export interface IVehicleLabels {
    headerTitle: string;
    preferredVehicleUpdateMessage: string;
    areYouSureDelete: string;
    confirmDelete: string;
    cancelDelete: string;
}

export class VehicleLabels {
    static vehicleLabelsEn: IVehicleLabels = {
        headerTitle: 'Vehicles',
        preferredVehicleUpdateMessage: 'Your preferred vehicle is updated.',
        areYouSureDelete: 'Are you sure you want to delete this vehicle?',
        cancelDelete: 'Cancel',
        confirmDelete: "Confirm"
    };

    static vehicleLabelsBg: IVehicleLabels = {
        headerTitle: 'Превозни средства',
        preferredVehicleUpdateMessage: 'Вашето предпочитено превозно средство е променено.',
        areYouSureDelete: 'Сигурни ли сте, че искате да премахнете това превозно средство?',
        cancelDelete: 'Откажи',
        confirmDelete: "Премахни"
    };
}
