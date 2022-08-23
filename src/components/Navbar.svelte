<script>
    import NavLink from '../components/NavLink.svelte'
    import { menuItems, menuLinks, menuDrop, conectionOnLine } from '../stores/stores'
</script>

<div class="container">

	<a class="navbar-brand" href>
		<img class="abc-logo" src="/assets/img/logos/abc-logo.jpg" alt="ABC Bilingual School El Salvador">
		<span class="texto-brand">ABC Bilingual School</span>
	</a>

	<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
		<span class="navbar-toggler-icon"></span>  {$menuDrop[0]}
	</button>

	<div class="collapse navbar-collapse" id="navbarNavDropdown">
		<ul class="navbar-nav">

			<li class="nav-item">
				<NavLink  to="{$menuLinks[0]}">
					<div class="nav-link rounded-xl">
						{$menuItems[0]} <!-- *! Inicio --> 
					</div>
				</NavLink>
			</li>

			<li class="nav-item dropdown">
				<div class="nav-link dropdown-toggle rounded-xl link-conocenos" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
					{$menuDrop[1]} <!-- *! Conócenos --> 
				</div>
				<ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
					<li>
						<NavLink to="{$menuLinks[1]}">
							<div class="dropdown-item">
								{$menuItems[1]} <!-- *! Institución --> 
							</div>
						</NavLink>
					</li>
					<li>
						<NavLink to="{$menuLinks[2]}">
							<div class="dropdown-item">
								{$menuItems[2]} <!-- *! Personal --> 
							</div>
						</NavLink>
					</li>
					<li>
						<NavLink to="{$menuLinks[3]}">
							<div class="dropdown-item">
								{$menuItems[3]} <!-- *! Vida escolar --> 
							</div>
						</NavLink>
					</li>
					<hr>
					<li>
						<div data-bs-toggle="modal" data-bs-target="#menuModal">
							<div class="dropdown-item">
								{$menuItems[4]} <!-- *! Menú cafetería --> 
							</div>
						</div>
					</li>
				</ul>
			</li>

			<li class="nav-item dropdown">
				<div class="nav-link dropdown-toggle rounded-xl link-informacion" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
					{$menuDrop[2]} <!-- *! Informacion --> 
				</div>
				<ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
					<li>
						<NavLink to="{$menuLinks[5]}">
							<div class="dropdown-item">
								{$menuItems[5]} <!-- *! Circulares --> 
							</div>
						</NavLink>
					</li>
					<li>
						<NavLink to="{$menuLinks[6]}">
							<div class="dropdown-item">
								{$menuItems[6]} <!-- *! Fechas Importantes --> 
							</div>
						</NavLink>
					</li>
					{#if $conectionOnLine}
						 <!-- content here -->
						 <hr>
						 <li>
							 <a target="_blank" rel="noopener" href="{$menuLinks[7]}">
								 <div class="dropdown-item">
									 {$menuItems[7]} <!-- *! Manual ABC --> 
								 </div>
							 </a>
						 </li>
						 <li>
							 <a target="_blank" rel="noopener" href="{$menuLinks[8]}">
								 <div class="dropdown-item">
									 {$menuItems[8]} <!-- *! Manual Teams --> 
								 </div>
							 </a>
						 </li>
						 <li>
							 <a target="_blank" rel="noopener" href="{$menuLinks[9]}">
								 <div class="dropdown-item">
									 {$menuItems[9]} <!-- *! Jornalizacion 1 --> 
								 </div>
							 </a>
						 </li>
						 <li>
							 <a target="_blank" rel="noopener" href="{$menuLinks[10]}">
								 <div class="dropdown-item">
									 {$menuItems[10]} <!-- *! Jornalizacion 2 --> 
								 </div>
							 </a>
						 </li>
					{/if}
				</ul>
			</li>

			<li class="nav-item">
				<NavLink  to="{$menuLinks[11]}">
					<div class="nav-link rounded-xl">
						{$menuItems[11]} <!-- *! Contáctanos --> 
					</div>
				</NavLink>
			</li>

		</ul>
	</div>
</div>
