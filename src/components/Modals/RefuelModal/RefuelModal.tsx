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
import CustomDatePicker from '../../InputElements/CustomDatePicker';
// Icons
import MoneyOutlinedIcon from '@material-ui/icons/MoneyOutlined';
import LocalAtmOutlinedIcon from '@material-ui/icons/LocalAtmOutlined';
import RoomOutlinedIcon from '@material-ui/icons/RoomOutlined';
import WorkOutlineOutlinedIcon from '@material-ui/icons/WorkOutlineOutlined';
import NotesOutlinedIcon from '@material-ui/icons/NotesOutlined';
import DateRangeOutlinedIcon from '@material-ui/icons/DateRangeOutlined';
import LocalGasStationOutlinedIcon from '@material-ui/icons/LocalGasStationOutlined';
import { InputHelper } from '../../../helpers/InputHelper';
import { helloWorld } from '../../../functions/lib';
// Icons

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
    fillingStation?: string;
    notes?: string;
    mileage?: string;
    reason?: string;
    fuel?: string;
    saveLoading?: boolean;
    headertoolbarColor?: string;
    headerTitle?: string;
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
        uid: this.props.vehicleStore.refuelToEdit?.uid ? this.props.vehicleStore.refuelToEdit?.uid : '',
        date: this.props.vehicleStore.refuelToEdit?.date ? this.props.vehicleStore.refuelToEdit?.date : new Date().toISOString(),
        time: this.props.vehicleStore.refuelToEdit?.time ? this.props.vehicleStore.refuelToEdit?.time : new Date(Date.now()).toISOString(),
        quantity: this.props.vehicleStore.refuelToEdit?.quantity ? this.props.vehicleStore.refuelToEdit?.quantity : '',
        pricePerLtr: this.props.vehicleStore.refuelToEdit?.pricePerLtr ? this.props.vehicleStore.refuelToEdit?.pricePerLtr : '',
        totalCost: this.props.vehicleStore.refuelToEdit?.totalCost ? this.props.vehicleStore.refuelToEdit?.totalCost : '',
        fillingStation: this.props.vehicleStore.refuelToEdit?.fillingStation ? this.props.vehicleStore.refuelToEdit?.fillingStation : '',
        notes: this.props.vehicleStore.refuelToEdit?.notes ? this.props.vehicleStore.refuelToEdit?.notes : '',
        mileage: this.props.vehicleStore.refuelToEdit?.mileage ? this.props.vehicleStore.refuelToEdit?.mileage : '',
        reason: this.props.vehicleStore.refuelToEdit?.reason ? this.props.vehicleStore.refuelToEdit?.reason : '',
        fuel: this.props.vehicleStore.refuelToEdit?.fuel ? this.props.vehicleStore.refuelToEdit?.fuel : '',
        saveLoading: false,
        headerTitle: this.props.uiStore.modals.editRefuelModalOpen ? 'Edit refuel' : 'Add refuel',
        headerToolbarColor: GlobalColors.purpleColor,
    };

    protected resetStores(): void {
        // If the edit refuel view was open reset the refuel edit observable and close the dialog.
        if (this.props.uiStore.modals.editRefuelModalOpen) {
            this.props.uiStore.setCreateEditRefuelModalOpen('both');
            this.props.vehicleStore.setRefuelToEdit(true);
        }
    }

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
                    <IonItem lines="none" className="c-input-field-item c-vehicle-margin-top">
                        <CustomTextField
                            label="Fuel"
                            onChange={this.handleFuelTypeChange}
                            value={this.state.fuel}
                            icon={LocalGasStationOutlinedIcon}
                            select={true}
                            selectOptions={InputHelper.fuelTypes as HTMLOptionElement[]}
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

    private muiTheme = createMuiTheme({
        palette: {
            primary: {
                main: GlobalColors.purpleColorRGB,
                light: GlobalColors.purpleColorRGB,
                dark: GlobalColors.purpleColorRGB,
            },
        },
    });

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

    private handleFuelTypeChange = (event: any): void => {
        this.setState({
            fuel: event?.target.value,
        });
    };

    private handleInput = (event: any): void => {
        let statePropName = event?.target?.getAttribute('name');
        let statePropValue = event?.target?.value;

        if (this.inputFieldTypes.includes(statePropName)) {
            switch (statePropName) {
                case 'pricePerLtr':
                    this.calculateTotalCostByPrice(statePropValue);
                    break;
                case 'quantity':
                    this.calculateTotalCostByQuantity(statePropValue);
                    break;
                default:
                    this.setState({ [statePropName]: statePropValue });
            }
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
        if (
            this.state.date &&
            this.state.date &&
            this.state.mileage &&
            this.state.fuel &&
            this.state.quantity &&
            this.state.pricePerLtr &&
            this.state.totalCost
        ) {
            this.setSaveLoading(true);

            let refuel: IRefuelCreateEdit = {
                date: this.state.date,
                time: this.state.time,
                mileage: this.state.mileage.trimEnd(),
                pricePerLtr: this.state.pricePerLtr,
                totalCost: this.state.totalCost,
                quantity: this.state.quantity,
                fillingStation: this.state.fillingStation,
                notes: this.state.notes,
                reason: this.state.reason,
                fuel: this.state.fuel,
            };

            //Create =>
            // 1. Save refuel;
            // 2. Create history model;
            // 3. Save history model;
            // 4. Get the new refuels;

            //Edit =>
            // 1. Save edited refuel;
            // 2. Get the history entry from the observable;
            // 3. Else get the history entry from the firebase;
            // 4. Save edited history entry;
            // 5. Refresh the refuels;
            // 6. Set the edited refuel in the refuel details screen.

            let refuelId: string;
            if (this.props.uiStore.modals.createRefuelModalOpen) {
                // Save the new refuel.
                refuelId = await this.props.vehicleStore.handleSaveRefuel(refuel);

                // If the refuel is successful create history entry.
                if (refuelId) {
                    let historyEntry = this.createHistoryEntryModel(refuel, refuelId);

                    // Create history entry.
                    await this.props.contentStore.saveHistoryEntry(this.props.vehicleStore.preferredVehicleId, historyEntry);
                }
            } else if (this.props.uiStore.modals.editRefuelModalOpen) {
                refuelId = this.state?.uid;

                // Save edited refuel.
                await this.props.vehicleStore.handleEditRefuel(refuel, refuelId);

                // Try to find the history entry in the entries observable.
                let historyEntry = this.props.contentStore.historyEntries?.find((x): boolean => x?.referenceId === refuelId);
                if (historyEntry?.uid) {
                    // If found get the id and create new history model by the edited refuel.
                    let historyEntryId = historyEntry.uid;

                    historyEntry = this.createHistoryEntryModel(refuel, refuelId, historyEntryId);
                } else {
                    // If the history entry doesn't exist in the entries observable(it is not loaded at the home screen),
                    // request to get it from the firebase.
                    let retrievedHistoryEntry = await this.props.contentStore.getHistoryEntryByReferenceId(
                        this.props.vehicleStore?.preferredVehicleId,
                        refuelId
                    );

                    if (retrievedHistoryEntry?.uid)
                        historyEntry = this.createHistoryEntryModel(refuel, refuelId, retrievedHistoryEntry.uid);
                }

                // Save edited history entry by refuel.
                historyEntry && (await this.props.contentStore.editHistoryEntry(this.props.vehicleStore.preferredVehicleId, historyEntry));
            }

            if (refuelId) {
                // Refresh refuels in order to show latest changes.
                await this.props.vehicleStore.getRefuelsByVehicleId(false, this.props.vehicleStore.preferredVehicleId);

                // Find the edited refuel and set it in the refuel view observable.
                let editedRefuel = this.props.vehicleStore.refuelsByVehicleId?.find((x): boolean => x?.uid === refuelId);
                editedRefuel && this.props.vehicleStore.setViewRefuel(editedRefuel);

                this.hideModal();
            } else {
                this.setSaveLoading(false);
            }
        } else {
            // CR: Add form validation.
            console.log('Please, form all fields');
        }
    }

    private createHistoryEntryModel(refuel: IRefuelCreateEdit, refuelId: string, historyEntryId?: string): IHistoryEntry {
        let historyEntry: IHistoryEntry;

        historyEntry = {
            cost: refuel.totalCost,
            date: refuel.date,
            mileage: refuel.mileage,
            referenceId: refuelId,
            title: 'Refueling', // CR: think about localization.
            type: 'refuel',
        };

        if (historyEntryId) {
            historyEntry.uid = historyEntryId;
        }

        return historyEntry;
    }
}
