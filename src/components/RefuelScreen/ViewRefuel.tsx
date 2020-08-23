import * as React from 'react';
import MainHeader from '../MainHeader/MainHeader';
import { GlobalColors } from '../../models/Constants/GlobalColors';
import { IonPage, IonContent, IonButtons, IonBackButton, IonItem, IonLabel, IonIcon, IonRow, IonCol } from '@ionic/react';
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
} from 'ionicons/icons';
import './ViewRefuel.css';
import dayjs from 'dayjs';
import { DateFormat } from '../../models/Constants/DateFormat';

interface ViewRefuelProps {
    vehicleStore?: IVehicleStore;
    userStore?: IUserStore;
}

interface ViewRefuelState {
    dataLoading: boolean;
}

@inject('vehicleStore')
@inject('userStore')
@observer
export default class ViewRefuel extends React.Component<ViewRefuelProps, ViewRefuelState> {
    public async componentDidMount(): Promise<void> {
        this.props.userStore.setHideTabsMenu(true);
    }

    public componentWillUnmount(): void {
        this.props.userStore.setHideTabsMenu(false);

        this.props.vehicleStore.setViewRefuel(null);
    }

    public state: ViewRefuelState = {
        dataLoading: this.props.vehicleStore?.viewRefuelData ? true : false,
    };

    private setDataLoading(dataLoading: boolean): void {
        this.setState({
            dataLoading: dataLoading,
        });
    }

    private renderContent(): JSX.Element {
       return this.renderRefuelContent();

        // return this.state.dataLoading ? (
        //     <LoadingScreen iconColor={GlobalColors.purpleColor} />
        // ) : this.props.vehicleStore?.viewRefuelData ? (
        //     this.renderRefuelContent()
        // ) : (
        //     <></>
        // );
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
                                {dayjs(this.props.vehicleStore.viewRefuelData?.date).format(DateFormat.defaultDateFormat)}
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
                            <p className="c-detail-info-price c-no-margin">{this.props.vehicleStore.viewRefuelData?.totalCost} BGN</p>
                        </IonCol>
                    </IonRow>
                    <IonRow className="c-space-left-right">
                        <IonCol size="6">
                            <IonIcon className="c-detail-icon" icon={odometerIcon} />
                            <div className="c-detail-info">{this.props.vehicleStore.viewRefuelData?.mileage} km</div>
                        </IonCol>
                        {this.props.vehicleStore?.viewRefuelData?.fillingStation && (
                            <IonCol size="6">
                                <IonIcon className="c-detail-icon" icon={locationIcon} />
                                <div className="c-detail-info">{this.props.vehicleStore.viewRefuelData?.fillingStation}</div>
                            </IonCol>
                        )}
                    </IonRow>
                </div>
                <div className="c-background-tab c-space-between-top">
                    <IonRow className="c-space-left-right">
                        {/* CR: Add field for this in the create/edit form */}
                        <p className="c-fuel-type">Diesel</p>
                    </IonRow>
                    <IonRow className="c-space-left-right">
                        <IonCol>
                            <p className="c-detail-title c-no-margin">Price / L</p>
                            <p className="c-refuel-price-qty c-no-margin">{this.props.vehicleStore.viewRefuelData?.pricePerLtr} BGN</p>
                        </IonCol>
                        <IonCol>
                            <p className="c-detail-title c-no-margin">Quantity</p>
                            <p className="c-refuel-price-qty c-no-margin">{this.props.vehicleStore.viewRefuelData?.quantity} L</p>
                        </IonCol>
                    </IonRow>
                </div>
                {this.props.vehicleStore?.viewRefuelData?.notes && (
                    <div className="c-background-tab c-space-between-top">
                        <IonRow className="c-space-left-right">
                            <p className="c-fuel-type">Notes</p>
                        </IonRow>
                        <IonRow className="c-space-left-right">
                            <p className="c-wrap-text">{this.props.vehicleStore.viewRefuelData.notes}</p>
                        </IonRow>
                    </div>
                )}
            </>
        );
    }

    public render() {
        return (
            <IonPage>
                <MainHeader toolbarColor={GlobalColors.purpleColor} title="Refuel details" extraContent={this.extraContent} />
                <IonContent>{this.renderContent()}</IonContent>
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
