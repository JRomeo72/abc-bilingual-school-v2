<script>
    import { conectionOnLine } from '../stores/stores';
    import MessageOffLine from './MessageOffLine.svelte';
    export let esp;
</script>
<section id="vida-escolar" class="container-fluid my-section pt-5">

    <div class="container text-center">
        <h2 Class="h2 titulo-seccion">{ esp ? "Vida Escolar" : "School Life"}</h2>
        <p Class="parrafo-seccion"> { esp ?
                                        "Feed de nuestro Instagram."
                                        :
                                        "Our Instagram Feed."
                                    }
        </p>
    </div>

    <div class="container instagram-feed">
        {#if $conectionOnLine}
             <!-- content here -->
             <script src="https://apps.elfsight.com/p/platform.js" defer></script>
             <div class="wall"></div>
             <div class="elfsight-app-fb5ebeca-3a74-4647-b6da-2c4b478c6250"></div>
        {:else}
            <MessageOffLine {esp} />
        {/if}
    </div>
</section>