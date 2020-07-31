import { observable, action } from 'mobx';

export interface IModals {
    // Vehicle
    vehicleModalOpen: boolean;
    createVehicleModalOpen: boolean;
    editVehicleModalOpen: boolean;

    // Repair
    repairModalOpen: boolean;

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

    // Observables
    modals: IModals;

    // Computed
}

export class UiStore implements IUiStore {
    @observable public modals: IModals = {
        vehicleModalOpen: false,
        repairModalOpen: false,
        editVehicleModalOpen: false,
        createVehicleModalOpen: false,
        refuelModalOpen: false,
    };

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
}
