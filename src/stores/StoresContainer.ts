import { UserStore } from "./UserStore/UserStore";
import AuthService from "../services/AuthService";

const authService = new AuthService();

/**
 * A property that combines and initializes all stores.
 */
export const stores = {
    userStore: new UserStore(authService),
};
