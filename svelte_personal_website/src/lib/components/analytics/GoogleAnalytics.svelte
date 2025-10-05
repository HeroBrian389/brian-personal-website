<script lang="ts">
	import { env } from "$env/dynamic/public";
	import { afterNavigate } from "$app/navigation";
	import { onMount } from "svelte";

	const measurementId = env.PUBLIC_GOOGLE_ANALYTICS_ID;

	declare global {
		interface Window {
			dataLayer: unknown[];
			gtag?: (...args: unknown[]) => void;
		}
	}

	const initializeAnalytics = () => {
		if (!measurementId) {
			return;
		}

		const existingScript = document.head.querySelector<HTMLScriptElement>(
			`script[data-ga-measurement-id="${measurementId}"]`
		);

		if (!existingScript) {
			const script = document.createElement("script");
			script.async = true;
			script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
			script.dataset.gaMeasurementId = measurementId;
			document.head.appendChild(script);
		}

		window.dataLayer = window.dataLayer || [];
		window.gtag = function gtag(...args: unknown[]) {
			window.dataLayer.push(args);
		};

		window.gtag("js", new Date());
		window.gtag("config", measurementId, {
			send_page_view: false
		});

		const sendPageView = (url: URL) => {
			window.gtag?.("event", "page_view", {
				page_location: url.href,
				page_path: `${url.pathname}${url.search}` || "/",
				page_title: document.title
			});
		};

		sendPageView(new URL(window.location.href));

		afterNavigate(({ to }) => {
			if (to?.url) {
				sendPageView(to.url);
			}
		});
	};

	onMount(() => {
		initializeAnalytics();
	});
</script>
