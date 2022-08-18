if ('serviceWorker' in navigator)
{
	window.addEventListener('load', function(){

		navigator.serviceWorker.register('/sw.js')
		.then(reg =>{
			console.log('Registro de SW exitoso', reg)
			// reg.addEventListener('updatefound', () => {
			// 	const installingWorker = reg.installing;
			// 	console.log('A new service worker is being installed:', installingWorker)
			// });
		})
		.catch(err => console.warn('Error al tratar de registrar el sw', err));

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
  