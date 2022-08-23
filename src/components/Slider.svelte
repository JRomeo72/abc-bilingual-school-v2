<script>
    export let esp;
</script>

<section id="My-Slider" class="carousel slide carousel-fade" data-bs-ride="carousel">
    
    <ol class="carousel-indicators">
        <li data-bs-target="#My-Slider" data-bs-slide-to="0" class="active"></li>
        <li data-bs-target="#My-Slider" data-bs-slide-to="1"></li>
        <li data-bs-target="#My-Slider" data-bs-slide-to="2"></li>
        <li data-bs-target="#My-Slider" data-bs-slide-to="3"></li>
        <li data-bs-target="#My-Slider" data-bs-slide-to="4"></li>
        <li data-bs-target="#My-Slider" data-bs-slide-to="5"></li>
        <li data-bs-target="#My-Slider" data-bs-slide-to="6"></li>
        <li data-bs-target="#My-Slider" data-bs-slide-to="7"></li>
        <li data-bs-target="#My-Slider" data-bs-slide-to="8"></li>
    </ol>

    <div class="carousel-inner">

        <!-- Slider 1-->
        <div class="carousel-item active" style="background-image:url('/assets/img/slider/slider_1.jpg')">
            <!--<img src="img/slider_1.jpg" class="d-block w-100" alt="...">-->
            <div class="mask"></div>
            <!--<div class="carousel-caption d-none d-sm-block">-->
            <div class="container texto-carrusel">
                {#if !esp}
                    <p class="display-3 font-weight-bold animated fadeInDown delay-1s">They are the most important.</p>
                    <p class="h3 animated fadeIn delay-2s">More than 35 years of building values for a better world.</p>
                {:else}
                    <p class="display-3 font-weight-bold animated fadeInDown delay-1s">Ellos son lo más Importante.</p>
                    <p class="h3 animated fadeIn delay-2s">Más de 35 años de construir valores para un mundo mejor.</p>
                {/if}
            </div>
        </div>

        <!-- Slider 2-->
        <div class="carousel-item"  style="background-image:url('/assets/img/slider/slider_2.jpg')">
            <!--<img src="img/slider_2.jpg" class="d-block w-100" alt="...">-->
            <div class="mask"></div>
            <!--<div class="carousel-caption d-none d-sm-block">-->
            <div class="container texto-carrusel">
            {#if !esp}
                <p class="display-3 font-weight-bold animated fadeInDown delay-1s">We educate with Values.</p>
                <p class="h3 animated fadeIn delay-2s">We pride ourselves on our personalized education.</p>
            {:else}
                <p class="display-3 font-weight-bold animated fadeInDown delay-1s">Educamos con Valores.</p>
                <p class="h3 animated fadeIn delay-2s">Nos enorgullecemos de nuestra educación personalizada.</p>
            {/if}
            </div>
        </div>

        <!-- Slider 3-->
        <div class="carousel-item"  style="background-image:url('/assets/img/slider/slider_3.jpg')">
            <!--<img src="img/slider_3.jpg" class="d-block w-100" alt="...">-->
            <div class="mask"></div>
            <!--<div class="carousel-caption d-none d-sm-block">-->
            <div class="container texto-carrusel-3">
            {#if !esp}
                <p class="display-3 font-weight-bold animated fadeInRight delay-1s">Equality for all.</p>
                <p class="h3 animated fadeIn delay-2s">We promote respect and equality, "STOP bullying".</p>
            {:else}
                <p class="display-3 font-weight-bold animated fadeInRight delay-1s">Igualdad para todos.</p>
                <p class="h3 animated fadeIn delay-2s">Fomentamos el respeto y la igualdad, "ALTO al bullying".</p>
            {/if}
            </div>
        </div>

        <!-- Slider 4-->
        <div class="carousel-item" style="background-image:url('/assets/img/slider/slider_4.jpg')">
            <div class="mask"></div>
            <div class="container texto-carrusel">
                {#if !esp}
                    <p class="display-3 font-weight-bold animated fadeInDown delay-1s">They are the most important.</p>
                    <p class="h3 animated fadeIn delay-2s">More than 35 years of building values for a better world.</p>
                {:else}
                    <p class="display-3 font-weight-bold animated fadeInDown delay-1s">Ellos son lo más Importante.</p>
                    <p class="h3 animated fadeIn delay-2s">Más de 35 años de construir valores para un mundo mejor.</p>
                {/if}
            </div>
        </div>

        <!-- Slider 5-->
        <div class="carousel-item"  style="background-image:url('/assets/img/slider/slider_5.jpg')">
            <div class="mask"></div>
            <div class="container texto-carrusel">
            {#if !esp}
                <p class="display-3 font-weight-bold animated fadeInDown delay-1s">We educate with Values.</p>
                <p class="h3 animated fadeIn delay-2s">We pride ourselves on our personalized education.</p>
            {:else}
                <p class="display-3 font-weight-bold animated fadeInDown delay-1s">Educamos con Valores.</p>
                <p class="h3 animated fadeIn delay-2s">Nos enorgullecemos de nuestra educación personalizada.</p>
            {/if}
            </div>
        </div>

        <!-- Slider 6-->
        <div class="carousel-item"  style="background-image:url('/assets/img/slider/slider_6.jpg')">
            <div class="mask"></div>
            <div class="container texto-carrusel-3">
            {#if !esp}
                <p class="display-3 font-weight-bold animated fadeInRight delay-1s">Equality for all.</p>
                <p class="h3 animated fadeIn delay-2s">We promote respect and equality, "STOP bullying".</p>
            {:else}
                <p class="display-3 font-weight-bold animated fadeInRight delay-1s">Igualdad para todos.</p>
                <p class="h3 animated fadeIn delay-2s">Fomentamos el respeto y la igualdad, "ALTO al bullying".</p>
            {/if}
            </div>
        </div>

        <!-- Slider 7-->
        <div class="carousel-item" style="background-image:url('/assets/img/slider/slider_7.jpg')">
            <div class="mask"></div>
            <div class="container texto-carrusel">
                {#if !esp}
                    <p class="display-3 font-weight-bold animated fadeInDown delay-1s">They are the most important.</p>
                    <p class="h3 animated fadeIn delay-2s">More than 35 years of building values for a better world.</p>
                {:else}
                    <p class="display-3 font-weight-bold animated fadeInDown delay-1s">Ellos son lo más Importante.</p>
                    <p class="h3 animated fadeIn delay-2s">Más de 35 años de construir valores para un mundo mejor.</p>
                {/if}
            </div>
        </div>

        <!-- Slider 8-->
        <div class="carousel-item"  style="background-image:url('/assets/img/slider/slider_8.jpg')">
            <div class="mask"></div>
            <div class="container texto-carrusel">
            {#if !esp}
                <p class="display-3 font-weight-bold animated fadeInDown delay-1s">We educate with Values.</p>
                <p class="h3 animated fadeIn delay-2s">We pride ourselves on our personalized education.</p>
            {:else}
                <p class="display-3 font-weight-bold animated fadeInDown delay-1s">Educamos con Valores.</p>
                <p class="h3 animated fadeIn delay-2s">Nos enorgullecemos de nuestra educación personalizada.</p>
            {/if}
            </div>
        </div>

        <!-- Slider 9-->
        <div class="carousel-item"  style="background-image:url('/assets/img/slider/slider_9.jpg')">
            <div class="mask"></div>
            <div class="container texto-carrusel-3">
            {#if !esp}
                <p class="display-3 font-weight-bold animated fadeInRight delay-1s">Equality for all.</p>
                <p class="h3 animated fadeIn delay-2s">We promote respect and equality, "STOP bullying".</p>
            {:else}
                <p class="display-3 font-weight-bold animated fadeInRight delay-1s">Igualdad para todos.</p>
                <p class="h3 animated fadeIn delay-2s">Fomentamos el respeto y la igualdad, "ALTO al bullying".</p>
            {/if}
            </div>
        </div>


    </div>

    <button type="button" class="carousel-control-prev" data-bs-target="#My-Slider" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="sr-only">Previous</span>
    </button>

    <button type="button" class="carousel-control-next" data-bs-target="#My-Slider" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="sr-only">Next</span>
    </button>

</section>