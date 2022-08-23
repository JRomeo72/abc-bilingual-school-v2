<script>
    export let esp;
</script>
<section class="animalo" data-animate-effect="fadeIn">
    <div class="container my-5">

        <div class="embed-responsive embed-responsive-16by9" style="background-image: url({ esp ? '/assets/img/offline/videoBackEs.jpg' : '/assets/img/offline/videoBackIn.jpg'}); background-position: center;">
            <div class="visible">
                <!--<iframe class="embed-responsive-item" src="https://vimeo.com/405312037" allowfullscreen></iframe>-->
                <iframe title="mi video" class="iframe" src="https://player.vimeo.com/video/405312037" width="640" height="360" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>
            </div>
        </div>

    </div>
</section>