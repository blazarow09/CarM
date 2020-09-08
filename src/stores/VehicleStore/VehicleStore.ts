import { observable, action, IObservableArray, computed } from 'mobx';
import { IVehicleViewModel } from '../../models/Vehicle/IVehicleViewModel';
import VehicleService from '../../services/VehicleService';
import { IRepair } from '../../models/Repair/IRepair';
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

    saveLastOdometerForVehicle(odometer: number): Promise<void>;
    getLastOdometerForVehicle(): Promise<void>;

    getPreferredVehicleId(userId: string): Promise<void>;
    savePreferredVehicleId(vehicleId: string, userId: string): Promise<void>;

    getAvailableCars(reset: boolean): Promise<boolean>;

    // Repair
    handleSaveRepair(repair: IRepair, userId: string): Promise<string>;
    getRepairsByVehicleId(reset: boolean, vehicleId: string, userId: string): Promise<void>;

    //Refuel
    handleSaveRefuel(refuel: IRefuelCreateEdit): Promise<string>;
    getRefuelsByVehicleId(reset: boolean, vehicleId: string): Promise<void>;
    getSingleRefulebById(refuelId: string): Promise<void>;

    setViewRefuel(refuel: IRefuelView): void;
    viewRefuelData: IRefuelView;
    setRefuelToEdit(reset?: boolean): void;
    handleEditRefuel(refuel: IRefuelCreateEdit, refuelId: string): Promise<void>;
    refuelToEdit: IRefuelCreateEdit;

    // Observables
    availableCars: IObservableArray<IVehicleViewModel>;
    userId: string;
    vehicleToEdit: IVehicleViewModel;
    repairsByVehicleId: IObservableArray<IRepair>;
    refuelsByVehicleId: IObservableArray<IRefuelView>;

    preferredVehicleId: string;
    lastOdometer: string;

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
    @observable public viewRefuelData: IRefuelView = null;
    @observable public lastOdometer: string = '';
    @observable public refuelToEdit: IRefuelCreateEdit = null;

    //#endregion

    public constructor(vehicleService: VehicleService, refuelService: RefuelService) {
        this._vehicleService = vehicleService;
        this._refuelService = refuelService;
    }

    public setUserId(userId: string): void {
        this.userId = userId;
    }

    //#region Vehicle Operations
    @action
    public async getLastOdometerForVehicle(): Promise<void> {
        if (this.preferredVehicleId) {
            let lastOdometer = await this._vehicleService.getLastOdometerForVehicle(this.preferredVehicleId);

            if (lastOdometer) {
                this.lastOdometer = lastOdometer;
            }
        }
    }

    @action
    public async saveLastOdometerForVehicle(odometer: number): Promise<void> {
        if (this.preferredVehicleId && odometer) {
            await this._vehicleService.saveLastOdometerForVehicle(this.preferredVehicleId, odometer);

            this.lastOdometer = this.lastOdometer;
        }
    }

    public async handleVehicleSave(vehicle: IVehicleViewModel, userId: string): Promise<void> {
        if (vehicle) {
            await this._vehicleService.saveVehicle(vehicle, userId);

            // await this.saveLastOdometerForVehicle(vehicle.mileage);
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
    public async getAvailableCars(reset: boolean): Promise<boolean> {
        if (reset) {
            this.availableCars.clear();
            return true;
        } else {
            try {
                let cars = await this._vehicleService.getAvailablecars();

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
    public async handleSaveRepair(repair: IRepair, userId: string): Promise<string> {
        if (repair && this.preferredVehicleId) {
            let repairId = await this._vehicleService.saveRepair(repair, userId, this.preferredVehicleId);

            // await this.saveLastOdometerForVehicle(repair.mileage);

            return repairId;
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
    public async handleSaveRefuel(refuel: IRefuelCreateEdit): Promise<string> {
        if (refuel && this.preferredVehicleId) {
            let refuelId = await this._refuelService.saveRefuel(refuel, this.preferredVehicleId);

            // await this.saveLastOdometerForVehicle(refuel.mileage);

            return refuelId;
        }
    }

    public async handleEditRefuel(refuel: IRefuelCreateEdit, refuelId: string): Promise<void> {
        if (refuel && this.preferredVehicleId) {
            await this._refuelService.editRefuel(refuel, this.preferredVehicleId, refuelId);

            // await this.saveLastOdometerForVehicle(refuel.mileage);

            // return refuelId;
        }
    }

    public async getRefuelsByVehicleId(reset: boolean, vehicleId: string): Promise<void> {
        if (reset) {
            this.refuelsByVehicleId.clear();
        } else {
            if (vehicleId) {
                let refuels = await this._refuelService.getRefuelsByVehicleId(vehicleId);

                this.refuelsByVehicleId.replace(refuels);
            }
        }
    }

    @action
    public async getSingleRefulebById(refuelId: string): Promise<void> {
        if (refuelId && this.preferredVehicleId) {
            let refuel = await this._refuelService.getSingleRefuel(this.preferredVehicleId, refuelId);

            this.setViewRefuel(refuel);
        }
    }

    @action
    public setRefuelToEdit(reset?: boolean): void {
        if (reset) {
            this.refuelToEdit = null;
        } else if (this.viewRefuelData) this.refuelToEdit = this.viewRefuelData;
    }

    @action
    public setViewRefuel(refuel: IRefuelView): void {
        this.viewRefuelData = refuel;
    }
    //#endregion
}
