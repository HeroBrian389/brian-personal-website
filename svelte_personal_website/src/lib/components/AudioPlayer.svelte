<script lang="ts">
        import { onMount } from "svelte";

        const MUTE_STORAGE_KEY = "brian-personal-website:audio-muted";
        const HOVER_MEDIA_QUERY = "(hover: hover)";
        const TRACK_INFO = {
                title: "Jazz Background",
                artist: "Unknown Artist"
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

        // Toggle audio playback
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

        function togglePopover() {
                showPopover = !showPopover;
        }

        function handleRecordClick(event: MouseEvent) {
                if (supportsHover) {
                        return;
                }

                event.stopPropagation();
                togglePopover();
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
                if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        togglePopover();
                } else if (event.key === "Escape") {
                        event.preventDefault();
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
                                window.localStorage.setItem(MUTE_STORAGE_KEY, nextMuted ? "true" : "false");
                        } catch (error) {
                                console.log("[AUDIO] Unable to persist mute preference", error);
                        }
                }
        }

        function handleToggleMute(event: MouseEvent) {
                event.stopPropagation();
                toggleMute();
        }

        // Handle visibility change
        function handleVisibilityChange() {
                if (!audioElement) return;

		if (document.hidden) {
			// Page is hidden (tab switched/minimized)
			if (audioPlaying) {
				audioElement.pause();
			}
		} else {
			// Page is visible again
			if (audioPlaying) {
				audioElement.play().catch((err) => {
					console.log("Audio resume failed:", err);
				});
			}
		}
        }

        // Initialize
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

                // Start background music
                if (audioElement) {
                        console.log("[AUDIO] Audio element found, setting volume to 0.2");
                        audioElement.volume = 0.2; // Set to 20% volume for ambient background
                        audioElement.muted = isMuted;

                        if (isMuted) {
                                console.log("[AUDIO] Mute preference active, skipping autoplay");
                                audioPlaying = false;
                        } else {
                                // Try to play audio
                                const playPromise = audioElement.play();

                                if (playPromise !== undefined) {
                                        playPromise
                                                .then(() => {
                                                        console.log("[AUDIO] Autoplay successful!");
                                                        audioPlaying = true;
                                                })
                                                .catch((err) => {
                                                        // Handle autoplay policy - user interaction may be required
                                                        console.log("[AUDIO] Autoplay prevented:", err.name, err.message);
                                                        console.log("[AUDIO] User interaction required to start playback");

                                                        // Show prompt to user
                                                        showAudioPrompt = true;

                                                        // Hide prompt after a few seconds
                                                        setTimeout(() => {
                                                                showAudioPrompt = false;
                                                        }, 8000);

                                                        // Try to play on first user interaction
                                                        const playOnInteraction = () => {
                                                                if (audioElement) {
                                                                        audioElement
                                                                                .play()
                                                                                .then(() => {
                                                                                        console.log(
                                                                                                "[AUDIO] Playback started after user interaction"
                                                                                        );
                                                                                        audioPlaying = true;
                                                                                        showAudioPrompt = false;
                                                                                        // Remove the listener once audio starts
                                                                                        document.removeEventListener("click", playOnInteraction);
                                                                                        document.removeEventListener("keydown", playOnInteraction);
                                                                                })
                                                                                .catch((e) => {
                                                                                        console.log("[AUDIO] Still failed to play:", e);
                                                                                });
                                                                }
                                                        };

                                                        // Add listeners for user interaction
                                                        document.addEventListener("click", playOnInteraction, { once: true });
                                                        document.addEventListener("keydown", playOnInteraction, { once: true });
                                                });
                                }
                        }
                } else {
                        console.log("[AUDIO] Audio element not found!");
                }

                // Listen for visibility changes
                document.addEventListener("visibilitychange", handleVisibilityChange);

                // Cleanup on unmount
                return () => {
                        document.removeEventListener("visibilitychange", handleVisibilityChange);
                        removePointerdown?.();
                        removeHoverListener?.();
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
        <!-- Subtle prompt message -->
        {#if showAudioPrompt}
                <div class="animate-fade-in-out absolute right-full mr-4 whitespace-nowrap">
                        <p class="text-muted-foreground/60 text-xs font-light tracking-[0.2em] uppercase">
                                Click to play music
                        </p>
                </div>
        {/if}

        <!-- Vinyl record -->
        <div
                bind:this={vinylContainer}
                class="relative"
                onpointerenter={handlePointerEnter}
                onpointerleave={handlePointerLeave}
                onfocusin={openPopover}
                onfocusout={handleFocusOut}
        >
                <div
                        role="button"
                        tabindex="0"
                        aria-label="Show background music details"
                        aria-controls="audio-popover"
                        aria-expanded={showPopover}
                        class="relative h-16 w-16 cursor-pointer focus:outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-foreground/40"
                        onclick={handleRecordClick}
                        onkeydown={handleVinylKeydown}
                >
                        <span class="sr-only">Background music details</span>
                        <div
                                class="absolute inset-0 rounded-full bg-gradient-to-br from-neutral-900 to-neutral-800 shadow-lg {showAudioPrompt
                                        ? 'animate-pulse-subtle'
                                        : ''}"
                                class:animate-spin-slow={audioPlaying}
                        >
                                <!-- Vinyl grooves -->
                                <div class="absolute inset-[15%] rounded-full border border-neutral-700/50"></div>
                                <div class="absolute inset-[25%] rounded-full border border-neutral-700/40"></div>
                                <div class="absolute inset-[35%] rounded-full border border-neutral-700/30"></div>

                                <!-- Center label -->
                                <div
                                        class="absolute inset-[40%] rounded-full bg-gradient-to-br from-red-900 to-red-800"
                                >
                                        <div class="absolute inset-[30%] rounded-full bg-neutral-900"></div>
                                </div>

                                <!-- Highlight for 3D effect -->
                                <div class="absolute top-1 left-1 h-3 w-3 rounded-full bg-white/10 blur-sm"></div>
                        </div>
                </div>

                {#if showPopover}
                        <div
                                id="audio-popover"
                                role="dialog"
                                aria-label="Background music details"
                                class="pointer-events-auto absolute right-full top-1/2 z-50 w-64 -translate-y-1/2 rounded-2xl border border-foreground/10 bg-background/95 px-6 py-5 text-left shadow-xl shadow-black/20 backdrop-blur"
                        >
                                <p class="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Now Playing</p>
                                <p class="mt-3 text-sm font-extralight text-foreground">{TRACK_INFO.title}</p>
                                <p class="mt-1 text-xs font-light text-muted-foreground">{TRACK_INFO.artist}</p>

                                <button
                                        type="button"
                                        class="group relative mt-5 w-full overflow-hidden border border-foreground/10 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground transition-all duration-500 hover:border-foreground/30 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-foreground/40"
                                        aria-pressed={isMuted}
                                        onclick={handleToggleMute}
                                >
                                        <span class="relative z-10 font-light">
                                                {isMuted ? "Unmute background music" : "Mute background music"}
                                        </span>
                                        <span
                                                class="absolute inset-0 origin-left scale-x-0 bg-foreground/5 transition-transform duration-700 group-hover:scale-x-100"
                                        ></span>
                                </button>

                                <p class="mt-3 text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60">
                                        {#if isMuted}
                                                Muted
                                        {:else if audioPlaying}
                                                Playing softly
                                        {:else}
                                                Paused
                                        {/if}
                                </p>
                        </div>
                {/if}
        </div>

        <!-- Play/Pause button -->
        <button
                onclick={toggleAudio}
                class="group bg-background border-foreground/10 hover:border-foreground/30 relative
           rounded-full border p-3
           text-sm transition-all duration-500"
		title={audioPlaying ? "Pause music" : "Play music"}
	>
		<span class="relative z-10 block flex h-4 w-4 items-center justify-center">
			{#if audioPlaying}
				<svg class="h-3 w-3" fill="currentColor" viewBox="0 0 16 16">
					<path
						d="M5 3.5v9a.5.5 0 0 1-1 0v-9a.5.5 0 0 1 1 0zm6 0v9a.5.5 0 0 1-1 0v-9a.5.5 0 0 1 1 0z"
					/>
				</svg>
			{:else}
				<svg class="ml-0.5 h-3 w-3" fill="currentColor" viewBox="0 0 16 16">
					<path
						d="M4 3.5v9a.5.5 0 0 0 .757.429l7-4.5a.5.5 0 0 0 0-.858l-7-4.5A.5.5 0 0 0 4 3.5z"
					/>
				</svg>
			{/if}
		</span>
		<div
			class="bg-foreground/5 absolute inset-0 scale-0 rounded-full transition-transform duration-500 group-hover:scale-100"
		></div>
	</button>
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
