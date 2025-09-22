<script lang="ts">
        import { cn } from "$lib/utils";
        import { Popover, PopoverContent, PopoverTrigger } from "$lib/components/ui/popover";
        import { Pause, Play, SpeakerSimpleHigh, SpeakerSimpleSlash } from "phosphor-svelte";
        import { onMount } from "svelte";

        const MUTE_STORAGE_KEY = "brian-personal-website:audio-muted";
        const HOVER_MEDIA_QUERY = "(hover: hover)";
        const TRACK_INFO = {
                title: "You Hate Jazz?",
                artist: "Harrison & Jaleel Shaw — 2025"
        };

        let audioElement: HTMLAudioElement | null = null;
        let audioPlaying = $state(false);
        let showAudioPrompt = $state(false);
        let showPopover = $state(false);
        let isMuted = $state(false);
        let vinylContainer: HTMLDivElement | null = null;
        let supportsHover = false;
        let removePointerdown: (() => void) | null = null;
        let removeHoverListener: (() => void) | null = null;
        let removePlayOnInteraction: (() => void) | null = null;

        function toggleAudio() {
                if (!audioElement) return;

                if (audioPlaying) {
                        audioElement.pause();
                        audioPlaying = false;
                } else {
                        audioElement
                                .play()
                                .then(() => {
                                        audioPlaying = true;
                                })
                                .catch((err) => {
                                        console.log("Audio play failed:", err);
                                });
                }
        }

        function openPopover() {
                showPopover = true;
        }

        function closePopover() {
                showPopover = false;
        }

        function handleRecordClick(event: MouseEvent) {
                if (!supportsHover) {
                        return;
                }

                event.stopImmediatePropagation();
                event.preventDefault();
                openPopover();
        }

        function handlePointerEnter() {
                if (!supportsHover) return;
                openPopover();
        }

        function handlePointerLeave() {
                if (!supportsHover) return;
                closePopover();
        }

        function handleFocusOut(event: FocusEvent) {
                if (!vinylContainer) return;

                const nextFocusTarget = event.relatedTarget as Node | null;
                if (!nextFocusTarget || !vinylContainer.contains(nextFocusTarget)) {
                        closePopover();
                }
        }

        function handleVinylKeydown(event: KeyboardEvent) {
                if (event.key === "Escape") {
                        event.preventDefault();
                        event.stopImmediatePropagation();
                        closePopover();
                        (event.currentTarget as HTMLElement).blur();
                }
        }

        function toggleMute() {
                if (!audioElement) return;

                const nextMuted = !isMuted;
                isMuted = nextMuted;
                audioElement.muted = nextMuted;

                if (typeof window !== "undefined") {
                        try {
                                window.localStorage.setItem(MUTE_STORAGE_KEY, String(nextMuted));
                        } catch (error) {
                                console.log("[AUDIO] Unable to persist mute preference", error);
                        }
                }
        }

        function handleVisibilityChange() {
                if (!audioElement) return;

                if (document.hidden) {
                        if (audioPlaying) {
                                audioElement.pause();
                        }
                } else {
                        if (audioPlaying) {
                                audioElement.play().catch((err) => {
                                        console.log("Audio resume failed:", err);
                                });
                        }
                }
        }

        onMount(() => {
                console.log("[AUDIO] Component mounted, attempting to play audio...");

                if (typeof window !== "undefined") {
                        try {
                                const storedPreference = window.localStorage.getItem(MUTE_STORAGE_KEY);
                                if (storedPreference !== null) {
                                        isMuted = storedPreference === "true";
                                        console.log("[AUDIO] Restored mute preference:", isMuted);
                                }
                        } catch (error) {
                                console.log("[AUDIO] Unable to read mute preference", error);
                        }

                        const handlePointerDown = (event: PointerEvent) => {
                                if (vinylContainer && !vinylContainer.contains(event.target as Node)) {
                                        closePopover();
                                }
                        };

                        window.addEventListener("pointerdown", handlePointerDown);
                        removePointerdown = () => {
                                window.removeEventListener("pointerdown", handlePointerDown);
                        };

                        if (typeof window.matchMedia === "function") {
                                const mediaQuery = window.matchMedia(HOVER_MEDIA_QUERY);
                                supportsHover = mediaQuery.matches;

                                const handleHoverPreferenceChange = (event: MediaQueryListEvent) => {
                                        supportsHover = event.matches;
                                        if (supportsHover === false) {
                                                closePopover();
                                        }
                                };

                                if (typeof mediaQuery.addEventListener === "function") {
                                        mediaQuery.addEventListener("change", handleHoverPreferenceChange);
                                        removeHoverListener = () =>
                                                mediaQuery.removeEventListener("change", handleHoverPreferenceChange);
                                } else {
                                        mediaQuery.addListener(handleHoverPreferenceChange);
                                        removeHoverListener = () => mediaQuery.removeListener(handleHoverPreferenceChange);
                                }
                        }
                }

                if (audioElement) {
                        console.log("[AUDIO] Audio element found, setting volume to 0.2");
                        audioElement.volume = 0.2;
                        audioElement.muted = isMuted;

                        if (isMuted) {
                                console.log("[AUDIO] Mute preference active, skipping autoplay");
                                audioPlaying = false;
                        } else {
                                const playPromise = audioElement.play();

                                if (playPromise !== undefined) {
                                        playPromise
                                                .then(() => {
                                                        console.log("[AUDIO] Autoplay successful!");
                                                        audioPlaying = true;
                                                })
                                                .catch((err) => {
                                                        console.log("[AUDIO] Autoplay prevented:", err.name, err.message);
                                                        console.log("[AUDIO] User interaction required to start playback");

                                                        showAudioPrompt = true;

                                                        setTimeout(() => {
                                                                showAudioPrompt = false;
                                                        }, 8000);

                                                        const playOnInteraction = () => {
                                                                if (!audioElement) {
                                                                        removePlayOnInteraction?.();
                                                                        removePlayOnInteraction = null;
                                                                        return;
                                                                }

                                                                audioElement
                                                                        .play()
                                                                        .then(() => {
                                                                                console.log(
                                                                                        "[AUDIO] Playback started after user interaction"
                                                                                );
                                                                                audioPlaying = true;
                                                                                showAudioPrompt = false;
                                                                                removePlayOnInteraction?.();
                                                                                removePlayOnInteraction = null;
                                                                        })
                                                                        .catch((e) => {
                                                                                console.log("[AUDIO] Still failed to play:", e);
                                                                        });
                                                        };

                                                        removePlayOnInteraction?.();

                                                        document.addEventListener("click", playOnInteraction, { once: true });
                                                        document.addEventListener("keydown", playOnInteraction, { once: true });
                                                        removePlayOnInteraction = () => {
                                                                document.removeEventListener("click", playOnInteraction);
                                                                document.removeEventListener("keydown", playOnInteraction);
                                                        };
                                                });
                                }
                        }
                } else {
                        console.log("[AUDIO] Audio element not found!");
                }

                document.addEventListener("visibilitychange", handleVisibilityChange);

                return () => {
                        document.removeEventListener("visibilitychange", handleVisibilityChange);
                        removePointerdown?.();
                        removeHoverListener?.();
                        removePlayOnInteraction?.();
                        removePlayOnInteraction = null;
                        if (audioElement) {
                                audioElement.pause();
                        }
                };
        });
</script>

<!-- Background audio -->
<audio bind:this={audioElement} src="/jazz-background.mp3" loop preload="auto"></audio>

<!-- Vinyl record player - fixed bottom right -->
<div class="fixed right-8 bottom-8 z-50 flex items-center gap-4">
        {#if showAudioPrompt}
                <div class="animate-fade-in-out absolute right-full mr-4 whitespace-nowrap">
                        <p class="text-muted-foreground/60 text-xs font-light tracking-[0.2em] uppercase">
                                Click to play music
                        </p>
                </div>
        {/if}

        <Popover bind:open={showPopover}>
                <div
                        bind:this={vinylContainer}
                        class="relative"
                        onpointerenter={handlePointerEnter}
                        onpointerleave={handlePointerLeave}
                        onfocusin={openPopover}
                        onfocusout={handleFocusOut}
                >
                        <PopoverTrigger
                                type="button"
                                aria-label="Show background music details"
                                class="relative h-16 w-16 cursor-pointer focus:outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-foreground/40"
                                onclick={handleRecordClick}
                                onkeydown={handleVinylKeydown}
                        >
                                <span class="sr-only">Background music details</span>
                                <div
                                        class={cn(
                                                "absolute inset-0 rounded-full bg-gradient-to-br from-neutral-900 to-neutral-800 shadow-lg",
                                                showAudioPrompt && "animate-pulse-subtle",
                                                audioPlaying && "animate-spin-slow"
                                        )}
                                >
                                        <div class="absolute inset-[15%] rounded-full border border-neutral-700/50"></div>
                                        <div class="absolute inset-[25%] rounded-full border border-neutral-700/40"></div>
                                        <div class="absolute inset-[35%] rounded-full border border-neutral-700/30"></div>

                                        <div
                                                class="absolute inset-[40%] rounded-full bg-gradient-to-br from-red-900 to-red-800"
                                        >
                                                <div class="absolute inset-[30%] rounded-full bg-neutral-900"></div>
                                        </div>

                                        <div class="absolute top-1 left-1 h-3 w-3 rounded-full bg-white/10 blur-sm"></div>
                                </div>
                        </PopoverTrigger>

                        <PopoverContent
                                id="audio-popover"
                                aria-label="Background music details"
                                aria-modal="false"
                                side="top"
                                align="end"
                                sideOffset={18}
                                collisionPadding={16}
                                class={cn(
                                        "pointer-events-auto w-64 rounded-2xl border border-foreground/10 bg-background/95 px-6 py-5 text-left shadow-xl shadow-black/20 backdrop-blur"
                                )}
                        >
                                <p class="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Now Playing</p>
                                <p class="mt-3 text-sm font-extralight text-foreground">{TRACK_INFO.title}</p>
                                <p class="mt-1 text-xs font-light text-muted-foreground">{TRACK_INFO.artist}</p>

                                <div class="mt-5 flex items-center justify-between gap-3">
                                        <button
                                                type="button"
                                                class="group relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-foreground/10 text-muted-foreground transition-all duration-500 hover:border-foreground/30 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-foreground/40"
                                                aria-label={isMuted ? "Unmute background music" : "Mute background music"}
                                                aria-pressed={isMuted}
                                                title={isMuted ? "Unmute background music" : "Mute background music"}
                                                onclick={toggleMute}
                                        >
                                                <span class="relative z-10 flex items-center justify-center">
                                                        {#if isMuted}
                                                                <SpeakerSimpleSlash size={16} />
                                                        {:else}
                                                                <SpeakerSimpleHigh size={16} />
                                                        {/if}
                                                </span>
                                                <span
                                                        class="pointer-events-none absolute inset-0 rounded-full bg-foreground/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                                                ></span>
                                        </button>

                                        <button
                                                type="button"
                                                class="group relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-foreground/10 text-muted-foreground transition-all duration-500 hover:border-foreground/30 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-foreground/40"
                                                aria-label={audioPlaying ? "Pause background music" : "Play background music"}
                                                aria-pressed={audioPlaying}
                                                title={audioPlaying ? "Pause background music" : "Play background music"}
                                                onclick={toggleAudio}
                                        >
                                                <span class="relative z-10 flex items-center justify-center">
                                                        {#if audioPlaying}
                                                                <Pause size={16} />
                                                        {:else}
                                                                <Play size={16} />
                                                        {/if}
                                                </span>
                                                <span
                                                        class="pointer-events-none absolute inset-0 rounded-full bg-foreground/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                                                ></span>
                                        </button>
                                </div>

                                <p class="mt-3 text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60">
                                        {#if isMuted}
                                                Muted
                                        {:else if audioPlaying}
                                                Playing softly
                                        {:else}
                                                Paused
                                        {/if}
                                </p>
                        </PopoverContent>
                </div>
        </Popover>
</div>

<style>
	/* Vinyl spinning animation */
	@keyframes spin-slow {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	:global(.animate-spin-slow) {
		animation: spin-slow 3s linear infinite;
	}

	/* Subtle pulse animation */
	@keyframes pulse-subtle {
		0%,
		100% {
			opacity: 1;
			transform: scale(1);
		}
		50% {
			opacity: 0.8;
			transform: scale(1.05);
		}
	}

	:global(.animate-pulse-subtle) {
		animation: pulse-subtle 2s ease-in-out infinite;
	}

	/* Fade in and out animation */
	@keyframes fade-in-out {
		0% {
			opacity: 0;
			transform: translateX(10px);
		}
		20%,
		80% {
			opacity: 1;
			transform: translateX(0);
		}
		100% {
			opacity: 0;
			transform: translateX(10px);
		}
	}

	:global(.animate-fade-in-out) {
		animation: fade-in-out 8s ease-in-out;
	}
</style>
