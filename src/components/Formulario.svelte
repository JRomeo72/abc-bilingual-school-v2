<script>
    export let esp;
    let urlEmailEs = 'https://design-2u.com/tools/email-abc/email-completo.html';
    let urlEmailIn = 'https://design-2u.com/tools/email-abc/email-full.html';
</script>

<section id="mapa-formulario" class="mapa-y-form bg-azul py-5">
    <div class="container-fluid">
        <div class="row">

            <div class="form-back col-md-12 col-lg-5 mb-3 order-lg-last animalo p-0 h-100" data-animate-effect="fadeInRight" style="background-image: url({ esp ? '/assets/img/offline/formBackEs.jpg' : '/assets/img/offline/formBackIn.jpg'});">
                <div class="d-flex justify-content-center visible p-0 h-100">
                    {#if !esp}
                        <iframe title="form" class="iframe" src="{urlEmailIn}" frameborder="0" style="height: 550px; width: 100%; max-width: 400px;"></iframe>
                    {:else}
                        <iframe title="form" class="iframe" src="{urlEmailEs}" frameborder="0" style="height: 550px; width: 100%; max-width: 400px;"></iframe>
                    {/if}
                </div>
            </div>

            <div class="map-back col-md-12 col-lg-7 animalo p-0 h-100" data-animate-effect="fadeInLeft" style="background-image: url({ esp ? '/assets/img/offline/mapBackEs.jpg' : '/assets/img/offline/mapBackIn.jpg'});">
                <div class="visible p-0 h-100">
                    <!-- <iframe title="map" class="iframe" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3876.2161397145815!2d-89.24494204874848!3d13.705355302011316!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f63301f44ce3d33%3A0xfa50e6bfe968f136!2sABC%20BILINGUAL%20SCHOOL!5e0!3m2!1sen!2ssv!4v1584989650307!5m2!1sen!2ssv" width="100%" height="550px" frameborder="0" style="border:0;" allowfullscreen="" aria-hidden="false" tabindex="0"></iframe> -->
                    <iframe title  class="iframe" src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3606.2090978151423!2d-89.24348720253126!3d13.705277082850435!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f63301f44ce3d33%3A0xfa50e6bfe968f136!2sABC%20Bilingual%20School!5e0!3m2!1sen!2ssv!4v1651537049535!5m2!1sen!2ssv" width="100%" height="550" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                <div>
            </div>

        </div>
    </div>
</section>