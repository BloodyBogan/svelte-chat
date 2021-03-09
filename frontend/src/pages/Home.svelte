<section class="hero">
  <h1 class="hero__title">Chat anywhere you want, anytime you want</h1>
  <p class="hero__paragraph">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Volutpat ipsum odio id eget
    dui massa arcu vestibulum.
  </p>
  <a href="/signup" class="btn">Get started</a>
</section>
<section class="credits">
  <p>
    &copy; 2021 | <a href="https://github.com/BloodyBogan/svelte-chat">Michal Kaštan</a>
  </p>
</section>

<style lang="scss">
  @import '../styles/variables';

  .hero {
    flex-grow: 1;
    padding: 2.5em 0em 7.5em 0em;

    &__title {
      max-width: 54.2rem;
      margin: 0 auto 3.5rem auto;
    }

    &__paragraph {
      max-width: 46.5rem;
      margin: 0 auto 3.5rem auto;
    }
  }

  .credits {
    flex-shrink: 0;
    padding: 5em 2.5em;
    background: $clr-accent-darkest;
    background: linear-gradient(45deg, $clr-accent-light, $clr-accent-darkest);
    border-radius: 0rem 0rem $border-radius-small $border-radius-small;

    p {
      color: $clr-light-100;

      a {
        color: inherit;
      }
    }
  }
</style>
