<script>
	
	import { onMount } from 'svelte';
	import { Router, Route } from 'svelte-routing';
	// import { checkConnection } from './views/Common.svelte';
	import Header from './components/Header.svelte';
	import Inicio from './views/Inicio.svelte';
	import Institucion from './views/Institucion.svelte';
	import Personal from './views/Personal.svelte';
	import VEscolar from './views/VidaEscolar.svelte';
	import Circulares from './views/Circulares.svelte';
	import Fechas from './views/Fechas.svelte';
	import Contactanos from './views/Contactanos.svelte';
	import NoFound from './views/404.svelte';
	import Cafeteria from './components/Cafeteria.svelte';

	export let url = "";

	onMount( () => {

		jQuery(document).ready(function(){

			// ESTE CODIGO HACE QUE EL MENU APARESCA Y SE VALLA
			var flag = false;
			var scroll;
			var nav = jQuery("#navbar-fixed")

			jQuery(window).scroll(function(){
				var scroll = jQuery(window).scrollTop();

				if(scroll >1000){
					if(!flag){
						nav.addClass('animated fadeInDown');
						flag = true;
					}

				}
				else{
					if(flag){
						nav.removeClass('fadeInDown');
						nav.addClass('fadeOutUp');
						flag = false;
						setTimeout( function () {
							nav.removeClass('animated fadeOutUp');

						}, 200, 'easeInOutExpo' );
					}
					
					

				}

			});

		});

		let contentMessage = document.querySelector("#contentMessage");
		let messages = {
			"true": "✅ Conectado a internet",
			"false": "🚫 Sin conexión a internet"
		};

		window.contentMessage = contentMessage;
		window.messages = messages

		lightbox.option({
			'disableScrolling': true
		});

		Waves.attach('.nav-link, .dropdown-item, .btn-link', ['waves-block', 'waves-light']);
		Waves.init()

	} );

</script>


<Router url="{url}">
	<Header />
	
	<Route path="/contact-us">
		<Contactanos esp = {false} />
	</Route>
	<Route path="/contactanos">
		<Contactanos esp = {true} />
	</Route>

	<Route path="/important-dates">
		<Fechas esp = {false} />
	</Route>
	<Route path="/fechas-importantes">
		<Fechas esp = {true} />
	</Route>

	<Route path="/newsletter">
		<Circulares esp = {false} />
	</Route>
	<Route path="/circulares">
		<Circulares esp = {true} />
	</Route>

	<Route path="/school-life">
		<VEscolar esp = {false} />
	</Route>
	<Route path="/vida-escolar">
		<VEscolar esp = {true} />
	</Route>

	<Route path="/our-team/*">
		<Personal esp = {false} />
	</Route>
	<Route path="/personal/*">
		<Personal esp = {true} />
	</Route>

	<Route path="/institution">
		<Institucion esp = {false} />
	</Route>
	<Route path="/institucion">
		<Institucion esp = {true} />
	</Route>

	<Route path="/home">
		<Inicio esp = {false} />
	</Route>
	<Route path="/">
		<Inicio esp = {true} />
	</Route>

	<Route path="/*" component="{NoFound}" />


</Router>
<Cafeteria />

<div id="contentMessage" class="card-body text-center animate p-2"></div>
