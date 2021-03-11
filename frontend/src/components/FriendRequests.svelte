<script lang="ts">
  import axios from '@axios';

  import type { FriendRequests } from '../stores/user';
  import { userStore } from '../stores/user';
  const { isAuthenticated, user } = userStore;

  import { notificationsStore } from '../stores/notifications';

  export let friendRequests: FriendRequests[] | undefined;
  export let handleFriendRequestsOpenClose: () => void;
  export let redirect: (path: string) => void;

  const handleConfirm = async (_id: number): Promise<void> => {
    try {
      const response = await axios.post('/user/friends/accept', { _id });

      if (response.data.success) {
        notificationsStore.addNotification('Hooray!', response.data.message);
      } else {
        notificationsStore.addNotification('Oops!', 'Something went wrong');
      }
    } catch (err) {
      const response = err.response;
      if (response.status === 401) {
        $isAuthenticated = false;
        $user = {};

        redirect('/login');

        notificationsStore.addNotification('Oops!', 'Your session has expired');
      } else {
        notificationsStore.addNotification('Oops!', 'There was an error');
      }
    }
  };

  const handleDecline = async (_id: number): Promise<void> => {
    try {
      const response = await axios.post('/user/friends/decline', { _id });

      if (response.data.success) {
        notificationsStore.addNotification('Aww :(', response.data.message);
      } else {
        notificationsStore.addNotification('Oops!', 'Something went wrong');
      }
    } catch (err) {
      const response = err.response;
      if (response.status === 401) {
        $isAuthenticated = false;
        $user = {};

        redirect('/login');

        notificationsStore.addNotification('Oops!', 'Your session has expired');
      } else {
        notificationsStore.addNotification('Oops!', 'There was an error');
      }
    }
  };
</script>

<div class="friend-requests-header">
  <button on:click={() => handleFriendRequestsOpenClose()}
    ><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
      ><path d="M21 11H6l6-5-2-2-7 8 7 8 2-2-6-5h15z" /></svg
    ></button
  >
  <p>
    You have {friendRequests?.length} friend {friendRequests?.length === 1
      ? 'request'
      : 'requests'}
  </p>
</div>
{#if friendRequests}
  <ul class="requests">
    {#each friendRequests as friendRequest}
      <li class="requests__item">
        <p><strong>{friendRequest.username}</strong> wants to add you as a friend</p>
        <div class="buttons">
          <button
            class="buttons__confirm"
            on:click={() => handleConfirm(friendRequest._id)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
              ><path
                d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16z"
              /><path d="M10 14l-2-3-2 2 4 3 7-6-2-2z" /></svg
            >
          </button>
          <button
            class="buttons__delete"
            on:click={() => handleDecline(friendRequest._id)}
            ><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
              ><path
                d="M17 20V8H7v12h10zm-4-10h2v8h-2v-8zm-4 0h2v8H9v-8zm0-6h6v2H9z"
              /><path
                d="M5 20l2 2h10l2-2V8h2V6h-4V4l-2-2H9L7 4v2H3v2h2v12zM9 4h6v2H9V4zM8 8h9v12H7V8h1z"
              /><path d="M9 10h2v8H9zm4 0h2v8h-2z" /></svg
            ></button
          >
        </div>
      </li>
    {/each}
  </ul>
{/if}

<style lang="scss">
  @import '../styles/variables';

  .friend-requests-header {
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

  .requests {
    display: flex;
    flex-direction: column;
    margin-top: 3rem;

    &__item {
      display: flex;
      align-items: center;
      padding: 1.25em;
      color: $clr-dark-900;
      border: 0.1rem solid $clr-light-200;
      border-radius: $border-radius-small;

      & + & {
        margin-top: 3rem;
      }

      p {
        flex-grow: 1;

        strong {
          color: $clr-accent-darkest;
        }
      }

      .buttons {
        flex-shrink: 0;
        margin-left: 1.5rem;

        & > * + * {
          margin-left: 1rem;
        }

        &__confirm,
        &__delete {
          &:hover,
          &:focus {
            svg {
              path {
                fill: $clr-accent-darkest;
              }
            }
          }

          svg {
            path {
              fill: $clr-dark-900;
            }
          }
        }

        &__delete {
          svg {
            path {
              &:first-child {
                fill: $clr-light-100;
              }
            }
          }
        }
      }
    }
  }
</style>
