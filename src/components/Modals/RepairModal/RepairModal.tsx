import * as React from 'react';
import {
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
    IonSpinner,
} from '@ionic/react';
import { observer, inject } from 'mobx-react';
import { IUiStore } from '../../../stores/UiStore/UiStore';
import { closeOutline as closeIcon, checkmarkOutline as saveButton } from 'ionicons/icons';
import { IVehicleStore } from '../../../stores/VehicleStore/VehicleStore';
import { IUserStore } from '../../../stores/UserStore/UserStore';
import { IRepair } from '../../../models/Repair/IRepair';
import ModalBase from '../ModalBase';
import { GlobalConstants } from '../../../models/Constants/GlobalConstants';

interface RepairModalState {
    date: string;
    mileage: string;
    repair: string;
    cost: string;
    place: string;
    city: string;
    phone: string;
    note: string;
    saveLoading?: boolean;
    headertoolbarColor: string;
    headerTitle: string;
}

interface RepairModalProps {
    uiStore?: IUiStore;
    vehicleStore?: IVehicleStore;
    userStore?: IUserStore;
}

@inject('uiStore')
@inject('userStore')
@inject('vehicleStore')
@observer
export default class RepairModal extends ModalBase<RepairModalProps, RepairModalState> {
    protected visible(): boolean {
        return this.props.uiStore?.modals?.repairModalOpen;
    }

    public state: RepairModalState = {
        date: '',
        mileage: '',
        repair: '',
        cost: '',
        place: '',
        city: '',
        phone: '',
        note: '',
        saveLoading: false,
        headerTitle: 'Add repair',
        headertoolbarColor: 'warning',
    };

    private handleInput(inputValue: string, field: 'date' | 'mileage' | 'repair' | 'cost' | 'place' | 'city' | 'phone' | 'note'): void {
        if (inputValue) {
            switch (field) {
                case 'date':
                    this.setState({ date: inputValue });
                    break;
                case 'mileage':
                    this.setState({ mileage: inputValue });
                    break;
                case 'repair':
                    this.setState({ repair: inputValue });
                    break;
                case 'cost':
                    this.setState({ cost: inputValue });
                    break;
                case 'place':
                    this.setState({ place: inputValue });
                    break;
                case 'city':
                    this.setState({ city: inputValue });
                    break;
                case 'phone':
                    this.setState({ phone: inputValue });
                    break;
                case 'note':
                    this.setState({ note: inputValue });
                    break;
            }
        }
    }

    private setSaveLoading(loading: boolean): void {
        this.setState({
            saveLoading: loading,
        });
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
            this.setSaveLoading(true);
            console.log('Saving repair for vehicle with Id:' + this.props.vehicleStore.preferredVehicleId);

            var repair: IRepair = {
                date: this.state.date,
                mileage: parseInt(this.state.mileage),
                repair: this.state.repair,
                cost: parseInt(this.state.cost),
                place: this.state.place,
                city: this.state.city,
                phone: parseInt(this.state.phone),
                note: this.state.note,
            };
            console.log('Saving repair' + repair);

            await this.props.vehicleStore.handleRepairModal(repair, this.props.userStore.userContext.userId);

            await this.props.vehicleStore.getRepairsByVehicleId(
                this.props.vehicleStore.preferredVehicleId,
                this.props.userStore.userContext.userId
            );

            this.setSaveLoading(false);

            this.hideModal();
        } else {
            console.log('Please, form all fields');
        }
    }

    protected content(): JSX.Element {
        return (
            <>
                <IonContent>
                    <IonList className="c-form-fields">
                        <IonRow>
                            <IonCol>
                                <IonItem>
                                    <IonLabel>Date</IonLabel>
                                    <IonDatetime
                                        color="warning"
                                        pickerFormat={GlobalConstants.defaultDateFormat}
                                        displayFormat={GlobalConstants.defaultDateFormat}
                                        onIonChange={(e) => this.handleInput(e.detail.value!, 'date')}
                                    ></IonDatetime>
                                </IonItem>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol>
                                <IonItem>
                                    <IonLabel position="floating">Repair</IonLabel>
                                    <IonInput
                                        onIonChange={(event): void => this.handleInput(event.detail.value, 'repair')}
                                        color="warning"
                                    />
                                </IonItem>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol>
                                <IonItem>
                                    <IonLabel position="floating">Cost</IonLabel>
                                    <IonInput onIonChange={(event): void => this.handleInput(event.detail.value, 'cost')} type="number" />
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
                                    <IonInput onIonChange={(event): void => this.handleInput(event.detail.value, 'phone')} type="number" />
                                </IonItem>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol>
                                <IonItem>
                                    <IonLabel position="floating">Notes</IonLabel>
                                    <IonTextarea onIonChange={(event): void => this.handleInput(event.detail.value, 'note')} />
                                </IonItem>
                            </IonCol>
                        </IonRow>
                    </IonList>
                </IonContent>
            </>
        );
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
            // <IonButtons slot="end">
            //     <IonButton onClick={(): void => this.hideModal()}>
            //         <IonIcon slot="icon-only" icon={closeIcon} />
            //     </IonButton>
            // </IonButtons>
        );
    };
}
