if ('serviceWorker' in navigator) {
	
	window.addEventListener('load', function(){

		let serviceWorker;



		navigator.serviceWorker.register('/sw.js')
		.then(reg =>{

			// if(navigator.serviceWorker.controller) {

			// 	reg.addEventListener('updatefound', () => {
			// 		const installingWorker = reg.installing;
			// 		console.log('A new service worker is being installed:', installingWorker)
	
			// 		setTimeout(() => {
			// 			alert('Hay una version nueva de esta Web App, reinicia el navegador para efectuar los cambios');
			// 			location.reload();
			// 		}, 3000);
			// 	});
			// }

			console.log('Registro de SW exitoso', reg);

			if(reg.installing) {
				serviceWorker = reg.installing;
			}else if(reg.active) {
				serviceWorker = reg.active;
			}

			console.log(serviceWorker.state);

			serviceWorker.addEventListener('statechange', (e) => {
				console.log(e.target.state);
			})

			setInterval(() => {
				reg.update();
				console.log('Comprobando cada 1mn')
			}, 60000);

		})
		.catch(err => console.warn('Error al tratar de registrar el sw', err));

		navigator.serviceWorker.oncontrollerchange = () => {
			setTimeout(() => {
				alert('Hay una version nueva de esta Web App, el navegador se reiniciara para efectuar los cambios');
				location.reload();
			}, 10000);
		};


	});
	
}
  