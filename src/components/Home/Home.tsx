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
} from '@ionic/react';
import { settingsOutline as settingsIcon, exitOutline as exitIcon, add as addIcon } from 'ionicons/icons';
import { IUserStore } from '../../stores/UserStore/UserStore';
import { observer, inject } from 'mobx-react';
import MainHeader from '../MainHeader/MainHeader';
import { IVehicleStore } from '../../stores/VehicleStore/VehicleStore';
import NoResultsScreen from '../NoResultsScreen/NoResultsScreen';
import ModalsContainer from '../Modals/ModalsContainer';
import { IUiStore, Modals } from '../../stores/UiStore/UiStore';

interface HomeProps {
    userStore?: IUserStore;
    vehicleStore?: IVehicleStore;
    uiStore?: IUiStore;
}

@inject('vehicleStore')
@inject('userStore')
@inject('uiStore')
@observer
export default class Home extends React.Component<HomeProps> {
    // private backButtonPlugin = Plugins;
    // private BackButtonEvent = Plugins;

    public async componentDidMount(): Promise<void> {
        await this.props.vehicleStore.getAvailableCars(false, this.props.userStore.userContext.userId);
    }

    public async componentWillUnmount(): Promise<void> {
        await this.props.vehicleStore.getAvailableCars(true);
    }

    private async logout(): Promise<void> {
        await this.props.userStore.handleLogout();
    }

    private setCurrentSelectedCar(event: any): void {
        this.props.vehicleStore.savePreferredVehicleId(event?.target?.value, this.props.userStore.userContext?.userId);
    }

    public render() {
        if (!this.props.vehicleStore.availableCars) {
            return <IonLoading isOpen />;
        }

        return (
            <IonPage>
                <MainHeader title="Dashboard" extraContent={this.extraContent}/>
                <IonContent>
                    {this.props.vehicleStore.isAvailableCars ? (
                        <>
                            <IonItem>
                                <IonLabel>Preferred vehicle</IonLabel>
                                <IonSelect
                                    interface="popover"
                                    onIonChange={(event) => this.setCurrentSelectedCar(event)}
                                    value={this.props.vehicleStore?.preferredVehicleId}
                                >
                                    {this.props.vehicleStore.availableCars.map((car, index) => (
                                        <IonSelectOption key={index} value={car?.uid}>
                                            {`${car?.brand} - ${car?.model}`}{' '}
                                        </IonSelectOption>
                                    ))}
                                </IonSelect>
                            </IonItem>
                            <IonCard>
                                <IonCardHeader>
                                    <IonCardSubtitle>Card Subtitle</IonCardSubtitle>
                                    <IonCardTitle>Card Title</IonCardTitle>
                                </IonCardHeader>

                                <IonCardContent>
                                    Keep close to Nature's heart... and break clear away, once in awhile, and climb a mountain or spend a
                                    week in the woods. Wash your spirit clean.
                                </IonCardContent>
                            </IonCard>
                        </>
                    ) : (
                        <NoResultsScreen extraContent={this.extraContentResultScreen} />
                    )}
                    <ModalsContainer />
                </IonContent>
            </IonPage>
        );
    }

    private extraContentResultScreen = (): JSX.Element => {
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
