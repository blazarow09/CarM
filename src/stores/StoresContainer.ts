import { UserStore } from './UserStore/UserStore';
import AuthService from '../services/AuthService';
import { VehicleStore } from './VehicleStore/VehicleStore';
import VehicleService from '../services/VehicleService';
import { UiStore } from './UiStore/UiStore';
import RefuelService from '../services/RefuelService';

const authService = new AuthService();
const vehicleService = new VehicleService();
const refuelService = new RefuelService();

/**
 * A property that combines and initializes all stores.
 */
export const stores = {
    userStore: new UserStore(authService),
    vehicleStore: new VehicleStore(vehicleService, refuelService),
    uiStore: new UiStore(),
};
