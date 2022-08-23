<script>
    import { Link } from 'svelte-routing';
    export let esp, link1, link2, link3, link4, link5;
</script>

<div class="col-sm-4 col-lg-2 mb-5 d-flex justify-content-center animalo retardo-2" data-animate-effect="fadeInUp">
    <div class="block-3">

        {#if !esp}
    
            <h3 class="block-title">Menu</h3>

            <ul class="menu">
                <li>
                    {#if link1.search('#') > -1}
                        <a data-easing="easeOutQuint" class="link" href={link1}>Home</a>
                    {:else}
                        <Link to="{link1}">Home</Link>
                    {/if}
                </li>
                <li>
                    {#if link2.search('#') > -1}
                        <a data-easing="easeOutQuint" class="link" href={link2}>About us</a>
                    {:else}
                        <Link to="{link2}">About us</Link>
                    {/if}
                </li>
                <li>
                    {#if link3.search('#') > -1}
                        <a data-easing="easeOutQuint" class="link" href={link3}>Team</a>
                    {:else}
                        <Link to="{link3}">Team</Link>
                    {/if}
                </li>
                <li>
                    {#if link4.search('#') > -1}
                        <a data-easing="easeOutQuint" class="link" href={link4}>School life</a>
                    {:else}
                        <Link to="{link4}">School life</Link>
                    {/if}
                </li>
                <li>
                    {#if link5.search('#') > -1}
                        <a data-easing="easeOutQuint" class="link" href={link5}>Contact us</a>
                    {:else}
                        <Link to="{link5}">Contact us</Link>
                    {/if}
                </li>
            </ul>

        {:else}

            <h3 class="block-title">Menú</h3>

            <ul class="menu">
                <li>
                    {#if link1.search('#') > -1}
                        <a data-easing="easeOutQuint" class="link" href={link1}>Inicio</a>
                    {:else}
                        <Link to="{link1}">Inicio</Link>
                    {/if}
                </li>
                <li>
                    {#if link2.search('#') > -1}
                        <a data-easing="easeOutQuint" class="link" href={link2}>Conocenos</a>
                    {:else}
                        <Link to="{link2}">Conocenos</Link>
                    {/if}
                </li>
                <li>
                    {#if link3.search('#') > -1}
                        <a data-easing="easeOutQuint" class="link" href={link3}>Equipo</a>
                    {:else}
                        <Link to="{link3}">Equipo</Link>
                    {/if}
                </li>
                <li>
                    {#if link4.search('#') > -1}
                        <a data-easing="easeOutQuint" class="link" href={link4}>Vida escolar</a>
                    {:else}
                        <Link to="{link4}">Vida escolar</Link>
                    {/if}
                </li>
                <li>
                    {#if link5.search('#') > -1}
                        <a data-easing="easeOutQuint" class="link" href={link5}>Contáctanos</a>
                    {:else}
                        <Link to="{link5}">Contáctanos</Link>
                    {/if}
                </li>
            </ul>

        {/if}

        <ul class="footer-social list-unstyled float-md-left float-lft mt-3">
            <li class="animalo retardo-3" data-animate-effect="fadeInUp">
                <a href="https://www.facebook.com/abcbilingualschool" target="_blank">
                    <span class="fab fa-facebook-f"></span>
                </a>
            </li>
            <li class="animalo retardo-4" data-animate-effect="fadeInUp">
                <a href="https://www.instagram.com/abc_bilingual_school" target="_blank">
                    <span class="fab fa-instagram"></span>
                </a>
            </li>
        </ul>

    </div>
</div>