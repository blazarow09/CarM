import * as React from 'react';
import './RepairEntry.css';
import { IonItem, IonLabel, IonIcon, IonRow, IonCol } from '@ionic/react';
import { build as repairIcon } from 'ionicons/icons';
import dayjs from 'dayjs';
import { GlobalConstants } from '../../models/Constants/GlobalConstants';
import { IRepair } from '../../models/Repair/IRepair';

interface RepairEntryProps {
    repairEntry: IRepair;
}

export default class RepairEntry extends React.Component<RepairEntryProps> {
    public render() {
        return (
            <IonRow>
                <IonCol size="1">
                    <div className="c-entry-thumbnail c-repair">
                        <IonIcon className="c-entry-icon" icon={repairIcon} />
                    </div>
                </IonCol>
                <IonCol size="11">
                    <IonItem className="c-bgr-transparent">
                        <IonRow className="c-entry-details-row">
                            <IonCol size="4">
                                <IonLabel className="c-detail-primary-row">
                                    {dayjs(this.props.repairEntry.date).format(GlobalConstants.defaultDateFormat)}
                                </IonLabel>
                                <IonLabel className="c-detail-secondary-row">{`Mil: ${this.props.repairEntry.mileage}`}</IonLabel>
                            </IonCol>
                            <IonCol size="4">
                                <IonLabel className="c-detail-primary-row">{this.props.repairEntry.repair}</IonLabel>
                                <IonLabel className="c-detail-secondary-row">{this.props.repairEntry.place}</IonLabel>
                            </IonCol>
                            <IonCol size="4">
                                <IonLabel className="c-detail-primary-row">{`${this.props.repairEntry.cost} BGN`}</IonLabel>
                            </IonCol>
                        </IonRow>
                    </IonItem>
                </IonCol>
            </IonRow>
        );
    }
}
