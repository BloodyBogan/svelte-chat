<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import { bounceOut } from 'svelte/easing';

  export let id: number;
  export let title: string;
  export let message: string;
  export let removeToast: (id: number) => void;
</script>

<li
  class="toast"
  in:fly={{ x: 250, duration: 250, easing: bounceOut }}
  out:fade={{ duration: 250 }}
>
  <div class="toast__body">
    <strong>{title}</strong>
    <p>{message}</p>
  </div>
  <button type="button" on:click={() => removeToast(id)}>X</button>
  <div class="toast__bar">
    <div class="line" on:animationend={() => removeToast(id)} />
  </div>
</li>

<style lang="scss">
  @import '../styles/variables';

  :global(.toast + .toast) {
    margin-top: 2rem;
  }

  .toast {
    position: relative;
    display: inline-flex;
    align-items: center;
    max-width: 46.5rem;
    background-color: $clr-accent-darkest;
    border-radius: $border-radius-small;
    box-shadow: $box-shadow-buttons;
    overflow: hidden;
    z-index: 2000;

    &__body {
      margin-right: 3.5rem;
      padding: 1.25em;
      text-align: left;

      & > * {
        display: block;
      }

      strong {
        font-size: 2rem;
        font-weight: 700;
        color: $clr-light-100;
      }

      p {
        margin-top: 0.5rem;
        font-size: 1.4rem;
        color: darken($clr-light-100, 15%);
      }
    }

    button {
      align-self: stretch;
      padding: 1.25em;
      color: $clr-light-100;
      outline: none;

      &:hover,
      &:focus {
        background-color: lighten($clr-accent-darkest, 10%);
      }
    }

    &__bar,
    &__bar > .line {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 0.7rem;
      z-index: 1000;
    }

    &__bar {
      background-color: lighten($clr-accent-darkest, 10%);
    }

    &__bar > .line {
      background-color: $clr-accent-darkest;
      transform: scaleX(1);
      transform-origin: left;
      animation-name: shrink;
      animation-duration: 5000ms;
      animation-timing-function: linear;
      animation-delay: $transition-duration-medium;
      animation-fill-mode: forwards;
      animation-iteration-count: 1;
    }
  }

  @keyframes shrink {
    from {
      transform: scaleX(1);
    }

    to {
      transform: scaleX(0);
    }
  }
</style>
