import { writable, Writable, get } from 'svelte/store';

export const notifications = writable([]);

interface Notification {
    id?: number;
    title: string;
    message: string
}

class NotificationsStore  {
    constructor(
        private id: Writable<number> = writable(0),
        public notifications: Writable<Notification[]> = writable([])
    ) {}

    addNotification(title: string, message: string) {
        const notification: Notification = {
            id: get(this.id),
            title,
            message
        }

        this.id.update((v: number): number => v += 1);
        this.notifications.update((n) => [...n, notification]);
    }
}

export const notificationsStore = new NotificationsStore();