import React from 'react';
import { IonReactRouter } from '@ionic/react-router';
import { Route, Redirect, Switch } from 'react-router-dom';
import LoginPage from './Authentication/Login/Login';
import RegisterPage from './Authentication/Register/Register';
import AppTabs from './AppTabs';
import { AppRoutes } from './AppRoutes';
import { useAuth } from './Authentication/AuthGuard/AuthGuard';
import { IAuthContext } from '../services/AuthService';

declare global {
    interface Window {
        authContext: IAuthContext;
    }
}

const AppRouter: React.FC = () => {
    const { loggedIn, userId, email } = useAuth();

    const userContext: IAuthContext = {
        userId: userId,
        loggedIn: loggedIn,
        email: email,
    };

    window.authContext = userContext;

    return (
        <IonReactRouter>
            <Switch>
                <Route exact path={AppRoutes.loginRoute}>
                    <LoginPage loggedIn={loggedIn} />
                </Route>
                <Route exact path={AppRoutes.registerRoute}>
                    <RegisterPage loggedIn={loggedIn} />
                </Route>
                <Route path={AppRoutes.prefixMyRoute}>
                    <AppTabs userId={userId} loggedIn={loggedIn} />
                </Route>
                <Redirect exact path="/" to={AppRoutes.homeRoute} />
            </Switch>
        </IonReactRouter>
    );
};

export default AppRouter;
