import { writable, Writable } from 'svelte/store';

interface User {
    username?: string,
    profilePhoto?: string,
    bio?: string
}

class UserStore {
    constructor(
        public isAuthenticated: Writable<boolean> = writable(false),
        public user: Writable<User> = writable({})
    ) {}
}

export const userStore = new UserStore();