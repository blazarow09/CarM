import * as React from 'react';
import { IonRow, IonCol, IonIcon, IonItem, IonLabel } from '@ionic/react';
import dayjs from 'dayjs';
import { GlobalConstants } from '../../models/Constants/GlobalConstants';
import IHistoryEntry from '../../models/History/IHistoryEntry';
import RefuelIcon from './ServiceIcons/RefuelIcon';
import odometerIcon from '../../img/icons/odometer-b.svg';
import './HistoryEntry.css';
import RepairIcon from './ServiceIcons/RepairIcon';

interface HistoryEntryProps {
    historyEntry: IHistoryEntry;
}

export default class HistoryEntry extends React.Component<HistoryEntryProps> {
    public render() {
        return (
            <IonRow>
                {this.getEntryIcon(this.props.historyEntry.type)}
                <IonCol size="11">
                    <IonItem lines="none" button className="c-bgr-transparent c-no-ripple">
                        <IonRow className="c-entry-details-row">
                            <IonCol size="8">
                                <IonLabel className="c-detail-primary-row c-title">{this.props.historyEntry.title}</IonLabel>
                                <IonRow>
                                    <IonIcon className="c-mileage-icon" icon={odometerIcon} />
                                    <IonLabel className="c-detail-secondary-row">{`${this.props.historyEntry.mileage} km`}</IonLabel>
                                </IonRow>
                            </IonCol>
                            <IonCol size="4">
                                <IonLabel className="c-detail-primary-row-end">{`${this.props.historyEntry.cost} BGN`}</IonLabel>
                                <IonLabel className="c-detail-secondary-row-end">
                                    {dayjs(this.props.historyEntry.date).format(GlobalConstants.defaultDateFormatWithoutYear)}
                                </IonLabel>
                            </IonCol>
                        </IonRow>
                    </IonItem>
                </IonCol>
            </IonRow>
        );
    }

    private getEntryIcon(entryType: string): JSX.Element {
        switch (entryType) {
            case 'refuel':
                return <RefuelIcon className="c-refuel" />;
            case 'repair':
                return <RepairIcon className="c-repair"/>;
            default:
                return <></>;
        }
    }
}
