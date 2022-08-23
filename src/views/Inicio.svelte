<script>
    import Common from './Common.svelte';
    import Slider from '../components/Slider.svelte';
    import Servicios from '../components/Servicios.svelte';
    import Instituciones from '../components/Instituciones.svelte';
    import Nosotros from '../components/Nosotros.svelte';
    import Video from '../components/Video.svelte';
    import Parallax from '../components/Parallax.svelte';
    import Equipo from '../components/Equipo.svelte';
    import Testimoniales from '../components/Testimoniales.svelte';
    import Fotos from '../components/Fotos.svelte';
    import Footer from '../components/Footer.svelte';

    export let esp;
    let hidden = true, pagina = 1, inicio = true, url = [ "/", "home" ];
</script>

<main>
    <Common {esp} {inicio} {url}  />
    <Slider {esp} />
    <Servicios {esp} />
    <Instituciones />
    <Nosotros {esp} {hidden} />
    <Video {esp} />
    <Parallax {esp} />
    <Equipo {esp} eq="administracion" />
    <Testimoniales {esp} />
    <Fotos />
</main>
<Footer {esp} {pagina} />
