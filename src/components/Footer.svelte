<script>
    import Block1 from './Footer-block-1.svelte';
    import Block2 from './Footer-block-2.svelte';
    import Block3 from './Footer-block-3.svelte';
    import Block4 from './Footer-block-4.svelte';
    import Block5 from './Footer-block-5.svelte';

    export let esp, pagina;

</script>

<footer>
    <div class="container-fluid seccion-footer">

        <div class="container">

            <div class="row">
                <Block1 {esp} />
                <Block2 {esp} />

                {#if !esp}


                        {#if pagina == 1}
                            <Block3 {esp} link1="#" link2="#conocenos" link3="#equipo" link4="/school-life" link5="/contact-us" />
                        {:else if pagina == 2}
                            <Block3 {esp} link1="/home" link2="#conocenos" link3="/our-team/administration" link4="/school-life" link5="/contact-us" />
                        {:else if pagina == 3}
                            <Block3 {esp} link1="/home" link2="/institution" link3="#equipo" link4="/school-life" link5="/contact-us" />
                        {:else if pagina == 4}
                            <Block3 {esp} link1="/home" link2="/institution" link3="/our-team/administration" link4="#vida-escolar" link5="/contact-us" />
                        {:else if pagina == 5}
                            <Block3 {esp} link1="/home" link2="/institution" link3="/our-team/administration" link4="/school-life" link5="/contact-us" />
                        {:else if pagina == 6}
                            <Block3 {esp} link1="/home" link2="/institution" link3="/our-team/administration" link4="/school-life" link5="#contactanos" />
                        {/if}
                {:else}
                        {#if pagina == 1}
                            <Block3 {esp} link1="#" link2="#conocenos" link3="#equipo" link4="/vida-escolar" link5="/contactanos" />
                        {:else if pagina == 2}
                            <Block3 {esp} link1="/" link2="#conocenos" link3="/personal/administracion" link4="/vida-escolar" link5="/contactanos" />
                        {:else if pagina == 3}
                            <Block3 {esp} link1="/" link2="/institucion" link3="#equipo" link4="/vida-escolar" link5="/contactanos" />
                        {:else if pagina == 4}
                            <Block3 {esp} link1="/" link2="/institucion" link3="/personal/administracion" link4="#vida-escolar" link5="/contactanos" />
                        {:else if pagina == 5}
                            <Block3 {esp} link1="/" link2="/institucion" link3="/personal/administracion" link4="/vida-escolar" link5="/contactanos" />
                        {:else if pagina == 6}
                            <Block3 {esp} link1="/" link2="/institucion" link3="/personal/administracion" link4="/vida-escolar" link5="#contactanos" />
                        {/if}
                {/if}
                        
                <Block4 {esp} />

            </div>

            <Block5 />

        </div>



    </div>
</footer>