<script lang="ts">
  import { onMount } from 'svelte';

  import axios from '@axios';

  import { notificationsStore } from '../stores/notifications';

  import type { SignUpFields } from './types';

  export let redirect: (path: string) => void;

  let usernameInputField: HTMLInputElement;
  let passwordInputField: HTMLInputElement;
  let confirmPasswordInputField: HTMLInputElement;

  let usernameValue = '';
  let passwordValue = '';
  let confirmPasswordValue = '';

  const errors = {
    username: '',
    password: '',
    confirmPassword: ''
  };

  let fields: SignUpFields = {
    username: null,
    password: null,
    confirmPassword: null
  };

  const handleFormSubmit = async (): Promise<void> => {
    const body = {
      username: username.value,
      password: password.value,
      confirmPassword: confirmPassword.value
    };

    try {
      const response = await axios.post('/auth/signup', body);

      if (response.data.success) {
        redirect('/login');

        notificationsStore.addNotification('Hooray!', response.data.message);
      } else {
        notificationsStore.addNotification('Oops!', 'Looks like something went wrong');
      }

      usernameValue = '';
      passwordValue = '';
      confirmPasswordValue = '';
    } catch (err) {
      const response = err.response;
      if ('errors' in response.data) {
        const { errors: errs } = response.data;

        errs.forEach((error, index): void => {
          const key = Object.keys(error)[0];

          errors[key] = error[key];

          if (index === 0) fields[key].focus();
        });
      } else if (response.status === 409) {
        notificationsStore.addNotification('So sad!', response.data.message);

        usernameInputField.focus();
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
      } else if (this.value.length < 3) {
        errors.username = 'Username must be at least 3 characters long';
        return false;
      } else {
        return true;
      }
    }
  };

  $: password = {
    value: passwordValue.trim(),
    validate() {
      if (this.value && this.value.length < 8) {
        errors.password = 'Password must be at least 8 characters long';
        return false;
      } else if (this.value.search(/[0-9]/) === -1) {
        errors.password = 'Password must contain at least one number';
        return false;
      } else {
        return true;
      }
    }
  };

  $: confirmPassword = {
    value: confirmPasswordValue.trim(),
    validate() {
      if (this.value && this.value !== password.value) {
        errors.confirmPassword = 'Passwords do not match';
        return false;
      }

      return true;
    }
  };

  $: disabled =
    !username.value ||
    !username.validate() ||
    !password.value ||
    !password.validate() ||
    !confirmPassword.value ||
    !confirmPassword.validate();

  onMount((): void => {
    fields = {
      username: usernameInputField,
      password: passwordInputField,
      confirmPassword: confirmPasswordInputField
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
  <h2>Create your account</h2>
  <form class="form" on:submit|preventDefault={handleFormSubmit}>
    <div class="form__group">
      <label for="username">Username*</label>
      <input
        type="text"
        bind:this={usernameInputField}
        bind:value={usernameValue}
        on:input={() => (errors.username = '')}
        on:blur={username.validate}
        placeholder="Enter your username"
        required
        minlength="3"
      />
      {#if errors.username}
        <div class="error">{errors.username}</div>
      {/if}
    </div>
    <div class="form__group">
      <label for="password">Password*</label>
      <input
        type="password"
        bind:this={passwordInputField}
        bind:value={passwordValue}
        on:input={() => {
          errors.password = '';
          errors.confirmPassword = '';
        }}
        on:blur={password.validate}
        placeholder="Enter your password"
        required
        minlength="8"
      />
      {#if errors.password}
        <div class="error">
          {errors.password}
        </div>
      {/if}
    </div>
    <div class="form__group">
      <label for="confirmPassword">Confirm password*</label>
      <input
        type="password"
        bind:this={confirmPasswordInputField}
        bind:value={confirmPasswordValue}
        on:input={() => {
          errors.password = '';
          errors.confirmPassword = '';
        }}
        on:blur={confirmPassword.validate}
        placeholder="Confirm your password"
        required
      />
      {#if errors.confirmPassword}
        <div class="error">
          {errors.confirmPassword}
        </div>
      {/if}
    </div>
    <input type="submit" {disabled} class="btn" value="Click to create an account" />
  </form>
</section>
