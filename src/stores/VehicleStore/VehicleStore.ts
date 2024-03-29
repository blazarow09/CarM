import { observable, action, IObservableArray, computed } from 'mobx';
import { IVehicleViewModel } from '../../models/Vehicle/IVehicleViewModel';
import VehicleService from '../../services/VehicleService';
import { IRepair } from '../../models/Repair/IRepair';
import { IRefuelCreateEdit } from '../../models/Refuel/IRefuelCreateEdit';
import RefuelService from '../../services/RefuelService';
import { IRefuelView } from '../../models/Refuel/IRefuelView';
import RepairService from '../../services/RepairService';

export interface IVehicleStore {
    // Methods
    setUserId(userId: string): void;

    setCurrentSelectedVehicle(vehicleId: string): void;
    setVehicleToEdit(vehicleToEdit: IVehicleViewModel): void;

    // Vehicle
    handleVehicleSave(vehicle: IVehicleViewModel): Promise<void>;
    handleEditVehicle(vehicle: IVehicleViewModel, vehicleId: string): Promise<void>;
    removeVehicle(vehicleId: string): Promise<void>;

    saveLastOdometerForVehicle(odometer: string, lastUpdatedOdometer: string): Promise<void>;
    getLastOdometerForVehicle(): Promise<void>;

    getPreferredVehicleId(userId: string): Promise<void>;
    savePreferredVehicleId(vehicleId: string): Promise<void>;

    getAvailableCars(reset: boolean): Promise<boolean>;

    // Repair
    handleSaveRepair(repair: IRepair, userId: string): Promise<string>;
    getRepairsByVehicleId(reset: boolean, vehicleId: string): Promise<void>;
    getSingleRepairById(repairId: string): Promise<void>;
    setViewRepair(repair: IRepair): void;
    viewRepairData: IRepair;

    //Refuel
    handleSaveRefuel(refuel: IRefuelCreateEdit): Promise<string>;
    getRefuelsByVehicleId(reset: boolean, vehicleId: string): Promise<void>;
    getSingleRefulebById(refuelId: string): Promise<void>;

    setViewRefuel(refuel: IRefuelView): void;
    setRefuelToEdit(reset?: boolean): void;
    handleEditRefuel(refuel: IRefuelCreateEdit, refuelId: string): Promise<void>;
    setLatestRefuelEntry(refuelEntry: IRefuelView): void;
    viewRefuelData: IRefuelView;
    refuelToEdit: IRefuelCreateEdit;
    latestRefuelEntry: IRefuelView;

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
    private _repairService: RepairService;

    //#endregion

    //#region Observables initialization
    @observable public userId: string = '';

    @observable public availableCars: IObservableArray<IVehicleViewModel> = observable([]);
    @observable public vehicleToEdit: IVehicleViewModel = null;
    @observable public preferredVehicleId: string = '';

    @observable public repairsByVehicleId: IObservableArray<IRepair> = observable([]);

    @observable public refuelsByVehicleId: IObservableArray<IRefuelView> = observable([]);
    @observable public viewRefuelData: IRefuelView = null;
    @observable public viewRepairData: IRepair = null;
    @observable public lastOdometer: string = '';
    @observable public refuelToEdit: IRefuelCreateEdit = null;
    @observable public latestRefuelEntry: IRefuelCreateEdit = null;

    //#endregion

    public constructor(vehicleService: VehicleService, refuelService: RefuelService, repairService: RepairService) {
        this._vehicleService = vehicleService;
        this._refuelService = refuelService;
        this._repairService = repairService;
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
    public async saveLastOdometerForVehicle(odometer: string, lastUpdatedOdometer: string): Promise<void> {
        if (this.preferredVehicleId && odometer) {
            await this._vehicleService.saveLastOdometerForVehicle(this.preferredVehicleId, odometer, lastUpdatedOdometer);

            this.lastOdometer = odometer;
        }
    }

    public async handleVehicleSave(vehicle: IVehicleViewModel): Promise<void> {
        if (vehicle) {
            await this._vehicleService.saveVehicle(vehicle);
        }
    }

    public async removeVehicle(vehicleId: string): Promise<void> {
        await this._vehicleService.removeVehicle(vehicleId);
    }

    public async handleEditVehicle(vehicle: IVehicleViewModel, vehicleId: string): Promise<void> {
        if (vehicle) {
            await this._vehicleService.editVehicle(vehicle, vehicleId);
        }
    }

    @action
    public async getPreferredVehicleId(userId: string): Promise<void> {
        if (userId) {
            let preferredVehicleId = await this._vehicleService.getPreferredVehicle();

            this.preferredVehicleId = preferredVehicleId;
        }
    }

    @action
    public async savePreferredVehicleId(vehicleId: string): Promise<void> {
        if (vehicleId) {
            await this._vehicleService.savePreferredVehicle(vehicleId);

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
            let repairId = await this._repairService.saveRepair(repair, this.preferredVehicleId);

            // await this.saveLastOdometerForVehicle(repair.mileage);

            return repairId;
        }
    }

    @action
    public async getRepairsByVehicleId(reset: boolean, vehicleId: string): Promise<void> {
        if (reset) {
            this.repairsByVehicleId.clear();
        } else {
            let repairs: IRepair[];

            if (vehicleId) {
                repairs = await this._repairService.getRepairsByVehicleId(vehicleId);
            }

            this.repairsByVehicleId.replace(repairs);
        }
    }

    @action
    public async getSingleRepairById(repairId: string): Promise<void> {
        if (repairId && this.preferredVehicleId) {
            let repair = await this._repairService.getSingleRepair(this.preferredVehicleId, repairId);

            this.setViewRepair(repair);
        }
    }

    @action
    public setViewRepair(repair: IRepair): void {
        this.viewRepairData = repair;
    }
    //#endregion

    //#region Refuel Operations
    public async handleSaveRefuel(refuel: IRefuelCreateEdit): Promise<string> {
        if (refuel && this.preferredVehicleId) {
            let refuelId = await this._refuelService.saveRefuel(refuel, this.preferredVehicleId);

            return refuelId;
        }
    }

    public async handleEditRefuel(refuel: IRefuelCreateEdit, refuelId: string): Promise<void> {
        if (refuel && this.preferredVehicleId) {
            await this._refuelService.editRefuel(refuel, this.preferredVehicleId, refuelId);

            // return refuelId;
        }
    }

    @action
    public async getRefuelsByVehicleId(reset: boolean, vehicleId: string): Promise<void> {
        if (reset) {
            this.refuelsByVehicleId.clear();
        } else {
            if (vehicleId) {
                let refuels = await this._refuelService.getRefuelsByVehicleId(vehicleId);

                this.refuelsByVehicleId.replace(refuels);

                if (refuels.length > 0) this.setLatestRefuelEntry(refuels[0]);
            }
        }
    }

    @action
    public setLatestRefuelEntry(refuelEntry: IRefuelView): void {
        this.latestRefuelEntry = refuelEntry;
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
