import App from './App.svelte';

const app = new App({
	target: document.body,
	props: {
		sitename: 'astroloAGI'
	}
});

export default app;