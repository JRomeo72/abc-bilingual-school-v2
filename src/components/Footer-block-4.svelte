<script>
    export let esp;
    let urlEmailEs = 'https://design-2u.com/tools/email-abc/email-corto.html';
    let urlEmailIn = 'https://design-2u.com/tools/email-abc/email-short.html';
</script>

<div class="col-sm-8 col-lg-4 mb-5 animalo retardo-5" data-animate-effect="fadeInUp">

    <div class="block-4">

        <div class="border border-light m-2 p-3">
            
            <div class="text-center">
            {#if !esp}
                <h3 class="block-title mb-4">Subscribe</h3>
                <p class="text">Subscribe to receive weekly information in your email.</p>
                <div class="small-form-back" style="background-image: url(/assets/img/offline/smallFormBackIn.png);">
                    <div class="visible">
                        <iframe title="form" class="iframe" src={urlEmailIn} frameborder="0" style="height: 200px; width: 100%;"></iframe>
                    </div>
                </div>
            {:else}
                <h3 class="block-title mb-4">Suscríbete</h3>
                <p class="text">Suscríbete para recibir información semanal en tu correo.</p>
                <div class="small-form-back" style="background-image: url(/assets/img/offline/smallFormBackEs.png);">
                    <div class="visible">
                        <iframe title="form" class="iframe" src={urlEmailEs} frameborder="0" style="height: 200px; width: 100%;"></iframe>
                    </div>
                </div>
            {/if}
            </div>

        </div>
    
    </div>

</div>