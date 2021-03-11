<script lang="ts">
  import Message from './Message.svelte';

  const messages = [
    {
      username: 'SomeUsername',
      message: 'Let me know when you get back home, mate',
      sentAt: '08:17am',
      photo: false
    },
    {
      username: 'BloodyBogan',
      message:
        'You won’t believe where I’ve been, man! We had so much fun it’s unbelievable.',
      sentAt: '10:45pm',
      photo: false
    },
    {
      username: 'BloodyBogan',
      message: 'https://via.placeholder.com/240',
      sentAt: '10:51pm',
      photo: true
    }
  ];
</script>

<section class="chatbox">
  <header class="chatbox__header">
    <div class="profile-photo">
      <img src="https://via.placeholder.com/150" alt="Your friend" />
    </div>
    <div class="info">
      <button><strong>SomeUsername</strong></button>
      <p>offline</p>
    </div>
    <button class="unfriend"
      ><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
        ><path d="M17 20V8H7v12h10zm-4-10h2v8h-2v-8zm-4 0h2v8H9v-8zm0-6h6v2H9z" /><path
          d="M5 20l2 2h10l2-2V8h2V6h-4V4l-2-2H9L7 4v2H3v2h2v12zM9 4h6v2H9V4zM8 8h9v12H7V8h1z"
        /><path d="M9 10h2v8H9zm4 0h2v8h-2z" /></svg
      ></button
    >
  </header>
  <div class="chatbox__body">
    {#if messages.length === 0}
      <p>No messages yet...</p>
    {:else}
      {#each messages as message}
        <Message {...message} />
      {/each}
    {/if}
  </div>
  <form class="form">
    <div class="form__group">
      <input type="text" placeholder="Type your message here" />
      <button class="send-photo"
        ><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
          ><circle cx="7.5" cy="9.5" r="1.5" /><path d="M10 14l-1-2-3 4h12l-5-6z" /><path
            d="M20 4H4L2 6v12l2 2h16l2-2V6l-2-2zM4 18V6h16v12H4z"
          /></svg
        ></button
      >
      <button class="send-message">
        <svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg"
          ><path
            d="M10 20C4 20 0 16 0 10a10 10 0 1110 10zm0-18a8 8 0 100 16 8 8 0 000-16zm0 13l-1-1 2-3H5V9h6L9 6l1-1 5 5-5 5z"
            fill="#151E42"
          /></svg
        >
      </button>
    </div>
  </form>
</section>

<style lang="scss">
  @import '../styles/variables';

  .chatbox {
    align-self: stretch;
    flex-grow: 1;
    display: flex;
    flex-direction: column;

    button {
      &:hover,
      &:focus {
        svg {
          path {
            fill: $clr-accent-darkest;
          }
        }
      }
    }

    &__header {
      flex-grow: 0;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      width: 100%;
      padding: 0.9375em 1.25em;
      color: $clr-dark-900;
      border: 0.1rem solid $clr-light-200;
      border-radius: $border-radius-small;

      .profile-photo,
      .unfriend {
        flex-grow: 0;
        flex-shrink: 0;
      }

      .profile-photo {
        $size: 5.6rem;

        position: relative;

        width: $size;
        height: $size;

        img {
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
        }
      }

      .info {
        flex-grow: 1;
        text-align: left;
        margin: 0rem 1.5rem 0rem 1rem;

        button {
          display: block;
          width: 100%;
          text-align: left;

          strong {
            font-size: 2rem;
            font-weight: 600;
          }
        }

        p {
          margin-top: 1rem;
          color: $clr-light-900;
        }
      }

      .unfriend {
        svg {
          width: 2.4rem;

          path {
            &:first-child {
              fill: $clr-light-100;
            }
          }
        }
      }
    }

    &__body {
      position: relative;
      flex-grow: 1;
      margin: 4rem 0rem;

      p {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }

    .form {
      flex-shrink: 0;
      position: relative;

      button {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);

        &.send-message {
          width: 2rem;
          right: 1.25em;
        }

        &.send-photo {
          width: 2.4rem;
          right: 3.375em;
        }
      }
    }
  }
</style>
