import App from './App.svelte';
import './assets/css/mix-css.css';
import './assets/css/simple-lightbox.css';
import './assets/js/bootstrap.js';
import jQuery from './assets/js/jquery.min.js';
import SimpleLightbox from './assets/js/simple-lightbox.modules';
import jarallax from './assets/js/jarallax';
import lightbox from './assets/js/lightbox';
import './assets/js/waypoints';
import Waves from './assets/js/waves';

window.jQuery = jQuery;
window.$ = jQuery;
window.SimpleLightbox = SimpleLightbox;
window.jarallax = jarallax;
window.lightbox = lightbox;
window.Waves = Waves;

const app = new App({
	// target: document.body
	target: document.getElementById('app'),
	hydrate: true
});

export default app;