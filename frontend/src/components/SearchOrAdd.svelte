<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  import type { User } from '../stores/user';
  import { userStore } from '../stores/user';
  const { user } = userStore;

  export let searching: boolean;

  const dispatch = createEventDispatcher();

  let searchValue = '';
  let friends: User[];

  const handleInput = () => {
    friends = $user.friends!.filter(friend => friend.username!.includes(searchValue));

    dispatch('searching', { friends, searchValue });
  };

  $: if (!searching) {
    searchValue = '';
  }
</script>

<div class="form__group">
  <svg width="18" height="17" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M16.302 16.608l-5.896-5.716c-2.622 1.807-6.236 1.365-8.313-1.017C.016 7.492.17 3.965 2.444 1.759c2.275-2.207 5.914-2.355 8.372-.342s2.915 5.517 1.05 8.06l5.896 5.716-1.46 1.414zM6.82 2C4.864 2 3.176 3.33 2.779 5.188c-.398 1.857.604 3.729 2.4 4.483 1.794.754 3.888.182 5.014-1.368a3.907 3.907 0 00-.364-5.038l.624.6-.704-.68-.012-.012A4.164 4.164 0 006.82 2z"
    />
  </svg>
  <input
    type="text"
    bind:value={searchValue}
    on:input={handleInput}
    placeholder="Search or add a friend"
  />
</div>

<style lang="scss">
  @import '../styles/variables';

  .form__group {
    position: relative;

    svg {
      position: absolute;
      top: 50%;
      left: 1.25em;
      transform: translateY(-50%);
      max-width: 1.8rem;

      path {
        fill: $clr-dark-100;
      }
    }

    input[type='text'] {
      padding-left: 3em;
    }
  }
</style>
