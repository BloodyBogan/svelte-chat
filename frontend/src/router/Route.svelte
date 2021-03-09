<script lang="ts">
  import { SvelteComponent } from 'svelte';

  import { register, activeRoute } from './Router.svelte';

  import type { Route } from './types';

  export let path = '*';
  export let component: typeof SvelteComponent | null = null;
  export let middleware: PageJS.Callback[] = [];

  const route: Route = { path, component, middleware };

  register(route);
</script>

{#if $activeRoute.path === path}
  <svelte:component this={$activeRoute.component} {...$$restProps} />
{/if}
