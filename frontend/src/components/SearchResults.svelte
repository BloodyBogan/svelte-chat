<script lang="ts">
  import axios from '@axios';

  import type { User } from '../stores/user';
  import { userStore } from '../stores/user';
  const { isAuthenticated, user } = userStore;

  import { notificationsStore } from '../stores/notifications';

  import ContactList from './ContactList.svelte';

  export let handleStartStopSearching: () => void;
  export let searchValue: string;
  export let friends: User[];
  export let redirect: (path: string) => void;

  const handleAddFriend = async (): Promise<void> => {
    try {
      const response = await axios.post('/user/friends', { searchValue });

      if (response.data.success) {
        notificationsStore.addNotification('Hooray!', response.data.message);
      } else {
        notificationsStore.addNotification('Oops!', 'There was an error');
      }
    } catch (err) {
      const response = err.response;
      if (response.status === 401) {
        $isAuthenticated = false;
        $user = {};

        redirect('/login');

        notificationsStore.addNotification('Oops!', 'Your session has expired');
      } else if ('errors' in response.data) {
        const { errors: errs } = response.data;

        errs.forEach((error): void => {
          const key = Object.keys(error)[0];

          notificationsStore.addNotification('Oops!', error[key]);
        });
      } else if (response.status === 404) {
        notificationsStore.addNotification('Oops!', response.data.message);
      } else if (response.status === 422) {
        notificationsStore.addNotification('Oops!', response.data.message);
      } else {
        notificationsStore.addNotification('Oops!', response.data.message);
      }
    }
  };

  $: numberOfFriends = friends.length;
</script>

<div class="results-header">
  <button on:click={() => handleStartStopSearching()}
    ><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
      ><path d="M21 11H6l6-5-2-2-7 8 7 8 2-2-6-5h15z" /></svg
    ></button
  >
  <p>{numberOfFriends} friends found</p>
</div>
{#if friends.length === 0}
  <div class="results-add">
    <p>You don't have any friends matching that username</p>
    <p>Do you want to add <strong>{searchValue}</strong> as a friend?</p>
    <button class="btn" on:click={handleAddFriend}>Add</button>
  </div>
{:else}
  <ContactList {friends} />
{/if}

<style lang="scss">
  @import '../styles/variables';

  .results-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 1.5rem;

    button {
      flex-shrink: 0;

      svg {
        width: 2.4rem;

        path {
          fill: $clr-dark-900;
        }
      }
    }

    p {
      flex-grow: 1;
      margin-left: 4.8rem;
      text-align: right;
    }
  }

  .results-add {
    margin-top: 3rem;

    p {
      color: $clr-dark-900;

      & + p {
        margin-top: 1.5rem;
      }

      strong {
        font-size: 2rem;
        font-weight: 600;
        color: $clr-accent-darkest;
      }
    }

    button {
      width: 100%;
      margin-top: 3rem;
      padding: 0.9375em;
    }
  }
</style>
