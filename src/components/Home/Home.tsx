import * as React from 'react';
import {
    IonPage,
    IonButtons,
    IonButton,
    IonIcon,
    IonContent,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonLoading,
    IonFab,
    IonFabButton,
    IonCard,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonCardContent,
    IonList,
} from '@ionic/react';
import { settingsOutline as settingsIcon, exitOutline as exitIcon, add as addIcon } from 'ionicons/icons';
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
        this.setDataLoading(true);

        await this.props.vehicleStore.getAvailableCars(false, this.props.userStore.userContext.userId);
        await this.props.contentStore.getHistoryEntries(this.props.vehicleStore.preferredVehicleId);

        // Stop loading indicator.
        this.setDataLoading(false);
    }

    public async componentDidUpdate(): Promise<void> {
        await this.props.contentStore.getHistoryEntries(this.props.vehicleStore.preferredVehicleId);
    }

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
            <NoResultsScreen extraContent={!this.props.vehicleStore.isAvailableCars && this.extraContentResultScreen}/>
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
                        {preferredVehicle?.brand} {preferredVehicle?.model}
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
                        <IonLabel className="c-entries-month">
                            {dayjs(Date.now()).format(DateFormat.defaultDateFormatFullMonthWithoutYear)}
                        </IonLabel>
                    </IonItem>
                    {this.props.contentStore.historyEntries.map((historyEntry, index) => (
                        <HistoryEntry key={index} historyEntry={historyEntry} />
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
        // Add default history events such as welcome to carM and one more - Star monitoring your vehicle expenses with Car M
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
                <IonButton>
                    <IonIcon icon={settingsIcon} slot="icon-only" />
                </IonButton>
                <IonButton onClick={async (): Promise<void> => await this.logout()}>
                    <IonIcon icon={exitIcon} slot="icon-only" />
                </IonButton>
            </IonButtons>
        );
    };
}
