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
} from '@ionic/react';
import { settingsOutline as settingsIcon, exitOutline as exitIcon, car } from 'ionicons/icons';
import { IUserStore } from '../../stores/UserStore/UserStore';
import { observer, inject } from 'mobx-react';
import MainHeader from '../MainHeader/MainHeader';
import { firestore } from '../../firebase/firebaseConfig.dev';
import { IContentStore } from '../../stores/ContentStore/ContentStore';
import NoVehicleScreen from '../NoVehicleScreen/NoVehicleScreen';
import ModalsContainer from '../Modals/ModalsContainer';

interface HomeProps {
    userStore?: IUserStore;
    contentStore?: IContentStore;
}

@inject('contentStore')
@inject('userStore')
@observer
export default class Home extends React.Component<HomeProps> {
    public async componentDidMount(): Promise<void> {
        await this.props.contentStore.getAvailableCars(false, this.props.userStore.userContext.userId);
    }

    public async componentWillUnmount(): Promise<void> {
        await this.props.contentStore.getAvailableCars(true);
    }

    private toggleTheme(checked: boolean): void {
        if (!checked) {
            document.body.classList.toggle('dark', checked);
        } else {
            document.body.classList.toggle('dark', checked);
        }
    }

    private async logout(): Promise<void> {
        await this.props.userStore.handleLogout();
    }

    public render() {
        if (!this.props.contentStore.availableCars) {
            return <IonLoading isOpen />;
        }

        return (
            <IonPage>
                <MainHeader title="Dashboard" extraContent={this.extraContent} />
                <IonContent>
                    {this.props.contentStore.isAvailableCars ? (
                        <IonItem>
                            <IonLabel>Select a car</IonLabel>
                            <IonSelect
                                // value={toppings}
                                interface="popover"
                                // onIonChange={(e) => setToppings(e.detail.value)}
                            >
                                {this.props.contentStore.availableCars.map((car, index) => (
                                    <IonSelectOption key={index} value={car.uid}>{`${car.brand} - ${car.model}`}</IonSelectOption>
                                ))}
                            </IonSelect>
                        </IonItem>
                    ) : (
                        <NoVehicleScreen />
                    )}
                    <ModalsContainer />

                </IonContent>
            </IonPage>
        );
    }

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
