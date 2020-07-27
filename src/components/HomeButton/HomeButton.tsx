import * as React from 'react';
import { IonFab, IonFabButton, IonIcon, IonFabList, IonLabel } from '@ionic/react';
import { observer, inject } from 'mobx-react';
import { IUiStore, Modals } from '../../stores/UiStore/UiStore';
import { arrowUpCircleOutline as arrowUpButton, carSportOutline as vehicleIcon, build as repairIcon } from 'ionicons/icons';
import { IVehicleStore } from '../../stores/VehicleStore/VehicleStore';

interface HomeButtonProps {
    uiStore?: IUiStore;
    vehicleStore?: IVehicleStore;
}

@inject('uiStore')
@inject('vehicleStore')
@observer
export default class HomeButton extends React.Component<HomeButtonProps> {
    public render() {
        return (
            <IonFab vertical="bottom" horizontal="center" className="c-home-button">
                <IonFabButton color="primary">
                    <IonIcon icon={arrowUpButton} />
                </IonFabButton>
                <IonFabList side="top">
                    <IonLabel>Vehicle</IonLabel>
                    <IonFabButton color="secondary" onClick={(): void => this.props.uiStore.openCloseModal(Modals.AddCarModal, 'open')}>
                        <IonIcon icon={vehicleIcon} />
                    </IonFabButton>
                    <IonLabel>Repair</IonLabel>
                    <IonFabButton
                        color="secondary"
                        onClick={(): void => this.props.uiStore.openCloseModal(Modals.AddRepairModal, 'open')}
                        disabled={this.props.vehicleStore.currentSelectedVehicleId === '' ? true : false}
                    >
                        <IonIcon icon={repairIcon} />
                    </IonFabButton>
                </IonFabList>
            </IonFab>
        );
    }
}
