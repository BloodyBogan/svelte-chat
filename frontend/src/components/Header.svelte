<script lang="ts">
  import { activeRouteStore } from '../router/types';

  const { activeRoute } = activeRouteStore;
</script>

<header class="header">
  <nav>
    <ul class="header__list">
      <li class="header__logo">
        <a href="/" aria-current={$activeRoute.path === '/' ? 'page' : null}
          ><svg width="33" height="33" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M3.894 16.708l.005.024a10.833 10.833 0 006.117 7.626l6.484 2.948v-3.473h3.667a9.167 9.167 0 009.166-9.166v-1.834a9.167 9.167 0 00-9.166-9.166h-7.334a9.167 9.167 0 00-9.166 9.166v1.834c0 .697.077 1.372.222 2.018l.005.023zM20.167 33L8.499 27.696A14.5 14.5 0 01.31 17.487 12.876 12.876 0 010 14.667v-1.834C0 5.746 5.746 0 12.833 0h7.334C27.254 0 33 5.746 33 12.833v1.834C33 21.754 27.254 27.5 20.167 27.5V33z"
            />
          </svg>Chative</a
        >
      </li>
      <li>
        <a href="/login" aria-current={$activeRoute.path === '/login' ? 'page' : null}
          >Log In</a
        >
      </li>
      <li>
        <a href="/signup" aria-current={$activeRoute.path === '/signup' ? 'page' : null}
          >Sign Up</a
        >
      </li>
    </ul>
  </nav>
</header>

<style lang="scss">
  @import '../styles/variables';

  .header {
    display: inline-block;
    max-width: $max-width;
    width: 100%;
    margin: 6.4rem 0rem 0rem;
    padding: 2.5em;
    background-color: $clr-light-100;
    border-radius: $border-radius-medium;
    box-shadow: $box-shadow-main;

    &__list {
      display: flex;
      align-items: center;
      justify-content: flex-end;

      li {
        a {
          padding: 0.3125em 0em;

          &:focus {
            outline: none;
          }
        }

        &:not(:last-child, .header__logo) {
          margin-right: 3.5rem;

          a {
            color: $clr-dark-100;
          }
        }

        &:not(.header__logo) {
          a {
            position: relative;

            &[aria-current] {
              color: $clr-dark-900;

              &::after {
                transform: translateX(-50%) scaleY(1);
                opacity: 1;
              }
            }

            &::after {
              $size: 0.5em;

              content: '';
              position: absolute;
              bottom: -0.625em;
              left: 50%;
              transform: translateX(-50%) scaleY(0);
              transform-origin: center top;
              width: $size;
              height: $size;
              background-color: $clr-accent-darkest;
              border-radius: 50%;
              opacity: 0;
              transition-property: transform, opacity;
              transition-duration: $transition-duration-medium;
              transition-timing-function: $transition-timing-function;
            }

            &:hover::after,
            &:focus::after {
              transform: translateX(-50%) scaleY(1);
              opacity: 1;
            }
          }
        }

        &:last-child {
          a {
            &[aria-current] {
              color: $clr-accent-darkest;
            }
          }
        }
      }
    }

    &__logo {
      margin-right: auto;

      a {
        font-size: 2rem;
        color: $clr-dark-900;

        svg {
          display: inline-block;
          max-width: 3.3rem;
          margin-right: 1rem;
          vertical-align: middle;

          path {
            fill: $clr-accent-darkest;
          }
        }
      }
    }
  }
</style>
