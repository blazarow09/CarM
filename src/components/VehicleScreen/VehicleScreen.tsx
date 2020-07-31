import * as React from 'react';
import {
    IonPage,
    IonContent,
    IonFabButton,
    IonIcon,
    IonFab,
    IonBackButton,
    IonButtons,
    IonItem,
    IonLabel,
    IonImg,
    IonRow,
    IonCheckbox,
    IonFabList,
    IonAlert,
    IonToast,
} from '@ionic/react';
import MainHeader from '../MainHeader/MainHeader';
import {
    addOutline as addIcon,
    eyeOutline as viewIcon,
    trashOutline as removeIcon,
    ellipsisVerticalOutline as moreIcon,
    pencilOutline as editIcon,
} from 'ionicons/icons';
import { IUserStore } from '../../stores/UserStore/UserStore';
import { observer, inject } from 'mobx-react';
import { IUiStore, Modals } from '../../stores/UiStore/UiStore';
import defaultCarImg from '../../img/default-car.png';
import './VehicleScreen.css';
import { IVehicleStore } from '../../stores/VehicleStore/VehicleStore';
import { MainSpinner } from '../Spinners/Spinners';
import { AppRoutes } from '../AppRoutes';
import { IVehicleViewModel } from '../../models/Vehicle/IVehicleViewModel';
import NoResultsScreen from '../NoResultsScreen/NoResultsScreen';
import VehicleService from '../../services/VehicleService';

interface VehicleScreenProps {
    userStore?: IUserStore;
    uiStore?: IUiStore;
    vehicleStore?: IVehicleStore;
}

interface VehicleScreenState {
    loading: boolean;
    openAlert: boolean;
    vehicleId: string;
    showPreferredSaveSucces: boolean;
}

@inject('userStore')
@inject('uiStore')
@inject('vehicleStore')
@observer
export default class VehicleScreen extends React.Component<VehicleScreenProps> {
    public async componentDidMount(): Promise<void> {
        this.props.userStore.setHideTabsMenu(true);

        this.setLoading(true);

        let loaded = await this.props.vehicleStore.getAvailableCars(false, this.props.userStore.userContext.userId);

        // if (!loaded) {
        //     // show empty screen and stop loading
        //     this.setLoading(loaded);
        // } else {
        //     this.setLoading(!loaded);
        // }
    }

    public componentWillUnmount(): void {
        this.props.userStore.setHideTabsMenu(false);
    }

    public state: VehicleScreenState = {
        loading: false,
        openAlert: false,
        vehicleId: '',
        showPreferredSaveSucces: false,
    };

    private setLoading(loading: boolean): void {
        this.setState({
            loading: loading,
        });
    }

    private async removeVehicle(): Promise<void> {
        if (this.state.vehicleId) {
            await this.props.vehicleStore.removeVehicle(this.state.vehicleId, this.props.userStore?.userContext?.userId);
        }
    }

    private async setOpenAlert(open: boolean, vehicleId: string): Promise<void> {
        this.setState({
            vehicleId: vehicleId,
            openAlert: open,
        });

        await this.removeVehicle();

        await this.props.vehicleStore.getAvailableCars(false, this.props.userStore.userContext.userId);
    }

    private openEditVehicleView(vehicle: IVehicleViewModel): void {
        if (vehicle) {
            this.props.vehicleStore.setVehicleToEdit(vehicle);
        }

        this.props.uiStore.openModal(Modals.VehicleModal);
        this.props.uiStore.setCreateEditVehicleModalOpen('edit', true);
    }

    private async savePreferredVehicle(vehicleId: string): Promise<void> {
        if (vehicleId) {
            await this.props.vehicleStore.savePreferredVehicleId(vehicleId, this.props.userStore?.userContext?.userId);

            this.setShowToast(true);
        }
    }

    private setShowToast(show: boolean): void {
        this.setState({
            showPreferredSaveSucces: show,
        });
    }

    public render() {
        return (
            <IonPage>
                <MainHeader toolbarColor="red" title="Vehicles" extraContent={this.extraContent} />
                <IonContent>
                    {this.props.vehicleStore?.availableCars?.length === 0 ? (
                        <NoResultsScreen />
                    ) : (
                        this.props.vehicleStore?.availableCars?.map((vehicle, index) => (
                            <IonRow className="c-vehicle-row" key={index}>
                                {/* More actions buttons */}
                                {this.getMoreActionsButton(vehicle)}
                                <div className="c-vehicle-select">
                                    <IonItem>
                                        <IonLabel className="c-car-name-label" color="light">
                                            {`${vehicle.brand} ${vehicle.model}`}
                                        </IonLabel>
                                        <IonCheckbox
                                            slot="start"
                                            className="c-color-red"
                                            value={vehicle?.uid}
                                            disabled={this.props.vehicleStore?.preferredVehicleId === vehicle?.uid}
                                            checked={this.props.vehicleStore?.preferredVehicleId === vehicle?.uid}
                                            onClick={async (event): Promise<void> => {
                                                if (event?.currentTarget?.value !== this.props.vehicleStore?.preferredVehicleId) {
                                                    console.log(event?.currentTarget?.value);
                                                    console.log(this.props.vehicleStore?.preferredVehicleId);
                                                    await this.savePreferredVehicle(event?.currentTarget?.value);
                                                }
                                            }}
                                        />
                                    </IonItem>
                                </div>
                                {/* Entry row background image */}
                                <IonImg src={defaultCarImg} />
                            </IonRow>
                        ))
                    )}

                    <IonFab vertical="bottom" horizontal="end" slot="fixed">
                        <IonFabButton
                            className="c-color-red"
                            onClick={(): void => {
                                this.props.uiStore.openModal(Modals.VehicleModal);
                                this.props.uiStore.setCreateEditVehicleModalOpen('create', true);
                            }}
                        >
                            <IonIcon icon={addIcon} />
                        </IonFabButton>
                    </IonFab>
                    {this.getAllert()}
                    <IonToast
                        isOpen={this.state.showPreferredSaveSucces}
                        onDidDismiss={() => this.setShowToast(false)}
                        message="Your preferred vehicle is updated."
                        duration={1000}
                    />
                </IonContent>
            </IonPage>
        );
    }

    private getMoreActionsButton = (vehicle: IVehicleViewModel): JSX.Element => {
        return (
            <div className="c-vehicle-actions">
                <IonFab vertical="top" horizontal="end" slot="fixed">
                    <IonFabButton color="light" size="small">
                        <IonIcon icon={moreIcon} />
                    </IonFabButton>
                    <IonFabList side="start">
                        {/* Delete */}
                        <IonFabButton
                            className="c-color-red"
                            onClick={async (): Promise<void> => await this.setOpenAlert(true, vehicle.uid)}
                        >
                            <IonIcon icon={removeIcon} />
                        </IonFabButton>
                        {/* Edit */}
                        <IonFabButton className="c-color-orange" onClick={(): void => this.openEditVehicleView(vehicle)}>
                            <IonIcon icon={editIcon} />
                        </IonFabButton>
                        {/* View */}
                        <IonFabButton className="c-color-purple">
                            <IonIcon icon={viewIcon} />
                        </IonFabButton>
                    </IonFabList>
                </IonFab>
            </div>
        );
    };

    private extraContent = (): JSX.Element => {
        return (
            <IonButtons slot="start">
                <IonBackButton defaultHref={AppRoutes.homeRoute} />
            </IonButtons>
        );
    };

    private getAllert = (): JSX.Element => {
        return (
            <IonAlert
                isOpen={this.state.openAlert}
                onDidDismiss={async (): Promise<void> => this.setOpenAlert(false, '')}
                header={'Confirm'}
                message={'Are you sure you want to delete this vehicle?'}
                buttons={[
                    {
                        text: 'Cancel',
                        role: 'cancel',
                        cssClass: 'secondary',
                        handler: async (): Promise<void> => {
                            await this.setOpenAlert(false, '');
                        },
                    },
                    {
                        text: 'Confirm',
                        handler: async (): Promise<void> => {
                            await this.removeVehicle();
                        },
                    },
                ]}
            />
        );
    };
}
