<script>
    import { Link } from 'svelte-routing';
	import { onMount } from 'svelte'
    export let esp;

	onMount( () => {
		
		jarallax(document.querySelector('.jarallax'), {
			speed: 0.5
		});

	} )

</script>

<!-- <div class="parallax d-flex justify-content-center align-items-center">
    <div class="mask"></div>
    <div class="elementos text-center text-white justify-align-contnt">

        {#if !esp}
            <h2 class="display-4 animalo" data-animate-effect="fadeInUp">We teach your child with love and respect.</h2>
            <p class="animalo retardo-1" data-animate-effect="fadeIn">Respect and love for our students is what defines us as integral educators in our society.</p>
            <NavLink to="/about-us/school-life">
                <div  class="btn bg-naranja rounded-pill shadow text-white animalo delay-500ms" data-animate-effect="fadeIn">
                    School Life
                </div>
            </NavLink>
        {:else}
             <h2 class="display-4 animalo" data-animate-effect="fadeInUp">Enseñamos a su hijo con Amor y Respeto.</h2>
             <p class="animalo retardo-1" data-animate-effect="fadeIn">El respeto y el amor hacia nuestros alumnos, es lo que nos define como educadores integrales en nuestra sociedad.</p>
             <NavLink to="/about-us/school-life">
                <div  class="btn bg-naranja rounded-pill shadow text-white animalo delay-500ms" data-animate-effect="fadeIn">
                    Vida Escolar
                </div>
            </NavLink>
        {/if}

    </div>

</div> -->


<section id="parallax" class="view jarallax">
    <img class="jarallax-img" src="/assets/img/parallax.jpg" alt="">
    
    <div class="mask rgba-black-light">
        <div class="container d-flex justify-content-center align-items-center text-center h-100">
            <div class="row mt-5">

                {#if !esp}
                    <div class="col-md-9 animalo mb-3 text-box-parallax" data-animate-effect="fadeIn">
                        <h1 class="text-white font-weight-bold mb-2 animalo" data-animate-effect="fadeInDown">We teach your child with love and respect.</h1>
                        <p class="parrafo text-white animalo" data-animate-effect="fadeIn">Respect and love for our students is what defines us as integral educators in our society.</p>
                    </div>
                    <div class="col-md-3 d-flex align-items-center">
                        <p><Link to="school-life" class="btn rounded-pill bg-naranja text-white px-4 py-3 animalo btn-link" data-animate-effect="fadeIn">School Life</Link></p>
                    </div>
                {:else}
                    <div class="col-md-9 animalo mb-3 text-box-parallax" data-animate-effect="fadeIn">
                        <h1 class="text-white font-weight-bold mb-2 animalo" data-animate-effect="fadeInDown">Enseñamos a su hijo con Amor y Respeto.</h1>
                        <p class="parrafo text-white animalo" data-animate-effect="fadeIn">
                            El respeto y el amor hacia nuestros alumnos, es lo que nos define como educadores integrales en nuestra sociedad.
                        </p>
                    </div>
                    <div class="col-md-3 d-flex align-items-center">
                        <p><Link to="vida-escolar" class="btn rounded-pill bg-naranja text-white px-4 py-3 animalo btn-link" data-animate-effect="fadeIn">Vida Escolar</Link></p>
                    </div>
                {/if}

            </div>
        </div>
    </div>
</section>
