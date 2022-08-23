<script>
    import { Router, Route } from 'svelte-routing';
    import NavBottom from '../components/NavBottom.svelte';
    import Personal from '../components/Personal.svelte';
    import NoFound from './404.svelte';
    import Instituciones from '../components/Instituciones.svelte';
    import Footer from '../components/Footer.svelte';

    export let esp;
    // console.log(Object.values(id))
    // let valor = Object.values(id);
    // let uri = valor[0]
    let pagina = 3;

</script>

<main>
    <Router>
        {#if esp}
            <Route path="/administracion">
                <Personal {esp} eq="administracion" url={"/our-team/administration"} />
            </Route>
            <Route path="/parvularia">
                <Personal {esp} eq="parvularia" url={"/our-team/preschool"} />
            </Route>
            <Route path="/primaria">
                <Personal {esp} eq="primaria" url={"/our-team/primary"} />
            </Route>
            <Route path="/secundaria">
                <Personal {esp} eq="secundaria" url={"/our-team/highschool"} />
            </Route>
            <Route path="/nivelacion">
                <Personal {esp} eq="nivelacion" url={"/our-team/development"} />
            </Route>
            <Route path="/">
                <Personal {esp} eq="parvularia" url={"/our-team/preschool"} />
            </Route>
        {:else}
            <Route path="/administration">
                <Personal {esp} eq="administration" url={"/personal/administracion"} />
            </Route>
            <Route path="/preschool">
                <Personal {esp} eq="preschool" url={"/personal/parvularia"} />
            </Route>
            <Route path="/primary">
                <Personal {esp} eq="primary" url={"/personal/primaria"} />
            </Route>
            <Route path="/highschool">
                <Personal {esp} eq="highschool" url={"/personal/secundaria"} />
            </Route>
            <Route path="/development">
                <Personal {esp} eq="development" url={"/personal/nivelacion"} />
            </Route>
            <Route path="/">
                <Personal {esp} eq="preschool" url={"/personal/parvularia"} />
            </Route>
        {/if}

        <Route path="*">
            <NoFound start="true" />
        </Route>
        <NavBottom {esp} />
    </Router>

    <Instituciones />
</main>
<Footer {esp} {pagina} />