import { UserStore } from './UserStore/UserStore';
import AuthService from '../services/AuthService';
import { VehicleStore } from './VehicleStore/VehicleStore';
import VehicleService from '../services/VehicleService';
import { UiStore } from './UiStore/UiStore';
import RefuelService from '../services/RefuelService';
import LocalizationStore from './LocalizationStore/LocalizationStore';
import HistoryService from '../services/HistoryService';
import ContentStore from './ContentStore/ContentStore';
import UserService from '../services/UserService';
import RepairService from '../services/RepairService';

const authService = new AuthService();
const vehicleService = new VehicleService();
const refuelService = new RefuelService();
const historyService = new HistoryService();
const userService = new UserService();
const repairService = new RepairService();

/**
 * A property that combines and initializes all stores.
 */
export const stores = {
    userStore: new UserStore(authService, userService),
    vehicleStore: new VehicleStore(vehicleService, refuelService, repairService),
    uiStore: new UiStore(),
    localizationStore: new LocalizationStore(),
    contentStore: new ContentStore(historyService),
};
