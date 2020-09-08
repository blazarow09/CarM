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
import LinearScaleOutlinedIcon from '@material-ui/icons/LinearScaleOutlined';
//Icons
import { manufacturers } from '../../../resources/Vehicle/Manufacturers';
import { TextField, Grid, ButtonGroup, Button } from '@material-ui/core';
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
    tankCapacity?: string;
    saveLoading?: boolean;
    headerToolbarColor?: string;
    headerTitle?: string;
    oneTankButtonTheme: 'text' | 'contained' | 'outlined';
    twoTanksButtonTheme: 'text' | 'contained' | 'outlined';
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
        tankCapacity: this.props.vehicleStore?.vehicleToEdit ? this.props.vehicleStore.vehicleToEdit?.tankCapacity : '',
        saveLoading: false,
        headerTitle: this.props.uiStore.modals.createVehicleModalOpen ? 'Add vehicle' : 'Edit vehicle',
        headerToolbarColor: GlobalColors.redColor,
        oneTankButtonTheme: this.props.vehicleStore.vehicleToEdit?.fuelTanksCount === '1' ? 'contained' : 'outlined',
        twoTanksButtonTheme: this.props.vehicleStore.vehicleToEdit?.fuelTanksCount === '2' ? 'contained' : 'outlined',
    };

    private inputFieldTypes = new Array<string>('type', 'model', 'fuel', 'mileage', 'vehicleName', 'licensePlate', 'year');

    protected resetStores(): void {
        this.props.vehicleStore.setVehicleToEdit(null);
    }

    private handleInput = (event: any): void => {
        let statePropName = event?.target?.getAttribute('name');
        let statePropValue = event?.target?.value;

        if (this.inputFieldTypes.includes(statePropName)) {
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
                            <Grid item xs={1}>
                                {/* <div className="c-icon-customization-select">
                                            <BusinessOutlinedIcon />
                                        </div> */}
                            </Grid>
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
                </ThemeProvider>
            </IonContent>
        );
    }

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
        if (this.state.type && this.state.manufacturer && this.state.model && this.state.vehicleName && this.state.fuelTanksCount) {
            this.setSaveLoading(true);

            const vehicle: IVehicleViewModel = {
                type: this.state.type,
                manufacturer: this.state.manufacturer,
                vehicleName: this.state.vehicleName,
                licensePlate: this.state.licensePlate,
                year: this.state.year,
                model: this.state.model,
                fuelTanksCount: this.state.fuelTanksCount,
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
