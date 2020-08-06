import * as React from 'react';
import './ServiceEntry.css';
import { IonItem, IonLabel, IonRow, IonCol } from '@ionic/react';
// import { colorFillOutline as refuelIcon } from 'ionicons/icons';
import dayjs from 'dayjs';
import { DateFormat } from '../../models/Constants/DateFormat';
import { IRefuelView } from '../../models/Refuel/IRefuelView';
import RefuelIcon from './ServiceIcons/RefuelIcon';

interface RepairEntryProps {
    refuelEntry: IRefuelView;
}

export default class RefuelEntry extends React.Component<RepairEntryProps> {
    public render() {
        return (
            <IonRow>
                <RefuelIcon className="c-refuel"/>
                <IonCol size="11">
                    <IonItem className="c-bgr-transparent">
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
