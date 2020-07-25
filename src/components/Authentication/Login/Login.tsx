import * as React from 'react';
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonRouterLink,
    IonSpinner,
} from '@ionic/react';
import { IUserStore } from '../../../stores/UserStore/UserStore';
import { inject, observer } from 'mobx-react';
import { Redirect } from 'react-router-dom';

interface LoginPageProps {
    loggedIn: boolean;
    userStore?: IUserStore;
}

interface LoginPageState {
    email: string;
    password: string;
    loading: boolean;
}

@inject('userStore')
@observer
export default class LoginPage extends React.Component<LoginPageProps, LoginPageState> {
    public state: LoginPageState = {
        email: '',
        password: '',
        loading: false,
    };

    private setEmail(email: string): void {
        this.setState({
            email: email,
        });
    }

    private setPassword(password: string): void {
        this.setState({
            password: password,
        });
    }

    private setLoading(loading: boolean): void {
        this.setState({
            loading: loading,
        });
    }

    private async handleLogin(): Promise<void> {
        this.setLoading(true);

        let authContext = await this.props.userStore.handleLogin({
            email: this.state.email,
            password: this.state.password,
        });

        // this.setLoading(false);
    }

    public render() {
        if (this.props.loggedIn) {
            return <Redirect to="/my/home" />;
        }

        return (
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>Login</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent className="ion-padding">
                    <IonList>
                        <IonItem>
                            <IonLabel position="floating">Email</IonLabel>
                            <IonInput
                                type="email"
                                onIonChange={(event): void => this.setEmail(event?.detail?.value ? event?.detail?.value : '')}
                            />
                        </IonItem>
                        <IonItem>
                            <IonLabel position="floating">Password</IonLabel>
                            <IonInput
                                type="password"
                                onIonChange={(event): void => this.setPassword(event?.detail?.value ? event?.detail?.value : '')}
                            />
                        </IonItem>
                    </IonList>
                    {/* {!status.isSuccessfulLoggedIn && <IonLabel color="danger">The email or password is invalid.</IonLabel>} */}
                    {/* <IonButton expand="block" disabled={status.isLoading} onClick={async (): Promise<void> => await this.handleLogin()}> */}
                    <IonButton expand="block" onClick={async (): Promise<void> => await this.handleLogin()} disabled={this.state.loading}>
                        {this.state.loading ? <IonSpinner name="crescent" /> : 'Login'}
                    </IonButton>
                    <IonLabel>
                        Don't have an account? <IonRouterLink routerLink="/register">Register</IonRouterLink>
                    </IonLabel>
                    {/* <IonLoading
                isOpen={status.isLoading}
                message={'Logging in...'}
            /> */}
                </IonContent>
            </IonPage>
        );
    }
}
