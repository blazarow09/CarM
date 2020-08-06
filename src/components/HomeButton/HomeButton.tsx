import * as React from 'react';
import { IonFab, IonFabButton, IonIcon, IonFabList } from '@ionic/react';
import { observer, inject } from 'mobx-react';
import { IUiStore } from '../../stores/UiStore/UiStore';
import { IVehicleStore } from '../../stores/VehicleStore/VehicleStore';
import {
    arrowUpCircleOutline as arrowUpButton,
    carSportOutline as vehicleIcon,
    build as repairIcon,
} from 'ionicons/icons';
import { AppRoutes } from '../AppRoutes';
import { GlobalColors } from '../../models/Constants/GlobalColors';
import refuelIcon from '../../img/icons/refuel-w.svg';
import { IUserStore } from '../../stores/UserStore/UserStore';


interface HomeButtonProps {
    uiStore?: IUiStore;
    userStore?: IUserStore;
    vehicleStore?: IVehicleStore;
    hiddenAppTabs: boolean;
}

@inject('uiStore')
@inject('vehicleStore')
@inject('userStore')
@observer
export default class HomeButton extends React.Component<HomeButtonProps> {
    public render() {
        return (
            <IonFab vertical="bottom" horizontal="center" className={`c-home-button ${this.props.userStore.hideTabsMenu && 'c-tabs-not-visible'}`} hidden={this.props.hiddenAppTabs}>
                {/* Home Button */}
                <IonFabButton color={GlobalColors.defaultColor}>
                    <IonIcon icon={arrowUpButton} />
                </IonFabButton>
                <IonFabList side="top">
                    {/* Vehicle */}
                    <IonFabButton color={GlobalColors.redColor} routerLink={AppRoutes.vehicleScreenRoute}>
                        <IonIcon icon={vehicleIcon} />
                    </IonFabButton>
                </IonFabList>
                <IonFabList side="start">
                    {/* Repair */}
                    <IonFabButton
                        color={GlobalColors.orangeColor}
                        routerLink={AppRoutes.repairScreenRoute}
                        disabled={this.props.vehicleStore.preferredVehicleId === '' ? true : false}
                    >
                        <IonIcon icon={repairIcon} />
                    </IonFabButton>
                    {/* Expense
                    <IonFabButton color="success">
                        <IonIcon icon={expenseIcon} />
                    </IonFabButton>
                    Income
                    <IonFabButton color="success">
                        <IonIcon icon={incomeIcon} />
                    </IonFabButton> */}
                </IonFabList>
                <IonFabList side="end">
                    {/* Refuel */}
                    <IonFabButton
                        color={GlobalColors.purpleColor}
                        routerLink={AppRoutes.refuelScreenRoute}
                        disabled={this.props.vehicleStore.preferredVehicleId === '' ? true : false}
                    >
                        <IonIcon icon={refuelIcon} />
                    </IonFabButton>
                    {/* Route
                    <IonFabButton color="success">
                        <IonIcon icon={routeIcon} />
                    </IonFabButton>
                    Reminder
                    <IonFabButton color="success">
                        <IonIcon icon={reminderIcon} />
                    </IonFabButton> */}
                </IonFabList>
            </IonFab>
        );
    }
}
