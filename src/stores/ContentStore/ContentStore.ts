import { observable, action, IObservableArray, computed } from 'mobx';
import { ICar } from '../../models/Car/ICar';
import CarService from '../../services/CarService';

export interface IContentStore {
    // Methods
    getAvailableCars(reset: boolean, userId?: string): Promise<void>;

    // Observables
    availableCars: IObservableArray<ICar>;

    // Computed
    isAvailableCars: boolean;
}

export class ContentStore implements IContentStore {
    //#region Services
    private _carService: CarService;

    //#endregion

    //#region Observables initialization
    @observable public availableCars: IObservableArray<ICar> = observable([]);

    //#endregion

    public constructor(carService: CarService) {
        this._carService = carService;
    }

    @action
    public async getAvailableCars(reset: boolean, userId: string): Promise<void> {
        if (reset) {
            this.availableCars.clear();
        } else {
            let cars = await this._carService.getAvailablecars(userId);

            this.availableCars.replace(cars);
        }
    }

    @computed
    public get isAvailableCars(): boolean {
        return !!this.availableCars.length;
    }
}
