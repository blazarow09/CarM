import * as React from 'react';
import MainHeader from '../MainHeader/MainHeader';
import { GlobalColors } from '../../models/Constants/GlobalColors';
import { IonPage, IonContent, IonButtons, IonBackButton, IonItem, IonIcon, IonRow, IonCol, IonButton } from '@ionic/react';
import { AppRoutes } from '../AppRoutes';
import { IVehicleStore } from '../../stores/VehicleStore/VehicleStore';
import { observer, inject } from 'mobx-react';
import { IUserStore } from '../../stores/UserStore/UserStore';
import odometerIcon from '../../img/icons/odometer-b.svg';
import {
    calendarOutline as dateIcon,
    chevronBackOutline as backIcon,
    chevronForwardOutline as nextIcon,
    locationOutline as locationIcon,
    createOutline as editIcon,
} from 'ionicons/icons';
import './ViewRepair.css';
import dayjs from 'dayjs';
import { DateFormat } from '../../models/Constants/DateFormat';
import { Modals, IUiStore } from '../../stores/UiStore/UiStore';
import LoadingScreen from '../Spinners/LoadingScreen';

interface ViewRepairProps {
    vehicleStore?: IVehicleStore;
    userStore?: IUserStore;
    uiStore?: IUiStore;
}

interface ViewRepairState {
    dataLoading: boolean;
}

@inject('vehicleStore')
@inject('userStore')
@inject('uiStore')
@observer
export default class ViewRepair extends React.Component<ViewRepairProps, ViewRepairState> {
    public async componentDidMount(): Promise<void> {
        this.props.userStore.setHideTabsMenu(true);
    }

    public componentWillUnmount(): void {
        this.props.userStore.setHideTabsMenu(false);

        this.props.vehicleStore.setViewRefuel(null);
    }

    public state: ViewRepairState = {
        dataLoading: false,
    };

    // No need for loading indicator for now.
    private setDataLoading(dataLoading: boolean): void {
        this.setState({
            dataLoading: dataLoading,
        });
    }

    private renderContent(): JSX.Element {
        return this.state.dataLoading ? (
            <LoadingScreen iconColor={GlobalColors.purpleColor} />
        ) : this.props.vehicleStore?.viewRepairData && !this.state.dataLoading ? (
            this.renderRefuelContent()
        ) : (
            <></>
        );
    }

    private renderRefuelContent(): JSX.Element {
        return (
            <>
                <IonItem className="c-item-background-tab" lines="none">
                    <IonRow className="c-date-content">
                        <IonCol size="1" className="c-button-click-effect" ion-align-items-start>
                            <IonIcon icon={backIcon} onClick={() => console.log('previous')} />
                        </IonCol>
                        <IonCol size="10" className="c-date-info">
                            <IonIcon icon={dateIcon} size="small" />
                            <span className="c-date-margin-left">
                                {dayjs(this.props.vehicleStore.viewRepairData?.date).format(DateFormat.defaultDateFormat)}
                            </span>
                        </IonCol>
                        <IonCol size="1" ion-align-items-end className="c-button-click-effect">
                            <IonIcon icon={nextIcon} />
                        </IonCol>
                    </IonRow>
                </IonItem>
                <div className="c-background-tab c-space-between-top">
                    <IonRow className="c-space-left-right">
                        <IonCol size="12">
                            <p className="c-detail-title">Total cost</p>
                            <p className="c-detail-info-color c-no-margin">{this.props.vehicleStore.viewRepairData?.cost} BGN</p>
                        </IonCol>
                    </IonRow>
                    <IonRow className="c-space-left-right">
                        <IonCol size="6">
                            <IonIcon className="c-detail-icon" icon={odometerIcon} />
                            <div className="c-detail-info">{this.props.vehicleStore.viewRepairData?.mileage} km</div>
                        </IonCol>
                        {this.props.vehicleStore?.viewRepairData?.place && this.props.vehicleStore?.viewRepairData?.city && (
                            <IonCol size="6">
                                <IonIcon className="c-detail-icon" icon={locationIcon} />
                                <div className="c-detail-info">{`${this.props.vehicleStore.viewRepairData?.place}, ${this.props.vehicleStore.viewRepairData?.city}`}</div>
                            </IonCol>
                        )}
                    </IonRow>
                </div>
                <div className="c-background-tab c-space-between-top">
                    <IonRow className="c-space-left-right">
                        {/* CR: Add field for this in the create/edit form */}
                        <p className="c-repair-type">{this.props.vehicleStore.viewRepairData?.repair}</p>
                    </IonRow>
                    <IonRow className="c-space-left-right">
                        <IonCol>
                            <p className="c-detail-title c-no-margin">Cost</p>
                            <p className="c-detail-text c-no-margin">{this.props.vehicleStore.viewRepairData?.cost} BGN</p>
                        </IonCol>
                        <IonCol>
                            <p className="c-detail-title c-no-margin">Phone</p>
                            <p className="c-detail-text c-no-margin">{this.props.vehicleStore.viewRepairData?.phone}</p>
                        </IonCol>
                    </IonRow>
                </div>
                {this.props.vehicleStore?.viewRepairData?.note && (
                    <div className="c-background-tab c-space-between-top">
                        <IonRow className="c-space-left-right">
                            <p className="c-repair-type">Notes</p>
                        </IonRow>
                        <IonRow className="c-space-left-right">
                            <p className="c-wrap-text">{this.props.vehicleStore.viewRepairData.note}</p>
                        </IonRow>
                    </div>
                )}
            </>
        );
    }

    public render() {
        return (
            <IonPage>
                <MainHeader toolbarColor={GlobalColors.orangeColor} title="Repair details" extraContent={this.extraContent} />
                <IonContent>{this.renderContent()}</IonContent>
            </IonPage>
        );
    }

    private openRefuelEditMode(): void {
        this.props.vehicleStore.setRefuelToEdit();

        this.props.uiStore.setCreateEditRefuelModalOpen('edit', true);

        this.props.uiStore.openModal(Modals.RefuelModal);
    }

    private extraContent = (): JSX.Element => {
        return (
            <>
                <IonButtons slot="start">
                    <IonBackButton defaultHref={AppRoutes.homeRoute} />
                </IonButtons>
                <IonButtons slot="end">
                    <IonButton onClick={(): void => this.openRefuelEditMode() } disabled>
                        <IonIcon slot="icon-only" icon={editIcon} />
                    </IonButton>
                </IonButtons>
            </>
        );
    };
}
