export interface IDashboardLabels {
    headerTitle: string;
    homeTabTitle: string;
    moreTabTitle: string;
    preferredVehicleMessage: string;
}

export class DashboardLabels {
    static dashboardLabelsEn: IDashboardLabels = {
        headerTitle: 'Dashboard',
        preferredVehicleMessage: 'Preferred vehicle',
        homeTabTitle: 'Home',
        moreTabTitle: 'More',
    };

    static dashboardLabelsBg: IDashboardLabels = {
        headerTitle: 'Начало',
        preferredVehicleMessage: 'Предпочитено превозно средство',
        homeTabTitle: 'Начало',
        moreTabTitle: 'Още',
    };
}
