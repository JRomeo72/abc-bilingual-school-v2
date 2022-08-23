import App from './App.svelte';
import './assets/css/mix-css.css';
import './assets/js/bootstrap.js';
import jQuery from './assets/js/jquery.min.js';
import VenoBox from './assets/js/venobox';
import jarallax from './assets/js/jarallax';
import lightbox from './assets/js/lightbox';
// import SmoothScroll from './assets/js/smooth-scroll';
import './assets/js/waypoints';
import Waves from './assets/js/waves';

window.jQuery = jQuery;
window.$ = jQuery;
window.VenoBox = VenoBox;
window.jarallax = jarallax;
window.lightbox = lightbox;
window.Waves = Waves;
// window.SmoothScroll = SmoothScroll;

const app = new App({
	// target: document.body
	target: document.getElementById('app'),
	hydrate: true
});

export default app;