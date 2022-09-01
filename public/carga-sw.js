if ('serviceWorker' in navigator) {
	
	window.addEventListener('load', function(){

		navigator.serviceWorker.register('/sw.js')
			.then(reg =>{

				console.log('Registro de SW exitoso', reg);

				setInterval(() => {
					reg.update();
					console.log('Comprobando 10sg')
				}, 10000);

				if(navigator.serviceWorker.controller) {

					reg.addEventListener('updatefound', () => {
						const installingWorker = reg.installing;
						console.log('A new service worker is being installed:', installingWorker)
	
						setTimeout(() => {
							alert('Hay una version nueva de esta Web App, reinicia el navegador para efectuar los cambios');
							// location.reload();
						}, 10000);
					});
				}
			})
			.catch(err => console.warn('Error al tratar de registrar el sw', err));

		// navigator.serviceWorker.oncontrollerchange = () => {
		// 	alert('Hay una version nueva de esta Web App, el navegador se reiniciara para efectuar los cambios');
		// 	location.reload();
		// };

		// if(!navigator.serviceWorker.controller) {

		// }else{
		// 	navigator.serviceWorker.oncontrollerchange = () => {
		// 		console.log('Registro de SW Nuevo');
		// 	};

		// }


		// navigator.serviceWorker.oncontrollerchange = (ev) => {
		// 	console.log('New service worker activated');
			// if(navigator.serviceWorker.controller) {
			// 	console.log('Refresh Web');
			// }
		// };

	});
	
}
  