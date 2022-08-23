<script>
    import { Link } from 'svelte-routing';
    export let esp, hidden;
</script>

<section id="conocenos" class="container about-us-section">

    <div class="row pt-5">

        <div class="col-md-5 order-last p-4 bg-claro animalo" data-animate-effect="fadeInUp">
            <h2 class="mb-4">{!esp ? 'What we offer' : 'Qué ofrecemos'}</h2>
            <p>{ !esp ? 
                    'We are an institution committed to training individuals with a high sense of personal and social responsibility, comprehensive citizens with academic excellence, who have the tools to lead in a global world.' :
                    'Somos una institución comprometida con la formación de individuos con alto sentido de responsabilidad personal y social, ciudadanos integrales con excelencia académica, que poseen las herramientas para liderar en un mundo global.'
                }
            </p>
            <p>{ !esp ? 
                    'We pride ourselves on our work as educators and on our personalized education.' :
                    'Nos enorgullecemos de nuestro trabajo como educadores y de nuestra educación personalizada.'
                }
            </p>
            <p>{ !esp ? 
                    'Our teachers are trained to educate our students through values and principles, to form successful citizens.' :
                    'Nuestros maestros están capacitados para educar a nuestros estudiantes a través de valores y principios, para formar ciudadanos exitosos.'
                }
            </p>

            {#if !hidden}

                <h4 class="mt-4 ml-4">{ !esp ? 'Our program includes:' : 'Nuestro programa incluye:'}</h4>
                <ul calss="programa">
                    <li>
                        <span><i class="fas fa-arrow-right sombra"></i></span>
                        <span>{ !esp ? 'Bilingual English - Spanish education from maternal.' : 'Educación bilingüe inglés – español desde maternal.'}</span>
                    </li>
                    <li>
                        <span><i class="fas fa-arrow-right sombra"></i></span>
                        <span>{ !esp ? 'French lessons.' : 'Clases de francés.'}</span>
                    </li>
                    <li>
                        <span><i class="fas fa-arrow-right sombra"></i></span>
                        <span>{ !esp ? 'Computing.' : 'Computación.'}</span>
                    </li>
                    <li>
                        <span><i class="fas fa-arrow-right sombra"></i></span>
                        <span>{ !esp ? 'Robotics program.' : 'Programa de robótica.'}</span>
                    </li>
                    <li>
                        <span><i class="fas fa-arrow-right sombra"></i></span>
                        <span>{ !esp ? 'Sports program.' : 'Programa deportivo.'}</span>
                    </li>
                    <li>
                        <span><i class="fas fa-arrow-right sombra"></i></span>
                        <span>{ !esp ? 'Music program.' : 'Programa de música.'}</span>
                    </li>
                    <li>
                        <span><i class="fas fa-arrow-right sombra"></i></span>
                        <span>{ !esp ? 'Art program.' : 'Programa de arte.'}</span>
                    </li>
                    <li>
                        <span><i class="fas fa-arrow-right sombra"></i></span>
                        <span>{ !esp ? 'Motivational talk program.' : 'Programa de charlas motivacionales.'}</span>
                    </li>
                    <li>
                        <span><i class="fas fa-arrow-right sombra"></i></span>
                        <span>{ !esp ? 'Anti-bullying program.' : 'Programa en contra del bullying (acoso escolar).'}</span>
                    </li>
                    <li>
                        <span><i class="fas fa-arrow-right sombra"></i></span>
                        <span>{ !esp ? 'Use of technology in the classroom starting in preschool.' : 'Uso de tecnología en el aula comenzando en parvularia.'}</span>
                    </li>
                    <li>
                        <span><i class="fas fa-arrow-right sombra"></i></span>
                        <span>{ !esp ? 'Student government.' : 'Gobierno estudiantil.'}</span>
                    </li>
                </ul>

                <h4 class="mt-4 ml-4">{ !esp ? 'Extracurricular:' : 'Extra Curriculares:'}</h4>
                <ul calss="programa">
                    <li>
                        <span><i class="fas fa-arrow-right sombra"></i></span>
                        <span>{ !esp ? 'Cooking club.' : 'Club de cocina.'}</span>
                    </li>
                    <li>
                        <span><i class="fas fa-arrow-right sombra"></i></span>
                        <span>{ !esp ? 'Chess Club.' : 'Club de ajedrez.'}</span>
                    </li>
                    <li>
                        <span><i class="fas fa-arrow-right sombra"></i></span>
                        <span>{ !esp ? 'Homework club.' : 'Club de tareas.'}</span>
                    </li>
                    <li>
                        <span><i class="fas fa-arrow-right sombra"></i></span>
                        <span>{ !esp ? 'Day care.' : 'Day care.'}</span>
                    </li>
                </ul>

            {/if}

            {#if hidden}
                {#if !esp}
                    <div class="d-flex justify-content-center"><Link to="/institution"><button class="btn rounded-pill bg-naranja text-white sombra px-4 py-2">Read more</button></Link></div>
                {:else}
                    <div class="d-flex justify-content-center"><Link to="/institucion"><button class="btn rounded-pill bg-naranja text-white sombra px-4 py-2">Leer más</button></Link></div>
                {/if}
            {/if}

        </div>

        <div class="col-md-7 p-4 animalo" data-animate-effect="fadeInUp">
            <h2 class="mb-4">{ !esp ? 'Welcome to ABC Bilingual School' : 'Bienvenidos a ABC Bilingual School'}</h2>
            <p>{ !esp ? 
                    'Our institution began operations in 1986, as a team dedicated to providing bilingual education services at the kindergarten level.' :
                    'Nuestra institución inició operaciones en el año 1986, como una empresa dedicada a prestar servicios de educación bilingüe a nivel parvulario.'
                }
                </p>
            <p>{ !esp ? 
                    'It started with 8 students, having had strong growth due to the quality of the service provided. This growth gave us the opportunity to establish the organization, legally as of july 1993, as ABC KID`S SCHOOL, S.A. DE C.V.' :
                    'Comenzó con 8 alumnos, habiendo tenido un fuerte crecimiento debido a la calidad del servicio prestado. Este crecimiento hizo que se convirtiera en una pequeña empresa instituyéndose y legalizándose en julio de 1993, como ABC KID`S SCHOOL, S.A. DE C.V.'
                }
                </p>
            <p>{ !esp ? 
                    'The operating permit was granted by the Ministry of Education of El Salvador (MINED) under agreement No. 15-0536.' :
                    'El permiso de funcionamiento fue otorgado por Ministerio de Educación de El Salvador (MINED) bajo el acuerdo No. 15-0536.'
                }
                </p>

            <div class="row no-gutters mt-5">

                <div class="col-lg-12 mb-4">
                    <div class="section-about-us d-flex">
                    <div class="box-icon-about-us">
                        <div class="icono bg-azul me-2 sombra">
                        <span class="fas fa-graduation-cap"></span>
                        </div>
                    </div>
                    <div>
                        <h5>{ !esp ? 'Mission' : 'Misión'}</h5>
                        <p class="text-section-about-us">
                            { !esp ?
                                'Forge individuals with a high degree of personal and social responsibility, comprehensive citizens with excellent academic quality, endowed with the knowledge and skills to be leaders in their environment.' :
                                'Forjar individuos con un alto grado de responsabilidad personal y social, ciudadanos integrales con excelente calidad académica, dotados con los conocimientos y aptitudes para ser líderes en su medio.'
                            }
                        </p>
                    </div>
                    </div>
                </div>

                <div class="col-lg-12 mb-4">
                    <div class="section-about-us d-flex">
                    <div class="box-icon-about-us">
                        <div class="icono bg-azul me-2 sombra">
                        <span class="fas fa-handshake"></span>
                        </div>
                    </div>
                    <div>
                        <h5>{ !esp ? 'Vision' : 'Visión'}</h5>
                        <p class="text-section-about-us">
                            { !esp ?
                                "To be the bilingual institution that trains committed leaders with a high sense of the practice of values, to succeed in today's professional world." :
                                "Ser la institución bilingüe formadora de líderes comprometidos y con un alto sentido de la práctica de los valores, para triunfar en el mundo profesional actual."
                            }
                        </p>
                    </div>
                    </div>
                </div>

                {#if !hidden}

                    <div class="col-lg-12 mb-4">
                        <div class="section-about-us d-flex">
                            <div class="box-icon-about-us">
                                <div class="icono bg-azul me-2 sombra">
                                    <span class="far fa-award"></span>
                                </div>
                            </div>
                            <div>
                                <h5>{ !esp ? 'General objective' : 'Objetivo General'}</h5>
                                <p class="text-section-about-us">
                                    { !esp ?
                                        'Provide a bilingual and personalized comprehensive education that highlights moral values to forge successful future citizens.' :
                                        'Proporcionar una educación integral bilingüe y personalizada en la que se resalten los valores morales para forjar futuros ciudadanos exitosos.'
                                    }
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-12 mb-4">
                        <div id="valores" class="bg-azul sombra">
                            <h5 class="mt-3">{ !esp ? 'Values' : 'Valores' }</h5>
                            <div class="elements">
                                <ul>
                                    <li>Respeto,</li>
                                    <li>Lealtad,</li>
                                    <li>Hermandad,</li>
                                    <li>Humanismo,</li>
                                    <li>Responsabilidad,</li>
                                    <li>Servicio</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <h4 class="ml-5">{ !esp ? 'Our educational plan includes:' : 'Nuestro plan educativo incluye:'}</h4>

                    <div class="row no-gutters mt-4">

                        <div class="col-lg-12 mb-4">
                            <div class="section-about-us d-flex">
                            <div class="box-icon-about-us">
                                <div class="icono bg-azul me-2 sombra">
                                <span class="fas fa-bullhorn"></span>
                                </div>
                            </div>
                            <div>
                                <p class="text-section-about-us">
                                    { !esp ?
                                        'Academic leadership with a modern and high-level curriculum in the wide variety of activities we offer.' :
                                        'Liderazgo académico con un curriculum moderno y de alto nivel en la amplia variedad de actividades que ofrecemos.'
                                    }
                                </p>
                            </div>
                            </div>
                        </div>

                        <div class="col-lg-12 mb-4">
                            <div class="section-about-us d-flex">
                            <div class="box-icon-about-us">
                                <div class="icono bg-azul me-2 sombra">
                                <span class="fas fa-hand-holding-seedling"></span>
                                </div>
                            </div>
                            <div>
                                <p class="text-section-about-us">
                                    { !esp ?
                                        'Education in values and morals, in a healthy environment, surrounded by love and with a positive approach.' :
                                        'Educación en valores y moral, en un ambiente sano, rodeado de cariño y con un enfoque positivo.'
                                    }
                                </p>
                            </div>
                            </div>
                        </div>

                    </div>

                {/if}


            </div>

        </div>

    </div>

</section>