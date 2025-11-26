A three-model bakeoff with nuanced celery issues with consensus LLM-as-a-judge to evaluate the models.

To evaluate the newly released Gemini 3 Pro, Cluade Opus 4.5, and GPT-5.1-Codex-Max-Xhigh (what a name), I gave them each the same celery worker debugging task. In each case, I used their native harness (Gemini CLI, Claude Code, and Codex CLI respectively) to pinpoint the root cause.

Once each agent had attempted to pinpoint the root cause, I passed all 3 anonymised model outputs separately to each of the LLMs to judge which output was best. Below, I give the findings of each of the judge LLMs. 

Codex-Max emerged as the clear winner, with Opus producing strange hallucinations, and gemini displaying a lack of sophistication at times. Feel free to judge for yourself!

## The root cause

Future-scheduled `send_follow_up_email_task` messages (ETA ≈ the next day) were pulled immediately by Celery, held unacked because `task_acks_late=True`, and sat in RabbitMQ long enough to trigger the broker’s 30-minute `consumer_timeout`, which closed the channel and killed the worker. That’s why we saw “received” logs but never task_prerun/start: the task wasn’t due yet, it was just unacked for hours.

Full analysis:

## Setup

I gave the **same debugging task** (“Find subtle bug with Celery timeouts”) to three models:

* **Dev A (Claude)**
* **Dev B (Gemini)**
* **Dev C (Codex)**

Then I asked **each model** (Claude, Gemini, and Codex) to **judge all three outputs** and choose which one was best.

Below are their evaluations.

---

## As judged by Gemini

### Dev B (Gemini) – Best Overall Analysis

* **Accuracy:** High. Correctly identified `CELERY_TASK_TIME_LIMIT = 1800s` and the mechanism of the loop (kill → unacked → requeue).
* **Insight:** Uniquely identified the specific code path causing the hang (`transcription.services -> openai_api.py -> step_1`), which is the actual root problem that needs fixing.
* **Verdict:** Provided the most actionable solution for the codebase.

### Dev C (Codex) – Best Infrastructure Forensics

* **Accuracy:** High. Correctly identified the RabbitMQ `consumer_timeout` mechanism and provided specific log evidence (`PreconditionFailed ... Timeout value used: 1800000 ms`).
* **Insight:** Correctly analyzed the `prefetch=1` and `acks_late=True` interaction causing RabbitMQ to see the worker as stuck.
* **Verdict:** Excellent diagnosis of why the connection drops, but missed the specific code causing the hang.

### Dev A (Claude) – Partial Credit

* **Accuracy:** Low/Medium. Correctly flagged `acks_late` and the RabbitMQ timeout.
* **Flaw:** Incorrectly concluded the worker was idle. `consumer_timeout` applies to **unacknowledged messages**; an idle worker has no unacknowledged messages and would not be disconnected for this reason.
* **Verdict:** Found the right settings but drew the wrong conclusion about the worker's state.

---

## As judged by Claude

### Dev A (Claude) – Grade: C

**Correct findings:**

* Identified `consumer_timeout = 1800000ms` correctly.
* Understood `task_acks_late = True` is involved.
* Provided valid solutions.

**Incorrect conclusion:**

* Claimed the worker is “idle with no tasks to process” and RabbitMQ terminates due to inactivity.
* This is factually wrong: the logs show the worker was actively processing tasks between 13:24 and 13:54.

**Why this matters:**
Dev A (Claude) identified the right components but misdiagnosed the interaction. The issue isn't inactivity—it's that tasks were received and delivered to the worker but the ACK wasn't sent back within 30 minutes because the worker was busy with other tasks (or the tasks were stuck in the prefetch queue).

---

### Dev B (Gemini) – Grade: D

**Incorrect findings:**

* Claimed `CELERY_TASK_TIME_LIMIT = 1800` causes the worker to exit.
* Claimed there's a “poison pill” task stuck in the queue.
* Claimed OpenAI calls without timeouts cause 30-minute hangs.

**Why this is wrong:**

1. The error message explicitly says `PRECONDITION_FAILED - delivery acknowledgement ... timed out` – this is a **RabbitMQ broker-side** error, not a Celery task time limit error.
2. The `task_time_limit` is commented out in the Celery config:
   `# task_time_limit=getattr(settings, "CELERY_TASK_TIME_LIMIT", 20)` at `celery.py:94`.
3. The logs show tasks completing successfully in **30–38 seconds**, not hanging for 30 minutes.
4. `send_follow_up_email_task` has its own time limits: `soft_time_limit=300`, `time_limit=330` (5.5 minutes max).

**Critical error:**
Dev B (Gemini) confused Celery’s **task execution timeout** with RabbitMQ’s **delivery acknowledgement timeout**. These are fundamentally different mechanisms.

---

### Dev C (Codex) – Grade: A

**Correct findings:**

* Precisely identified the error from logs:
  `PreconditionFailed ... Timeout value used: 1800000 ms`.
* Correctly identified the specific task: `send_follow_up_email_task` received at 13:24:21.
* Correctly explained the mechanism: task delivered, never acknowledged, broker enforces 30-minute timeout.
* Correctly noted that `prefetch = 1` means one un-acked task blocks further ACKs.

---

## As judged by Codex

### Root cause

* The worker exits are caused by RabbitMQ’s `consumer_timeout` (30 min / 1,800,000 ms) closing the channel because at least one delivery stays un-acked for ≥ 30 minutes; Celery then dies with `PreconditionFailed`.
* This is visible twice on **2025-11-26** (13:54:21 and 03:56:23) in `backend/logs/healthcloud.log:4535-4612`.

### What the code/logs show

* Default late ACKs for all tasks via `task_acks_late = True` in `HealthcloudTask` (`backend/healthcloud/celery.py:153-164`), combined with
  `CELERY_WORKER_PREFETCH_MULTIPLIER = 1` (`backend/healthcloud/settings.py:441-445`), means each worker process keeps a delivery **un-acked until the task finishes**.
* A burst of `send_follow_up_email_task` messages was delivered at 13:24:21 and never logged as started/finished before the 13:54:21 timeout (`backend/logs/healthcloud.log:4267-4301`), indicating at least one was still un-acked 30 minutes later when RabbitMQ enforced the timeout.
* Celery’s global hard/soft limits are 1800/1740 seconds (`backend/healthcloud/settings.py:441-445`), but there are **no** “Hard time limit exceeded” entries in the log, so the crash is **not** Celery killing a task; it is the broker closing the consumer channel.
* Tasks suspected by Dev B (Gemini) aren’t holding the ACK: `process_uploaded_dictation_task` explicitly sets `task_acks_late=False` (`backend/transcription/tasks/process_dictation.py:202-207`) and finishes in ~38s in the same log window.

### Assessment of each dev

- **Dev A (Claude):** Correctly identifies `consumer_timeout` + late ACKs, but wrongly says the worker was idle; heartbeat wouldn’t fix an un-acked delivery sitting 30 minutes.
- **Dev B (Gemini):** Wrong root cause; blamed Celery hard time limit and a non-late-acked dictation task; no logs support the claim.
- **Dev C (Codex):** Closest to reality; tied the 30-minute `PreconditionFailed` to an un-acked delivery, cited `task_acks_late=True` + `prefetch=1`, aligned with the 13:24:21 → 13:54:21 timeline.

## Meta (qualitative)

- Gemini 3 Pro: too trigger happy, makes random changes, doesn’t follow instructions closely.
- Opus 4.5: doesn’t research enough and gives silly suggestions.
- Codex-max-xhigh: still the best, but extremely slow (2–10x slower).

---

Editor note (2025-11-26): Gemini 3 Pro is totally unusable - it never follows instructions.
