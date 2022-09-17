<script>
    import Common from './Common.svelte';
    import Boxes from '../components/InfoBoxes.svelte';
    import Formulario from '../components/Formulario.svelte';
    import Instituciones from '../components/Instituciones.svelte';
    import Footer from '../components/Footer.svelte';

    export let esp, url = [ "/contactanos", "/contact-us" ];
    let pagina=6, setTime=200;
</script>

<main>
    <Common {esp} {setTime} {url} />
    <Boxes {esp} />
    <Formulario {esp} />
    <Instituciones />
</main>
<Footer {esp} {pagina} />