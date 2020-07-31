import * as React from 'react';
import { IonPage, IonContent, IonFab, IonFabButton, IonIcon, IonButtons, IonBackButton } from '@ionic/react';
import MainHeader from '../MainHeader/MainHeader';
import NoResultsScreen from '../NoResultsScreen/NoResultsScreen';
import { Modals, IUiStore } from '../../stores/UiStore/UiStore';
import { AppRoutes } from '../AppRoutes';
import { addOutline as addIcon } from 'ionicons/icons';
import { observer, inject } from 'mobx-react';
import { IUserStore } from '../../stores/UserStore/UserStore';

interface RefuelScreenProps {
    uiStore?: IUiStore;
    userStore?: IUserStore;
}

@inject('uiStore')
@inject('userStore')
@observer
export default class RefuelScreen extends React.Component<RefuelScreenProps> {
    public async componentDidMount(): Promise<void> {
        this.props.userStore.setHideTabsMenu(true);

       
    }

    public componentWillUnmount(): void {
        this.props.userStore.setHideTabsMenu(false);
    }

    public render() {
        return (
            <IonPage>
                <MainHeader toolbarColor="purple" title="Refuels" extraContent={this.extraContent} />
                <IonContent>
                    {/* {this.props.vehicleStore?.repairsByVehicleId?.length === 0 ? (
                        <NoResultsScreen />
                    ) : (
                        this.props.vehicleStore?.repairsByVehicleId?.map((repair) => <p key={repair.uid}>{repair?.repair}</p>)
                    )} */}

                    <IonFab vertical="bottom" horizontal="end" slot="fixed">
                        <IonFabButton className="c-color-purple" onClick={(): void => this.props.uiStore.openModal(Modals.RefuelModal)}>
                            <IonIcon icon={addIcon} />
                        </IonFabButton>
                    </IonFab>
                </IonContent>
            </IonPage>
        );
    }

    private extraContent = (): JSX.Element => {
        return (
            <IonButtons slot="start">
                <IonBackButton defaultHref={AppRoutes.homeRoute} />
            </IonButtons>
        );
    };
}
