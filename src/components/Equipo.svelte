<script>
    import { Link } from 'svelte-routing';
    import EqItems from './EqItems.svelte';
    export let esp, eq;
</script>
<section  id="equipo">
    <div class="container my-section team-section pt-3">

        <div Class="text-center">
            <h2 Class="h2 titulo-seccion">{ esp ? 'Nuestro Equipo' : 'Our Team' }</h2>
            <p Class="parrafo-seccion"></p>
        </div>


        <EqItems {esp} {eq} />

        <p class="mb-4 d-flex justify-content-center animalo pt-4" data-animate-effect="fadeIn">
            {#if esp}
                 <Link to="/personal/parvularia" class="btn rounded-pill bg-naranja text-white px-4 py-2 sombra btn-link">Todo el Equipo</Link>
            {:else}
                 <Link to="/our-team/preschool" class="btn rounded-pill bg-naranja text-white px-4 py-2 sombra btn-link">All Team</Link>
            {/if}
        </p>
    </div>
</section>