<script>
    import { cafeteria } from '../assets/js/data';
    export let esp;
</script>

<div class="col-sm-6 col-lg-3 mb-5 animalo retardo-1" data-animate-effect="fadeInUp">
    <div class="block-2">

        <h3 class="block-title">{ esp ? "Últimas Circulares" : "Latest circulars" }</h3>

        <div class="mb-3 d-flex">

            <a href="/assets/img/circulares/circular-01.pdf" target="_blank">
                <img src="/assets/img/circulares/circular-01.jpg" alt="" class="card-img-top">
            </a>

            <!-- <a href="/assets/img/circulares/circular-01.pdf" data-lightbox="image-1">
                <img src="/assets/img/circulares/circular-01.jpg" alt="" class="card-img-top">
            </a> -->

            <div class="content-info">

                <a href="/assets/img/circulares/circular-01.pdf" target="_blank">
                    { esp ? "Bienvenida e Información" : "Welcome and Information" }
                </a>

                <!-- <a href="/assets/img/circulares/circular-01.pdf" data-lightbox="image-2">
                    { esp ? "Bienvenida e Información" : "Welcome and Information" }
                </a> -->
            
                <div class="meta mt-2">
                    <div><a href><i class="icon far fa-calendar-alt"></i> August 27, 2022</a></div>
                    <div><a href><i class="icon fas fa-user-alt"></i> Admin</a></div>
                    <div><a href><i class="icon far fa-comment-alt"></i> 19</a></div>
                </div>
            </div>
            
        </div>

        <div class="d-flex">

            <a href data-bs-toggle="modal" data-bs-target="#menuModal">
                <img src="/assets/img/menu-cafeteria.jpg" alt="" class="card-img-top">
            </a>

            <div class="content-info">

                <a href data-bs-toggle="modal" data-bs-target="#menuModal">
                    { esp ? cafeteria[6] : cafeteria[7] }
                </a>

                <div class="meta mt-2">
                    <div><a href><i class="icon far fa-calendar-alt"></i> {cafeteria[8]}</a></div>
                    <div><a href><i class="icon fas fa-user-alt"></i> Admin</a></div>
                    <div><a href><i class="icon far fa-comment-alt"></i> 19</a></div>
                </div>
            </div>
        </div>

    </div>
    
</div>