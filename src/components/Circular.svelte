<script>
    export let url, img, doc;
</script>

<div class="col pb-3 animalo" data-animate-effect="fadeInUp">
    {#if img}
         <a href={url} class="venobox" data-gall="myGallery">
            <img src={url} class="img-fluid card sombra" alt="circular"/>
        </a>
    {:else}
         <a href={doc}  target="_blank">
            <img src={url} class="img-fluid card sombra" alt="circular"/>
        </a>
    {/if}
</div>