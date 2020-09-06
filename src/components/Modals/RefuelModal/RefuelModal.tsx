import * as React from 'react';
import { IonButton, IonButtons, IonContent, IonIcon, IonSpinner, IonItem } from '@ionic/react';
import { inject, observer } from 'mobx-react';
import { IUiStore } from '../../../stores/UiStore/UiStore';
import { closeOutline as closeIcon, checkmarkOutline as saveButton } from 'ionicons/icons';
import { IVehicleStore } from '../../../stores/VehicleStore/VehicleStore';
import { IUserStore } from '../../../stores/UserStore/UserStore';
import ModalBase, { IModalBaseProps, IModalBaseState } from '../ModalBase';
import { GlobalColors } from '../../../models/Constants/GlobalColors';
import IHistoryEntry from '../../../models/History/IHistoryEntry';
import { IContentStore } from '../../../stores/ContentStore/ContentStore';
import { Moment } from 'moment';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CustomTextField from '../../InputElements/CustomTextField';
import { IRefuelCreateEdit } from '../../../models/Refuel/IRefuelCreateEdit';
import CustomTextFieldWithMask from '../../InputElements/CustomTextFieldWithMask';
// Icons
import MoneyOutlinedIcon from '@material-ui/icons/MoneyOutlined';
import LocalAtmOutlinedIcon from '@material-ui/icons/LocalAtmOutlined';
import RoomOutlinedIcon from '@material-ui/icons/RoomOutlined';
import WorkOutlineOutlinedIcon from '@material-ui/icons/WorkOutlineOutlined';
import NotesOutlinedIcon from '@material-ui/icons/NotesOutlined';
import DateRangeOutlinedIcon from '@material-ui/icons/DateRangeOutlined';

import './RefuelModal.css';
import CustomDatePicker from '../../InputElements/CustomDatePicker';

interface RefuelModalProps extends IModalBaseProps {
    uiStore?: IUiStore;
    vehicleStore?: IVehicleStore;
    userStore?: IUserStore;
    contentStore?: IContentStore;
}

interface RefuelModalState extends IModalBaseState {
    uid?: string;
    date?: string;
    time?: string;
    quantity?: string;
    pricePerLtr?: string;
    totalCost?: string;
    mileage?: string;
    fillingStation?: string;
    notes?: string;
    saveLoading?: boolean;
    headertoolbarColor?: string;
    headerTitle?: string;
    reason?: string;
}

@inject('uiStore')
@inject('vehicleStore')
@inject('userStore')
@inject('contentStore')
@observer
export default class RefuelModal extends ModalBase<RefuelModalProps, RefuelModalState> {
    protected visible(): boolean {
        return this.props.uiStore?.modals.refuelModalOpen;
    }

    public state: RefuelModalState = {
        uid: '',
        date: new Date().toISOString(),
        time: new Date(Date.now()).toISOString(),
        quantity: '',
        pricePerLtr: '',
        totalCost: '',
        fillingStation: '',
        notes: '',
        mileage: '',
        reason: '',
        saveLoading: false,
        headerTitle: 'Add refuel',
        headerToolbarColor: GlobalColors.purpleColor,
    };

    private inputFieldTypes = new Array<string>(
        'date',
        'time',
        'quantity',
        'pricePerLtr',
        'totalCost',
        'fillingStation',
        'notes',
        'mileage',
        'reason'
    );

    protected resetStores(): void {
        this.props.vehicleStore.setVehicleToEdit(null);
    }

    private handleDate = (date: Moment): void => {
        this.setState({
            date: date.toISOString(),
        });
    };

    private handleTime = (time: Moment): void => {
        this.setState({
            time: time.toISOString(),
        });
    };

    private handleInput = (event: any): void => {
        let statePropName = event?.target.getAttribute('name');
        let statePropValue = event?.target?.value;

        if (this.inputFieldTypes.includes(statePropName)) {
            switch (statePropName) {
                case 'pricePerLtr':
                    this.calculateTotalCostByPrice(statePropValue);
                    break;
                case 'quantity':
                    this.calculateTotalCostByQuantity(statePropValue);
                    break;
            }

            this.setState({ [statePropName]: statePropValue });
        }
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

    public timeFormat = 'HH:mm';

    private muiTheme = createMuiTheme({
        palette: {
            primary: {
                main: GlobalColors.purpleColorRGB,
                light: GlobalColors.purpleColorRGB,
                dark: GlobalColors.purpleColorRGB,
            },
        },
    });

    protected content(): JSX.Element {
        return (
            <IonContent>
                <ThemeProvider theme={this.muiTheme}>
                    <IonItem lines="none" className="c-input-field-item">
                        <CustomDatePicker
                            margin="normal"
                            label="Date"
                            value={this.state.date}
                            onChange={this.handleDate}
                            name="date"
                            fullWidth={true}
                            icon={DateRangeOutlinedIcon}
                            withTimePicker={true}
                            timePickerProps={{ onChange: this.handleTime, value: this.state.time, label: 'Time' }}
                        />
                    </IonItem>
                    <IonItem lines="none" className="c-input-field-item">
                        <CustomTextFieldWithMask
                            onChange={this.handleInput}
                            icon={MoneyOutlinedIcon}
                            label="Odometer"
                            withAdornment={true}
                            adornmentPosition="end"
                            adornmentText="km"
                            helperText="Last odometer: 1000 km"
                            allowOnlyNumber={true}
                            name="mileage"
                            fullWidth={true}
                            value={this.state.mileage}
                            mask="99999999"
                            maskChar=" "
                        />
                    </IonItem>
                    <IonItem lines="none" className="c-input-field-item">
                        <CustomTextField
                            label="Price / L"
                            name="pricePerLtr"
                            onChange={this.handleInput}
                            type="number"
                            value={this.state.pricePerLtr}
                            icon={LocalAtmOutlinedIcon}
                            trailingFields={this.getPriceTrailingFields()}
                            trailingFieldsCount={2}
                        />
                    </IonItem>
                    <IonItem lines="none" className="c-input-field-item">
                        <CustomTextField
                            label="Gas station"
                            name="fillingStation"
                            onChange={this.handleInput}
                            value={this.state.fillingStation}
                            icon={RoomOutlinedIcon}
                            fullWidth={true}
                        />
                    </IonItem>
                    <IonItem lines="none" className="c-input-field-item">
                        <CustomTextField
                            label="Reason"
                            name="reason"
                            onChange={this.handleInput}
                            value={this.state.reason}
                            icon={WorkOutlineOutlinedIcon}
                            fullWidth={true}
                        />
                    </IonItem>
                    <IonItem lines="none" className="c-input-field-item">
                        <CustomTextField
                            label="Notes"
                            name="notes"
                            onChange={this.handleInput}
                            value={this.state.notes}
                            icon={NotesOutlinedIcon}
                            fullWidth={true}
                            // multiline={true}
                            // rows={3}
                        />
                    </IonItem>
                    <IonItem className="c-note-italic">
                        Note: Entering mileage will update your car's odometer and track it by every entry.
                    </IonItem>
                </ThemeProvider>
            </IonContent>
        );
    }

    private getPriceTrailingFields(): JSX.Element[] {
        return [
            <CustomTextField label="Quantity" name="quantity" onChange={this.handleInput} type="number" value={this.state.quantity} />,
            <CustomTextField
                label="Total price"
                name="totalCost"
                value={this.state.totalCost}
                onChange={this.handleInput}
                type="number"
                withAdornment={true}
                adornmentPosition="end"
                adornmentText="L"
            />,
        ];
    }

    private setSaveLoading(loading: boolean): void {
        this.setState({
            saveLoading: loading,
        });
    }

    private async handleRefuelSave(): Promise<void> {
        if (this.state.date && this.state.mileage && this.state.quantity && this.state.pricePerLtr && this.state.totalCost) {
            this.setSaveLoading(true);

            const vehicleId = this.props.vehicleStore.preferredVehicleId;
            // The current authenticated used id.
            const userId = window?.authContext?.userId;

            let refuel: IRefuelCreateEdit = {
                date: this.state.date,
                time: this.state.time,
                mileage: this.state.mileage,
                pricePerLtr: this.state.pricePerLtr,
                totalCost: this.state.totalCost,
                quantity: this.state.quantity,
                fillingStation: this.state.fillingStation,
                notes: this.state.notes,
                reason: this.state.reason,
            };

            let refuelId = await this.props.vehicleStore.handleSaveRefuel(refuel, userId);

            if (refuelId) {
                await this.props.vehicleStore.getRefuelsByVehicleId(
                    false,
                    this.props.userStore.userContext.userId,
                    this.props.vehicleStore.preferredVehicleId
                );

                let historyEntry: IHistoryEntry = {
                    cost: refuel.totalCost,
                    date: refuel.date,
                    mileage: refuel.mileage,
                    referenceId: refuelId,
                    title: 'Refueling', // CR: think about localization.
                    type: 'refuel',
                };

                await this.props.contentStore.saveHistoryEntry(vehicleId, historyEntry);

                // this.setSaveLoading(false);
                this.hideModal();
            } else {
                this.setSaveLoading(false);
                // log the problem.
            }
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
