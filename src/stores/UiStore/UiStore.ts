import { observable, action } from 'mobx';

export interface IModals {
    addCarModal: boolean;
}

export enum Modals {
    AddCarModal,
}

export interface IUiStore {
    // Methods
    openCloseModal(modal: Modals, action: 'open' | 'close'): void;

    // Observables
    modals: IModals;

    // Computed
}

export class UiStore implements IUiStore {
    //#region Services
    // private _carService: CarService;

    //#endregion

    //#region Observables initialization
    // @observable public availableCars: IObservableArray<ICar> = observable([]);

    //#endregion

    // public constructor(carService: CarService) {
    //     this._carService = carService;
    // }

    @observable public modals: IModals = {
        addCarModal: false,
    };

    @action.bound
    public openCloseModal(modal: Modals, action: 'open' | 'close'): void {
        let boolAction: boolean;
        if (action == 'open') {
            boolAction = true;
        } else {
            boolAction = false;
        }

        switch (modal) {
            case Modals.AddCarModal:
                this.modals.addCarModal = boolAction;
                break;
            default:
                break;
        }
    }
}
