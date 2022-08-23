<script>
    import Common from './Common.svelte';
    import Fechas from '../components/Fechas.svelte';
    import Testimoniales from '../components/Testimoniales.svelte';
    import Fotos from '../components/Fotos.svelte';
    import Footer from '../components/Footer.svelte';

    export let esp;
    let hidden = true, pagina = 5, url = [ "fechas-importantes", "important-dates" ];
</script>

<main>
    <Common {esp} clase = ".link-informacion" {url} />
    <Fechas {esp} />
    <Testimoniales {esp} />
    <Fotos />
</main>
<Footer {esp} {pagina} />