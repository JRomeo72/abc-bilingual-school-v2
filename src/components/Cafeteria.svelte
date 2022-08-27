<script>
    import { cafeteria } from '../assets/js/data';
</script>

<div class="modal fade" id="menuModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-notify modal-xl modal-dialog-scrollable modal-azul modal-dialog-centered" role="document">
        <!--Content-->
        <div class="modal-content">
            <!--Header-->
            <div class="modal-header">
                <h4 class="modal-title color-naranja">ABC Bilingual School.</h4>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                    <!-- <span aria-hidden="true" class="white-text">&times;</span> -->
                </button>
            </div>
    
            <!--Body-->
            <div class="modal-body">
                <div class="row row-cols-1 d-flex justify-content-center">
                    <div class="col text-center menu-item">
                        <img src="/assets/img/menu-logo.jpg" class="img-menu-logo" alt="">
                    </div>
                    <div class="col text-center menu-item">
                        <h1 class="menu-titulo">Menú Almuerzo</h1>
                        <p class="menu-titulo__fecha">{cafeteria[0]}</p>
                    </div>

                </div>
                <div class="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-5 d-flex justify-content-center">
                    <div class="col text-center menu-item d-flex justify-content-center">
                        <div class="menu-item__contenedor">
                            <div class="menu-item__dia">
                                <p>Lunes</p>
                            </div>
                            <div class="menu-item__plato">
                                <p>{cafeteria[1]}</p>
                            </div>
                        </div>
                    </div>
                    <div class="col text-center menu-item d-flex justify-content-center">
                        <div class="menu-item__contenedor">
                            <div class="menu-item__dia">
                                <p>Martes</p>
                            </div>
                            <div class="menu-item__plato">
                                <p>{cafeteria[2]}</p>
                            </div>
                        </div>
                    </div>
                    <div class="col text-center menu-item d-flex justify-content-center">
                        <div class="menu-item__contenedor">
                            <div class="menu-item__dia">
                                <p>Miércoles</p>
                            </div>
                            <div class="menu-item__plato">
                                <p>{cafeteria[3]}</p>
                            </div>
                        </div>
                    </div>
                    <div class="col text-center menu-item d-flex justify-content-center">
                        <div class="menu-item__contenedor">
                            <div class="menu-item__dia">
                                <p>Jueves</p>
                            </div>
                            <div class="menu-item__plato">
                                <p>{cafeteria[4]}</p>
                            </div>
                        </div>
                    </div>
                    <div class="col text-center menu-item d-flex justify-content-center">
                        <div class="menu-item__contenedor">
                            <div class="menu-item__dia">
                                <p>Viernes</p>
                            </div>
                            <div class="menu-item__plato">
                                <p>{cafeteria[5]}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="precios d-flex justify-content-center">
                    <div class="row row-cols-1 row-cols-sm-2">
                        <div class="col d-flex justify-content-center">
                            <div class="precio text-center">
                                Parvularia a 3er grado: <span class="color-naranja">$3.00</span>
                            </div>
                        </div>
                        <div class="col d-flex justify-content-center">
                            <div class="precio text-center">
                                4to a 12vo grado: <span class="color-naranja">$3.25</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="text-center">
                    <h4>Todos los platos llevan dos acompañamientos, arroz y ensalada. Refresco natural.</h4>
                    <h4>Teléfono 2264-0508 Ext. 4.</h4>
                </div>
            </div>

    
            <!--Footer-->
            <div class="modal-footer justify-content-center">
                <button type="button" class="btn btn-outline-primary waves-effect" data-bs-dismiss="modal">Cerrar</button>
            </div>
        </div>
        <!--/.Content-->
    </div>
</div>