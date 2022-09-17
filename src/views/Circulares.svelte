<script>
    // import venobox from '../../assets/js/venobox';
    import Common from './Common.svelte';
    import Circulares from "../components/Circulares.svelte";
    import Testimoniales from '../components/Testimoniales.svelte';
    import Fotos from '../components/Fotos.svelte';
    import Footer from '../components/Footer.svelte';

    export let esp;
    let pagina = 5, setTime=200, url = [ "circulares", "newsletter" ];

</script>

<main>
    <Common {esp} clase=".link-informacion" {setTime} {url} />
    <Circulares {esp} />
    <Testimoniales {esp} />
    <Fotos />
</main>
<Footer {esp} {pagina} />