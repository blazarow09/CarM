import * as React from 'react';
import {
    IonModal,
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
} from '@ionic/react';
import { inject, observer } from 'mobx-react';
import { IUiStore, Modals } from '../../../stores/UiStore/UiStore';
import MainHeader from '../../MainHeader/MainHeader';
import { closeOutline as closeIcon } from 'ionicons/icons';
import { IVehicleStore } from '../../../stores/VehicleStore/VehicleStore';
import { IUserStore } from '../../../stores/UserStore/UserStore';

import './AddCarModal.css';

interface AddVehicleProps {
    uiStore?: IUiStore;
    vehicleStore?: IVehicleStore;
    userStore?: IUserStore;
}

interface AddVehicleState {
    type: string;
    brand: string;
    model: string;
    variant: string;
    engine: string;
    fuel: string;
    mileage: string;
}

@inject('uiStore')
@inject('vehicleStore')
@inject('userStore')
@observer
export default class AddVehicle extends React.Component<AddVehicleProps, AddVehicleState> {
    private visible(): boolean {
        return this.props.uiStore?.modals.addCarModal;
    }

    public state: AddVehicleState = {
        type: '',
        brand: '',
        model: '',
        variant: '',
        engine: '',
        fuel: '',
        mileage: '',
    };

    private handleInput(inputValue: string, field: 'type' | 'brand' | 'model' | 'variant' | 'engine' | 'fuel' | 'mileage'): void {
        if (inputValue) {
            switch (field) {
                case 'type':
                    this.setState({ type: inputValue });
                    break;
                case 'brand':
                    this.setState({ brand: inputValue });
                    break;
                case 'model':
                    this.setState({ model: inputValue });
                    break;
                case 'variant':
                    this.setState({ variant: inputValue });
                    break;
                case 'engine':
                    this.setState({ engine: inputValue });
                    break;
                case 'fuel':
                    this.setState({ fuel: inputValue });
                    break;
                case 'mileage':
                    this.setState({ mileage: inputValue });
                    break;
            }
        }
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
            await this.props.vehicleStore.handleAddVehicle(
                {
                    type: this.state.type,
                    brand: this.state.brand,
                    model: this.state.model,
                    variant: this.state.variant,
                    engine: this.state.engine,
                    fuel: this.state.fuel,
                    mileage: parseInt(this.state.mileage),
                },
                this.props.userStore.userContext.userId
            );

            await this.props.vehicleStore.getAvailableCars(false, this.props.userStore.userContext.userId);

            this.props.uiStore.openCloseModal(Modals.AddCarModal, 'close');
        } else {
            console.log('Please, form all fields');
        }
    }

    public render() {
        return (
            <IonModal
                isOpen={this.visible()}
                swipeToClose={true}
                onDidDismiss={(): void => this.props.uiStore.openCloseModal(Modals.AddCarModal, 'close')}
            >
                <MainHeader extraContent={this.extraContent} title="Add vehicle" />
                <IonContent>
                    <IonList className="c-form-fields">
                        <IonRow>
                            <IonCol>
                                <IonItem>
                                    <IonLabel position="floating">Type</IonLabel>
                                    <IonSelect
                                        interface="popover"
                                        onIonChange={(event): void => this.handleInput(event.detail.value, 'type')}
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
                                <IonItem className="c-item-ic">
                                    <IonLabel className="c-label-ic" position="floating">
                                        Brand
                                    </IonLabel>
                                    <IonInput onIonChange={(event): void => this.handleInput(event.detail.value, 'brand')}></IonInput>
                                </IonItem>
                            </IonCol>
                            <IonCol>
                                <IonItem>
                                    <IonLabel position="floating">Model</IonLabel>
                                    <IonInput onIonChange={(event): void => this.handleInput(event.detail.value, 'model')} />
                                </IonItem>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol>
                                <IonItem>
                                    <IonLabel position="floating">Variant</IonLabel>
                                    <IonInput onIonChange={(event): void => this.handleInput(event.detail.value, 'variant')} />
                                </IonItem>
                            </IonCol>
                            <IonCol>
                                <IonItem>
                                    <IonLabel position="floating">Engine</IonLabel>
                                    <IonInput onIonChange={(event): void => this.handleInput(event.detail.value, 'engine')} />
                                </IonItem>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol>
                                <IonItem>
                                    <IonLabel position="floating">Fuel</IonLabel>
                                    <IonSelect
                                        interface="popover"
                                        onIonChange={(event): void => this.handleInput(event.detail.value, 'fuel')}
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
                                <IonItem>
                                    <IonLabel position="floating">Mileage</IonLabel>
                                    <IonInput
                                        type="number"
                                        onIonChange={(event): void => this.handleInput(event.detail.value, 'mileage')}
                                    />
                                </IonItem>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol>
                                <IonButton
                                    color="primary"
                                    expand="full"
                                    onClick={async (): Promise<void> => await this.handleVehicleSave()}
                                >
                                    ADD
                                </IonButton>
                            </IonCol>
                        </IonRow>
                    </IonList>
                </IonContent>
            </IonModal>
        );
    }

    private extraContent = (): JSX.Element => {
        return (
            <IonButtons slot="end">
                <IonButton onClick={(): void => this.props.uiStore.openCloseModal(Modals.AddCarModal, 'close')}>
                    <IonIcon slot="icon-only" icon={closeIcon} />
                </IonButton>
            </IonButtons>
        );
    };
}
