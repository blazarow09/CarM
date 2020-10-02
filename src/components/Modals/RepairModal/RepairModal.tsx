import * as React from 'react';
import { IonContent, IonItem, IonButton, IonButtons, IonIcon, IonSpinner } from '@ionic/react';
import { observer, inject } from 'mobx-react';
import { IUiStore } from '../../../stores/UiStore/UiStore';
import { closeOutline as closeIcon, checkmarkOutline as saveButton } from 'ionicons/icons';
import { IVehicleStore } from '../../../stores/VehicleStore/VehicleStore';
import { IUserStore } from '../../../stores/UserStore/UserStore';
import ModalBase from '../ModalBase';
import { GlobalColors } from '../../../models/Constants/GlobalColors';
import IHistoryEntry from '../../../models/History/IHistoryEntry';
import { IContentStore } from '../../../stores/ContentStore/ContentStore';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { Moment } from 'moment';
// Icons
import BuildOutlinedIcon from '@material-ui/icons/BuildOutlined';
import MoneyOutlinedIcon from '@material-ui/icons/MoneyOutlined';
import LocalAtmOutlinedIcon from '@material-ui/icons/LocalAtmOutlined';
import NotesOutlinedIcon from '@material-ui/icons/NotesOutlined';
import LocationCityOutlinedIcon from '@material-ui/icons/LocationCityOutlined';
import DialpadOutlinedIcon from '@material-ui/icons/DialpadOutlined';
import DateRangeOutlinedIcon from '@material-ui/icons/DateRangeOutlined';

import CustomTextField from '../../InputElements/CustomTextField';
import { IRepair } from '../../../models/Repair/IRepair';
import CustomTextFieldWithMask from '../../InputElements/CustomTextFieldWithMask';
import CustomDatePicker from '../../InputElements/CustomDatePicker';

interface RepairModalState {
    date?: string;
    mileage?: string;
    repair?: string;
    cost?: string;
    place?: string;
    city?: string;
    phone?: string;
    notes?: string;
    saveLoading?: boolean;
    headerToolbarColor?: string;
    headerTitle?: string;
}

interface RepairModalProps {
    uiStore?: IUiStore;
    vehicleStore?: IVehicleStore;
    userStore?: IUserStore;
    contentStore?: IContentStore;
}

@inject('uiStore')
@inject('userStore')
@inject('vehicleStore')
@inject('contentStore')
@observer
export default class RepairModal extends ModalBase<RepairModalProps, RepairModalState> {
    protected visible(): boolean {
        return this.props.uiStore?.modals?.repairModalOpen;
    }

    public state: RepairModalState = {
        date: new Date().toISOString(),
        mileage: '',
        repair: '',
        cost: '',
        place: '',
        city: '',
        phone: '',
        notes: '',
        saveLoading: false,
        headerTitle: 'Add repair',
        headerToolbarColor: GlobalColors.orangeColor,
    };

    private muiTheme = createMuiTheme({
        palette: {
            primary: {
                main: GlobalColors.orangeColorRGB,
                light: GlobalColors.orangeColorRGB,
                dark: GlobalColors.orangeColorRGB,
            },
        },
    });

    private inputFieldTypes = new Array<string>('date', 'quantity', 'cost', 'notes', 'mileage', 'place', 'city', 'phone', 'repair');

    private handleInput = (event: any): void => {
        let statePropName = event?.target.getAttribute('name');
        let statePropValue = event?.target?.value;

        if (this.inputFieldTypes.includes(statePropName)) {
            this.setState({ [statePropName]: statePropValue });
        }
    }

    private setSaveLoading(loading: boolean): void {
        this.setState({
            saveLoading: loading,
        });
    }

    private handleDate = (date: Moment): void => {
        this.setState({
            date: date.toISOString(),
        });
    };

    protected content(): JSX.Element {
        return (
            <>
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
                                label="Repair"
                                name="repair"
                                onChange={this.handleInput}
                                value={this.state.repair}
                                icon={BuildOutlinedIcon}
                                fullWidth={true}
                            />
                        </IonItem>
                        <IonItem lines="none" className="c-input-field-item">
                            <CustomTextField
                                label="Cost"
                                name="cost"
                                onChange={this.handleInput}
                                type="number"
                                value={this.state.cost}
                                icon={LocalAtmOutlinedIcon}
                                fullWidth={true}
                                withAdornment={true}
                                adornmentPosition='end'
                                adornmentText='BGN'
                            />
                        </IonItem>
                        <IonItem lines="none" className="c-input-field-item">
                            <CustomTextField
                                label="Place"
                                name="place"
                                onChange={this.handleInput}
                                value={this.state.place}
                                icon={LocationCityOutlinedIcon}
                                trailingFieldsCount={1}
                                trailingFields={[
                                    <CustomTextField label="City" name="city" onChange={this.handleInput} value={this.state.city} />,
                                ]}
                            />
                        </IonItem>
                        <IonItem lines="none" className="c-input-field-item">
                            <CustomTextField
                                label="Contact"
                                name="phone"
                                onChange={this.handleInput}
                                value={this.state.phone}
                                icon={DialpadOutlinedIcon}
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
                    </ThemeProvider>
                </IonContent>
            </>
        );
    }

    private async handleVehicleSave(): Promise<void> {
        if (this.state.date && this.state.mileage && this.state.repair && this.state.cost) {
            this.setSaveLoading(true);

            var repair: IRepair = {
                date: this.state.date,
                mileage: this.state.mileage,
                repair: this.state.repair,
                cost: this.state.cost,
                place: this.state.place,
                city: this.state.city,
                phone: this.state.phone,
                note: this.state.notes,
            };

            let vehicleId = this.props.vehicleStore.preferredVehicleId;
            let userId = window?.authContext?.userId;

            let repairId = await this.props.vehicleStore.handleSaveRepair(repair, userId);

            await this.props.vehicleStore.getRepairsByVehicleId(false, vehicleId);

            if (repairId) {
                let historyEntry: IHistoryEntry = {
                    cost: repair.cost,
                    date: repair.date,
                    mileage: repair.mileage,
                    referenceId: repairId,
                    title: repair.repair, // CR: think about localization.
                    type: 'repair',
                };

                await this.props.contentStore.saveHistoryEntry(vehicleId, historyEntry);

                this.hideModal();
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
            // <IonButtons slot="end">
            //     <IonButton onClick={(): void => this.hideModal()}>
            //         <IonIcon slot="icon-only" icon={closeIcon} />
            //     </IonButton>
            // </IonButtons>
        );
    };
}
