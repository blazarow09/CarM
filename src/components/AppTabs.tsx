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
import RefuelScreen from './RefuelScreen/RefuelScreen';
import MoreOptionsScreen from './MoreOptionsScreen/MoreOptionsScreen';
import { ILocalizationStore } from '../stores/LocalizationStore/LocalizationStore';
import ViewRefuel from './RefuelScreen/ViewRefuel';
import SettingsScreen from './SettingsScreen/SettingsScreen';

interface AppTabsProps {
    userId: string;
    loggedIn: boolean;
    userStore?: IUserStore;
    vehicleStore?: IVehicleStore;
    localizationStore?: ILocalizationStore;
}

@inject('userStore')
@inject('vehicleStore')
@inject('localizationStore')
@observer
export default class AppTabs extends React.Component<AppTabsProps> {
    public async componentDidMount(): Promise<void> {
        if (this.props?.userId) {
            this.props.userStore.setUserContext(this.props.userId);
            console.log('setUserContext');

            this.props.localizationStore.populateLabelStore('EN');

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
                        <Route exact path={AppRoutes.refuelScreenRoute}>
                            <RefuelScreen />
                        </Route>
                        <Route exact path={AppRoutes.viewRefuelScreenRoute}>
                            <ViewRefuel />
                        </Route>
                        <Route exact path={AppRoutes.moreOptionsRoute}>
                            <MoreOptionsScreen />
                        </Route>
                        <Route exact path={AppRoutes.settingsRoute}>
                            <SettingsScreen />
                        </Route>
                    </IonRouterOutlet>

                    <IonTabBar className={this.props.userStore.hideTabsMenu && 'c-tabs-not-visible'} slot="bottom">
                        <IonTabButton tab="home" href={AppRoutes.homeRoute}>
                            <IonIcon icon={homeIcon} />
                            <IonLabel>{this.props.localizationStore?.dashboardLabels?.homeTabTitle}</IonLabel>
                        </IonTabButton>
                        {/* <IonTabButton tab="addEntry" disabled>
                            <IonIcon icon={addIcon} />
                            <IonLabel>Add</IonLabel>
                        </IonTabButton>
                        <IonTabButton tab="settings" disabled>
                            <IonIcon icon={reminderIcon} />
                            <IonLabel>Reminders</IonLabel>
                        </IonTabButton> */}
                        <IonTabButton tab="more" href={AppRoutes.moreOptionsRoute}>
                            <IonIcon icon={menuIcon} />
                            <IonLabel>{this.props.localizationStore?.dashboardLabels?.moreTabTitle}</IonLabel>
                        </IonTabButton>
                    </IonTabBar>
                </IonTabs>
            </>
        );
    }
}
