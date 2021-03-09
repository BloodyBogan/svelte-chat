<script lang="ts">
  import { Router, Route, redirect } from './router';

  import Header from './components/Header.svelte';

  import Home from './pages/Home.svelte';
  import SignUp from './pages/SignUp.svelte';
  import LogIn from './pages/LogIn.svelte';
  import Chat from './pages/Chat.svelte';
  import NotFound from './pages/NotFound.svelte';

  let isAuth = true;

  const guard: PageJS.Callback = (ctx, next) => {
    if (isAuth) {
      redirect('/login');
    } else {
      next();
    }
  };
</script>

<Header />
<main role="main">
  <Router>
    <Route path="/" component={Home} />
    <Route path="/signup" component={SignUp} />
    <Route path="/login" component={LogIn} />
    <Route path="/chat" component={Chat} middleware={[guard]} />
    <Route component={NotFound} />
  </Router>
</main>

<style lang="scss">
  @import './styles/variables';

  main {
    display: inline-flex;
    flex-direction: column;
    max-width: $max-width;
    width: 100%;
    min-height: 64rem;
    margin: 3.2rem auto 6.4rem auto;
    padding: 2.5em;
    background-color: $clr-light-100;
    border-radius: $border-radius-medium;
    box-shadow: $box-shadow-main;
  }
</style>
