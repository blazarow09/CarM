import * as React from 'react';
import './ServiceEntry.css';
import { IonItem, IonLabel, IonRow, IonCol } from '@ionic/react';
import dayjs from 'dayjs';
import { DateFormat } from '../../models/Constants/DateFormat';
import RefuelIcon from './ServiceIcons/RefuelIcon';
import { IVehicleStore } from '../../stores/VehicleStore/VehicleStore';
import { inject, observer } from 'mobx-react';
import { IRefuelView } from '../../models/Refuel/IRefuelView';
import { AppRoutes } from '../AppRoutes';

interface RepairEntryProps {
    refuelEntry: IRefuelView;
    vehicleStore?: IVehicleStore;
}

@inject('vehicleStore')
@observer
export default class RefuelEntry extends React.Component<RepairEntryProps> {
    public render() {
        return (
            <IonRow>
                <RefuelIcon className="c-refuel" />
                <IonCol size="11">
                    <IonItem
                        className="c-bgr-transparent"
                        routerLink={AppRoutes.viewRefuelScreenRoute}
                        button
                        onClick={(): void => this.props.vehicleStore.setViewRefuel(this.props.refuelEntry)}
                    >
                        <IonRow className="c-entry-details-row">
                            <IonCol size="4">
                                <IonLabel className="c-detail-primary-row">
                                    {dayjs(this.props.refuelEntry.date).format(DateFormat.defaultDateFormat)}
                                </IonLabel>
                                <IonLabel className="c-detail-secondary-row">{`Mil: ${this.props.refuelEntry.mileage}`}</IonLabel>
                            </IonCol>
                            <IonCol size="4">
                                <IonLabel className="c-detail-primary-row">{`${this.props.refuelEntry.quantity} Ltr`}</IonLabel>
                                <IonLabel className="c-detail-secondary-row">{`(+123) km`}</IonLabel>
                            </IonCol>
                            <IonCol size="4">
                                <IonLabel className="c-detail-primary-row">{`${this.props.refuelEntry.totalCost} BGN`}</IonLabel>
                            </IonCol>
                        </IonRow>
                    </IonItem>
                </IonCol>
            </IonRow>
        );
    }
}
