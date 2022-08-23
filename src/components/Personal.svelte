<script>
    import Common from '../views/Common.svelte';
    import EqItems from './EqItems.svelte';
    export let esp, eq, url;
</script>

<Common {esp} clase = ".link-conocenos" {url} />
<section id="equipo">
    <div class="container my-section team-section pt-3">

        <div Class="text-center">
            <h2 Class="h2 titulo-seccion">{ esp ? 'Nuestro Equipo' : 'Our Team' }</h2>
            <p Class="parrafo-seccion"></p>
        </div>

        <EqItems {esp} {eq} />

        <!-- {window.location.replace('/')} -->

    </div>
</section>