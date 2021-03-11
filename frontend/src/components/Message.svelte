<script lang="ts">
  import { userStore } from '../stores/user';
  const { user } = userStore;

  export let username: string;
  export let message: string;
  export let sentAt: string;
  export let photo: boolean;
</script>

<div class="message" class:my={username === $user.username} class:photo>
  <div class="message__body" class:photo>
    {#if photo}
      <img src={message} alt="Photo sent by {username}" />
    {:else}
      {message}
    {/if}
  </div>
  <div class="message__meta" class:my={username === $user.username}>
    <p>{username} @ {sentAt}</p>
  </div>
</div>

<style lang="scss">
  @import '../styles/variables';

  :global(.message + .message) {
    margin-top: 3rem;
  }

  .message {
    width: 85%;

    &.my {
      margin-left: auto;
    }

    &.photo {
      max-width: 24rem;
    }

    &__body {
      text-align: left;
      border-radius: $border-radius-small;
      overflow: hidden;

      &:not(.photo) {
        padding: 0.9375em 1.25em;
        color: $clr-dark-900;
        border: 0.1rem solid $clr-light-200;
      }

      img {
        max-width: 24rem;
        object-fit: cover;
      }
    }

    &__meta {
      margin-top: 0.5rem;
      text-align: left;
      color: lighten($clr-light-900, 10%);

      &.my {
        text-align: right;
      }
    }
  }
</style>
