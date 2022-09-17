<script>
    import Common from './Common.svelte';
    import Feed from '../components/InstaFeed.svelte';
    import Video from '../components/Video.svelte';
    import Fotos from '../components/Fotos.svelte';
    import Footer from '../components/Footer.svelte';

    export let esp;
    let pagina=4, setTime=200, url=[ "vida-escolar", "school-life" ];
</script>

<main>
    <Common {esp} clase=".link-conocenos" {setTime} {url} />
    <Feed {esp} />
    <Video {esp} />
    <Fotos />
</main>
<Footer {esp} {pagina} />