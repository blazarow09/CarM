import * as React from 'react';
import { IonPage, IonContent, IonFab, IonFabButton, IonIcon, IonButtons, IonBackButton } from '@ionic/react';
import MainHeader from '../MainHeader/MainHeader';
import { AppRoutes } from '../AppRoutes';
import { observer, inject } from 'mobx-react';
import { IUiStore, Modals } from '../../stores/UiStore/UiStore';
import { addOutline as addIcon } from 'ionicons/icons';
import { IUserStore } from '../../stores/UserStore/UserStore';
import { IVehicleStore } from '../../stores/VehicleStore/VehicleStore';
import NoResultsScreen from '../NoResultsScreen/NoResultsScreen';
interface RepairScreenProps {
    uiStore?: IUiStore;
    userStore?: IUserStore;
    vehicleStore?: IVehicleStore;
}

@inject('uiStore')
@inject('userStore')
@inject('vehicleStore')
@observer
export default class RepairScreen extends React.Component<RepairScreenProps> {
    public async componentDidMount(): Promise<void> {
        this.props.userStore.setHideTabsMenu(true);

        await this.props.vehicleStore.getRepairsByVehicleId(
            this.props.vehicleStore.preferredVehicleId,
            this.props.userStore.userContext?.userId
        );
    }

    public componentWillUnmount(): void {
        this.props.userStore.setHideTabsMenu(false);
    }

    public render() {
        return (
            <IonPage>
                <MainHeader toolbarColor="warning" title="Repairs" extraContent={this.extraContent} />
                <IonContent>
                    {this.props.vehicleStore?.repairsByVehicleId?.length === 0 ? (
                        <NoResultsScreen />
                    ) : (
                        this.props.vehicleStore?.repairsByVehicleId?.map((repair) => <p key={repair.uid}>{repair?.repair}</p>)
                    )}

                    <IonFab vertical="bottom" horizontal="end" slot="fixed">
                        <IonFabButton color="warning" onClick={(): void => this.props.uiStore.openCloseModal(Modals.AddRepairModal)}>
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
