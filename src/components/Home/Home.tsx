import * as React from 'react';
import {
    IonPage,
    IonButtons,
    IonButton,
    IonIcon,
    IonContent,
    IonItem,
    IonLabel,
    IonLoading,
    IonFab,
    IonFabButton,
    IonList,
} from '@ionic/react';
import { exitOutline as exitIcon, add as addIcon } from 'ionicons/icons';
import { IUserStore } from '../../stores/UserStore/UserStore';
import { observer, inject } from 'mobx-react';
import MainHeader from '../MainHeader/MainHeader';
import { IVehicleStore } from '../../stores/VehicleStore/VehicleStore';
import NoResultsScreen from '../NoResultsScreen/NoResultsScreen';
import ModalsContainer from '../Modals/ModalsContainer';
import { IUiStore, Modals } from '../../stores/UiStore/UiStore';
import { ILocalizationStore } from '../../stores/LocalizationStore/LocalizationStore';
import { IContentStore } from '../../stores/ContentStore/ContentStore';
import HistoryEntry from '../ServiceEntries/HistoryEntry';
import { AppRoutes } from '../AppRoutes';
import dayjs from 'dayjs';
import './Home.css';
import { DateFormat } from '../../models/Constants/DateFormat';
import LoadingScreen from '../Spinners/LoadingScreen';
import { GlobalColors } from '../../models/Constants/GlobalColors';
import calendarIcon from '../../img/icons/calendar-b.svg';

interface HomeProps {
    userStore?: IUserStore;
    vehicleStore?: IVehicleStore;
    uiStore?: IUiStore;
    localizationStore?: ILocalizationStore;
    contentStore?: IContentStore;
}

interface HomeState {
    dataLoading: boolean;
}

@inject('vehicleStore')
@inject('userStore')
@inject('uiStore')
@inject('localizationStore')
@inject('contentStore')
@observer
export default class Home extends React.Component<HomeProps, HomeState> {
    public state: HomeState = {
        dataLoading: true,
    };

    public async componentDidMount(): Promise<void> {
        await this.props.vehicleStore.getAvailableCars(false);
        await this.props.contentStore.getHistoryEntries(this.props.vehicleStore?.preferredVehicleId);

        // Stop loading indicator.
        this.setDataLoading(false);
    }

    // Causes thousands requests to the firestore.
    // public async componentDidUpdate(): Promise<void> {
    //     await this.props.contentStore.getHistoryEntries(this.props.vehicleStore.preferredVehicleId);
    // }

    public async componentWillUnmount(): Promise<void> {
        await this.props.vehicleStore.getAvailableCars(true);
    }

    private async logout(): Promise<void> {
        await this.props.userStore.handleLogout();
    }

    private setDataLoading(dataLoading: boolean): void {
        this.setState({
            dataLoading: dataLoading,
        });
    }

    private renderContent(): JSX.Element {
        return this.state.dataLoading ? (
            <LoadingScreen iconColor={GlobalColors.defaultColor} />
        ) : this.props.contentStore?.historyEntries?.length > 0 ? (
            this.renderHistoryContent()
        ) : (
            <NoResultsScreen extraContent={!this.props.vehicleStore.isAvailableCars && this.extraContentResultScreen} />
        );
    }

    private renderHistoryContent(): JSX.Element {
        let preferredVehicle = this.props.vehicleStore?.availableCars?.find(
            (x): boolean => x?.uid === this.props.vehicleStore?.preferredVehicleId
        );

        return (
            <>
                <IonItem>
                    <IonLabel>
                        {preferredVehicle?.vehicleName
                            ? preferredVehicle.vehicleName
                            : preferredVehicle?.manufacturer + ' ' + preferredVehicle?.model}
                    </IonLabel>
                    <IonButton expand="block" color="primary" fill="outline" routerLink={AppRoutes.vehicleScreenRoute}>
                        Change
                    </IonButton>
                    {/* <IonSelect
                    interface="popover"
                    onIonChange={(event) => this.setCurrentSelectedCar(event)}
                    value={this.props.vehicleStore?.preferredVehicleId}
                >
                    {this.props.vehicleStore.availableCars.map((car, index) => (
                        <IonSelectOption key={index} value={car?.uid}>
                            {`${car?.brand} - ${car?.model}`}{' '}
                        </IonSelectOption>
                    ))}
                </IonSelect> */}
                </IonItem>
                <IonList>
                    <IonItem lines="none">
                        <IonIcon className="c-entries-month-icon" icon={calendarIcon} />

                        <IonLabel className="c-entries-month">
                            {dayjs(Date.now()).format(DateFormat.defaultDateFormatFullMonthWithoutYear)}
                        </IonLabel>
                    </IonItem>
                    {this.props.contentStore.historyEntries.map((historyEntry, index) => (
                        <HistoryEntry key={index} historyEntry={historyEntry} />
                        /* <svg height="50" width="500" style={{ marginLeft: '9%' }}>
                                <line x1="0" y1="0" x2="0" y2="200" style={{ stroke: '#3dc2ff', strokeWidth: '4' }} />
                            </svg> */
                    ))}
                </IonList>
            </>
        );
    }

    public render() {
        if (!this.props.vehicleStore.availableCars) {
            return <IonLoading isOpen />;
        }

        return (
            <IonPage>
                <MainHeader title={this.props.localizationStore?.dashboardLabels?.headerTitle} extraContent={this.extraContent} />
                <IonContent>
                    {this.renderContent()}
                    <ModalsContainer />
                </IonContent>
            </IonPage>
        );
    }

    private extraContentResultScreen = (): JSX.Element => {
        // CR: Add default history events such as welcome to carM and one more - Star monitoring your vehicle expenses with Car M
        return (
            <IonFab horizontal="center" className="c-fab">
                <IonFabButton
                    color="light"
                    onClick={(): void => {
                        this.props.uiStore.openModal(Modals.VehicleModal);
                        this.props.uiStore.setCreateEditVehicleModalOpen('create', true);
                    }}
                >
                    <IonIcon icon={addIcon} />
                </IonFabButton>
            </IonFab>
        );
    };

    private extraContent = (): JSX.Element => {
        return (
            <IonButtons slot="end">
                {/* <IonButton>
                    <IonIcon icon={settingsIcon} slot="icon-only" />
                </IonButton> */}
                <IonButton onClick={async (): Promise<void> => await this.logout()}>
                    <IonIcon icon={exitIcon} slot="icon-only" />
                </IonButton>
            </IonButtons>
        );
    };
}
