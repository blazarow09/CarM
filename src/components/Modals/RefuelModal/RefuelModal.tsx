import * as React from 'react';
import {
    IonButton,
    IonButtons,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonRow,
    IonCol,
    IonIcon,
    IonSpinner,
    IonDatetime,
    IonTextarea,
} from '@ionic/react';
import { inject, observer } from 'mobx-react';
import { IUiStore } from '../../../stores/UiStore/UiStore';
import { closeOutline as closeIcon, checkmarkOutline as saveButton } from 'ionicons/icons';
import { IVehicleStore } from '../../../stores/VehicleStore/VehicleStore';
import { IUserStore } from '../../../stores/UserStore/UserStore';
import dayjs from 'dayjs';
import ModalBase, { IModalBaseProps, IModalBaseState } from '../ModalBase';
import './RefuelModal.css';
import TextFieldSuffix from '../../InputElements/TextFieldSuffix';
import { GlobalConstants } from '../../../models/Constants/GlobalConstants';

interface RefuelModalProps extends IModalBaseProps {
    uiStore?: IUiStore;
    vehicleStore?: IVehicleStore;
    userStore?: IUserStore;
}

interface RefuelModalState extends IModalBaseState {
    uid?: string;
    date?: string;
    quantity?: string;
    pricePerLtr?: string;
    totalCost?: string;
    mileage?: string;
    fillingStation?: string;
    notes?: string;
    saveLoading?: boolean;
    headertoolbarColor?: string;
    headerTitle?: string;
}

@inject('uiStore')
@inject('vehicleStore')
@inject('userStore')
@observer
export default class RefuelModal extends ModalBase<RefuelModalProps, RefuelModalState> {
    protected visible(): boolean {
        return this.props.uiStore?.modals.refuelModalOpen;
    }

    public state: RefuelModalState = {
        uid: '',
        date: '',
        quantity: '',
        pricePerLtr: '',
        totalCost: '',
        fillingStation: '',
        notes: '',
        mileage: '',
        saveLoading: false,
        headerTitle: 'Add refuel',
        headertoolbarColor: 'purple',
    };

    private inputFieldTypes = new Array<string>('date', 'quantity', 'pricePerLtr', 'totalCost', 'fillingStation', 'notes', 'mileage');

    protected resetStores(): void {
        this.props.vehicleStore.setVehicleToEdit(null);
    }

    private handleInput = (event: any): void => {
        let statePropName = event?.target?.name;
        let statePropValue = event?.detail?.value;

        if (this.inputFieldTypes.includes(statePropName)) {
            switch (statePropName) {
                case 'pricePerLtr':
                    this.calculateTotalCostByPrice(statePropValue);
                    break;
                case 'quantity':
                    this.calculateTotalCostByQuantity(statePropValue);
                    break;
            }
        }

        this.setState({ [statePropName]: statePropValue });
    };

    private calculateTotalCostByQuantity(statePropValue: string): void {
        let totalCost = 0;
        if (this.state.pricePerLtr !== '') {
            totalCost = parseFloat(this.state.pricePerLtr) * parseFloat(statePropValue);
        }

        this.setState({
            totalCost: totalCost?.toFixed(2).toString(),
        });
    }

    private calculateTotalCostByPrice(statePropValue: string): void {
        let totalCost = 0;
        if (statePropValue === '0' || statePropValue === '') {
            totalCost = parseFloat('0.0');
        } else if (this.state.quantity !== '') {
            totalCost = parseFloat(this.state.quantity) * parseFloat(statePropValue);
        }

        this.setState({
            totalCost: totalCost?.toFixed(2).toString(),
        });
    }

    protected content(): JSX.Element {
        return (
            <IonContent>
                <IonList className="c-form-fields">
                    <IonRow>
                        <IonCol size="8">
                            <IonRow>
                                <IonCol size="9">
                                    <IonItem className="c-input-field-purple">
                                        <IonLabel position="floating">Date</IonLabel>
                                        <IonDatetime
                                            color="warning"
                                            pickerFormat={GlobalConstants.defaultDateFormat}
                                            displayFormat={GlobalConstants.defaultDateFormat}
                                            onIonChange={(event) => this.handleInput(event)}
                                            name="date"
                                            value={
                                                this.state.date
                                                    ? this.state.date
                                                    : dayjs(Date.now()).format(GlobalConstants.defaultDateFormat)
                                            }
                                        />
                                    </IonItem>
                                </IonCol>
                                {/* <IonCol size="3"><IonIcon icon={dateIcon} /></IonCol> */}
                            </IonRow>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol>
                            <TextFieldSuffix
                                handleInput={this.handleInput}
                                value={this.state.mileage}
                                type="number"
                                inputName="mileage"
                                labelPosition="floating"
                                labelText="Mileage"
                                suffix="Km"
                                borderColor="purple"
                            />
                        </IonCol>
                        <IonCol>
                            <TextFieldSuffix
                                handleInput={this.handleInput}
                                value={this.state.quantity}
                                type="number"
                                inputName="quantity"
                                labelPosition="floating"
                                labelText="Quantity"
                                suffix="Ltr"
                                borderColor="purple"
                            />
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol>
                            <TextFieldSuffix
                                handleInput={this.handleInput}
                                value={this.state.pricePerLtr}
                                labelText="Price/Ltr"
                                labelPosition="floating"
                                type="number"
                                inputName="pricePerLtr"
                                suffix="BGN"
                                borderColor="purple"
                            />
                        </IonCol>
                        <IonCol>
                            <TextFieldSuffix
                                value={this.state.totalCost ? this.state.totalCost : '0.00'}
                                type="tel"
                                inputName="totalCost"
                                labelPosition="floating"
                                labelText="Total cost"
                                suffix="BGN"
                                borderColor="purple"
                                readonly={true}
                            />
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol>
                            <IonItem className="c-input-field-purple">
                                <IonLabel position="floating">Filling station</IonLabel>
                                <IonInput
                                    onIonChange={(event): void => this.handleInput(event)}
                                    value={this.state.fillingStation}
                                    name="fillingStation"
                                />
                            </IonItem>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol>
                            <IonItem className="c-input-field-purple">
                                <IonLabel position="floating">Notes</IonLabel>
                                <IonTextarea
                                    onIonChange={(event): void => this.handleInput(event.detail.value)}
                                    value={this.state.notes}
                                    name="notes"
                                />
                            </IonItem>
                        </IonCol>
                    </IonRow>
                </IonList>
            </IonContent>
        );
    }

    private setSaveLoading(loading: boolean): void {
        this.setState({
            saveLoading: loading,
        });
    }

    private async handleRefuelSave(): Promise<void> {
        if (this.state.date && this.state.mileage && this.state.quantity && this.state.pricePerLtr && this.state.totalCost) {
            this.setSaveLoading(true);

            // The current authenticated used id.
            const userId = this.props.userStore.userContext?.userId;

            // CR: Implement...

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
                    <IonButton onClick={async (): Promise<void> => await this.handleRefuelSave()}>
                        {this.state.saveLoading ? <IonSpinner name="crescent" /> : <IonIcon slot="icon-only" icon={saveButton} />}
                    </IonButton>
                </IonButtons>
            </>
        );
    };
}
