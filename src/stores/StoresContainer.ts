import { UserStore } from "./UserStore/UserStore";
import AuthService from "../services/AuthService";
import { ContentStore } from "./ContentStore/ContentStore";
import CarService from "../services/CarService";
import { UiStore } from "./UiStore/UiStore";

const authService = new AuthService();
const carService = new CarService();

/**
 * A property that combines and initializes all stores.
 */
export const stores = {
    userStore: new UserStore(authService),
    contentStore: new ContentStore(carService),
    uiStore: new UiStore()
};
