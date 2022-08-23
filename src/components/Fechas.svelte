<script>
    import { onMount } from 'svelte';
    import Fecha from './Fecha.svelte';
    export let esp;

    onMount( () => {
        miVenobox()
    } )

    const miVenobox = () => {
        new VenoBox({
            spinner    : 'grid',
            infinigall: true,
            numeration: true,
            spinColor    : '#fbb802',
        });
    }
</script>
<section id="fechas" class="container-fluid">
    <div class="container my-5 pb-3 sombra card">

        <h2 Class="h2 text-center titulo-seccion">{ esp ? "Fechas Importantes" : "Important Dates" }</h2>
        <h4 class="text-center sub-titulo-seccion">{ esp ? "Información Importante" : "Important Information" }</h4>

        <div id="info" class="row row-cols-2 row-cols-sm-3 row-cols-md-4 d-flex justify-content-center">

            <Fecha url="/assets/img/eventos/fechas.jpg"></Fecha>
            <Fecha url="/assets/img/eventos/agosto-01.jpg"></Fecha>
            <Fecha url="/assets/img/eventos/agosto-02.jpg"></Fecha>
            <Fecha url="/assets/img/eventos/agosto-03.jpg"></Fecha>
            <Fecha url="/assets/img/eventos/agosto-04.jpg"></Fecha>
            <Fecha url="/assets/img/eventos/agosto-05.jpg"></Fecha>
            <Fecha url="/assets/img/eventos/agosto-06.jpg"></Fecha>
            <Fecha url="/assets/img/eventos/agosto-07.jpg"></Fecha>
            <Fecha url="/assets/img/eventos/agosto-08.jpg"></Fecha>
            <Fecha url="/assets/img/eventos/agosto-09.jpg"></Fecha>
            <Fecha url="/assets/img/eventos/agosto-10.jpg"></Fecha>

        </div>

    </div>
</section>