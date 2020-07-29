import * as React from 'react';
import {
    IonModal,
    IonContent,
    IonList,
    IonRow,
    IonCol,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonButtons,
    IonIcon,
    IonDatetime,
    IonTextarea,
} from '@ionic/react';
import MainHeader from '../../MainHeader/MainHeader';
import { observer, inject } from 'mobx-react';
import { IUiStore, Modals } from '../../../stores/UiStore/UiStore';
import { closeOutline as closeIcon } from 'ionicons/icons';
import { IVehicleStore } from '../../../stores/VehicleStore/VehicleStore';
import { IUserStore } from '../../../stores/UserStore/UserStore';
import { IRepair } from '../../../models/Repair/IRepair';

interface AddRepairState {
    date: string;
    mileage: number;
    repair: string;
    cost: number;
    place: string;
    city: string;
    phone: number;
    note: string;
}

interface AddRepairProps {
    uiStore?: IUiStore;
    vehicleStore?: IVehicleStore;
    userStore?: IUserStore;
}

@inject('uiStore')
@inject('userStore')
@inject('vehicleStore')
@observer
export default class AddRepair extends React.Component<AddRepairProps, AddRepairState> {
    private visible(): boolean {
        return this.props.uiStore?.modals.addRepairModal;
    }

    private handleInput(inputValue: string, field: 'date' | 'mileage' | 'repair' | 'cost' | 'place' | 'city' | 'phone' | 'note'): void {
        if (inputValue) {
            switch (field) {
                case 'date':
                    this.setState({ date: inputValue });
                    break;
                case 'mileage':
                    this.setState({ mileage: parseInt(inputValue) });
                    break;
                case 'repair':
                    this.setState({ repair: inputValue });
                    break;
                case 'cost':
                    this.setState({ cost: parseInt(inputValue) });
                    break;
                case 'place':
                    this.setState({ place: inputValue });
                    break;
                case 'city':
                    this.setState({ city: inputValue });
                    break;
                case 'phone':
                    this.setState({ phone: parseInt(inputValue) });
                    break;
                case 'note':
                    this.setState({ note: inputValue });
                    break;
            }
        }
    }

    private async handleVehicleSave(): Promise<void> {
        if (
            this.state.date &&
            this.state.mileage &&
            this.state.repair &&
            this.state.cost &&
            this.state.place &&
            this.state.city &&
            this.state.phone &&
            this.state.note
        ) {
            console.log('Saving repair for vehicle with Id:' + this.props.vehicleStore.currentSelectedVehicleId);

            var repair: IRepair = {
                date: this.state.date,
                mileage: this.state.mileage,
                repair: this.state.repair,
                cost: this.state.cost,
                place: this.state.place,
                city: this.state.city,
                phone: this.state.phone,
                note: this.state.note,
            };
            console.log('Saving repair' + repair);

            await this.props.vehicleStore.handleAddRepair(repair, this.props.userStore.userContext.userId);

            await this.props.vehicleStore.getRepairsByVehicleId(
                this.props.vehicleStore.currentSelectedVehicleId,
                this.props.userStore.userContext.userId
            );

            this.props.uiStore.openCloseModal(Modals.AddRepairModal, 'close');
        } else {
            console.log('Please, form all fields');
        }
    }

    public render() {
        return (
            <div>
                <IonModal
                    isOpen={this.visible()}
                    swipeToClose={true}
                    onDidDismiss={(): void => this.props.uiStore.openCloseModal(Modals.AddRepairModal, 'close')}
                >
                    <MainHeader extraContent={this.extraContent} title="Add repair" toolbarColor="warning"/>
                    <IonContent>
                        <IonList className="c-form-fields">
                            <IonRow>
                                <IonCol>
                                    <IonItem>
                                        <IonLabel>Date</IonLabel>
                                        <IonDatetime color="warning"
                                            pickerFormat="DD-MM-YYYY"
                                            displayFormat="DD-MMM-YYYY"
                                            onIonChange={(e) => this.handleInput(e.detail.value!, 'date')}
                                        ></IonDatetime>
                                    </IonItem>
                                </IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol>
                                    <IonItem>
                                        <IonLabel position="floating">Repair</IonLabel>
                                        <IonInput onIonChange={(event): void => this.handleInput(event.detail.value, 'repair')} color="warning" />
                                    </IonItem>
                                </IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol>
                                    <IonItem>
                                        <IonLabel position="floating">Cost</IonLabel>
                                        <IonInput onIonChange={(event): void => this.handleInput(event.detail.value, 'cost')} type="number"/>
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
                                    <IonItem>
                                        <IonLabel position="floating">Place</IonLabel>
                                        <IonInput onIonChange={(event): void => this.handleInput(event.detail.value, 'place')} />
                                    </IonItem>
                                </IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol>
                                    <IonItem>
                                        <IonLabel position="floating">City</IonLabel>
                                        <IonInput onIonChange={(event): void => this.handleInput(event.detail.value, 'city')} />
                                    </IonItem>
                                </IonCol>
                                <IonCol>
                                    <IonItem>
                                        <IonLabel position="floating">Phone</IonLabel>
                                        <IonInput
                                            onIonChange={(event): void => this.handleInput(event.detail.value, 'phone')}
                                            type="number"
                                        />
                                    </IonItem>
                                </IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol>
                                    <IonItem>
                                        <IonLabel position="floating">Note</IonLabel>
                                        <IonTextarea onIonChange={(event): void => this.handleInput(event.detail.value, 'note')} />
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
            </div>
        );
    }

    private extraContent = (): JSX.Element => {
        return (
            <IonButtons slot="end">
                <IonButton onClick={(): void => this.props.uiStore.openCloseModal(Modals.AddRepairModal, 'close')}>
                    <IonIcon slot="icon-only" icon={closeIcon} />
                </IonButton>
            </IonButtons>
        );
    };
}
