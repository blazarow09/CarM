import * as React from 'react';
import { IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, IonIcon, IonLabel } from '@ionic/react';
import { Route, Redirect } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { IUserStore } from '../stores/UserStore/UserStore';
import Home from '../components/Home/Home';
import { AppRoutes } from './AppRoutes';
import { homeOutline as homeIcon, addOutline as addIcon, alarmOutline as reminderIcon, menuOutline as menuIcon } from 'ionicons/icons';

interface AppTabsProps {
    userId: string;
    loggedIn: boolean;
    userStore?: IUserStore;
}

@inject('userStore')
@observer
export default class AppTabs extends React.Component<AppTabsProps> {
    public render() {
        if (!this.props.loggedIn) {
            return <Redirect to={AppRoutes.loginRoute} />;
        }

        return (
            <IonTabs>
                <IonRouterOutlet>
                    <Route exact path={AppRoutes.homeRoute}>
                        <Home />
                    </Route>
                </IonRouterOutlet>

                <IonTabBar slot="bottom">
                    <IonTabButton tab="home" href={AppRoutes.homeRoute}>
                        <IonIcon icon={homeIcon} />
                        <IonLabel>Home</IonLabel>
                    </IonTabButton>
                    <IonTabButton tab="addEntry">
                        <IonIcon icon={addIcon} />
                        <IonLabel>Add</IonLabel>
                    </IonTabButton>
                    <IonTabButton tab="settings">
                        <IonIcon icon={reminderIcon} />
                        <IonLabel>Reminders</IonLabel>
                    </IonTabButton>
                    <IonTabButton tab="more">
                        <IonIcon icon={menuIcon} />
                        <IonLabel>More</IonLabel>
                    </IonTabButton>
                </IonTabBar>
            </IonTabs>
        );
    }
}
