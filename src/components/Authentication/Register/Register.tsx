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
} from '@ionic/react';
import { IUserStore } from '../../../stores/UserStore/UserStore';
import { observer, inject } from 'mobx-react';
import { Redirect } from 'react-router-dom';
import { AppRoutes } from '../../AppRoutes';

interface RegisterPageProps {
    loggedIn: boolean;
    userStore?: IUserStore;
}

interface RegisterPageState {
    email: string;
    password: string;
    passwordMatch: string;
}

@inject('userStore')
@observer
export default class RegisterPage extends React.Component<RegisterPageProps, RegisterPageState> {
    public state: RegisterPageState = {
        email: '',
        password: '',
        passwordMatch: '',
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

    private setPasswordMatch(passwordMatch: string): void {
        this.setState({
            passwordMatch: passwordMatch,
        });
    }

    private async handleRegister(): Promise<void> {
        let succeeded = await this.props.userStore.handleRegister({
            email: this.state.email,
            password: this.state.password,
            confirmPassword: this.state.passwordMatch,
        });
    }

    public render() {
        if (this.props.loggedIn) {
            return <Redirect to="/my/home" />;
        }

        return (
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>Register</IonTitle>
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
                        <IonItem>
                            <IonLabel position="floating">Confirm password</IonLabel>
                            <IonInput
                                type="password"
                                onIonChange={(event): void => this.setPasswordMatch(event?.detail?.value ? event?.detail?.value : '')}
                            />
                        </IonItem>
                    </IonList>
                    {/* {!status.isSuccessfulLoggedIn && <IonLabel color="danger">The email or password is invalid.</IonLabel>} */}
                    {/* <IonButton expand="block" disabled={status.isLoading} onClick={async (): Promise<void> => await this.handleLogin()}> */}
                    <IonButton expand="block" onClick={async (): Promise<void> => await this.handleRegister()}>
                        {/* {status.isLoading ? <IonSpinner name="dots" /> : 'Login'} */}
                        Register
                    </IonButton>
                    <IonLabel>
                        Already have an account? <IonRouterLink routerLink={AppRoutes.loginRoute}>Register</IonRouterLink>
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
