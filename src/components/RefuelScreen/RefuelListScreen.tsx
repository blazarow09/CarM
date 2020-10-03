import * as React from 'react';
import { IonPage, IonContent, IonFab, IonFabButton, IonIcon, IonButtons, IonBackButton, IonButton } from '@ionic/react';
import MainHeader from '../MainHeader/MainHeader';
import NoResultsScreen from '../NoResultsScreen/NoResultsScreen';
import { Modals, IUiStore } from '../../stores/UiStore/UiStore';
import { AppRoutes } from '../AppRoutes';
import { addOutline as addIcon, createOutline as editIcon } from 'ionicons/icons';
import { observer, inject } from 'mobx-react';
import { IUserStore } from '../../stores/UserStore/UserStore';
import { GlobalColors } from '../../models/Constants/GlobalColors';
import { IVehicleStore } from '../../stores/VehicleStore/VehicleStore';
import RefuelEntry from '../ServiceEntries/RefuelEntry';
import LoadingScreen from '../Spinners/LoadingScreen';

interface RefuelListScreenProps {
    uiStore?: IUiStore;
    userStore?: IUserStore;
    vehicleStore?: IVehicleStore;
}

interface RefuelListScreenState {
    dataLoading: boolean;
}

@inject('uiStore')
@inject('userStore')
@inject('vehicleStore')
@observer
export default class RefuelListScreen extends React.Component<RefuelListScreenProps, RefuelListScreenState> {
    public async componentDidMount(): Promise<void> {
        this.setDataLoading(true);
        this.props.userStore.setHideTabsMenu(true);

        await this.props.vehicleStore.getRefuelsByVehicleId(
            false,
            this.props.vehicleStore.preferredVehicleId
        );

        this.setDataLoading(false);
    }

    public state: RefuelListScreenState = {
        dataLoading: false,
    };

    public componentWillUnmount(): void {
        this.props.userStore.setHideTabsMenu(false);

        this.props.vehicleStore.getRefuelsByVehicleId(true, '');
    }

    private setDataLoading(dataLoading: boolean): void {
        this.setState({
            dataLoading: dataLoading,
        });
    }

    private renderContent(): JSX.Element {
        return this.state.dataLoading ? (
            <LoadingScreen iconColor={GlobalColors.orangeColor} />
        ) : this.props.vehicleStore?.refuelsByVehicleId?.length > 0 ? (
            this.renderRefuelContent()
        ) : (
            <NoResultsScreen />
        );
    }

    private renderRefuelContent(): JSX.Element {
        return (
            <>
                {this.props.vehicleStore?.refuelsByVehicleId?.map((refuel, index) => (
                    <RefuelEntry key={index} refuelEntry={refuel} />
                ))}
            </>
        );
    }

    public render() {
        return (
            <IonPage>
                <MainHeader toolbarColor={GlobalColors.purpleColor} title="Refuels" extraContent={this.extraContent} />
                <IonContent>
                    {this.renderContent()}
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
