import { writable, Writable } from 'svelte/store';

class ProfileStore {
    constructor(public profileOpened: Writable<boolean> = writable(false)) {}
}

export const profileStore = new ProfileStore();