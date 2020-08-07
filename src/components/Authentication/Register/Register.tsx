import * as React from 'react';
import {
    IonPage,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonCard,
    IonCardContent,
    IonRow,
    IonCol,
    IonIcon,
    IonSpinner,
    IonToast,
} from '@ionic/react';
import { IUserStore } from '../../../stores/UserStore/UserStore';
import { observer, inject } from 'mobx-react';
import { Redirect } from 'react-router-dom';
import { AppRoutes } from '../../AppRoutes';
import { logoGoogle as googleIcon, logoFacebook as fbIcon } from 'ionicons/icons';

import '../LoginRegister.css';
import { GlobalColors } from '../../../models/Constants/GlobalColors';

interface RegisterPageProps {
    loggedIn: boolean;
    userStore?: IUserStore;
}

interface RegisterPageState {
    email: string;
    password: string;
    passwordMatch: string;
    loading: boolean;
    anyError: boolean;
    errorMessage: string;
}

@inject('userStore')
@observer
export default class RegisterPage extends React.Component<RegisterPageProps, RegisterPageState> {
    public state: RegisterPageState = {
        email: '',
        password: '',
        passwordMatch: '',
        loading: false,
        anyError: false,
        errorMessage: '',
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

    private setLoading(loading: boolean): void {
        this.setState({
            loading: loading,
        });
    }

    private async handleRegister(): Promise<void> {
        this.setLoading(true);

        if (this.state.password !== this.state.passwordMatch) {
            this.setShowToast(true);

            this.setState({
                errorMessage: 'Your password and confirmation password do not match',
            });

            this.setLoading(false);
        } else {
            let succeeded = await this.props.userStore.handleRegister({
                email: this.state.email,
                password: this.state.password,
                confirmPassword: this.state.passwordMatch,
            });

            if (!succeeded) {
                this.setShowToast(true);

                this.setState({
                    errorMessage: 'Invalid email address',
                });

                this.setLoading(false);
            }
        }
    }

    private setCorrectStateSaveButton = (): boolean => {
        if (this.state.email === '' || this.state.password === '' || this.state.passwordMatch === '' || this.state.loading) {
            return true;
        }

        return false;
    };

    public render() {
        if (this.props.loggedIn) {
            return <Redirect to={AppRoutes.homeRoute} />;
        }

        return (
            <IonPage className="c-auth-form">
                <IonContent className="c-login-content">
                    <img className="c-logo-cars" src="https://prikachi.net/images/wnU9H.png" alt="carm logo" />

                    <IonCard className="c-card">
                        <IonCardContent>
                            <p className="c-sub-title">Create a CarM account</p>

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
                                        onIonChange={(event): void =>
                                            this.setPasswordMatch(event?.detail?.value ? event?.detail?.value : '')
                                        }
                                    />
                                </IonItem>
                            </IonList>
                            {/* {!status.isSuccessfulLoggedIn && <IonLabel color="danger">The email or password is invalid.</IonLabel>} */}
                            <IonButton
                                className="c-save-buton"
                                expand="block"
                                color="secondary"
                                onClick={async (): Promise<void> => await this.handleRegister()}
                                disabled={this.setCorrectStateSaveButton()}
                            >
                                {this.state.loading ? <IonSpinner name="crescent" /> : 'CREATE AN ACCOUNT'}
                            </IonButton>
                            <IonButton className="c-cancel-btn" color="primary" fill="clear" size="small" routerLink={AppRoutes.loginRoute}>
                                CANCEL
                            </IonButton>
                        </IonCardContent>
                    </IonCard>
                    <IonToast
                        isOpen={this.state.anyError}
                        onDidDismiss={() => {
                            this.setShowToast(false);
                            this.setState({
                                errorMessage: '',
                            });
                        }}
                        message={this.state.errorMessage}
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
