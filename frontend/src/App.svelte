<script lang="ts">
  import { Router, Route, redirect } from './router';

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

<header>
  <nav>
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/chat">Chat</a></li>
      <li><a href="/login">Log In</a></li>
      <li><a href="/signup">Sign Up</a></li>
    </ul>
  </nav>
</header>
<main>
  <Router>
    <Route path="/" component={Home} />
    <Route path="/signup" component={SignUp} />
    <Route path="/login" component={LogIn} />
    <Route path="/chat" component={Chat} middleware={[guard]} />
    <Route component={NotFound} />
  </Router>
</main>
