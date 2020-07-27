import { UserStore } from "./UserStore/UserStore";
import AuthService from "../services/AuthService";
import { VehicleStore } from "./VehicleStore/VehicleStore";
import CarService from "../services/VehicleService";
import { UiStore } from "./UiStore/UiStore";

const authService = new AuthService();
const carService = new CarService();

/**
 * A property that combines and initializes all stores.
 */
export const stores = {
    userStore: new UserStore(authService),
    vehicleStore: new VehicleStore(carService),
    uiStore: new UiStore()
};
