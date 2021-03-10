<script lang="ts">
  import { onMount } from 'svelte';

  import axios from '@axios';

  import { notificationsStore } from '../stores/notifications';

  import { userStore } from '../stores/user';
  const { isAuthenticated, user } = userStore;

  import type { AuthFields } from './types';

  export let redirect: (path: string) => void;

  let usernameInputField: HTMLInputElement;
  let passwordInputField: HTMLInputElement;

  let usernameValue = '';
  let passwordValue = '';

  const errors = {
    username: '',
    password: ''
  };

  let fields: AuthFields = {
    username: null,
    password: null
  };

  const handleFormSubmit = async (): Promise<void> => {
    const body = {
      username: username.value,
      password: password.value
    };

    try {
      const response = await axios.post('/auth/login', body);

      if (response.data.success) {
        $isAuthenticated = true;
        $user = response.data.user;

        redirect('/chat');

        notificationsStore.addNotification('Hooray!', response.data.message);
      } else {
        notificationsStore.addNotification('Oops!', 'Looks like something went wrong');
      }

      usernameValue = '';
      passwordValue = '';
    } catch (err) {
      const response = err.response;
      if ('errors' in response.data) {
        const { errors: errs } = response.data;

        errs.forEach((error, index): void => {
          const key = Object.keys(error)[0];

          errors[key] = error[key];

          if (index === 0) fields[key].focus();
        });
      } else if (response.status === 422) {
        errors.username = response.data.message;
        errors.password = response.data.message;
      } else {
        notificationsStore.addNotification('Oops!', response.data.message);
      }
    }
  };

  $: username = {
    value: usernameValue.trim(),
    validate() {
      if (this.value === '') {
        errors.username = 'Username must not be empty';
        return false;
      }

      return true;
    }
  };

  $: password = {
    value: passwordValue.trim(),
    validate() {
      if (this.value === '') {
        errors.password = 'Password must not be empty';
        return false;
      }

      return true;
    }
  };

  $: disabled =
    !username.value || !username.validate() || !password.value || !password.validate();

  onMount((): void => {
    fields = {
      username: usernameInputField,
      password: passwordInputField
    };
  });
</script>

<section class="features">
  <ul>
    <li class="features__feature">
      <h3>Quick and free sign-up</h3>
      <p>Get chatting effortlessly and in an instant</p>
    </li>
    <li class="features__feature">
      <h3>Chat with ease</h3>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Condimentum ridiculus.
      </p>
    </li>
    <li class="features__feature">
      <h3>Add all your friends</h3>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing.</p>
    </li>
  </ul>
</section>
<section class="form-section">
  <h2>Welcome back</h2>
  <form class="form" on:submit|preventDefault={handleFormSubmit}>
    <div class="form__group">
      <label for="username">Username</label>
      <input
        type="text"
        bind:this={usernameInputField}
        bind:value={usernameValue}
        on:input={() => (errors.username = '')}
        on:blur={username.validate}
        placeholder="Enter your username"
        required
      />
      {#if errors.username}
        <div class="error">{errors.username}</div>
      {/if}
    </div>
    <div class="form__group">
      <label for="password">Password</label>
      <input
        type="password"
        bind:this={passwordInputField}
        bind:value={passwordValue}
        on:input={() => (errors.password = '')}
        on:blur={password.validate}
        placeholder="Enter your password"
      />
      {#if errors.password}
        <div class="error">
          {errors.password}
        </div>
      {/if}
    </div>
    <input type="submit" {disabled} class="btn" value="Click to log in" />
  </form>
</section>
