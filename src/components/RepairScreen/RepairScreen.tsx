import * as React from 'react';
import { IonPage, IonContent, IonFab, IonFabButton, IonIcon, IonButtons, IonBackButton, IonList } from '@ionic/react';
import MainHeader from '../MainHeader/MainHeader';
import { AppRoutes } from '../AppRoutes';
import { observer, inject } from 'mobx-react';
import { IUiStore, Modals } from '../../stores/UiStore/UiStore';
import { addOutline as addIcon } from 'ionicons/icons';
import { IUserStore } from '../../stores/UserStore/UserStore';
import { IVehicleStore } from '../../stores/VehicleStore/VehicleStore';
import NoResultsScreen from '../NoResultsScreen/NoResultsScreen';
import { GlobalColors } from '../../models/Constants/GlobalColors';
import RepairEntry from '../ServiceEntries/RepairEntry';

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
            false,
            this.props.vehicleStore.preferredVehicleId
        );
    }

    public componentWillUnmount(): void {
        this.props.userStore.setHideTabsMenu(false);

        this.props.vehicleStore.getRepairsByVehicleId(true, '');
    }

    private renderRepairsList(): JSX.Element {
        return (
            <IonList>
                {this.props.vehicleStore.repairsByVehicleId.map((repairEntry, index) => (
                    <RepairEntry key={index} repairEntry={repairEntry} />
                ))}
            </IonList>
        );
    }

    public render() {
        return (
            <IonPage>
                <MainHeader toolbarColor={GlobalColors.orangeColor} title="Repairs" extraContent={this.extraContent} />
                <IonContent>
                    {this.props.vehicleStore?.repairsByVehicleId?.length === 0 ? <NoResultsScreen /> : this.renderRepairsList()}

                    <IonFab vertical="bottom" horizontal="end" slot="fixed">
                        <IonFabButton
                            color={GlobalColors.orangeColor}
                            onClick={(): void => this.props.uiStore.openModal(Modals.RepairModal)}
                        >
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
