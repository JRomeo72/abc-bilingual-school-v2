<script>
    import NavLink from '../components/NavLink.svelte'
    import { menuItems, menuLinks, menuDrop } from '../stores/stores'
</script>


<div class="container">

    <a class="navbar-brand" href='"'>
        <img class="abc-logo" src="/assets/img/logos/abc-logo.jpg" alt="ABC Bilingual School El Salvador">
        <span class="texto-brand">ABC Bilingual School</span>
    </a>
    
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span> {$menuDrop[0]}
    </button>
        
    <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ml-auto">
            <li class="nav-item">
                <NavLink to="{$menuLinks[0]}">
                    <div class="nav-link rounded-xl link-inicio">
                        {$menuItems[0]} <!-- *! Inicio -->
                    </div>
                </NavLink>
            </li>
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle rounded-xl link-conocenos" href='"' id="navbarDropdownMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    {$menuDrop[1]} <!-- *! Conócenos -->
                </a>
                <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                    <NavLink to="{$menuLinks[1]}">
                        <div class="dropdown-item link-institucion">
                            {$menuItems[1]}
                        </div>
                    </NavLink>
                    <NavLink to="{$menuLinks[2]}">
                        <div class="dropdown-item link-personal v-onLine">
                            {$menuItems[2]}
                        </div>
                    </NavLink>
                    <NavLink to="{$menuLinks[3]}">
                        <div class="dropdown-item link-escolar v-onLine">
                            {$menuItems[3]}
                        </div>
                    </NavLink>
                    <hr>
                    <a href='"' data-toggle="modal" data-target="#menuModal">
                        <div class="dropdown-item link-menu">
                            {$menuItems[4]}
                        </div>
                    </a>
                </div>
            </li>
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle rounded-xl link-informacion" href='"' id="navbarDropdownMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                {$menuDrop[2]} <!-- *! Informacion -->
                </a>
                <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                    <NavLink to="{$menuLinks[5]}">
                        <div class="dropdown-item link-circulares">
                            {$menuItems[5]}
                        </div>
                    </NavLink>
                    <NavLink to="{$menuLinks[6]}">
                        <div class="dropdown-item link-fechas">
                            {$menuItems[6]}
                        </div>
                    </NavLink>
                    <hr>
                    <a target="_blank" href="{$menuLinks[7]}">
                        <div class="dropdown-item">
                            {$menuItems[7]}
                        </div>
                    </a>
                    <a target="_blank" href="{$menuLinks[8]}">
                        <div class="dropdown-item">
                            {$menuItems[8]}
                        </div>
                    </a>
                    <a target="_blank" href="{$menuLinks[9]}">
                        <div class="dropdown-item">
                            {$menuItems[9]}
                        </div>
                    </a>
                </div>
            </li>
            <li class="nav-item">
                <NavLink to="{$menuLinks[10]}">
                    <div id="link-contact" class="nav-link rounded-xl link-contact">
                        {$menuItems[10]} <!-- *! Contáctanos -->
                    </div>
                </NavLink>
            </li>
        </ul>
    </div>

</div>


<!-- <nav class="navbar">
    <div class="navbar__brand"></div>
    <div class="navbar__nav">
        <ul class="nav__items">
            <li class="nav__item"><NavLink to="{$menuLinks[0]}">{$menuItems[0]}</NavLink></li>
            <li class="nav__item"><NavLink to="{$menuLinks[1]}">{$menuItems[1]}</NavLink></li>
            <li class="nav__item"><NavLink to="{$menuLinks[2]}">{$menuItems[2]}</NavLink></li>
            <li class="nav__item"><NavLink to="{$menuLinks[3]}">{$menuItems[3]}</NavLink></li>
        </ul>
    </div>
</nav> -->
