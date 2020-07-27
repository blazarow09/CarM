import { observable, action, IObservableArray, computed } from 'mobx';
import { IVehicle } from '../../models/Vehicle/IVehicle';
import VehicleService from '../../services/VehicleService';

export interface IVehicleStore {
    // Methods
    getAvailableCars(reset: boolean, userId?: string): Promise<void>;
    handleAddVehicle(vehicle: IVehicle, userId: string): Promise<void>;
    setUserId(userId: string): void;

    // Observables
    availableCars: IObservableArray<IVehicle>;
    userId: string;

    // Computed
    isAvailableCars: boolean;
}

export class VehicleStore implements IVehicleStore {
    //#region Services
    private _vehicleService: VehicleService;

    //#endregion

    //#region Observables initialization
    @observable public availableCars: IObservableArray<IVehicle> = observable([]);
    @observable public userId: string = '';

    //#endregion

    public constructor(carService: VehicleService) {
        this._vehicleService = carService;
    }

    public setUserId(userId: string): void {
        this.userId = userId;
    }

    public async handleAddVehicle(vehicle: IVehicle, userId: string): Promise<void> {
        if(vehicle) {
            await this._vehicleService.saveVehicle(vehicle, userId);
        }
    }

    @action
    public async getAvailableCars(reset: boolean, userId: string): Promise<void> {
        if (reset) {
            this.availableCars.clear();
        } else {
            let cars = await this._vehicleService.getAvailablecars(userId);

            this.availableCars.replace(cars);
        }
    }

    @computed
    public get isAvailableCars(): boolean {
        return !!this.availableCars.length;
    }
}
