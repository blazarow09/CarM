import { IonApp, IonContent, IonHeader, IonTitle, IonToolbar, IonLoading } from '@ionic/react';
import React from 'react';
import { observer, inject } from 'mobx-react';
import { IUserStore } from '../stores/UserStore/UserStore';
import { IonReactRouter } from '@ionic/react-router';
import { Route, Redirect, Switch } from 'react-router-dom';
import LoginPage from './Authentication/Login/Login';
import RegisterPage from './Authentication/Register/Register';
import AppTabs from './AppTabs';

interface AppRouterProps {
    userStore?: IUserStore;
}

@inject('userStore')
@observer
export default class AppRouter extends React.Component<AppRouterProps> {
    public render() {
        return (
            <IonReactRouter>
                <Switch>
                    <Route exact path="/login">
                        <LoginPage />
                    </Route>
                    <Route exact path="/register">
                        <RegisterPage />
                    </Route>
                    <Route path="/my">
                        <AppTabs />
                    </Route>
                    {!this.props.userStore?.userContext?.loggedIn && <Redirect to="/register"/>}
                    {/* <Redirect exact path="/" to="/my/entries" /> */}
                </Switch>
            </IonReactRouter>
        );
    }
}
