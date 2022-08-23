<script>
    import Common from './Common.svelte';
    import Instituciones from '../components/Instituciones.svelte';
    import Nosotros from '../components/Nosotros.svelte';
    import Fotos from '../components/Fotos.svelte';
    import Footer from '../components/Footer.svelte';

    export let esp;
    let hidden = false, pagina = 2, url = [ "institucion", "institution" ];
</script>

<main>
    <Common {esp} clase=".link-conocenos" {url} />
    <Nosotros {esp} {hidden} />
    <Instituciones />
    <Fotos />
</main>
<Footer {esp} {pagina} />