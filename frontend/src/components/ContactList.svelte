<script lang="ts">
  import type { User } from '../stores/user';

  import Contact from './Contact.svelte';

  export let friends: User[] = [];
</script>

<ul class="contact-list">
  {#if !friends || friends.length === 0}
    <p>No friends yet...</p>
  {:else}
    {#each friends as friend}
      <Contact username={friend.username} profilePhoto={friend.profilePhoto} />
    {/each}
  {/if}
</ul>

<style lang="scss">
  .contact-list {
    margin-top: 3.5rem;
  }
</style>
