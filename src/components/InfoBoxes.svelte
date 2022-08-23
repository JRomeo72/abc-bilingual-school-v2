<script>
    export let esp;
</script>

<section id="contactanos" class="container-fluid py-5">

    {#if !esp}
         <div Class="text-center py-4 animalo" data-animate-effect="fadeIn">
             <h2 Class="h2 titulo-seccion">Contact us<span> / Location</span></h2>
             <p Class="parrafo-seccion">You can contact us through our email or call us on our phone numbers. You can also visit us and we will attend you immediately</p>
         </div>
    {:else}
         <div Class="text-center py-4 animalo" data-animate-effect="fadeIn">
             <h2 Class="h2 titulo-seccion">Contáctanos<span> / Ubicación</span></h2>
             <p Class="parrafo-seccion">Puedes contactarnos por medio de nuestro correo electrónico o llamarnos a nuestros números telefónicos. Tambien puedes visitarnos y te atenderemos de inmediato</p>
         </div>
    {/if}

    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-4">

        <div class="col item px-2 mb-2 animalo" data-animate-effect="fadeInRight">
            <div class="p-3 bg-azul text-center color-naranja h-100">
                <i class="fas fa-map-marker-alt"></i>
                <h4 >{ !esp ? 'Address' : 'Dirección'}</h4>
                <p>89 Av. Nte. y 3a Calle Pte. #4628 Colonia Escalón, San Salvador, El Salvador, C.A.</p>
            </div>
        </div>

        <div class="col item px-2 mb-2 animalo" data-animate-effect="fadeInRight">
            <div class="p-3 bg-rojo text-center color-claro h-100">
                <i class="fas fa-phone-alt"></i>
                <h4>{ !esp ? 'Phone' : 'Teléfono'}</h4>
                <p>2264-0508 / 7696-9556</p>
            </div>
        </div>

        <div class="col item _email px-2 mb-2 animalo" data-animate-effect="fadeInRight">
            <div class="p-3 bg-naranja text-center color-azul h-100">
                <i class="far fa-envelope"></i>
                <h4>E-mail</h4>
                <p>info1@abcbilingualschool.edu.sv</p>
            </div>
        </div>

        <div class="col item px-2 mb-2 animalo" data-animate-effect="fadeInRight">
            <div class="p-3 bg-azul text-center color-naranja h-100">
                <i class="fas fa-share-alt"></i>
                <h4>{ !esp ? 'Social networks' : 'Redes Sociales'}</h4>
                <div class="social-icons d-flex justify-content-center">
                    <ul class="list-unstyled float-md-left float-left mt-3">
                        <li class="">
                        <a href="https://www.facebook.com/abcbilingualschool" target="_blank">
                            <span class="fab fa-facebook-f"></span>
                        </a>
                        </li>
                        <li class="">
                        <a href="https://www.instagram.com/abc_bilingual_school" target="_blank">
                            <span class="fab fa-instagram"></span>
                        </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

    </div>

</section>