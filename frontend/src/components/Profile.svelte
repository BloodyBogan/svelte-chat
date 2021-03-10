<script lang="ts">
  import { onMount } from 'svelte';

  import axios from '@axios';

  import { userStore } from '../stores/user';
  const { isAuthenticated, user } = userStore;

  import { notificationsStore } from '../stores/notifications';

  import type { ProfileFields } from './types';

  export let redirect: (path: string) => void;

  let bioTextArea: HTMLTextAreaElement;

  let bioValue = '';

  const errors = {
    bio: ''
  };

  const fields: ProfileFields = {
    bio: null
  };

  const handleBioEdit = async (): Promise<void> => {
    try {
      const response = await axios.patch('/user/bio', { bio: bioValue });

      if (response.data.success) {
        $user.bio = bioValue;

        notificationsStore.addNotification('Hooray!', response.data.message);
      } else {
        notificationsStore.addNotification('Oops!', 'Something went wrong');
      }

      bioValue = '';
    } catch (err) {
      const response = err.response;

      if (response.status === 401) {
        $isAuthenticated = false;
        $user = {};

        redirect('/login');

        notificationsStore.addNotification('Oops!', 'Your session has expired');
      } else if ('errors' in response.data) {
        const { errors: errs } = response.data;

        errs.forEach((error, index): void => {
          const key = Object.keys(error)[0];

          errors[key] = error[key];

          if (index === 0) fields[key].focus();
        });
      } else {
        notificationsStore.addNotification('Oops!', response.data.message);
      }
    }
  };

  $: bio = {
    value: bioValue.trim(),
    validate() {
      if (this.value === '') {
        errors.bio = 'Bio must not be empty';
        return false;
      } else if (this.value.length > 70) {
        errors.bio = 'Bio must not be more than 70 characters long';
        return false;
      }

      return true;
    }
  };

  $: bioButtonDisabled = !bio.value || !bio.validate();

  onMount(() => {
    fields.bio = bioTextArea;
  });
</script>

<section class="profile">
  <header class="profile__header">
    <img src={$user.profilePhoto} alt="Your profile photo" />
    <strong>{$user.username}</strong>
    <p>{$user.bio || 'No bio yet...'}</p>
  </header>
  <form class="form" on:submit|preventDefault={handleBioEdit}>
    <div class="form__group">
      <label for="bio">Edit your bio*</label>
      <textarea
        id="bio"
        bind:value={bioValue}
        bind:this={bioTextArea}
        on:input={() => (errors.bio = '')}
        on:blur={bio.validate}
        placeholder="Enter your bio (Max. 70 characters)"
        required
        minlength="1"
        maxlength="70"
      />
      {#if errors.bio}
        <div class="error">{errors.bio}</div>
      {/if}
    </div>
    <input type="submit" disabled={bioButtonDisabled} class="btn" value="Edit" />
  </form>
  <form class="form">
    <div class="form__group">
      <label for="profile-photo">Change your profile photo</label>
      <input type="file" id="profile-photo" accept="image/*" />
    </div>
    <input type="submit" class="btn" value="Upload" />
  </form>
</section>

<style lang="scss">
  @import '../styles/variables';

  .profile {
    flex-grow: 1;
    align-self: stretch;

    &__header {
      padding: 1.25em;
      text-align: center;
      border: 0.1rem solid $clr-light-200;
      border-radius: $border-radius-small;

      img {
        $size: 6.6rem;

        width: $size;
        height: $size;
        margin: 0 auto;
        border-radius: 50%;
      }

      strong {
        display: block;
        margin-top: 1rem;
        font-size: 2rem;
        font-weight: 600;
        color: $clr-dark-900;
      }

      p {
        margin-top: 1.5rem;
        color: lighten($clr-light-900, 10%);
        overflow-wrap: break-word;
        word-wrap: break-word;
        word-break: break-all;
      }
    }

    .form {
      margin-top: 4rem;

      input[type='submit'] {
        margin-top: 2rem;
      }
    }
  }
</style>
