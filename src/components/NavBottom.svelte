<script>
    import Link from './NavLink.svelte';
    export let esp;
</script>

<nav class="navbar navbar-expand-lg navbar-light bg-light nav-eq">
    <div class="container">

        {#if !esp}
             <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
             <span class="navbar-toggler-icon"></span> Menu
             </button>
             <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                 <div class="navbar-nav">
                 
					<Link to="administration">
						<div class="nav-item nav-link rounded-xl">Administration</div>
					</Link>
						
					<Link to="preschool">
						<div class="nav-item nav-link rounded-xl link-parvu">Preschool</div>
					</Link>

					<Link to="primary">
						<div class="nav-item nav-link rounded-xl">Primary School</div>
					</Link>

					<Link to="highschool">
						<div class="nav-item nav-link rounded-xl">High School</div>
					</Link>

					<Link to="development">
						<div class="nav-item nav-link rounded-xl">Development Center</div>
					</Link>
                 </div>
             </div>
        {:else}
             <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
             <span class="navbar-toggler-icon"></span> Menú
             </button>
             <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                 <div class="navbar-nav">
                 
					<Link to="administracion">
						<div class="nav-item nav-link rounded-xl">Administración</div>
					</Link>

					<Link to="parvularia">
						<div class="nav-item nav-link rounded-xl link-parvu">Parvularia</div>
					</Link>

					<Link to="primaria">
						<div class="nav-item nav-link rounded-xl">Primaria</div>
					</Link>

					<Link to="secundaria">
						<div class="nav-item nav-link rounded-xl">Secundaria</div>
					</Link>

					<Link to="nivelacion">
						<div class="nav-item nav-link rounded-xl">Aula de Nivelación</div>
					</Link>
                 </div>
             </div>
        {/if}

    </div>

</nav>