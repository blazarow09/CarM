import { observable, action, IObservableArray, computed } from 'mobx';
import { IVehicleViewModel } from '../../models/Vehicle/IVehicleViewModel';
import VehicleService from '../../services/VehicleService';
import { IRepair } from '../../models/Repair/IRepair';
import { IVehicleCreateEdit } from '../../models/Vehicle/IVehicleCreateEdit';

export interface IVehicleStore {
    // Methods
    setUserId(userId: string): void;

    setCurrentSelectedVehicle(vehicleId: string): void;
    setVehicleToEdit(vehicleToEdit: IVehicleViewModel): void;

    // Vehicle
    handleVehicleModal(vehicle: IVehicleViewModel, userId: string): Promise<void>;
    handleEditVehicle(vehicle: IVehicleViewModel, vehicleId: string, userId: string): Promise<void>;
    removeVehicle(vehicleId: string, userId: string): Promise<void>;
    getPreferredVehicleId(userId: string): Promise<void>;
    savePreferredVehicleId(vehicleId: string, userId: string): Promise<void>;

    getAvailableCars(reset: boolean, userId?: string): Promise<boolean>;

    // Repair
    handleRepairModal(repair: IRepair, userId: string): Promise<void>;
    getRepairsByVehicleId(vehicleId: string, userId: string): Promise<void>;

    // Observables
    availableCars: IObservableArray<IVehicleViewModel>;
    // currentSelectedVehicleId: string;
    userId: string;
    vehicleToEdit: IVehicleViewModel;
    repairsByVehicleId: IObservableArray<IRepair>;

    preferredVehicleId: string;

    // Computed
    isAvailableCars: boolean;
}

export class VehicleStore implements IVehicleStore {
    //#region Services
    private _vehicleService: VehicleService;

    //#endregion

    //#region Observables initialization
    @observable public userId: string = '';

    // @observable public currentSelectedVehicleId: string = '';
    @observable public availableCars: IObservableArray<IVehicleViewModel> = observable([]);
    @observable public vehicleToEdit: IVehicleViewModel = null;
    @observable public preferredVehicleId: string = '';

    @observable public repairsByVehicleId: IObservableArray<IRepair> = observable([]);

    //#endregion

    public constructor(carService: VehicleService) {
        this._vehicleService = carService;
    }

    public setUserId(userId: string): void {
        this.userId = userId;
    }

    //#region Vehicle Operations
    public async handleVehicleModal(vehicle: IVehicleViewModel, userId: string): Promise<void> {
        if (vehicle) {
            await this._vehicleService.saveVehicle(vehicle, userId);
        }
    }

    public async removeVehicle(vehicleId: string, userId: string): Promise<void> {
        await this._vehicleService.removeVehicle(vehicleId, userId);
    }

    public async handleEditVehicle(vehicle: IVehicleViewModel, vehicleId: string, userId: string): Promise<void> {
        if (vehicle && userId) {
            await this._vehicleService.editVehicle(vehicle, vehicleId, userId);
        }
    }

    @action
    public async getPreferredVehicleId(userId: string): Promise<void> {
        if (userId) {
            let preferredVehicleId = await this._vehicleService.getPreferredVehicle(userId);

            this.preferredVehicleId = preferredVehicleId;
        }
    }

    @action
    public async savePreferredVehicleId(vehicleId: string, userId: string): Promise<void> {
        if (userId && vehicleId) {
            await this._vehicleService.savePreferredVehicle(vehicleId, userId);

            this.preferredVehicleId = vehicleId;
        }
    }

    @action
    public setVehicleToEdit(vehicleToEdit: IVehicleViewModel): void {
        this.vehicleToEdit = vehicleToEdit;
    }

    @action
    public setCurrentSelectedVehicle(vehicleId: string): void {
        this.preferredVehicleId = vehicleId;
    }

    @action
    public async getAvailableCars(reset: boolean, userId: string): Promise<boolean> {
        if (reset) {
            this.availableCars.clear();
            return true;
        } else {
            try {
                let cars = await this._vehicleService.getAvailablecars(userId);

                this.availableCars.replace(cars);
            } catch (error) {
                console.log(error);
                return false;
            }

            return true;
        }
    }

    @computed
    public get isAvailableCars(): boolean {
        return !!this.availableCars.length;
    }
    //#endregion

    //#region Repair Operations
    public async handleRepairModal(repair: IRepair, userId: string): Promise<void> {
        if (repair && this.preferredVehicleId) {
            await this._vehicleService.saveRepair(repair, userId, this.preferredVehicleId);
        }
    }

    @action
    public async getRepairsByVehicleId(vehicleId: string, userId: string): Promise<void> {
        let repairs: IRepair[];

        if (vehicleId && userId) {
            repairs = await this._vehicleService.getRepairsByVehicleId(vehicleId, userId);
        }

        this.repairsByVehicleId.replace(repairs);
    }
    //#endregion
}
