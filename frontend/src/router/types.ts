import { SvelteComponent } from "svelte";
import { writable, Writable } from "svelte/store";

export interface Route {
    path: string, 
    component: typeof SvelteComponent | null,
    middleware: PageJS.Callback[]
}

export interface Routes {
    [key: string]: Route
}

class ActiveRouteStore {
    constructor(public activeRoute: Writable<Route> = writable({ path: '', component: null, middleware: [] })) {}
}

export const activeRouteStore = new ActiveRouteStore();