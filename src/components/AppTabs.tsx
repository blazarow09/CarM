import * as React from 'react';
import { IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, IonIcon, IonLabel } from '@ionic/react';
import { Route, Redirect } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { IUserStore } from '../stores/UserStore/UserStore';
import Home from '../components/Home/Home';
import { AppRoutes } from './AppRoutes';
import { homeOutline as homeIcon, menuOutline as menuIcon } from 'ionicons/icons';
import HomeButton from './HomeButton/HomeButton';
import { IVehicleStore } from '../stores/VehicleStore/VehicleStore';
import VehicleScreen from './VehicleScreen/VehicleScreen';
import RepairScreen from './RepairScreen/RepairScreen';

interface AppTabsProps {
    userId: string;
    loggedIn: boolean;
    userStore?: IUserStore;
    vehicleStore?: IVehicleStore;
}

@inject('userStore')
@inject('vehicleStore')
@observer
export default class AppTabs extends React.Component<AppTabsProps> {
    public async componentDidMount(): Promise<void> {
        if (this.props?.userId) {
            this.props.userStore.setUserContext(this.props.userId);
            console.log('setUserContext');

            await this.props.vehicleStore.getPreferredVehicleId(this.props?.userId);
        }
    }

    public render() {
        if (!this.props.loggedIn) {
            return <Redirect to={AppRoutes.loginRoute} />;
        }

        return (
            <>
                {this.props.vehicleStore.isAvailableCars && <HomeButton hiddenAppTabs={this.props.userStore.hideTabsMenu}/>}
                <IonTabs>
                    <IonRouterOutlet>
                        <Route exact path={AppRoutes.homeRoute}>
                            <Home />
                        </Route>
                        <Route exact path={AppRoutes.vehicleScreenRoute}>
                            <VehicleScreen />
                        </Route>
                        <Route exact path={AppRoutes.repairScreenRoute}>
                            <RepairScreen />
                        </Route>
                    </IonRouterOutlet>

                    <IonTabBar slot="bottom" hidden={this.props.userStore.hideTabsMenu}>
                        <IonTabButton tab="home" href={AppRoutes.homeRoute}>
                            <IonIcon icon={homeIcon} />
                            <IonLabel>Home</IonLabel>
                        </IonTabButton>
                        {/* <IonTabButton tab="addEntry" disabled>
                            <IonIcon icon={addIcon} />
                            <IonLabel>Add</IonLabel>
                        </IonTabButton>
                        <IonTabButton tab="settings" disabled>
                            <IonIcon icon={reminderIcon} />
                            <IonLabel>Reminders</IonLabel>
                        </IonTabButton> */}
                        <IonTabButton tab="more" disabled>
                            <IonIcon icon={menuIcon} />
                            <IonLabel>More</IonLabel>
                        </IonTabButton>
                    </IonTabBar>
                </IonTabs>
            </>
        );
    }
}
