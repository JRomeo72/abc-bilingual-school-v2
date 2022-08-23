<script>
    import { onMount } from 'svelte';
    import { menuItems, menuLinks, menuDrop, conectionOnLine } from '../stores/stores';

    import {
                contentWayPointAnimalo,
                navItemsEs,
                navItemsEn,
                navLinksEs,
                navLinksEsI,
                navLinksEn,
                navLinksEnH,
                navDropEs,
                navDropEn,
                menuRemoveClass,
                goScrollUp
            } from '../assets/js/scripts';
    import Language from '../components/Language.svelte'

    export let esp, clase, inicio, url=[];
    let page;
    
    // console.log(url);
    // console.log(typeof(url));

    // Comprobamos que prop 'url' es un string o un arreglo
    if(typeof(url) == "string") {
        page = url;
    }else{
        if(esp) {
            page = url[1];
        }else{
            page = url[0];
        }
    }

    // Iniciamos el idioma en el menú
    if(esp){
        
        if($menuItems[0] == "Home") {
            menuItems.update( n => navItemsEs );

            if(inicio){
                menuLinks.update( n => navLinksEsI );
            }else{
                menuLinks.update( n => navLinksEs );
            }

            menuDrop.update( n => navDropEs );
        }

        if(inicio) {
            menuLinks.update( n => navLinksEsI );
        }else if($menuLinks[2] !== "/personal") {
            menuLinks.update( n => navLinksEs );
        }

    }else{
        
        if($menuItems[0] == "Inicio") {
            menuItems.update( n => navItemsEn );

            if(inicio){
                menuLinks.update( n => navLinksEnH );
            }else{
                menuLinks.update( n => navLinksEn );
            }
            
            menuDrop.update( n => navDropEn );
        }

        if(inicio) {
            menuLinks.update( n => navLinksEnH );
        }else if($menuLinks[2] !== "/our-team") {
            menuLinks.update( n => navLinksEn );
        }
    }

    // Función que verifica la conexión y cambia la visualización
    export const checkConnection = () => {
        console.log(messages[navigator.onLine]);
        contentMessage.classList.remove("true");
        contentMessage.classList.remove("false");
        setTimeout(function (){
            contentMessage.innerHTML = messages[navigator.onLine];
            contentMessage.classList.add(navigator.onLine);
        }, 600);

        if(navigator.onLine){
            console.log("con conexion");
            conectionOnLine.update( n => true );

            //Recarga los iframes
            const iframe = document.querySelectorAll('.iframe');
            iframe.forEach(e =>{
                e.src = e.src;
            });
            
            const cambiarClase = document.querySelectorAll('.oculto');
            setTimeout(function(){
                cambiarClase.forEach(e => {
                    //e.removeClass('class', 'visible');
                    e.classList.remove("oculto");
                    e.classList.add("visible");
                });
            }, 2000);

            // const showElement = document.querySelectorAll('.v-offLine-ocultar');
            // showElement.forEach(e => e.classList.remove("v-ocultar"));

            // const hiddenElement = document.querySelectorAll('.v-onLine-ocultar');
            // hiddenElement.forEach(e => e.classList.add("v-ocultar"));

            setTimeout(() => {
                const menuBottom = document.querySelector('.nav-eq');
                if ( menuBottom ) {
                    menuBottom.classList.remove('subir');
                }
            }, 6000);

            setTimeout(function (){
                contentMessage.classList.remove("true");
            }, 6000);

            contentWayPointAnimalo();

        }else{
            console.log("sin conexion");
            conectionOnLine.update( n => false );

            setTimeout(() => {
                const menuBottom = document.querySelector('.nav-eq');
                if ( menuBottom ) {
                    menuBottom.classList.add('subir');
                }
            }, 1200);


            const cambiarClase = document.querySelectorAll('.visible');
            cambiarClase.forEach(e => {
                //e.setAttribute('class', 'oculto');
                e.classList.remove("visible");
                e.classList.add("oculto");
            });

            // const showElement = document.querySelectorAll('.v-onLine-ocultar');
            // showElement.forEach(e => e.classList.remove("v-ocultar"));

            // const hiddenElement = document.querySelectorAll('.v-offLine-ocultar');
            // hiddenElement.forEach(e => e.classList.add("v-ocultar"));
        }
    }


    onMount( async () => {
        window.addEventListener("online",  checkConnection);
    	window.addEventListener("offline", checkConnection);
        if(!navigator.onLine){
            checkConnection();
        }

        menuRemoveClass(clase);
        let tiempo = await goScrollUp();
        setTimeout(() => {
            contentWayPointAnimalo();
        }, tiempo);
        // console.log(navigator.onLine)

    } );

</script>


<Language {esp} {page} />
