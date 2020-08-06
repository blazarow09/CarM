import * as React from 'react';
import { IonRow, IonCol, IonIcon, IonItem, IonLabel } from '@ionic/react';
import dayjs from 'dayjs';
import IHistoryEntry from '../../models/History/IHistoryEntry';
import RefuelIcon from './ServiceIcons/RefuelIcon';
import odometerIcon from '../../img/icons/odometer-b.svg';
import './HistoryEntry.css';
import RepairIcon from './ServiceIcons/RepairIcon';
import { DateFormat } from '../../models/Constants/DateFormat';
import { IVehicleStore } from '../../stores/VehicleStore/VehicleStore';
import { observer, inject } from 'mobx-react';
import { AppRoutes } from '../AppRoutes';
import { promises } from 'dns';

interface HistoryEntryProps {
    vehicleStore?: IVehicleStore;
    historyEntry: IHistoryEntry;
}

interface HistoryEntryState {
    routerLink: string;
}

@inject('vehicleStore')
@observer
export default class HistoryEntry extends React.Component<HistoryEntryProps, HistoryEntryState> {
    public state: HistoryEntryState = {
        routerLink: '',
    };

    public render() {
        return (
            <IonRow>
                {this.getEntryIcon(this.props.historyEntry.type)}
                <IonCol size="11">
                    <IonItem
                        className="c-bgr-transparent c-no-ripple"
                        button
                        routerLink={this.getRoute()}
                        onClick={async (): Promise<void> => await this.getDetailsForEntry()}
                    >
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
                                    {dayjs(this.props.historyEntry.date).format(DateFormat.defaultDateFormatWithoutYear)}
                                </IonLabel>
                            </IonCol>
                        </IonRow>
                    </IonItem>
                </IonCol>
            </IonRow>
        );
    }

    private getRoute(): string {
        switch (this.props.historyEntry.type) {
            case 'refuel':
                return AppRoutes.viewRefuelScreenRoute;
        }
    }

    private async getDetailsForEntry(): Promise<void> {
        switch (this.props.historyEntry?.type) {
            case 'refuel':
                await this.props.vehicleStore.getSingleRefulebById(this.props.historyEntry.referenceId);

                this.setState({
                    routerLink: AppRoutes.viewRefuelScreenRoute,
                });
            case 'repair':
                break;
        }
    }

    private getEntryIcon(entryType: string): JSX.Element {
        switch (entryType) {
            case 'refuel':
                return <RefuelIcon className="c-refuel" />;
            case 'repair':
                return <RepairIcon className="c-repair" />;
            default:
                return <></>;
        }
    }
}
