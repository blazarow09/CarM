import { observable, action } from 'mobx';

export interface IModals {
    addCarModal: boolean;
    addRepairModal: boolean;
}

export enum Modals {
    AddCarModal,
    AddRepairModal,
}

export interface IUiStore {
    // Methods
    openCloseModal(modal: Modals, action: 'open' | 'close'): void;

    // Observables
    modals: IModals;

    // Computed
}

export class UiStore implements IUiStore {
    @observable public modals: IModals = {
        addCarModal: false,
        addRepairModal: false,
    };

    @action.bound
    public openCloseModal(modal: Modals, action: 'open' | 'close'): void {
        let boolAction: boolean;
        if (action === 'open') {
            boolAction = true;
        } else {
            boolAction = false;
        }

        switch (modal) {
            case Modals.AddCarModal:
                this.modals.addCarModal = boolAction;
                break;
            case Modals.AddRepairModal:
                this.modals.addRepairModal = boolAction;
                break;

            default:
                break;
        }
    }
}
