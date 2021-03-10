<script lang="ts">
  import { notificationsStore } from '../stores/notifications';
  const { notifications } = notificationsStore;

  import Toast from './Toast.svelte';

  const removeToast = (id: number) => {
    $notifications = $notifications.filter(notification => notification.id !== id);
  };
</script>

{#if $notifications}
  <div class="toasts">
    <ul>
      {#each $notifications as notification (notification.id)}
        <Toast
          id={notification.id}
          title={notification.title}
          message={notification.message}
          {removeToast}
        />
      {/each}
    </ul>
  </div>
{/if}

<style lang="scss">
  .toasts {
    position: fixed;
    top: 6.4rem;
    right: 5%;

    ul {
      display: inline-flex;
      flex-direction: column;
      align-items: flex-end;
    }
  }
</style>
