<script>
  import { onMount } from 'svelte';
  import { contentWayPointAnimalo } from '../assets/js/scripts'
  export let start = false;

  onMount( () => {
      if(start){
        // contentWayPointAnimalo()
      }
  } )
</script>

<div id="no-found" class="contenedor bg-purple">

    <div class="stars">
      <div class="custom-navbar">
        <div class="brand-logo">
          <img src="/assets/img/logos/abc-logo.png" height="80px" alt="img">
        </div>
        <div class="navbar-links">
          <ul>
            <li><a href="http://salehriaz.com/404Page/404.html" target="_blank">Home</a></li>
            <li><a href="http://salehriaz.com/404Page/404.html" target="_blank">About</a></li>
            <li><a href="http://salehriaz.com/404Page/404.html" target="_blank">Features</a></li>
            <li><a href="http://salehriaz.com/404Page/404.html" class="btn-request" target="_blank">Request A Demo</a></li>
          </ul>
        </div>
      </div>
      <div class="central-body">
        <img class="image-404" src="/assets/img/svg/404.svg" width="300px" alt="img">
        <!-- <a href class="btn-go-home" id="boton">GO BACK HOME</a> -->
      </div>
      <div class="objects">
        <img class="object_rocket" src="/assets/img/svg/rocket.svg" width="40px" alt="img">
        <div class="earth-moon">
          <img class="object_earth" src="/assets/img/svg/earth.svg" width="100px" alt="img">
          <img class="object_moon" src="/assets/img/svg/moon.svg" width="80px" alt="img">
        </div>
        <div class="box_astronaut">
          <img class="object_astronaut" src="/assets/img/svg/astronaut.svg" width="140px" alt="img">
        </div>
      </div>
      <div class="glowing_stars">
        <div class="star"></div>
        <div class="star"></div>
        <div class="star"></div>
        <div class="star"></div>
        <div class="star"></div>
  
      </div>
  
    </div>

  </div>