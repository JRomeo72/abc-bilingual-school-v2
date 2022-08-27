<script>
    import { onMount } from 'svelte';
    import { equipos } from '../assets/js/data';
    import { conectionOnLine } from '../stores/stores';
    import MessageOffLine from './MessageOffLine.svelte';
    export let esp, eq;
    let equipo;
    let title;

    if(eq == 'administracion' || eq == 'administration') {
        equipo = equipos.admin.eq
        title = equipos.admin.title
    }else if(eq == 'parvularia' || eq == 'preschool') {
        equipo = equipos.parvu.eq
        title = equipos.parvu.title
    }else if(eq == 'primaria' || eq == 'primary') {
        equipo = equipos.prima.eq
        title = equipos.prima.title
    }else if(eq == 'secundaria' || eq == 'highschool') {
        equipo = equipos.secun.eq
        title = equipos.secun.title
    }else if(eq == 'nivelacion' || eq == 'development') {
        equipo = equipos.nivel.eq
        title = equipos.nivel.title
    }

    onMount( () => {
        if(document.querySelector('.link-parvu')) {

            let link = document.querySelector('.link-parvu').parentElement;
    
            const addClass = () => {
                if(link){
                    link.classList.add('active');
                    link.setAttribute('aria-current', 'page');
                }
            }
    
            const removeClass = () => {
                if(link){
                    link.classList.remove('active');
                    link.removeAttribute('aria-current');
                }
            }
    
            if(esp) {
                if(location.pathname == '/personal'){
                    window.history.pushState('', "parvularia", "/personal/parvularia");
                    addClass()
                }else if(location.pathname !== '/personal/parvularia' && link.hasAttribute('aria-current')) {
                    // console.log(link.hasAttribute('aria-current'))
                    removeClass()
                }
            }else{
                if(location.pathname == '/our-team'){
                    window.history.pushState('', "preschool", "/our-team/preschool");
                    addClass()
                }else if(location.pathname !== '/our-team/preschool' && link.hasAttribute('aria-current')) {
                    // console.log(link.hasAttribute('aria-current'))
                    removeClass()
                }
            }
        }
        
    } )

</script>

<div>
    <h4 class="my-4 text-center sub-titulo-seccion">{ esp ? title[0] : title[1] }</h4>

    {#if $conectionOnLine}
        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4">
            {#each equipo as equipo}
                <div class="col mb-4 animalo" data-animate-effect="fadeInUp">
                    <!-- Card -->
                    <div class="card h-100 sombra-c">

                        <!--Card image-->
                        <div class="view overlay">
                            <img class="card-img-top" src={equipo.link} alt="imageCard">
                            <div>
                                <div class="mask rgba-stylish-light"></div>
                            </div>
                        </div>
            
                        <!--Card content-->
                        <div class="card-body">
                        
                            <!--Title-->
                            <div style="height: 55%;">
                                <h5 class="card-title text-center">{equipo.nombre}</h5>
                            </div>

                            <!--Text-->
                            <div style="height: 45%;" class="d-flex justify-content-center align-items-end">
                                <p class="card-text text-center">{ esp ? equipo.cargo : equipo.position }</p>
                                <!-- Provides extra visual weight and identifies the primary action in a set of buttons -->
                            </div>
                    
                        </div>
                
                    </div>
                    <!-- Card -->
                </div>
            {/each}
        </div>
    {:else}
        <MessageOffLine {esp} />
    {/if}
</div>