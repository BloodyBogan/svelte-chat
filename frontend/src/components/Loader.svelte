<div class="loader">
  <div class="loader__dot" />
  <div class="loader__dot" />
  <div class="loader__dot" />
  <div class="loader__dot" />
  <div class="loader__dot" />
  <div class="loader__dot" />
</div>

<style lang="scss">
  @import '../styles/variables';

  .loader {
    $size: 8rem;

    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: $size;
    height: $size;
    animation: loader 2.5s infinite linear both;

    &__dot {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      animation: loader-dot 2s infinite ease-in-out both;

      &::before {
        content: '';
        display: block;
        width: 25%;
        height: 25%;
        background-color: $clr-accent-darkest;
        border-radius: 100%;
        animation: loader-dot-before 2s infinite ease-in-out both;
      }

      &:nth-child(1),
      &:nth-child(1)::before {
        animation-delay: -1.1s;
      }

      &:nth-child(2),
      &:nth-child(2)::before {
        animation-delay: -1s;
      }

      &:nth-child(3),
      &:nth-child(3)::before {
        animation-delay: -900ms;
      }

      &:nth-child(4),
      &:nth-child(4)::before {
        animation-delay: -800ms;
      }

      &:nth-child(5),
      &:nth-child(5)::before {
        animation-delay: -700ms;
      }

      &:nth-child(6),
      &:nth-child(6)::before {
        animation-delay: -600ms;
      }
    }
  }

  @keyframes loader {
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes loader-dot {
    80%,
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes loader-dot-before {
    50% {
      transform: scale(0.4);
    }
    100%,
    0% {
      transform: scale(1);
    }
  }
</style>
