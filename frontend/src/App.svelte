<script lang="ts">
  import { onMount } from 'svelte';

  import axios from '@axios';

  import { Router, Route, redirect } from './router';

  import { activeRouteStore } from './router/types';
  const { activeRoute } = activeRouteStore;

  import { userStore } from './stores/user';
  const { isAuthenticated, user } = userStore;

  import Header from './components/Header.svelte';
  import Toasts from './components/Toasts.svelte';
  import Loader from './components/Loader.svelte';

  import Home from './pages/Home.svelte';
  import SignUp from './pages/SignUp.svelte';
  import LogIn from './pages/LogIn.svelte';
  import Chat from './pages/Chat.svelte';
  import NotFound from './pages/NotFound.svelte';

  let loading = true;

  const ensureAuthenticated: PageJS.Callback = (ctx, next) => {
    if ($isAuthenticated) {
      next();
    } else {
      redirect('/login');
    }
  };

  const ensureGuest: PageJS.Callback = (ctx, next) => {
    if (!$isAuthenticated) {
      next();
    } else {
      redirect('/chat');
    }
  };

  onMount(async () => {
    try {
      const response = await axios.get('/user');

      if (response.data.success) {
        $isAuthenticated = true;
        $user = response.data.user;
      }
    } catch (err) {
      $isAuthenticated = false;
      $user = {};
    }

    loading = false;
  });
</script>

<Header {loading} {redirect} />
<main role="main" class:vertical={$activeRoute.path === '/'}>
  {#if loading}
    <Loader />
  {:else}
    <Router>
      <Route path="/" component={Home} middleware={[ensureGuest]} />
      <Route path="/signup" component={SignUp} middleware={[ensureGuest]} {redirect} />
      <Route path="/login" component={LogIn} middleware={[ensureGuest]} {redirect} />
      <Route
        path="/chat"
        component={Chat}
        middleware={[ensureAuthenticated]}
        {redirect}
      />
      <Route component={NotFound} />
    </Router>
  {/if}
</main>
<Toasts />

<style lang="scss">
  @import './styles/variables';

  main {
    position: relative;
    display: inline-flex;
    flex-direction: row;
    align-items: center;
    max-width: $max-width;
    width: 100%;
    min-height: 64rem;
    margin: 3.2rem auto 6.4rem auto;
    padding: 2.5em;
    background-color: $clr-light-100;
    border-radius: $border-radius-medium;
    box-shadow: $box-shadow-main;

    &.vertical {
      flex-direction: column;
      align-items: unset;
    }
  }
</style>
