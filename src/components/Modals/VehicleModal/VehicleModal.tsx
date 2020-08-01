import * as React from 'react';
import {
    IonButton,
    IonButtons,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonRow,
    IonCol,
    IonIcon,
    IonSpinner,
} from '@ionic/react';
import { inject, observer } from 'mobx-react';
import { IUiStore } from '../../../stores/UiStore/UiStore';
import { closeOutline as closeIcon, checkmarkOutline as saveButton } from 'ionicons/icons';
import { IVehicleStore } from '../../../stores/VehicleStore/VehicleStore';
import { IUserStore } from '../../../stores/UserStore/UserStore';
import { IVehicleViewModel } from '../../../models/Vehicle/IVehicleViewModel';
import ModalBase, { IModalBaseProps, IModalBaseState } from '../ModalBase';
import { GlobalColors } from '../../../models/Constants/GlobalColors';

interface VehicleModalProps extends IModalBaseProps {
    uiStore?: IUiStore;
    vehicleStore?: IVehicleStore;
    userStore?: IUserStore;
}

interface VehicleModalState extends IModalBaseState {
    uid?: string;
    type?: string;
    brand?: string;
    model?: string;
    variant?: string;
    engine?: string;
    fuel?: string;
    mileage?: string;
    saveLoading?: boolean;
    headerToolbarColor?: string;
    headerTitle?: string;
}

@inject('uiStore')
@inject('vehicleStore')
@inject('userStore')
@observer
export default class VehicleModal extends ModalBase<VehicleModalProps, VehicleModalState> {
    protected visible(): boolean {
        return this.props.uiStore?.modals.vehicleModalOpen;
    }

    public state: VehicleModalState = {
        uid: this.props.vehicleStore?.vehicleToEdit ? this.props.vehicleStore.vehicleToEdit?.uid : '',
        type: this.props.vehicleStore?.vehicleToEdit ? this.props.vehicleStore.vehicleToEdit?.type : '',
        brand: this.props.vehicleStore?.vehicleToEdit ? this.props.vehicleStore.vehicleToEdit?.brand : '',
        model: this.props.vehicleStore?.vehicleToEdit ? this.props.vehicleStore.vehicleToEdit?.model : '',
        variant: this.props.vehicleStore?.vehicleToEdit ? this.props.vehicleStore.vehicleToEdit?.variant : '',
        engine: this.props.vehicleStore?.vehicleToEdit ? this.props.vehicleStore.vehicleToEdit?.engine : '',
        fuel: this.props.vehicleStore?.vehicleToEdit ? this.props.vehicleStore.vehicleToEdit?.fuel : '',
        mileage: this.props.vehicleStore?.vehicleToEdit ? this.props.vehicleStore.vehicleToEdit?.mileage.toString() : '',
        saveLoading: false,
        headerTitle: this.props.uiStore.modals.createVehicleModalOpen ? 'Add vehicle' : 'Edit vehicle',
        headerToolbarColor: GlobalColors.redColor,
    };

    private inputFieldTypes = new Array<string>('type', 'brand', 'model', 'variant', 'engine', 'fuel', 'mileage');

    protected resetStores(): void {
        this.props.vehicleStore.setVehicleToEdit(null);
    }

    private handleInput(event: any): void {
        let statePropName = event.target.name;
        let statePropValue = event.detail.value;

        if (this.inputFieldTypes.includes(statePropName)) {
            this.setState({ [statePropName]: statePropValue });
        }
    }

    protected content(): JSX.Element {
        return (
            <>
                <IonContent>
                    <IonList className="c-form-fields">
                        <IonRow>
                            <IonCol>
                                <IonItem className="c-item-input-vehicle">
                                    <IonLabel position="floating">Type</IonLabel>
                                    <IonSelect
                                        color={GlobalColors.redColor}
                                        interface="popover"
                                        onIonChange={(event): void => this.handleInput(event)}
                                        value={this.state.type}
                                        name="type"
                                    >
                                        <IonSelectOption key={1} value="Car">
                                            Car
                                        </IonSelectOption>
                                        <IonSelectOption key={2} value="Motorcycle" disabled>
                                            Motorcycle
                                        </IonSelectOption>
                                        <IonSelectOption key={3} value="Bus" disabled>
                                            Bus
                                        </IonSelectOption>
                                    </IonSelect>
                                </IonItem>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol>
                                <IonItem className="c-item-input-vehicle">
                                    <IonLabel position="floating">Brand</IonLabel>
                                    <IonInput
                                        onIonChange={(event): void => this.handleInput(event)}
                                        className="c-veh-input"
                                        value={this.state.brand}
                                        name="brand"
                                    />
                                </IonItem>
                            </IonCol>
                            <IonCol>
                                <IonItem className="c-item-input-vehicle">
                                    <IonLabel position="floating">Model</IonLabel>
                                    <IonInput
                                        onIonChange={(event): void => this.handleInput(event)}
                                        value={this.state.model}
                                        name="model"
                                    />
                                </IonItem>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol>
                                <IonItem className="c-item-input-vehicle">
                                    <IonLabel position="floating">Variant</IonLabel>
                                    <IonInput
                                        onIonChange={(event): void => this.handleInput(event)}
                                        value={this.state.variant}
                                        name="variant"
                                    />
                                </IonItem>
                            </IonCol>
                            <IonCol>
                                <IonItem className="c-item-input-vehicle">
                                    <IonLabel position="floating">Engine</IonLabel>
                                    <IonInput
                                        onIonChange={(event): void => this.handleInput(event)}
                                        value={this.state.engine}
                                        name="engine"
                                    />
                                </IonItem>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol>
                                <IonItem className="c-item-input-vehicle">
                                    <IonLabel position="floating">Fuel</IonLabel>
                                    <IonSelect
                                        interface="popover"
                                        onIonChange={(event): void => this.handleInput(event)}
                                        value={this.state.fuel}
                                        name="fuel"
                                    >
                                        <IonSelectOption key={1} value="Car">
                                            Diesel
                                        </IonSelectOption>
                                        <IonSelectOption key={2} value="Petrol">
                                            Petrol
                                        </IonSelectOption>
                                        <IonSelectOption key={3} value="Electricity">
                                            Electricity
                                        </IonSelectOption>
                                    </IonSelect>
                                </IonItem>
                            </IonCol>
                            <IonCol>
                                <IonItem className="c-item-input-vehicle">
                                    <IonLabel position="floating">Mileage</IonLabel>
                                    <IonInput
                                        value={this.state.mileage}
                                        type="number"
                                        onIonChange={(event): void => this.handleInput(event)}
                                        name="mileage"
                                    />
                                </IonItem>
                            </IonCol>
                        </IonRow>
                    </IonList>
                </IonContent>
            </>
        );
    }

    private setSaveLoading(loading: boolean): void {
        this.setState({
            saveLoading: loading,
        });
    }

    private async handleVehicleSave(): Promise<void> {
        if (
            this.state.type &&
            this.state.brand &&
            this.state.model &&
            this.state.variant &&
            this.state.engine &&
            this.state.fuel &&
            this.state.mileage
        ) {
            this.setSaveLoading(true);

            const vehicle: IVehicleViewModel = {
                type: this.state.type,
                brand: this.state.brand,
                model: this.state.model,
                variant: this.state.variant,
                engine: this.state.engine,
                fuel: this.state.fuel,
                mileage: parseInt(this.state.mileage),
            };

            // The current authenticated used id.
            const userId = this.props.userStore.userContext?.userId;

            // If the modal is open in edit mode.
            if (this.props.uiStore.modals.editVehicleModalOpen && vehicle) {
                vehicle.uid = this.state.uid;

                await this.props.vehicleStore.handleEditVehicle(vehicle, this.state.uid, userId);
                // If the modal is open in crete mode.
            } else if (this.props.uiStore.modals.createVehicleModalOpen && vehicle) {
                await this.props.vehicleStore.handleVehicleSave(vehicle, userId);
            }

            let shouldSetPreferredVehicle = false;
            if (!this.props.vehicleStore.isAvailableCars) {
                shouldSetPreferredVehicle = true;
            }

            // Retrieve last vehicle updates.
            await this.props.vehicleStore.getAvailableCars(false, userId);

            // If at this moment this is the first entry in the vehicle's collection we should add a preferred vehicle in the user's collection
            // with the currently create car id.
            // Otherwise keep the preferred vehicle as to the users' choice.
            if (shouldSetPreferredVehicle) {
                let preferredVehicleId = this.props.vehicleStore?.availableCars[0]?.uid;

                await this.props.vehicleStore.savePreferredVehicleId(preferredVehicleId, userId);
            }

            this.setSaveLoading(false);

            this.hideModal();
        } else {
            console.log('Please, form all fields');
        }
    }

    protected extraContent = (): JSX.Element => {
        return (
            <>
                <IonButtons slot="end">
                    <IonButton onClick={(): void => this.hideModal()}>
                        <IonIcon slot="icon-only" icon={closeIcon} />
                    </IonButton>
                </IonButtons>
                <IonButtons slot="end">
                    <IonButton onClick={async (): Promise<void> => await this.handleVehicleSave()}>
                        {this.state.saveLoading ? <IonSpinner name="crescent" /> : <IonIcon slot="icon-only" icon={saveButton} />}
                    </IonButton>
                </IonButtons>
            </>
        );
    };
}
