<script>
    import { onMount } from 'svelte';
    import Circular from './Circular.svelte';
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

<section id="circulares" class="container-fluid">
    <div class="container my-5 pb-3 sombra card">

        <h2 Class="h2 text-center titulo-seccion">{ !esp ? 'Newsletter' : 'Circulares'}</h2>
        <h4 class="text-center sub-titulo-seccion">{ !esp ? 'Important Information' : 'Información importante'}</h4>

        <div id="info" class="row row-cols-2 row-cols-sm-3 row-cols-md-4 d-flex justify-content-center">

            <Circular url="/assets/img/circulares/circular-01.jpg" doc="/assets/img/circulares/circular-01.pdf"/>
            <!-- <Circular url="/assets/img/circulares/circular-04.jpg" img="true"/>
            <Circular url="/assets/img/circulares/circular-03.jpg" img="true"/>
            <Circular url="/assets/img/circulares/circular-02.jpg" img="true"/>
            <Circular url="/assets/img/circulares/circular-01.jpg" doc="/assets/img/circulares/circular-01.pdf"/> -->

        </div>
    
    </div>
</section>