<script lang="ts">
  import { profileStore } from '../stores/profile';
  const { profileOpened } = profileStore;

  import SearchOrAdd from 'src/components/SearchOrAdd.svelte';
  import ContactList from 'src/components/ContactList.svelte';
  import Profile from 'src/components/Profile.svelte';

  export let redirect: (path: string) => void;
</script>

<section class="contacts">
  <header class="contacts__header">
    <strong>Chat</strong>
    <p>1 online</p>
  </header>
  <div class="contacts__body">
    <SearchOrAdd />
    <ContactList />
  </div>
</section>
{#if $profileOpened}
  <Profile {redirect} />
{:else}
  <section class="chat">Your chat</section>
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
      border-bottom: 0.1rem solid $clr-light-200;

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
  }
</style>
