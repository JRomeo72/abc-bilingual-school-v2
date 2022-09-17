<script>
    import Common from './Common.svelte';
    import Fechas from '../components/Fechas.svelte';
    import Testimoniales from '../components/Testimoniales.svelte';
    import Fotos from '../components/Fotos.svelte';
    import Footer from '../components/Footer.svelte';

    export let esp;
    let pagina=5, setTime=200, url=[ "fechas-importantes", "important-dates" ];
</script>

<main>
    <Common {esp} clase=".link-informacion" {setTime} {url} />
    <Fechas {esp} />
    <Testimoniales {esp} />
    <Fotos />
</main>
<Footer {esp} {pagina} />