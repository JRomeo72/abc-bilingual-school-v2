<script>
    export let esp, page;
</script>

<div class="buttonfloat">
    <a href="{page}">
        {#if esp}
             <img src="/assets/img/usa.png" class="flag" alt="flag"/>
        {:else}
             <img src="/assets/img/el-salvador.png" class="flag" alt="flag"/>
        {/if}
    </a>
</div>