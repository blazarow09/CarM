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

interface VehicleScreenProps {
    userStore?: IUserStore;
    uiStore?: IUiStore;
    vehicleStore?: IVehicleStore;
}

interface VehicleScreenState {
    loading: boolean;
    openAlert: boolean;
    vehicleId: string;
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

        this.props.uiStore.openCloseModal(Modals.AddVehicleModal);
        this.props.uiStore.setCreateEditVehicleModalOpen('edit', true);
    }

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

    public render() {
        return (
            <IonPage>
                <MainHeader toolbarColor="danger" title="Vehicles" extraContent={this.extraContent} />
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
                                        <IonCheckbox slot="start" color="danger" />
                                    </IonItem>
                                </div>
                                {/* Entry row background image */}
                                <IonImg src={defaultCarImg} />
                            </IonRow>
                        ))
                    )}

                    <IonFab vertical="bottom" horizontal="end" slot="fixed">
                        <IonFabButton
                            color="danger"
                            onClick={(): void => {
                                this.props.uiStore.openCloseModal(Modals.AddVehicleModal);
                                this.props.uiStore.setCreateEditVehicleModalOpen('create', true);
                            }}
                        >
                            <IonIcon icon={addIcon} />
                        </IonFabButton>
                    </IonFab>
                    {this.getAllert()}
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
                        <IonFabButton color="danger" onClick={async (): Promise<void> => await this.setOpenAlert(true, vehicle.uid)}>
                            <IonIcon icon={removeIcon} />
                        </IonFabButton>
                        {/* Edit */}
                        <IonFabButton color="warning" onClick={(): void => this.openEditVehicleView(vehicle)}>
                            <IonIcon icon={editIcon} />
                        </IonFabButton>
                        {/* View */}
                        <IonFabButton color="tertiary">
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
}
