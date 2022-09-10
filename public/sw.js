const CACHE_NAME = 'ABC_v22.09.10';
urlsToCache = [
    // ? Views ***************************
    '/',
    '/home',
    '/institucion',
    '/institution',
    '/personal/administracion',
    '/personal/parvularia',
    '/personal/primaria',
    '/personal/secundaria',
    '/personal/nivelacion',
    '/our-team/administration',
    '/our-team/preshool',
    '/our-team/primary',
    '/our-team/highschool',
    '/our-team/development',
    '/circulares',
    '/newsletter',
    '/fechas-importantes',
    '/important-dates',
    '/contact-us',
    '/contactanos',

    // ? Javascript + css **************** 
    '/App.js',
    '/manifest.json',
    '/carga-sw.js',
    '/assets/js/bundle.js',        
    '/assets/js/bundle.css',

    // ? Documentos ********************** 
    // '/assets/documents/Manual-de-convivencia-2021-2022.pdf',
    // '/assets/documents/Manual-Teams.pdf',
    // '/assets/documents/Calendario-2021-2022.pdf',

    // ? Fuentes Tipograficas ************ 
    '/assets/font/coolvetica/coolvetica_rg.ttf',
    '/assets/font/roboto/Roboto-Bold.ttf',
    '/assets/font/roboto/Roboto-Light.ttf',
    '/assets/font/roboto/Roboto-Medium.ttf',
    '/assets/font/roboto/Roboto-Regular.ttf',
    '/assets/font/roboto/Roboto-Thin.ttf',
    '/assets/webfonts/fa-brands-400.ttf',
    '/assets/webfonts/fa-regular-400.ttf',
    '/assets/webfonts/fa-solid-900.ttf',

    // ! IMAGENES 
    // ? Circulares ********************** 
    '/assets/img/circulares/circular-01.jpg',
    '/assets/img/circulares/circular-01.pdf',
    // '/assets/img/circulares/circular-01.jpg',
    // '/assets/img/circulares/circular-01.pdf',
    '/assets/img/circulares/circular-02.png',
    '/assets/img/circulares/circular-03.png',
    // '/assets/img/circulares/circular-04.jpg',
    // ? Fechas Imp. ********************* 
    '/assets/img/eventos/fechas.jpg',
    '/assets/img/eventos/sept-01.jpg',
    '/assets/img/eventos/sept-02.jpg',
    '/assets/img/eventos/sept-03.jpg',
    '/assets/img/eventos/sept-04.jpg',
    '/assets/img/eventos/sept-05.jpg',
    '/assets/img/eventos/sept-06.jpg',
    '/assets/img/eventos/sept-07.jpg',
    '/assets/img/eventos/sept-08.jpg',
    // ? Imagenes Galeria **************** 
    '/assets/img/fotos/foto-01.jpg',
    '/assets/img/fotos/foto-02.jpg',
    '/assets/img/fotos/foto-03.jpg',
    '/assets/img/fotos/foto-04.jpg',
    // ? Favicon ************************* 
    '/assets/img/icons/favicon-16x16.png',
    '/assets/img/icons/favicon-32x32.png',
    '/assets/img/icons/favicon-96x96.png',
    // ? Imagenes Lightbox *************** 
    '/assets/img/lightbox/close.png',
    '/assets/img/lightbox/default-skin.png',
    '/assets/img/lightbox/default-skin.svg',
    '/assets/img/lightbox/loading.gif',
    '/assets/img/lightbox/next.png',
    '/assets/img/lightbox/preloader.gif',
    '/assets/img/lightbox/prev.png',
    // ? Logos *************************** 
    '/assets/img/logos/abc-logo.jpg',
    '/assets/img/logos/Logo_McGraw-Hill.jpg',
    '/assets/img/logos/Logo_alianza-francesa.png',
    '/assets/img/logos/Logo_HMH.png',
    '/assets/img/logos/Logo_Pearson.png',
    '/assets/img/logos/Logo_Santillana.png',
    '/assets/img/logos/Logo_t-box.png',
    '/assets/img/logos/NIPSA_Logo.png',
    // ? Sin Conexión ******************** 
    '/assets/img/offline/formBackEs.jpg',
    '/assets/img/offline/formBackIn.jpg',
    '/assets/img/offline/mapBackEs.jpg',
    '/assets/img/offline/mapBackIn.jpg',
    '/assets/img/offline/smallFormBackEs.png',
    '/assets/img/offline/smallFormBackIn.png',
    '/assets/img/offline/videoBackEs.jpg',
    '/assets/img/offline/videoBackIn.jpg',
    // ? Slider ************************** 
    '/assets/img/slider/slider_1.jpg',
    '/assets/img/slider/slider_2.jpg',
    '/assets/img/slider/slider_3.jpg',
    '/assets/img/slider/slider_4.jpg',
    '/assets/img/slider/slider_5.jpg',
    '/assets/img/slider/slider_6.jpg',
    '/assets/img/slider/slider_7.jpg',
    '/assets/img/slider/slider_8.jpg',
    '/assets/img/slider/slider_9.jpg',
    // ? Imagenes SVG ******************** 
    '/assets/img/svg/404.svg',
    '/assets/img/svg/arrow_left.svg',
    '/assets/img/svg/arrow_right.svg',
    '/assets/img/svg/astronaut.svg',
    '/assets/img/svg/earth.svg',
    '/assets/img/svg/hombre-user.svg',
    '/assets/img/svg/map-marker-alt-solid.svg',
    '/assets/img/svg/moon.svg',
    '/assets/img/svg/mujer-user.svg',
    '/assets/img/svg/overlay_stars.svg',
    '/assets/img/svg/rocket.svg',
    '/assets/img/svg/x.svg',
    // ? Imagenes Parallax *************** 
    '/assets/img/parallax.jpg',
    '/assets/img/bg_purple.png',
    // ? Modal - Menu ******************** 
    '/assets/img/menu-cafeteria.jpg',
    '/assets/img/menu-logo.jpg',
    // ? Banderas ************************ 
    '/assets/img/el-salvador.png',
    '/assets/img/usa.png',
];

//durante la fase de instalación, generalmente se almacena en caché los activos estáticos
self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache)
                // .then(() => self.skipWaiting())
            })
            .catch(err => console.log('Falló registro de cache', err))
    )
    self.skipWaiting()
})

//una vez que se instala el SW, se activa y busca los recursos para hacer que funcione sin conexión
self.addEventListener('activate', e => {
    const cacheWhitelist = CACHE_NAME;

    e.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {

                        if (cacheName !== cacheWhitelist) {
                            return caches.delete(cacheName)
                        }
                    })
                )
            })
            // Le indica al SW activar el cache actual
            // .then(() => self.clients.claim())
    )
    clients.claim()
})

//cuando el navegador recupera una url
self.addEventListener('fetch', e => {
    //Responder ya sea con el objeto en caché o continuar y buscar la url real
    e.respondWith(

        // caches.open(CACHE_NAME)
        //     .then( cache => {
        //         return cache.match(e.request)
        //             .then(res => {
        //                 return res || fetch(e.request);
        //             })
        //     })

        caches.match(e.request)
            .then(res => {
                return res || fetch(e.request);
            })
    )
})