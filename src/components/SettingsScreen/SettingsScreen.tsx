import * as React from 'react';
import { IonList, IonItem, IonLabel, IonPage, IonContent, IonButtons, IonBackButton, IonRow, IonCol, IonAlert } from '@ionic/react';
import MainHeader from '../MainHeader/MainHeader';
import { GlobalColors } from '../../models/Constants/GlobalColors';
import { AppRoutes } from '../AppRoutes';
import './SettingsScreen.css';
import { observer, inject } from 'mobx-react';
import { IUserStore } from '../../stores/UserStore/UserStore';
import { ILocalizationStore } from '../../stores/LocalizationStore/LocalizationStore';

interface SettingsScreenProps {
    userStore?: IUserStore;
    localizationStore?: ILocalizationStore;
}

interface SettingsScreenState {
    isOpenLanguageOptions: boolean;
}

@inject('userStore')
@inject('localizationStore')
@observer
export default class SettingsScreen extends React.Component<SettingsScreenProps, SettingsScreenState> {
    public state: SettingsScreenState = {
        isOpenLanguageOptions: false,
    };

    public render() {
        return (
            <IonPage>
                <MainHeader toolbarColor={GlobalColors.defaultColor} title="Settings" extraContent={this.extraContent} />
                <IonContent>
                    <IonList>
                        <IonLabel className="c-title">Experience</IonLabel>
                        <IonItem lines="none" button onClick={(): void => this.openCloseLanguageOptions(true)}>
                            <IonRow>
                                <IonCol>
                                    <IonLabel>Language</IonLabel>
                                    <IonLabel className="c-option-secondary">Bulgarian</IonLabel>
                                </IonCol>
                            </IonRow>
                        </IonItem>
                    </IonList>
                    {this.renderLanguageOptions()}
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

    private openCloseLanguageOptions(status: boolean): void {
        this.setState({
            isOpenLanguageOptions: status,
        });
    }

    private renderLanguageOptions(): JSX.Element {
        return (
            <IonAlert
                isOpen={this.state.isOpenLanguageOptions}
                onDidDismiss={() => this.openCloseLanguageOptions(false)}
                header={'Change language'}
                inputs={[
                    {
                        name: 'language',
                        type: 'checkbox',
                        label: 'English',
                        value: 'EN',
                        checked: true,
                    },
                    {
                        name: 'language',
                        type: 'checkbox',
                        label: 'Български',
                        value: 'BG',
                    },
                ]}
                buttons={[
                    {
                        text: 'Cancel',
                        role: 'cancel',
                        cssClass: 'secondary',
                        handler: () => {
                            console.log('Confirm Cancel');
                        },
                    },
                    {
                        text: 'Ok',
                        handler: async (option): Promise<void> => {
                            if (option.length === 1) {
                                let currentUserSettings = this.props.userStore?.userSettings;

                                currentUserSettings.language = option[0];

                                await this.props.userStore.updateUserSettings(currentUserSettings);

                                this.props.localizationStore.populateLabelStore(this.props.userStore?.userSettings?.language);

                                console.log(option[0]);
                            }
                        },
                    },
                ]}
            />
        );
    }
}
