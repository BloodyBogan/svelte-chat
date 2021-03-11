import { writable, Writable } from 'svelte/store';

export interface FriendRequests {
    _id: number,
    username: string,
}

export interface User {
    username?: string,
    profilePhoto?: string,
    bio?: string, 
    friends?: User[],
    friendRequests?: FriendRequests[],
}

class UserStore {
    constructor(
        public isAuthenticated: Writable<boolean> = writable(false),
        public user: Writable<User> = writable({})
    ) {}
}

export const userStore = new UserStore();