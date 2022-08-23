import { writable } from "svelte/store";
import { navItemsEs, navLinksEs, navDropEs } from "../assets/js/scripts";

export const menuItems = writable( navItemsEs );
export const menuLinks = writable( navLinksEs );
export const menuDrop = writable( navDropEs );

export const conectionOnLine = writable(true);