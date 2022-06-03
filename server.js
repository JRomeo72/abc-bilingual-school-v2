const path = require("path");
const express = require("express");
const app = require("./public/App.js");

const server = express();

server.use(express.static(path.join(__dirname, "public")));

server.get("*", function(req, res) {

	const { html } = app.render({ url: req.url });

	res.set('Cache-control', 'public, max-age=600');

	res.write(`
		<!DOCTYPE html>
		<html lang="es">
			<head>
				<meta charset="UTF-8">
				<meta http-equiv="X-UA-Compatible" content="IE=edge">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
			
				<meta name="description" content="Bienvenidos al sitio web de ABC Bilingual School El Salvador, aquí encontraras toda la información acerca de nuestra institución">
			
				<!--* Favicon -->
				<link rel="icon" type="image/png" sizes="16x16" href="/assets/img/icons/favicon-16x16.png">
				<link rel="icon" type="image/png" sizes="32x32" href="/assets/img/icons/favicon-32x32.png">
				<link rel="icon" type="image/png" sizes="96x96" href="/assets/img/icons/favicon-96x96.png">
			
				<!--* Icono de la Aplicacion -->
				<link rel="apple-touch-icon" sizes="57x57" href="/assets/img/icons/apple-icon-57x57.png">
				<link rel="apple-touch-icon" sizes="60x60" href="/assets/img/icons/apple-icon-60x60.png">
				<link rel="apple-touch-icon" sizes="72x72" href="/assets/img/icons/apple-icon-72x72.png">
				<link rel="apple-touch-icon" sizes="76x76" href="/assets/img/icons/apple-icon-76x76.png">
				<link rel="apple-touch-icon" sizes="114x114" href="/assets/img/icons/apple-icon-114x114.png">
				<link rel="apple-touch-icon" sizes="120x120" href="/assets/img/icons/apple-icon-120x120.png">
				<link rel="apple-touch-icon" sizes="144x144" href="/assets/img/icons/apple-icon-144x144.png">
				<link rel="apple-touch-icon" sizes="152x152" href="/assets/img/icons/apple-icon-152x152.png">
				<link rel="apple-touch-icon" sizes="180x180" href="/assets/img/icons/apple-icon-180x180.png">
			
				<link rel="manifest" href="/manifest.json">
				<meta name="theme-color" content="#062d5d">
				<!--* Color de la barra del navegador -->
				<meta name="msapplication-TileColor" content="#fbb802">
				<meta name="MobileOptimized" content="width">
				<meta name="HandheldFriendly" content="true">
				<link rel="apple-touch-startup-image" href="/assets/img/icons/apple-icon-180x180.png">
				<!--* Imagen del inicio del programa -->
				<meta name="apple-mobile-web-app-title" content="ABC Bilingual School">
				<meta name="apple-mobile-web-app-capable" content="yes">
				<!--<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">-->
				<meta name="apple-mobile-web-app-status-bar-style" content="black">
				<meta name="msapplication-TileImage" content="/assets/img/icons/ms-icon-144x144.png">
			
				<title>ABC Bilingual School</title>

				<!-- <link rel='icon' type='image/png' href='/favicon.png'> -->
				<link rel='stylesheet' href='/assets/js/bundle.css'>

			</head>
			<body>
				<div id="app">${html}</div>
			
				<script src="/carga-sw.js"></script>
				<script src="/assets/js/bundle.js"></script>
			
			</body>
		</html>
	`);

	res.end();
});

const port = process.env.PORT || 4002;
server.listen(port, () => {
	console.log(`Listening on port ${port}`);
	console.log(`http://localhost:${port}`);
});
