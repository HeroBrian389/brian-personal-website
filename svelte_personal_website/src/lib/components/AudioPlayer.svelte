<script lang="ts">
	import { onMount } from "svelte";
	import { Play, Pause } from "phosphor-svelte";

	let mainAudio: HTMLAudioElement | null = null;
	let introAudio: HTMLAudioElement | null = null;
	let tonearmElement: HTMLDivElement | null = null;

	const TONEARM_REST_ANGLE = -90;
	const TONEARM_PLAY_ANGLE = -62.5;
	const TONEARM_TIMEOUT = 1600;

	let isCueing = $state(false);
	let isArmTraveling = $state(false);
	let isPlaying = $state(false);
	let isPaused = $state(false);
	type TonearmPosition = "rest" | "play";
	let tonearmPosition = $state("rest") as TonearmPosition;
	let runToken = 0;

	let discSpinning = $derived(isCueing || isArmTraveling || isPlaying);
	let tonearmAngle = $derived(
		(tonearmPosition === "play" || isPaused) ? TONEARM_PLAY_ANGLE : TONEARM_REST_ANGLE
	);
	let isBusy = $derived(isCueing || isArmTraveling);

	// Generate deterministic groove data to avoid hydration mismatches
	const grooves = Array.from({ length: 4 }, (_, i) => {
		const seed = i * 1337; // Simple deterministic seed
		return {
			r: 40 + i * 15, // Wider spacing for better visibility
			opacity: 0.18 + (seed % 15) / 200, // More visible opacity (0.18 - 0.25)
			width: 1.8, // Thicker lines
			dashArray: `${(seed % 40) + 30} ${(seed % 25) + 30}` // More visible dashes
		};
	});

	function resetAudioElements() {
		if (introAudio) {
			introAudio.pause();
			introAudio.currentTime = 0;
		}

		if (mainAudio) {
			mainAudio.pause();
			mainAudio.currentTime = 0;
		}
	}

	function stopPlayback() {
		runToken += 1;
		isCueing = false;
		isArmTraveling = false;
		isPlaying = false;
		isPaused = false;
		tonearmPosition = "rest";

		resetAudioElements();
	}

	async function resumePlayback() {
		if (!mainAudio || !isPaused) return;

		try {
			await mainAudio.play();
			isPlaying = true;
			isPaused = false;
		} catch (err) {
			console.log("[AUDIO] Unable to resume playback", err);
			stopPlayback();
		}
	}

	async function cueAndPlay() {
		if (!mainAudio) return;

		const token = ++runToken;
		resetAudioElements();
		tonearmPosition = "rest";

		// Skip intro sound and arm animation - go straight to play
		tonearmPosition = "play";

		try {
			await mainAudio.play();
			if (token !== runToken) {
				return;
			}
			isPlaying = true;
		} catch (err) {
			console.log("[AUDIO] Unable to start ambient loop", err);
			stopPlayback();
		}
	}

	async function togglePlayback() {
		// If paused, resume without intro sound
		if (isPaused) {
			await resumePlayback();
			return;
		}

		// If playing or busy, stop completely
		if (isPlaying || isBusy) {
			stopPlayback();
			return;
		}

		// Otherwise start from beginning with intro
		await cueAndPlay();
	}

	onMount(() => {
		// Listen for external pause/play events (laptop media controls, etc)
		const handlePause = () => {
			if (isPlaying && !isPaused) {
				isPlaying = false;
				isPaused = true;
			}
		};

		const handlePlay = () => {
			if (isPaused) {
				isPlaying = true;
				isPaused = false;
			}
		};

		if (mainAudio) {
			mainAudio.volume = 0.2;
			mainAudio.loop = true;
			mainAudio.addEventListener("pause", handlePause);
			mainAudio.addEventListener("play", handlePlay);
		}

		if (introAudio) {
			introAudio.volume = 0.5;
		}

		const handleVisibilityChange = () => {
			if (document.hidden) {
				stopPlayback();
			}
		};

		document.addEventListener("visibilitychange", handleVisibilityChange);

		return () => {
			document.removeEventListener("visibilitychange", handleVisibilityChange);
			if (mainAudio) {
				mainAudio.removeEventListener("pause", handlePause);
				mainAudio.removeEventListener("play", handlePlay);
			}
			stopPlayback();
		};
	});
</script>

<audio bind:this={mainAudio} src="/jazz-background.mp3" preload="auto" loop></audio>
<audio bind:this={introAudio} src="/gramophone-start.mp3" preload="auto"></audio>



<div class="audio-player-root desktop-player">
	<button
		type="button"
		onclick={togglePlayback}
		class="gramophone-card"
		aria-pressed={isPlaying}
		aria-label={isPlaying ? "Pause ambient audio" : "Play ambient audio"}
	>
		<div class="deck-layout">
			<div class="platter">
				<div class="vinyl-disc" class:spin-record={discSpinning}>
					<!-- SVG Grooves for texture -->
					<svg class="vinyl-grooves" viewBox="0 0 200 200">
						{#each grooves as groove}
							<circle
								cx="100"
								cy="100"
								r={groove.r}
								fill="none"
								stroke="rgba(255, 255, 255, {groove.opacity})"
								stroke-width={groove.width}
								stroke-dasharray={groove.dashArray}
							/>
						{/each}
					</svg>
					
					<div class="vinyl-label">
						<div class="vinyl-center"></div>
					</div>
				</div>
			</div>

			<div class="tonearm-assembly">
				<div class="tonearm-axis">
					<div
						class="tonearm-swing"
						bind:this={tonearmElement}
						style={`--tonearm-angle: ${tonearmAngle}deg`}
					>
						<div class="tonearm-rod"></div>
						<div class="tonearm-cue"></div>
						<div class="tonearm-rest"></div>
					</div>
				</div>
			</div>
		</div>
	</button>
</div>

<div class="audio-player-root mobile-player">
	<button
		type="button"
		onclick={togglePlayback}
		class="mobile-play-toggle"
		class:is-active={isPlaying}
		aria-pressed={isPlaying}
		aria-label={isPlaying ? "Pause ambient audio" : "Play ambient audio"}
	>
		{#if isPlaying}
			<Pause size={20} weight="light" class="mobile-play-icon" />
		{:else}
			<Play size={20} weight="light" class="mobile-play-icon" />
		{/if}
	</button>
</div>

<style>
	.audio-player-root {
		position: fixed;
		bottom: 1.5rem;
		right: 1.5rem;
		z-index: 50;
		pointer-events: auto;
	}

	.desktop-player {
		display: block;
	}

	.mobile-player {
		display: none;
	}

	.gramophone-card {
		width: 240px;
		height: 200px;
		border-radius: 36px;
		background: linear-gradient(140deg, #3a1d07, #8b4a1c 55%, #b26730);
		border: 1px solid rgba(54, 28, 13, 0.6);
		box-shadow: inset 0 2px 0 rgba(255, 255, 255, 0.15), 0 32px 70px rgba(0, 0, 0, 0.45);
		position: relative;
		overflow: hidden;
	}

	.mobile-play-toggle {
		width: 48px;
		height: 48px;
		border-radius: 9999px;
		border: 1px solid rgba(255, 255, 255, 0.2);
		background: rgba(5, 5, 5, 0.9);
		color: rgba(255, 255, 255, 0.85);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		transition: background 0.4s ease, border-color 0.4s ease, color 0.4s ease;
	}

	.mobile-play-toggle.is-active {
		background: rgba(8, 8, 8, 0.9);
		color: #fff;
		border-color: rgba(255, 255, 255, 0.35);
		box-shadow: 0 0 12px rgba(0, 0, 0, 0.35);
	}

	.mobile-play-icon {
		width: 1.5rem;
		height: 1.5rem;
	}

	.deck-layout {
		position: relative;
		width: 100%;
		height: 100%;
	}

	.platter {
		position: absolute;
		left: 12px;
		top: 50%;
		transform: translateY(-50%);
		width: 160px;
		height: 160px;
		filter: drop-shadow(0 12px 18px rgba(0, 0, 0, 0.45));
	}

	.vinyl-disc {
		position: relative;
		width: 100%;
		height: 100%;
		border-radius: 9999px;
		background: linear-gradient(140deg, #111, #1a1a1a 50%, #0a0a0a);
		box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.05), inset 0 18px 45px rgba(0, 0, 0, 0.65);
		overflow: hidden;
	}

	.vinyl-grooves {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		transform: rotate(-90deg); /* Start from top */
	}

	/* Removed old .vinyl-groove classes */

	.vinyl-label {
		position: absolute;
		inset: 28%;
		border-radius: 9999px;
		background: radial-gradient(circle at 40% 35%, rgba(0, 0, 0, 0.08), transparent 60%),
			linear-gradient(130deg, #f7f7f7, #dcdcdc 65%, #c6c6c6);
	}

	.vinyl-center {
		position: absolute;
		inset: 42%;
		border-radius: 9999px;
		background: #040404;
		box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.15);
		opacity: 0.6;
	}

	.spin-record {
		animation: record-spin 5s linear infinite;
	}

	.tonearm-assembly {
		position: absolute;
		right: 12px;
		top: 12px;
		width: 200px;
		height: 220px;
		pointer-events: none;
	}

	.tonearm-axis {
		position: absolute;
		right: 12px;
		top: 12px;
		width: 24px;
		height: 24px;
		border-radius: 9999px;
		background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.85), rgba(70, 70, 70, 0.85));
		box-shadow: inset 0 6px 12px rgba(0, 0, 0, 0.55);
	}

	.tonearm-swing {
		position: absolute;
		right: 12px; /* Align right edge with center of tonearm-axis */
		top: 4px; /* Align center (5px from top) with axis center at 24px: 24px - 5px = 19px */
		width: 120px;
		height: 10px;
		transform-origin: 100% 50%;
		transform: rotate(var(--tonearm-angle, 0deg));
		transition: transform 0.3s cubic-bezier(0.45, 0, 0.15, 1);
	}

	.tonearm-rod {
		position: absolute;
		left: 0;
		right: 0;
		height: 100%;
		border-radius: 9999px;
		background: #cccccc;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
		transition: box-shadow 0.3s ease, filter 0.3s ease;
	}

	.tonearm-cue {
		position: absolute;
		left: 10px;
		top: 50%;
		transform: translateY(-50%);
		width: 6px;
		height: 20px;
		border-radius: 3px;
		background: #979797;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
		transition: box-shadow 0.3s ease, filter 0.3s ease;
	}

	.tonearm-rest {
		position: absolute;
		left: 0;
		top: 50%;
		transform: translateY(-50%);
		width: 30px;
		height: 12px;
		border-radius: 9999px;
		background: #8a8a8a;
		box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.35);
		transition: box-shadow 0.3s ease, filter 0.3s ease;
	}

	/* Hover effects for tonearm - indicates interactive element */
	.gramophone-card:hover .tonearm-rod {
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4),
					0 0 12px rgba(255, 255, 255, 0.6),
					0 0 24px rgba(255, 255, 255, 0.3);
		filter: brightness(1.3);
	}

	.gramophone-card:hover .tonearm-cue {
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4),
					0 0 10px rgba(255, 255, 255, 0.5),
					0 0 20px rgba(255, 255, 255, 0.25);
		filter: brightness(1.3);
	}

	.gramophone-card:hover .tonearm-rest {
		box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.35),
					0 0 8px rgba(255, 255, 255, 0.4),
					0 0 16px rgba(255, 255, 255, 0.2);
		filter: brightness(1.2);
	}

	@media (max-width: 768px) {
		.audio-player-root {
			bottom: 1rem;
			right: 1rem;
		}

		.desktop-player {
			display: none;
		}

		.mobile-player {
			display: block;
		}

		.gramophone-card {
			width: 40px;
			height: 40px;
			padding: 0;
			border-radius: 9999px;
			background: rgba(5, 5, 5, 0.9);
			border: 1px solid rgba(255, 255, 255, 0.1);
		}

		.deck-layout {
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.platter {
			position: relative;
			left: auto;
			top: auto;
			width: 64px;
			height: 64px;
		}

		.tonearm-assembly {
			display: none;
		}
	}

	@keyframes record-spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
</style>
