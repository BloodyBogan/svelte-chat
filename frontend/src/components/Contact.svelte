<script lang="ts">
  export let profilePhoto: string;
  export let online: boolean;
  export let username: string;
  export let lastMessage: string;
</script>

<li class="contact">
  <div class="contact__profile-photo" class:online>
    <img src={profilePhoto} alt="{username}'s profile photo" />
  </div>
  <div class="contact__body">
    <strong>{username}</strong>
    <p>{lastMessage}</p>
  </div>
</li>

<style lang="scss">
  @import '../styles/variables';

  :global(.contact + .contact) {
    margin-top: 3rem;
  }

  .contact {
    display: flex;
    align-items: center;
    cursor: pointer;

    &__profile-photo {
      position: relative;
      max-width: 6.6rem;

      &::after {
        $size: 1.5rem;

        content: '';
        position: absolute;
        top: 0;
        right: 0;
        transform: translateY(25%);
        width: $size;
        height: $size;
        background-color: $clr-dark-100;
        border-radius: 50%;
      }

      &.online {
        &::after {
          background-color: $clr-green;
        }
      }
    }

    &__body {
      margin-left: 1rem;

      strong {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 600;
        color: $clr-dark-900;
      }

      p {
        color: lighten($clr-light-900, 10%);
      }
    }
  }
</style>
