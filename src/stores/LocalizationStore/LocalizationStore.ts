import { observable, action } from 'mobx';
import { VehicleLabels, IVehicleLabels } from '../../resources/VehicleLabels/VehicleLabels';
import { DashboardLabels, IDashboardLabels } from '../../resources/DashboardLabels/DashboardLabels';
import { GeneralLabels, IGeneralLabels } from '../../resources/GeneralLabels/GeneralLabels';

export interface ILocalizationStore {
    populateLabelStore(cultureInfo: string): void;

    vehicleLabels: IVehicleLabels;
    dashboardLabels: IDashboardLabels;
    generalLabels: IGeneralLabels;
}

export default class LocalizationStore implements ILocalizationStore {
    @observable public vehicleLabels: IVehicleLabels;
    @observable public dashboardLabels: IDashboardLabels;
    @observable public generalLabels: IGeneralLabels;

    @action
    public populateLabelStore(cultureInfo: string): void {
        if (cultureInfo) {
            switch (cultureInfo) {
                case 'EN':
                    this.dashboardLabels = DashboardLabels.dashboardLabelsEn;
                    this.vehicleLabels = VehicleLabels.vehicleLabelsEn;
                    this.generalLabels = GeneralLabels.generalLabelsEn;
                    break;
                case 'BG':
                    this.dashboardLabels = DashboardLabels.dashboardLabelsBg;
                    this.vehicleLabels = VehicleLabels.vehicleLabelsBg;
                    this.generalLabels = GeneralLabels.generalLabelsBg;
                    break;
            }
        }
    }
}
