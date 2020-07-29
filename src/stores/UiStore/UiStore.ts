import { observable, action } from 'mobx';

export interface IModals {
    addCarModal: boolean;
    addRepairModal: boolean;
    createVehicleModalOpen: boolean;
    editVehicleModalOpen: boolean;
}

export enum Modals {
    AddVehicleModal,
    AddRepairModal,
}

export interface IUiStore {
    // Methods
    openCloseModal(modal: Modals): void;
    closeAllModals(): void;
    setCreateEditVehicleModalOpen(createOrEdit: 'create' | 'edit', status: boolean): void;

    // Observables
    modals: IModals;

    // Computed
}

export class UiStore implements IUiStore {
    @observable public modals: IModals = {
        addCarModal: false,
        addRepairModal: false,
        editVehicleModalOpen: false,
        createVehicleModalOpen: false,
    };

    @action.bound
    public openCloseModal(modal: Modals): void {
        this.closeAllModals();

        switch (modal) {
            case Modals.AddVehicleModal:
                this.modals.addCarModal = true;
                break;
            case Modals.AddRepairModal:
                this.modals.addRepairModal = true;
                break;

            default:
                break;
        }
    }

    @action
    public closeAllModals(): void {
        this.modals.addCarModal && (this.modals.addCarModal = false);
        this.modals.addRepairModal && (this.modals.addRepairModal = false);
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
