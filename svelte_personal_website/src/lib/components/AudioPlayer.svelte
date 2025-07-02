<script lang="ts">
	import { onMount } from "svelte";

	let audioElement: HTMLAudioElement | null = null;
	let audioPlaying = $state(false);
	let showAudioPrompt = $state(false);

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

		// Start background music
		if (audioElement) {
			console.log("[AUDIO] Audio element found, setting volume to 0.2");
			audioElement.volume = 0.2; // Set to 20% volume for ambient background

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
		} else {
			console.log("[AUDIO] Audio element not found!");
		}

		// Listen for visibility changes
		document.addEventListener("visibilitychange", handleVisibilityChange);

		// Cleanup on unmount
		return () => {
			document.removeEventListener("visibilitychange", handleVisibilityChange);
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
	<div class="relative h-16 w-16">
		<div
			class="absolute inset-0 rounded-full bg-gradient-to-br from-neutral-900 to-neutral-800 shadow-lg {showAudioPrompt
				? "animate-pulse-subtle"
				: ""}"
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
