<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  import axios, { CancelToken } from '@axios';

  import { userStore } from '../stores/user';
  const { isAuthenticated, user } = userStore;

  import { notificationsStore } from '../stores/notifications';

  import type { ProfileFields } from './types';
  import { CancelTokenSource } from 'axios';

  export let redirect: (path: string) => void;

  let bioTextArea: HTMLTextAreaElement;
  let fileInputField: HTMLInputElement;
  let fileSpan: HTMLSpanElement;

  let bioValue = '';

  const errors = {
    bio: '',
    file: ''
  };

  const fields: ProfileFields = {
    bio: null,
    file: null,
    fileSpan: null
  };

  let token: CancelTokenSource | null = null;

  let uploading = false;
  let uploadProgressValue = 0;

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

  const handleFileChange = e => {
    errors.file = '';

    file.value = e.target!.files[0];

    fileSpan.textContent = e.target!.files[0].name;
  };

  const handlePhotoChange = async (): Promise<void> => {
    const formData = new FormData();
    const photo = fields.file!.files![0];

    formData.append('photo', photo);

    try {
      token = CancelToken.source();

      uploading = true;

      const response = await axios.post('/user/photo', formData, {
        cancelToken: token.token,
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: progressEvent => {
          uploadProgressValue = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
        }
      });

      if (response && response.data.success) {
        $user.profilePhoto = response.data.url;

        notificationsStore.addNotification('Hooray!', response.data.message);
      } else {
        notificationsStore.addNotification('Oops!', 'Something went wrong');
      }

      token = null;

      uploading = false;
      uploadProgressValue = 0;

      fields.file!.value = '';

      fileSpan.innerHTML = 'Click <span>here</span> to choose photo (Max. 1MB)';
    } catch (err) {
      const response = err.response;

      if (response) {
        if (response.status === 401) {
          $isAuthenticated = false;
          $user = {};

          redirect('/login');

          notificationsStore.addNotification('Oops!', 'Your session has expired');
        } else if (response.status === 422) {
          errors.file = response.data.message;
        } else {
          notificationsStore.addNotification('Oops!', response.data.message);
        }
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

  $: file = {
    value: null,
    validate() {
      if (!this.value) {
        errors.file = 'Please choose an image';
        return false;
      } else if ((this.value as any).size > 1000000) {
        errors.file = 'Photo must not be larger than 1MB';
        return false;
      } else if (!(this.value as any).type.includes('image')) {
        errors.file = 'You can only upload an image';
        return false;
      }

      return true;
    }
  };

  $: bioButtonDisabled = !bio.value || !bio.validate();
  $: fileButtonDisabled = !file.value || !file.validate() || uploading;

  onMount(() => {
    fields.bio = bioTextArea;
    fields.file = fileInputField;
    fields.fileSpan = fileSpan;
  });

  onDestroy(() => {
    if (token) {
      token.cancel();
      token = null;

      notificationsStore.addNotification('Oops!', 'Profile photo upload canceled');
    }
  });
</script>

<section class="profile">
  <header class="profile__header">
    <img src={$user.profilePhoto} alt="Gorgeous you" />
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
  <form class="form" on:submit|preventDefault={handlePhotoChange}>
    <div class="form__group">
      <input
        type="file"
        id="profile-photo"
        bind:this={fileInputField}
        on:change={handleFileChange}
        on:blur={file.validate}
        accept="image/*"
      />
      <label for="profile-photo" bind:this={fileSpan}
        >Click <span>here</span> to choose photo (Max. 1MB)</label
      >
      {#if uploading}
        <progress max="100" value={uploadProgressValue} />
      {/if}
      {#if errors.file}
        <div class="error">{errors.file}</div>
      {/if}
    </div>
    <input type="submit" disabled={fileButtonDisabled} class="btn" value="Upload" />
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
        object-fit: cover;
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
