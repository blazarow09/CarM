import * as React from 'react';
import MainHeader from '../MainHeader/MainHeader';
import { GlobalColors } from '../../models/Constants/GlobalColors';
import { IonPage, IonContent, IonButtons, IonBackButton, IonItem, IonLabel } from '@ionic/react';
import { AppRoutes } from '../AppRoutes';
import { IVehicleStore } from '../../stores/VehicleStore/VehicleStore';
import { observer, inject } from 'mobx-react';

interface ViewRefuelProps {
    vehicleStore?: IVehicleStore;
}

@inject('vehicleStore')
@observer
export default class ViewRefuel extends React.Component<ViewRefuelProps> {
    public render() {
        return (
            <IonPage>
                <MainHeader toolbarColor={GlobalColors.purpleColor} title="Refuel details" extraContent={this.extraContent} />
                <IonContent>
                    <IonItem>
                        <IonLabel>{this.props?.vehicleStore.viewRefuelData?.totalCost}</IonLabel>
                        <IonLabel>{this.props?.vehicleStore.viewRefuelData?.quantity}</IonLabel>
                        <IonLabel>{this.props?.vehicleStore.viewRefuelData?.pricePerLtr}</IonLabel>
                        <IonLabel>{this.props?.vehicleStore.viewRefuelData?.mileage}</IonLabel>
                    </IonItem>
                </IonContent>
            </IonPage>
        );
    }

    private extraContent = (): JSX.Element => {
        return (
            <IonButtons slot="start">
                <IonBackButton defaultHref={AppRoutes.homeRoute} />
            </IonButtons>
        );
    };
}
