<script>
    import { onMount } from 'svelte';
    import Fecha from './Fecha.svelte';
    export let esp;

    onMount( () => {
        sLightbox()
    } )

    const sLightbox = () => {

        new SimpleLightbox('.gallery a', {
            overlayOpacity: 0.9,
            captionPosition: 'outside',
        })

        // jQuery('.venobox').venobox({
        //     spinner    : 'cube-grid',
        //     spinColor    : '#fbb802',
        //     border: '5px',
        //     bgcolor: '#fbb802',
        //     arrowsColor: '#fbb802',
        //     closeColor : "#fbb802",
        //     infinigall: true,
        //     numeratio: true,
        //     numerationColor: '#fbb802',
        //     titleattr: 'title',
        //     titleColor: '#fbb802',
        // });

        // new VenoBox({
        //     selector: '.venobox',
        //     spinner    : 'grid',
        //     spinColor    : '#fbb802',
        //     border: '5px',
        //     bgcolor: '#fbb802',
        //     infinigall: true,
        //     numeration: true,
        //     titleattr: 'title',
        //     navTouch: false,
        //     toolsColor: '#fbb802',
        // });
    }
</script>
<section id="fechas" class="container-fluid">
    <div class="container my-5 pb-3 sombra card">

        <h2 Class="h2 text-center titulo-seccion">{ esp ? "Fechas Importantes" : "Important Dates" }</h2>
        <h4 class="text-center sub-titulo-seccion">{ esp ? "Información Importante" : "Important Information" }</h4>

        <div id="info" class="gallery row row-cols-2 row-cols-sm-3 row-cols-md-4 d-flex justify-content-center">

            <Fecha url="/assets/img/eventos/fechas.png" title="Fechas importantes"></Fecha>
            <Fecha url="/assets/img/eventos/sept-01.jpg" title="Mes de la salud bucal"></Fecha>
            <Fecha url="/assets/img/eventos/sept-02.jpg" title="Entrega de proyectos Science Fair"></Fecha>
            <Fecha url="/assets/img/eventos/sept-03.jpg" title="Acto Cívico / Feria del maíz"></Fecha>
            <Fecha url="/assets/img/eventos/sept-04.jpg" title="Vacación - Día de la Independencia"></Fecha>
            <Fecha url="/assets/img/eventos/sept-05.jpg" title="Toma de fotografía para carnet"></Fecha>
            <Fecha url="/assets/img/eventos/sept-06.jpg" title="Elección gobierno estudiantil"></Fecha>
            <Fecha url="/assets/img/eventos/sept-07.jpg" title="Semana de las ciencias"></Fecha>
            <Fecha url="/assets/img/eventos/sept-08.jpg" title="Día del niño PTA"></Fecha>

        </div>

    </div>
</section>