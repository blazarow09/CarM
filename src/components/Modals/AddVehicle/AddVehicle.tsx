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
import MainHeader from '../../MainHeader/MainHeader';

import './AddCarModal.css';
import { IVehicleViewModel } from '../../../models/Vehicle/IVehicleViewModel';
import ModalBase, { IModalBaseProps, IModalBaseState } from '../ModalBase';

interface AddVehicleProps extends IModalBaseProps {
    uiStore?: IUiStore;
    vehicleStore?: IVehicleStore;
    userStore?: IUserStore;
}

interface AddVehicleState extends IModalBaseState {
    uid?: string;
    type?: string;
    brand?: string;
    model?: string;
    variant?: string;
    engine?: string;
    fuel?: string;
    mileage?: string;
    saveLoading?: boolean;
}

@inject('uiStore')
@inject('vehicleStore')
@inject('userStore')
@observer
export default class AddVehicle extends ModalBase<AddVehicleProps, AddVehicleState> {
    protected visible(): boolean {
        return this.props.uiStore?.modals.addCarModal;
    }

    public state: AddVehicleState = {
        uid: this.props.vehicleStore?.vehicleToEdit ? this.props.vehicleStore.vehicleToEdit?.uid : '',
        type: this.props.vehicleStore?.vehicleToEdit ? this.props.vehicleStore.vehicleToEdit?.type : '',
        brand: this.props.vehicleStore?.vehicleToEdit ? this.props.vehicleStore.vehicleToEdit?.brand : '',
        model: this.props.vehicleStore?.vehicleToEdit ? this.props.vehicleStore.vehicleToEdit?.model : '',
        variant: this.props.vehicleStore?.vehicleToEdit ? this.props.vehicleStore.vehicleToEdit?.variant : '',
        engine: this.props.vehicleStore?.vehicleToEdit ? this.props.vehicleStore.vehicleToEdit?.engine : '',
        fuel: this.props.vehicleStore?.vehicleToEdit ? this.props.vehicleStore.vehicleToEdit?.fuel : '',
        mileage: this.props.vehicleStore?.vehicleToEdit ? this.props.vehicleStore.vehicleToEdit?.mileage.toString() : '',
        saveLoading: false,
    };

    private inputFieldTypes = new Array<string>('type', 'brand', 'model', 'variant', 'engine', 'fuel', 'mileage');

    protected resetStores(): void {
        this.props.vehicleStore.setVehicleToEdit(null);
    }

    private handleInput(event: any): void {
        let statePropName = event.target.name;
        let statePropValue = event.detail.value;

        console.log(statePropName);
        console.log(statePropValue);

        if (this.inputFieldTypes.includes(statePropName)) {
            this.setState({ [statePropName]: statePropValue });
        }
    }

    protected content(): JSX.Element {
        return (
            <>
                <MainHeader extraContent={this.extraContent} title="Add vehicle" toolbarColor="danger" />

                <IonContent>
                    <IonList className="c-form-fields">
                        <IonRow>
                            <IonCol>
                                <IonItem className="c-item-input">
                                    <IonLabel position="floating">Type</IonLabel>
                                    <IonSelect
                                        color="danger"
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
                                <IonItem className="c-item-input">
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
                                <IonItem className="c-item-input">
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
                                <IonItem className="c-item-input">
                                    <IonLabel position="floating">Variant</IonLabel>
                                    <IonInput
                                        onIonChange={(event): void => this.handleInput(event)}
                                        value={this.state.variant}
                                        name="variant"
                                    />
                                </IonItem>
                            </IonCol>
                            <IonCol>
                                <IonItem className="c-item-input">
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
                                <IonItem className="c-item-input">
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
                                <IonItem className="c-item-input">
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
            this.setState({
                saveLoading: true,
            });

            const vehicle: IVehicleViewModel = {
                type: this.state.type,
                brand: this.state.brand,
                model: this.state.model,
                variant: this.state.variant,
                engine: this.state.engine,
                fuel: this.state.fuel,
                mileage: parseInt(this.state.mileage),
            };

            const userId = this.props.userStore.userContext?.userId;

            if (this.props.uiStore.modals.editVehicleModalOpen && vehicle) {
                vehicle.uid = this.state.uid;

                await this.props.vehicleStore.handleEditVehicle(vehicle, this.state.uid, userId);
            } else if (this.props.uiStore.modals.createVehicleModalOpen && vehicle) {
                await this.props.vehicleStore.handleAddVehicle(vehicle, userId);
            }

            await this.props.vehicleStore.getAvailableCars(false, userId);

            this.setState({
                saveLoading: false,
            });

            this.props.uiStore.closeAllModals();
        } else {
            console.log('Please, form all fields');
        }
    }

    private extraContent = (): JSX.Element => {
        return (
            <>
                <IonButtons slot="end">
                    <IonButton onClick={(): void => this.props.uiStore.closeAllModals()}>
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
