import * as React from 'react';
import {
    IonPage,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonRouterLink,
    IonSpinner,
    IonCard,
    IonCardContent,
    IonRow,
    IonCol,
    IonIcon,
    IonToast,
} from '@ionic/react';
import { IUserStore } from '../../../stores/UserStore/UserStore';
import { inject, observer } from 'mobx-react';
import { Redirect } from 'react-router-dom';
import { logoGoogle as googleIcon, logoFacebook as fbIcon } from 'ionicons/icons';
import { AppRoutes } from '../../AppRoutes';

import '../LoginRegister.css';
import { GlobalColors } from '../../../models/Constants/GlobalColors';

interface LoginPageProps {
    loggedIn: boolean;
    userStore?: IUserStore;
}

interface LoginPageState {
    email: string;
    password: string;
    loading: boolean;
    anyError: boolean;
}

@inject('userStore')
@observer
export default class LoginPage extends React.Component<LoginPageProps, LoginPageState> {
    public state: LoginPageState = {
        email: '',
        password: '',
        loading: false,
        anyError: false
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

        let authResult = await this.props.userStore.handleLogin({
            email: this.state.email,
            password: this.state.password,
        });

        if(!authResult) {
            this.setLoading(false);
            this.setShowToast(true);
        }
     }

    private setCorrectStateSaveButton = (): boolean => {
        if (this.state.email === '' || this.state.password === '' || this.state.loading) {
            return true;
        }

        return false;
    };

    public render() {
        if (this.props.loggedIn) {
            return <Redirect to="/my/home" />;
        }

        return (
            <IonPage className="c-auth-form">
                <IonContent className="c-login-content">
                    <img className="c-logo-cars" src="https://prikachi.net/images/wnU9H.png" alt="carm logo" />
                    <IonCard className="c-card">
                        <IonCardContent>
                            <p className="c-sub-title">Log in using</p>

                            <IonRow className="ion-align-items-center">
                                <IonCol size="6">
                                    <IonButton fill="outline" color="secondary" className="c-provider-btn">
                                        <IonIcon icon={fbIcon} className="c-btn-icon" />
                                        <IonLabel>Facebook</IonLabel>
                                    </IonButton>
                                </IonCol>
                                <IonCol size="6">
                                    <IonButton fill="outline" color="secondary" className="c-provider-btn">
                                        <IonIcon icon={googleIcon} className="c-btn-icon" />
                                        <IonLabel>Google</IonLabel>
                                    </IonButton>
                                </IonCol>
                            </IonRow>

                            <div className="c-separator"></div>
                            <p className="c-or-label">OR</p>
                            <IonList className="c-form-fields">
                                <IonItem>
                                    <IonLabel position="floating">Email</IonLabel>
                                    <IonInput
                                        type="email"
                                        pattern="email"
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
                            <IonRouterLink>Forgot your password?</IonRouterLink>
                            {/* {!status.isSuccessfulLoggedIn && <IonLabel color="danger">The email or password is invalid.</IonLabel>} */}
                            <IonButton
                                className="c-save-buton"
                                expand="block"
                                color="secondary"
                                onClick={async (): Promise<void> => await this.handleLogin()}
                                disabled={this.setCorrectStateSaveButton()}
                            >
                                {this.state.loading ? <IonSpinner name="crescent" /> : 'Login'}
                            </IonButton>
                        </IonCardContent>
                    </IonCard>
                    <IonButton className="c-create-acc-btn" color="light" fill="clear" size="small" routerLink={AppRoutes.registerRoute}>
                        CREATE AN ACCOUNT
                    </IonButton>
                    <IonToast
                        isOpen={this.state.anyError}
                        onDidDismiss={() => this.setShowToast(false)}
                        message="Invalid email and/or password"
                        // message={this.props.localizationStore.vehicleLabels.preferredVehicleUpdateMessage}
                        duration={10000}
                        color={GlobalColors.redColor}
                    />
                </IonContent>
            </IonPage>
        );
    }

    private setShowToast(show: boolean): void {
        this.setState({
            anyError: show,
        });
    }
}
