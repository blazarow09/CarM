import * as React from 'react';
import { IonFab, IonFabButton, IonIcon, IonFabList } from '@ionic/react';
import { observer, inject } from 'mobx-react';
import { IUiStore } from '../../stores/UiStore/UiStore';
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
import { AppRoutes } from '../AppRoutes';

interface HomeButtonProps {
    uiStore?: IUiStore;
    vehicleStore?: IVehicleStore;
    hiddenAppTabs: boolean;
}

@inject('uiStore')
@inject('vehicleStore')
@observer
export default class HomeButton extends React.Component<HomeButtonProps> {
    public render() {
        return (
            <IonFab vertical="bottom" horizontal="center" className="c-home-button" hidden={this.props.hiddenAppTabs}>
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
                        routerLink={AppRoutes.repairScreenRoute}
                        disabled={this.props.vehicleStore.currentSelectedVehicleId === '' ? true : false}
                    >
                        <IonIcon icon={repairIcon} />
                    </IonFabButton>
                    {/* Vehicle */}
                    <IonFabButton color="danger" routerLink={AppRoutes.vehicleScreenRoute}>
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
