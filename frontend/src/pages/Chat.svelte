<script lang="ts">
  import type { User } from '../stores/user';
  import { userStore } from '../stores/user';
  const { user } = userStore;

  import { profileStore } from '../stores/profile';
  const { profileOpened } = profileStore;

  import SearchOrAdd from 'src/components/SearchOrAdd.svelte';
  import ContactList from 'src/components/ContactList.svelte';
  import Profile from 'src/components/Profile.svelte';
  import SearchResults from 'src/components/SearchResults.svelte';
  import FriendRequests from 'src/components/FriendRequests.svelte';
  import ChatBox from 'src/components/ChatBox.svelte';

  export let redirect: (path: string) => void;

  let searching = false;
  let initialSearch = true;

  let searchValue: string;
  let friends: User[];

  const handleSearching = ({ detail }): void => {
    searchValue = detail.searchValue;
    friends = detail.friends;

    if (initialSearch) {
      friendRequestsOpen = false;

      handleStartStopSearching();
    }
  };

  const handleStartStopSearching = (): void => {
    friendRequestsOpen = false;

    searching = !searching;
    initialSearch = !initialSearch;
  };

  let friendRequestsOpen = false;

  const handleFriendRequestsOpenClose = (): void => {
    searching = false;
    initialSearch = true;

    friendRequestsOpen = !friendRequestsOpen;
  };

  let friendsOnline = 0;

  $: if ($user.friends) {
    friendsOnline = $user.friends.filter(friend => friend.online).length;
  }
</script>

<section class="contacts">
  <header class="contacts__header">
    <div class="left">
      <strong>Chat</strong>
      <p>{friendsOnline} online</p>
    </div>
    <div class="right">
      <button on:click={handleFriendRequestsOpenClose}
        ><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
          ><path
            d="M19 14v-4c0-3-2-6-5-7a2 2 0 00-4 0c-3 1-5 4-5 7v4l-2 1v3l1 1h16l1-1v-2-1l-2-1zm0 3H5v-1l2-1v-5a5 5 0 0110 0v5l2 1v1zm-7 5l3-2H9l3 2z"
          /></svg
        ></button
      >
      {#if $user.friendRequests && $user.friendRequests.length > 0}
        <span>{$user.friendRequests.length}</span>
      {/if}
    </div>
  </header>
  <div class="contacts__body">
    <SearchOrAdd on:searching={handleSearching} {searching} />
    {#if searching}
      <SearchResults {handleStartStopSearching} {searchValue} {friends} {redirect} />
    {:else if friendRequestsOpen}
      <FriendRequests
        {handleFriendRequestsOpenClose}
        friendRequests={$user.friendRequests}
        {redirect}
      />
    {:else}
      <ContactList friends={$user.friends} />
    {/if}
  </div>
</section>
{#if $profileOpened}
  <Profile {redirect} />
{:else}
  <ChatBox />
{/if}

<style lang="scss">
  @import '../styles/variables';

  .contacts {
    align-self: stretch;
    flex-shrink: 0;
    width: 46.5rem;
    margin-right: 9.5rem;
    text-align: left;
    background: $clr-light-100;
    border: 0.1rem solid $clr-light-200;
    border-radius: $border-radius-small 0rem 0rem $border-radius-small;

    &__header,
    &__body {
      padding: 0.9375em 1.25em;
    }

    &__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 0.1rem solid $clr-light-200;

      .left {
        flex-grow: 1;

        strong {
          display: block;
          font-size: 2rem;
          font-weight: 600;
          color: $clr-dark-900;
          margin-bottom: 1rem;
        }

        p {
          color: $clr-light-900;
        }
      }

      .right {
        position: relative;
        flex-shrink: 0;
        margin-left: 4.8rem;

        button {
          padding: 0.9375em 0em;

          svg {
            max-width: 2.4rem;

            path {
              fill: $clr-dark-900;
            }
          }
        }

        span {
          position: absolute;
          top: 30%;
          right: -25%;
          transform: translateY(-50%);
          font-size: 1.2rem;
          font-weight: 700;
          color: $clr-light-100;
          padding: 0.5em;
          pointer-events: none;

          &::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 100%;
            padding-top: 100%;
            background-color: $clr-accent-darkest;
            border-radius: 50%;
            pointer-events: none;
            z-index: -1000;
          }
        }
      }
    }
  }
</style>
