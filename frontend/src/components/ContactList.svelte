<script lang="ts">
  import type { User } from '../stores/user';

  import Contact from './Contact.svelte';

  export let friends: User[] | undefined;
</script>

<ul class="contact-list">
  {#if friends}
    {#each friends as friend}
      <Contact username={friend.username} profilePhoto={friend.profilePhoto} />
    {/each}
  {:else}
    <p>No friends yet...</p>
  {/if}
</ul>

<style lang="scss">
  .contact-list {
    margin-top: 3.5rem;
  }
</style>
