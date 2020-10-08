import { observable, action } from 'mobx';
import { GlobalColors } from '../../models/Constants/GlobalColors';

export interface IModals {
    // Vehicle
    vehicleModalOpen: boolean;
    createVehicleModalOpen: boolean;
    editVehicleModalOpen: boolean;

    // Repair
    repairModalOpen: boolean;
    createRefuelModalOpen: boolean;
    editRefuelModalOpen: boolean;

    // Refuel
    refuelModalOpen: boolean;
}

export enum Modals {
    VehicleModal,
    RepairModal,
    RefuelModal,
}

export interface IUiStore {
    // Methods
    openModal(modal: Modals): void;
    closeAllModals(): void;
    setCreateEditVehicleModalOpen(createOrEdit: 'create' | 'edit', status: boolean): void;

    setCreateEditRefuelModalOpen(createOrEdit: 'create' | 'edit' | 'both', status?: boolean): void;

    // Observables
    modals: IModals;

    // Notification
    showHideNotification(status: boolean, message?: string, duration?: number, color?: string): void;
    notificationMessage: string;
    notificationOpen: boolean;
    notificationDuration: number;
    notificationColor: string;
    // Computed
}

export class UiStore implements IUiStore {
    @observable public modals: IModals = {
        // Repair
        repairModalOpen: false,
        // Vehicle
        vehicleModalOpen: false,
        editVehicleModalOpen: false,
        createVehicleModalOpen: false,
        // Refuel
        refuelModalOpen: false,
        createRefuelModalOpen: false,
        editRefuelModalOpen: false,
    };

    // Notification
    @observable public notificationMessage: string = '';
    @observable public notificationColor: string = GlobalColors.defaultColor;
    @observable public notificationOpen: boolean = false;
    @observable public notificationDuration: number = 10000;

    public showHideNotification(status: boolean, message?: string, duration?: number, color?: string): void {
        if (!status) this.notificationOpen = status;

        if (status) {
            this.notificationMessage = message;

            if (duration) this.notificationDuration = duration;
            if (color) this.notificationColor = color;

            this.notificationOpen = status;
        } else {
            this.notificationMessage = '';
            this.notificationDuration = 10000;
            this.notificationColor = GlobalColors.defaultColor;
        }
    }

    @action.bound
    public openModal(modal: Modals): void {
        this.closeAllModals();

        switch (modal) {
            case Modals.VehicleModal:
                this.modals.vehicleModalOpen = true;
                break;
            case Modals.RepairModal:
                this.modals.repairModalOpen = true;
                break;
            case Modals.RefuelModal:
                this.modals.refuelModalOpen = true;
                break;
            default:
                break;
        }
    }

    @action
    public closeAllModals(): void {
        this.modals.vehicleModalOpen && (this.modals.vehicleModalOpen = false);
        this.modals.repairModalOpen && (this.modals.repairModalOpen = false);
        this.modals.refuelModalOpen && (this.modals.refuelModalOpen = false);
    }

    @action
    public setCreateEditVehicleModalOpen(createOrEdit: 'create' | 'edit', status: boolean): void {
        if (createOrEdit === 'create') {
            this.modals.createVehicleModalOpen = status;
            this.modals.editVehicleModalOpen = !status;
        } else if (createOrEdit === 'edit') {
            this.modals.editVehicleModalOpen = status;
            this.modals.createVehicleModalOpen = !status;
        }
    }

    @action
    public setCreateEditRefuelModalOpen(createOrEdit: 'create' | 'edit' | 'both', status?: boolean): void {
        if (createOrEdit === 'create') {
            this.modals.createRefuelModalOpen = status;
            this.modals.editRefuelModalOpen = !status;
        } else if (createOrEdit === 'edit') {
            this.modals.editRefuelModalOpen = status;
            this.modals.createRefuelModalOpen = !status;
        } else if (createOrEdit === 'both') {
            this.modals.editRefuelModalOpen = false;
            this.modals.createRefuelModalOpen = false;
        }
    }
}
