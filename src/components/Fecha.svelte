<script>
    export let url, title;
</script>

<!-- De esta forma lo hacia con venobox.js -->
<!-- <div class="col pb-3 animalo" data-animate-effect="fadeInUp">
    <a href="{url}" class="venobox" data-gall="myGallery" title="{title}">
        <img src="{url}" class="img-fluid card sombra" alt="fecha"/>
    </a>
</div> -->

<a href="{url}" class="col pb-3 animalo" data-animate-effect="fadeInUp">
    <img src="{url}" class="img-fluid card sombra" alt="fecha" title="{title}" />
</a>