import * as React from 'react';
import { IonFab, IonFabButton, IonIcon, IonFabList, IonLabel, IonItem, IonRow, IonCol } from '@ionic/react';
import { observer, inject } from 'mobx-react';
import { IUiStore, Modals } from '../../stores/UiStore/UiStore';
import { IVehicleStore } from '../../stores/VehicleStore/VehicleStore';
import {
    arrowUpCircleOutline as arrowUpButton,
    carSportOutline as vehicleIcon,
    build as repairIcon,
    walletOutline as expenseIcon,
    compassOutline as routeIcon,
    alarmOutline as reminderIcon,
    cardOutline as incomeIcon,
    colorFillOutline as refuelIcon,
} from 'ionicons/icons';

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
                {/* Home Button */}
                <IonFabButton color="primary">
                    <IonIcon icon={arrowUpButton} />
                </IonFabButton>
                <IonFabList side="top">
                    {/* Refuel */}
                    <IonFabButton color="medium">
                        <IonIcon icon={refuelIcon} />
                    </IonFabButton>
                    {/* Repair */}
                    <IonFabButton
                        color="warning"
                        onClick={(): void => this.props.uiStore.openCloseModal(Modals.AddRepairModal, 'open')}
                        disabled={this.props.vehicleStore.currentSelectedVehicleId === '' ? true : false}
                    >
                        <IonIcon icon={repairIcon} />
                    </IonFabButton>
                    {/* Vehicle */}
                    <IonFabButton color="danger" onClick={(): void => this.props.uiStore.openCloseModal(Modals.AddCarModal, 'open')}>
                        <IonIcon icon={vehicleIcon} />
                    </IonFabButton>
                </IonFabList>
                <IonFabList side="start">
                    {/* Expense */}
                    <IonFabButton color="success">
                        <IonIcon icon={expenseIcon} />
                    </IonFabButton>
                    {/* Income */}
                    <IonFabButton color="success">
                        <IonIcon icon={incomeIcon} />
                    </IonFabButton>
                </IonFabList>
                <IonFabList side="end">
                    {/* Route */}
                    <IonFabButton color="success">
                        <IonIcon icon={routeIcon} />
                    </IonFabButton>
                    {/* Reminder */}
                    <IonFabButton color="success">
                        <IonIcon icon={reminderIcon} />
                    </IonFabButton>
                </IonFabList>
            </IonFab>
        );
    }
}

{
    /* <IonFab vertical="bottom" horizontal="center" className="c-home-button">
                <IonFabButton color="primary">
                    <IonIcon icon={arrowUpButton} />
                </IonFabButton>
                <IonFabList side="top">
                    <IonLabel>Vehicle</IonLabel>
                    <IonFabButton color="danger" onClick={(): void => this.props.uiStore.openCloseModal(Modals.AddCarModal, 'open')}>
                        <IonIcon icon={vehicleIcon} />
                    </IonFabButton>
                    <IonLabel>Repair</IonLabel>
                    <IonFabButton
                        color="warning"
                        onClick={(): void => this.props.uiStore.openCloseModal(Modals.AddRepairModal, 'open')}
                        disabled={this.props.vehicleStore.currentSelectedVehicleId === '' ? true : false}
                    >
                        <IonIcon icon={repairIcon} />
                    </IonFabButton>
                    <IonLabel>Expense</IonLabel>
                    <IonFabButton
                        color="success"
                        // onClick={(): void => this.props.uiStore.openCloseModal(Modals.AddRepairModal, 'open')}
                        // disabled={this.props.vehicleStore.currentSelectedVehicleId === '' ? true : false}
                    >
                        <IonIcon icon={expenseIcon} />
                    </IonFabButton>
                </IonFabList>
            </IonFab> */
}
