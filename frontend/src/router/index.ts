import page from 'page';

import Router from './Router.svelte';
import Route from './Route.svelte';

const redirect = (path: string): void => { page.redirect(path); }

export { Router, Route, redirect };