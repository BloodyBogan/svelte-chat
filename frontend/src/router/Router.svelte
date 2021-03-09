<script context="module" lang="ts">
  import type { Route, Routes } from './types';
  import { activeRouteStore } from './types';

  const routes: Routes = {};

  export const { activeRoute } = activeRouteStore;

  export const register = (route: Route): void => {
    routes[route.path] = route;
  };
</script>

<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  import page from 'page';

  const last = (route: Route): PageJS.Callback => {
    return function (ctx): void {
      $activeRoute = route;
    };
  };

  const setupPage = (): void => {
    for (let [path, route] of Object.entries(routes)) {
      page(path, ...route.middleware, last(route));
    }

    page.start();
  };

  onMount(setupPage);

  onDestroy(page.stop);
</script>

<slot />
