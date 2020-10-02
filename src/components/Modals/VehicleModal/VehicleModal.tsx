import * as React from 'react';
import { IonButton, IonButtons, IonContent, IonIcon, IonSpinner, IonItem } from '@ionic/react';
import { inject, observer } from 'mobx-react';
import { IUiStore } from '../../../stores/UiStore/UiStore';
import { closeOutline as closeIcon, checkmarkOutline as saveButton } from 'ionicons/icons';
import { IVehicleStore } from '../../../stores/VehicleStore/VehicleStore';
import { IUserStore } from '../../../stores/UserStore/UserStore';
import { IVehicleViewModel } from '../../../models/Vehicle/IVehicleViewModel';
import ModalBase, { IModalBaseProps, IModalBaseState } from '../ModalBase';
import { GlobalColors } from '../../../models/Constants/GlobalColors';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CustomTextField from '../../InputElements/CustomTextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
//Icons
import DriveEtaOutlinedIcon from '@material-ui/icons/DriveEtaOutlined';
import BusinessOutlinedIcon from '@material-ui/icons/BusinessOutlined';
import FormatListBulletedOutlinedIcon from '@material-ui/icons/FormatListBulletedOutlined';
import AddIcon from '@material-ui/icons/Add';
import LooksOneIcon from '@material-ui/icons/LooksOne';
import LooksTwoIcon from '@material-ui/icons/LooksTwo';
import LinearScaleOutlinedIcon from '@material-ui/icons/LinearScaleOutlined';
import NotesOutlinedIcon from '@material-ui/icons/NotesOutlined';
import ConfirmationNumberIcon from '@material-ui/icons/ConfirmationNumber';
//Icons
import { manufacturers } from '../../../resources/Vehicle/Manufacturers';
import { TextField, Grid, ButtonGroup, Button, IconButton } from '@material-ui/core';
import './VehicleModal.css';
import { InputHelper } from '../../../helpers/InputHelper';
import CustomTextFieldWithMask from '../../InputElements/CustomTextFieldWithMask';

interface VehicleModalProps extends IModalBaseProps {
    uiStore?: IUiStore;
    vehicleStore?: IVehicleStore;
    userStore?: IUserStore;
}

interface VehicleModalState extends IModalBaseState {
    uid?: string;
    type?: string;
    manufacturer?: string;
    model?: string;
    vehicleName?: string;
    licensePlate?: string;
    year?: string;
    fuelTanksCount?: string;
    mainFuelType?: string;
    mainTankCapacity?: string;
    secondFuelType?: string;
    secondTankCapacity?: string;
    saveLoading?: boolean;
    headerToolbarColor?: string;
    chassisNumber?: string;
    vin?: string;
    notes?: string;
    headerTitle?: string;
    oneTankButtonTheme?: 'text' | 'contained' | 'outlined';
    twoTanksButtonTheme?: 'text' | 'contained' | 'outlined';
    moreOptions?: boolean;
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
        model: this.props.vehicleStore?.vehicleToEdit ? this.props.vehicleStore.vehicleToEdit?.model : '',
        licensePlate: this.props.vehicleStore?.vehicleToEdit ? this.props.vehicleStore.vehicleToEdit?.licensePlate : '',
        year: this.props.vehicleStore?.vehicleToEdit ? this.props.vehicleStore.vehicleToEdit?.year : '',
        vehicleName: this.props.vehicleStore?.vehicleToEdit ? this.props.vehicleStore.vehicleToEdit?.vehicleName : '',
        manufacturer: this.props.vehicleStore?.vehicleToEdit ? this.props.vehicleStore.vehicleToEdit?.manufacturer : '',
        fuelTanksCount: this.props.vehicleStore?.vehicleToEdit ? this.props.vehicleStore.vehicleToEdit?.fuelTanksCount : '',
        mainFuelType: this.props.vehicleStore?.vehicleToEdit ? this.props.vehicleStore.vehicleToEdit?.mainFuelType : '',
        mainTankCapacity: this.props.vehicleStore?.vehicleToEdit ? this.props.vehicleStore.vehicleToEdit?.mainTankCapacity : '',
        secondFuelType: this.props.vehicleStore?.vehicleToEdit ? this.props.vehicleStore.vehicleToEdit?.secondFuelType : '',
        secondTankCapacity: this.props.vehicleStore?.vehicleToEdit ? this.props.vehicleStore.vehicleToEdit?.secondTankCapacity : '',
        vin: this.props.vehicleStore?.vehicleToEdit ? this.props.vehicleStore.vehicleToEdit?.vin : '',
        chassisNumber: this.props.vehicleStore?.vehicleToEdit ? this.props.vehicleStore.vehicleToEdit?.chassisNumber : '',
        notes: this.props.vehicleStore?.vehicleToEdit ? this.props.vehicleStore.vehicleToEdit?.notes : '',
        saveLoading: false,
        headerTitle: this.props.uiStore.modals.createVehicleModalOpen ? 'Add vehicle' : 'Edit vehicle',
        headerToolbarColor: GlobalColors.redColor,
        oneTankButtonTheme: this.props.vehicleStore.vehicleToEdit?.fuelTanksCount === '1' ? 'contained' : 'outlined',
        twoTanksButtonTheme: this.props.vehicleStore.vehicleToEdit?.fuelTanksCount === '2' ? 'contained' : 'outlined',
        moreOptions: false, //CR: True if in edit mode there is license plate, year, chasis, vin or notes.
    };

    public componentDidMount(): void {
        if (this.props.uiStore.modals.editVehicleModalOpen) {
            let vehicleToEdit = this.props.vehicleStore.vehicleToEdit;

            if (vehicleToEdit.notes || vehicleToEdit.chassisNumber || vehicleToEdit.vin || vehicleToEdit.licensePlate || vehicleToEdit.year)
                this.setState({ moreOptions: true });
        }
    }

    private inputFieldTypes = new Array<string>(
        'type',
        'model',
        'fuel',
        'mileage',
        'vehicleName',
        'licensePlate',
        'year',
        'mainTankCapacity',
        'secondTankCapacity',
        'vin',
        'chassisNumber',
        'notes'
    );

    protected resetStores(): void {
        this.props.vehicleStore.setVehicleToEdit(null);
    }

    private handleInput = (event: any): void => {
        let statePropName = event?.target?.getAttribute('name');
        let statePropValue = event?.target?.value as string;

        if (this.inputFieldTypes.includes(statePropName)) {
            statePropValue.trim();

            this.setState({ [statePropName]: statePropValue });
        }
    };

    private handleVehicleTypeChange = (event: any): void => {
        this.setState({
            type: event?.target.value,
        });
    };

    private muiTheme = createMuiTheme({
        palette: {
            primary: {
                main: GlobalColors.redColorRGB,
                light: GlobalColors.redColorRGB,
                dark: GlobalColors.redColorRGB,
            },
        },
    });

    private vehicleTypes = [
        {
            value: 'Car',
            label: 'Car',
        },
        {
            value: 'Motorcycle',
            label: 'Motorcycle',
        },
        {
            value: 'Bus',
            label: 'Bus',
        },
    ];

    private onManufacturerChange = (_event: any, newValue: string): void => {
        this.setState({
            manufacturer: newValue,
        });
    };

    protected content(): JSX.Element {
        return (
            <IonContent>
                <ThemeProvider theme={this.muiTheme}>
                    <IonItem lines="none" className="c-input-field-item c-vehicle-margin-top">
                        <CustomTextField
                            label="Vehicle"
                            name="type"
                            onChange={this.handleVehicleTypeChange}
                            value={this.state.type}
                            icon={DriveEtaOutlinedIcon}
                            select={true}
                            selectOptions={this.vehicleTypes as HTMLOptionElement[]}
                        />
                    </IonItem>
                    <IonItem lines="none" className="c-input-field-item">
                        <Grid container spacing={1}>
                            <Grid item xs={1}></Grid>
                            <Grid item xs={11} className="c-field-grid">
                                <CustomTextField
                                    label="Vehicle name"
                                    name="vehicleName"
                                    onChange={this.handleInput}
                                    value={this.state.vehicleName}
                                />
                            </Grid>
                        </Grid>
                    </IonItem>
                    <IonItem lines="none" className="c-input-field-item">
                        <Autocomplete
                            freeSolo
                            disableClearable
                            fullWidth={true}
                            options={manufacturers.map((option) => option.name)}
                            onChange={this.onManufacturerChange}
                            value={this.state.manufacturer}
                            renderInput={(params) => (
                                <Grid container spacing={1}>
                                    <Grid item xs={1}>
                                        <div className="c-icon-customization-select">
                                            <BusinessOutlinedIcon />
                                        </div>
                                    </Grid>
                                    <Grid item xs={11} className="c-field-grid">
                                        <TextField
                                            {...params}
                                            label="Manufacturer"
                                            margin="normal"
                                            name="manufacturer"
                                            InputProps={{ ...params.InputProps, type: 'search' }}
                                        />
                                    </Grid>
                                </Grid>
                            )}
                        />
                    </IonItem>
                    <IonItem lines="none" className="c-input-field-item">
                        <CustomTextField
                            label="Model"
                            name="model"
                            onChange={this.handleInput}
                            value={this.state.model}
                            icon={FormatListBulletedOutlinedIcon}
                        />
                    </IonItem>
                    <IonItem lines="none" className="c-input-field-item c-vehicle-margin-top">
                        <Grid container spacing={1}>
                            <Grid item xs={1}></Grid>
                            <Grid item xs={11} className="c-field-grid">
                                <ButtonGroup fullWidth size="small" color="primary" aria-label="small primary button group">
                                    <Button
                                        className="c-one-tank-btn"
                                        variant={this.state.oneTankButtonTheme}
                                        aria-valuetext="1"
                                        onClick={(event: any): void => this.onTankChange(event)}
                                    >
                                        One tank
                                    </Button>
                                    <Button
                                        className="c-two-tanks-btn"
                                        variant={this.state.twoTanksButtonTheme}
                                        aria-valuetext="2"
                                        onClick={(event: any): void => this.onTankChange(event)}
                                    >
                                        Two tanks
                                    </Button>
                                </ButtonGroup>
                            </Grid>
                        </Grid>
                    </IonItem>
                    {this.state.fuelTanksCount === '1' && this.renderMainTankField()}
                    {this.state.fuelTanksCount === '2' && this.renderBothTankFields()}
                    {!!this.state.moreOptions && this.renderMoreOptions()}

                    {!this.state.moreOptions && (
                        <IonItem lines="none" className="c-input-field-item c-vehicle-margin-top c-more-options-item">
                            <Button className="c-more-options-btn" onClick={() => this.setState({ moreOptions: true })}>
                                <AddIcon />
                                <span className="c-more-options-text">More options</span>
                            </Button>
                        </IonItem>
                    )}
                </ThemeProvider>
            </IonContent>
        );
    }

    private renderMoreOptions(): JSX.Element {
        return (
            <>
                <IonItem lines="none" className="c-input-field-item c-vehicle-margin-top">
                    <CustomTextField
                        label="License plate"
                        onChange={this.handleInput}
                        name="licensePlate"
                        value={this.state.licensePlate}
                        icon={LinearScaleOutlinedIcon}
                        trailingFieldsCount={1}
                        trailingFields={[
                            <CustomTextFieldWithMask
                                onChange={this.handleInput}
                                label="Year"
                                allowOnlyNumber={true}
                                name="year"
                                fullWidth={true}
                                value={this.state.year}
                                mask="9999"
                                maskChar=" "
                            />,
                        ]}
                    />
                </IonItem>
                <IonItem lines="none" className="c-input-field-item c-vehicle-margin-top">
                    <CustomTextField
                        label="Chassis number"
                        onChange={this.handleInput}
                        name="chassisNumber"
                        value={this.state.chassisNumber}
                        icon={ConfirmationNumberIcon}
                        fullWidth={true}
                    />
                </IonItem>
                <IonItem lines="none" className="c-input-field-item c-vehicle-margin-top">
                    <CustomTextField
                        label="Identification (VIN)"
                        onChange={this.handleInput}
                        name="vin"
                        value={this.state.vin}
                        icon={ConfirmationNumberIcon}
                        fullWidth={true}
                    />
                </IonItem>
                <IonItem lines="none" className="c-input-field-item c-vehicle-margin-top">
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
            </>
        );
    }

    private renderBothTankFields(): JSX.Element {
        return (
            <>
                {this.renderMainTankField()}
                {this.renderSecondaryTankField()}
            </>
        );
    }

    private renderMainTankField(): JSX.Element {
        return (
            <>
                <p className="c-tank-title">Main Tank</p>
                <IonItem lines="none" className="c-input-field-item c-vehicle-margin-top">
                    <CustomTextField
                        label="Fuel type"
                        name="mainFuelType"
                        onChange={this.handleMainFuelTypeChange}
                        value={this.state.mainFuelType}
                        icon={LooksOneIcon}
                        select={true}
                        selectOptions={InputHelper.fuelTypes as HTMLOptionElement[]}
                        trailingFieldsCount={1}
                        trailingFields={[
                            <CustomTextFieldWithMask
                                onChange={this.handleInput}
                                label="Tank capacity"
                                withAdornment={true}
                                adornmentPosition="end"
                                adornmentText="L"
                                name="mainTankCapacity"
                                value={this.state.mainTankCapacity}
                                mask="99999999"
                                maskChar=""
                            />,
                        ]}
                    />
                </IonItem>
            </>
        );
    }

    private renderSecondaryTankField(): JSX.Element {
        return (
            <>
                <p className="c-tank-title">Secondary Tank</p>
                <IonItem lines="none" className="c-input-field-item c-vehicle-margin-top">
                    <CustomTextField
                        label="Fuel type"
                        name="secondFuelType"
                        onChange={this.handleSecondaryFuelTypeChange}
                        value={this.state.secondFuelType}
                        icon={LooksTwoIcon}
                        select={true}
                        selectOptions={InputHelper.fuelTypes as HTMLOptionElement[]}
                        trailingFieldsCount={1}
                        trailingFields={[
                            <CustomTextFieldWithMask
                                onChange={this.handleInput}
                                label="Tank capacity"
                                withAdornment={true}
                                adornmentPosition="end"
                                adornmentText="L"
                                name="secondTankCapacity"
                                value={this.state.secondTankCapacity}
                                mask="99999999"
                                maskChar=""
                            />,
                        ]}
                    />
                </IonItem>
            </>
        );
    }

    private handleMainFuelTypeChange = (event: any): void => {
        this.setState({
            mainFuelType: event?.target.value,
        });
    };

    private handleSecondaryFuelTypeChange = (event: any): void => {
        this.setState({
            secondFuelType: event?.target.value,
        });
    };

    private onTankChange(event: any, tankCount?: '1' | '2'): void {
        console.log(event.target.parentElement.ariaValueText);
        let fuelTanksCount = event?.target?.parentElement?.ariaValueText;

        if (fuelTanksCount === '1') {
            this.setState({
                oneTankButtonTheme: 'contained',
                twoTanksButtonTheme: 'outlined',
                fuelTanksCount: fuelTanksCount,
            });
        } else if (fuelTanksCount === '2') {
            this.setState({
                oneTankButtonTheme: 'outlined',
                twoTanksButtonTheme: 'contained',
                fuelTanksCount: fuelTanksCount,
            });
        }
    }

    private setSaveLoading(loading: boolean): void {
        this.setState({
            saveLoading: loading,
        });
    }

    private async handleVehicleSave(): Promise<void> {
        if (
            !this.state.type ||
            !this.state.manufacturer ||
            !this.state.model ||
            !this.state.vehicleName ||
            !this.state.fuelTanksCount ||
            (this.state.fuelTanksCount === '1' && (!this.state.mainTankCapacity || !this.state.mainFuelType)) ||
            (this.state.fuelTanksCount === '2' &&
                (!this.state.mainTankCapacity || !this.state.secondTankCapacity || !this.state.mainFuelType || !this.state.secondFuelType))
        ) {
            console.log('Please, form all fields');
            // CR: Error handle the input
            return;
        }

        this.setSaveLoading(true);

        let vehicleMainTank: IVehicleViewModel = { mainFuelType: '', mainTankCapacity: '' };
        let vehicleSecondaryTank: IVehicleViewModel = { secondFuelType: '', secondTankCapacity: '' };
        if (this.state.fuelTanksCount === '1') {
            vehicleMainTank.mainFuelType = this.state.mainFuelType;
            vehicleMainTank.mainTankCapacity = this.state.mainTankCapacity;
        } else if (this.state.fuelTanksCount === '2') {
            vehicleSecondaryTank.secondFuelType = this.state.secondFuelType;
            vehicleSecondaryTank.secondTankCapacity = this.state.secondTankCapacity;
        }

        let vehicle: IVehicleViewModel = {
            type: this.state.type,
            manufacturer: this.state.manufacturer,
            vehicleName: this.state.vehicleName,
            licensePlate: this.state.licensePlate,
            year: this.state.year,
            model: this.state.model,
            fuelTanksCount: this.state.fuelTanksCount,
            chassisNumber: this.state.chassisNumber,
            vin: this.state.vin,
            notes: this.state.notes,
            ...vehicleMainTank,
            ...vehicleSecondaryTank,
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
        await this.props.vehicleStore.getAvailableCars(false);

        // If at this moment this is the first entry in the vehicle's collection we should add a preferred vehicle in the user's collection
        // with the currently create car id.
        // Otherwise keep the preferred vehicle as to the users' choice.
        if (shouldSetPreferredVehicle) {
            let preferredVehicleId = this.props.vehicleStore?.availableCars[0]?.uid;

            await this.props.vehicleStore.savePreferredVehicleId(preferredVehicleId, userId);
        }

        this.setSaveLoading(false);

        this.hideModal();
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
