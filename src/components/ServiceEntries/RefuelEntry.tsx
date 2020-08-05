import * as React from 'react';
import './ServiceEntry.css';
import { IonItem, IonLabel, IonIcon, IonRow, IonCol } from '@ionic/react';
// import { colorFillOutline as refuelIcon } from 'ionicons/icons';
import dayjs from 'dayjs';
import { GlobalConstants } from '../../models/Constants/GlobalConstants';
import { IRefuelView } from '../../models/Refuel/IRefuelView';
import refuelIcon from '../../img/icons/refuel.svg';

interface RepairEntryProps {
    refuelEntry: IRefuelView;
}

export default class RefuelEntry extends React.Component<RepairEntryProps> {
    public render() {
        return (
            <IonRow>
                <IonCol size="1">
                    <div className="c-entry-thumbnail c-refuel">
                        <IonIcon color="white" className="c-entry-icon" icon={refuelIcon} />
                    </div>
                </IonCol>
                <IonCol size="11">
                    <IonItem className="c-bgr-transparent">
                        <IonRow className="c-entry-details-row">
                            <IonCol size="4">
                                <IonLabel className="c-detail-primary-row">
                                    {dayjs(this.props.refuelEntry.date).format(GlobalConstants.defaultDateFormat)}
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
