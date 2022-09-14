<script>
	
	import { onMount } from 'svelte';
	import { Router, Route } from 'svelte-routing';
	// import { checkConnection } from './views/Common.svelte';
	import Spinner from './components/Spinner.svelte';
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

		// ESTE CODIGO HACE QUE EL MENU APARESCA Y SE VALLA
		let flag = false;
		let spinner = document.querySelector('#spinner');
		let main = document.querySelector('.main');
		let nav = document.querySelector("#navbar-fixed");

		// setTimeout(() => {
			spinner.classList.add('fade-out-animation');

			main.style.display = 'block';
			setTimeout(() => { main.style.opacity = 1}, 100);

		// }, 2000);

		window.onscroll = function(){
			let scroll = document.documentElement.scrollTop;

			if(scroll >1000){
				if(!flag){
					nav.classList.add('animated', 'fadeInDown');
					flag = true;
				}

			}
			else{
				if(flag){
					nav.classList.remove('fadeInDown');
					nav.classList.add('fadeOutUp');
					flag = false;
					setTimeout( function () {
						nav.classList.remove('animated', 'fadeOutUp');

					}, 200, 'easeInOutExpo' );
				}
				
				

			}

		};

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

<Spinner />
<div class="main">
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
	
		<Router path="/*" component="{NoFound}" />
	
	
	</Router>
	<Cafeteria />
</div>

<div id="contentMessage" class="card-body text-center animate p-2"></div>
