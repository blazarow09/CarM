import * as React from 'react';
import { IonPage, IonContent, IonFab, IonFabButton, IonIcon, IonButtons, IonBackButton } from '@ionic/react';
import MainHeader from '../MainHeader/MainHeader';
import NoResultsScreen from '../NoResultsScreen/NoResultsScreen';
import { Modals, IUiStore } from '../../stores/UiStore/UiStore';
import { AppRoutes } from '../AppRoutes';
import { addOutline as addIcon } from 'ionicons/icons';
import { observer, inject } from 'mobx-react';
import { IUserStore } from '../../stores/UserStore/UserStore';
import { GlobalColors } from '../../models/Constants/GlobalColors';
import { IVehicleStore } from '../../stores/VehicleStore/VehicleStore';
import RefuelEntry from '../ServiceEntries/RefuelEntry';

interface RefuelScreenProps {
    uiStore?: IUiStore;
    userStore?: IUserStore;
    vehicleStore?: IVehicleStore;
}

@inject('uiStore')
@inject('userStore')
@inject('vehicleStore')
@observer
export default class RefuelScreen extends React.Component<RefuelScreenProps> {
    public async componentDidMount(): Promise<void> {
        this.props.userStore.setHideTabsMenu(true);

        await this.props.vehicleStore.getRefuelsByVehicleId(
            false,
            this.props.userStore.userContext.userId,
            this.props.vehicleStore.preferredVehicleId
        );
    }

    public componentWillUnmount(): void {
        this.props.userStore.setHideTabsMenu(false);

        this.props.vehicleStore.getRefuelsByVehicleId(true, '', '');
    }

    public render() {
        return (
            <IonPage>
                <MainHeader toolbarColor={GlobalColors.purpleColor} title="Refuels" extraContent={this.extraContent} />
                <IonContent>
                    {this.props.vehicleStore?.refuelsByVehicleId?.length === 0 ? (
                        <NoResultsScreen />
                    ) : (
                        this.props.vehicleStore?.refuelsByVehicleId?.map((refuel, index) => (
                            <RefuelEntry key={index} refuelEntry={refuel} />
                        ))
                    )}

                    <IonFab vertical="bottom" horizontal="end" slot="fixed">
                        <IonFabButton
                            color={GlobalColors.purpleColor}
                            onClick={(): void => this.props.uiStore.openModal(Modals.RefuelModal)}
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
