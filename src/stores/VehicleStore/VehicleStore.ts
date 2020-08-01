import { observable, action, IObservableArray, computed } from 'mobx';
import { IVehicleViewModel } from '../../models/Vehicle/IVehicleViewModel';
import VehicleService from '../../services/VehicleService';
import { IRepair } from '../../models/Repair/IRepair';
import { IVehicleCreateEdit } from '../../models/Vehicle/IVehicleCreateEdit';
import { IRefuelCreateEdit } from '../../models/Refuel/IRefuelCreateEdit';
import RefuelService from '../../services/RefuelService';
import { IRefuelView } from '../../models/Refuel/IRefuelView';

export interface IVehicleStore {
    // Methods
    setUserId(userId: string): void;

    setCurrentSelectedVehicle(vehicleId: string): void;
    setVehicleToEdit(vehicleToEdit: IVehicleViewModel): void;

    // Vehicle
    handleVehicleSave(vehicle: IVehicleViewModel, userId: string): Promise<void>;
    handleEditVehicle(vehicle: IVehicleViewModel, vehicleId: string, userId: string): Promise<void>;
    removeVehicle(vehicleId: string, userId: string): Promise<void>;

    getPreferredVehicleId(userId: string): Promise<void>;
    savePreferredVehicleId(vehicleId: string, userId: string): Promise<void>;

    getAvailableCars(reset: boolean, userId?: string): Promise<boolean>;

    // Repair
    handleSaveRepair(repair: IRepair, userId: string): Promise<void>;
    getRepairsByVehicleId(reset: boolean, vehicleId: string, userId: string): Promise<void>;

    //Refuel
    handleSaveRefuel(refuel: IRefuelCreateEdit, userId: string): Promise<void>;
    getRefuelsByVehicleId(reset: boolean, userId: string, vehicleId: string): Promise<void>;

    // Observables
    availableCars: IObservableArray<IVehicleViewModel>;
    userId: string;
    vehicleToEdit: IVehicleViewModel;
    repairsByVehicleId: IObservableArray<IRepair>;
    refuelsByVehicleId: IObservableArray<IRefuelView>;

    preferredVehicleId: string;

    // Computed
    isAvailableCars: boolean;
}

export class VehicleStore implements IVehicleStore {
    //#region Services
    private _vehicleService: VehicleService;
    private _refuelService: RefuelService;

    //#endregion

    //#region Observables initialization
    @observable public userId: string = '';

    @observable public availableCars: IObservableArray<IVehicleViewModel> = observable([]);
    @observable public vehicleToEdit: IVehicleViewModel = null;
    @observable public preferredVehicleId: string = '';

    @observable public repairsByVehicleId: IObservableArray<IRepair> = observable([]);

    @observable public refuelsByVehicleId: IObservableArray<IRefuelView> = observable([]);

    //#endregion

    public constructor(vehicleService: VehicleService, refuelService: RefuelService) {
        this._vehicleService = vehicleService;
        this._refuelService = refuelService;
    }

    public setUserId(userId: string): void {
        this.userId = userId;
    }

    //#region Vehicle Operations
    public async handleVehicleSave(vehicle: IVehicleViewModel, userId: string): Promise<void> {
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
    public async handleSaveRepair(repair: IRepair, userId: string): Promise<void> {
        if (repair && this.preferredVehicleId) {
            await this._vehicleService.saveRepair(repair, userId, this.preferredVehicleId);
        }
    }

    @action
    public async getRepairsByVehicleId(reset: boolean, vehicleId: string, userId: string): Promise<void> {
        if (reset) {
            this.repairsByVehicleId.clear();
        } else {
            let repairs: IRepair[];

            if (vehicleId && userId) {
                repairs = await this._vehicleService.getRepairsByVehicleId(vehicleId, userId);
            }

            this.repairsByVehicleId.replace(repairs);
        }
    }
    //#endregion

    //#region Refuel Operations
    public async handleSaveRefuel(refuel: IRefuelCreateEdit, userId: string): Promise<void> {
        if (refuel && this.preferredVehicleId) {
            await this._refuelService.saveRefuel(refuel, userId, this.preferredVehicleId);
        }
    }

    public async getRefuelsByVehicleId(reset: boolean, userId: string, vehicleId: string): Promise<void> {
        if (reset) {
            this.refuelsByVehicleId.clear();
        } else {
            if (userId && vehicleId) {
                let refuels = await this._refuelService.getIRefuelsByVehicleId(vehicleId, userId);

                this.refuelsByVehicleId.replace(refuels);
            }
        }
    }
    //#endregion
}
