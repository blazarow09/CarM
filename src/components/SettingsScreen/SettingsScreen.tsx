import * as React from 'react';
import { IonList, IonItem, IonLabel, IonPage, IonContent, IonButtons, IonBackButton, IonRow, IonCol, IonAlert } from '@ionic/react';
import MainHeader from '../MainHeader/MainHeader';
import { GlobalColors } from '../../models/Constants/GlobalColors';
import { AppRoutes } from '../AppRoutes';
import './SettingsScreen.css';
import { observer, inject } from 'mobx-react';
import { IUserStore } from '../../stores/UserStore/UserStore';
import { ILocalizationStore } from '../../stores/LocalizationStore/LocalizationStore';
import { IUserSettingsCreateUpdate } from '../../models/User/IUserSettingsCreateUpdate';

interface SettingsScreenProps {
    userStore?: IUserStore;
    localizationStore?: ILocalizationStore;
}

interface SettingsScreenState {
    isOpenLanguageOptions: boolean;
    enChecked: boolean;
    bgChecked: boolean;
}

@inject('userStore')
@inject('localizationStore')
@observer
export default class SettingsScreen extends React.Component<SettingsScreenProps, SettingsScreenState> {
    public state: SettingsScreenState = {
        isOpenLanguageOptions: false,
        enChecked: this.props.userStore?.userSettings?.language === 'EN',
        bgChecked: this.props.userStore?.userSettings?.language === 'BG',
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
                        handler: (input) => {
                            if(input.checked) {
                                this.setState({
                                    bgChecked: false,
                                    enChecked: true,
                                });
                            }
                        },
                        checked: this.state.enChecked,
                        // checked: this.props.userStore.userSettings?.language === 'EN',
                    },
                    {
                        name: 'language',
                        type: 'checkbox',
                        label: 'Български',
                        value: 'BG',
                        handler: (input) => {
                            if(input.checked) {
                                this.setState({
                                    bgChecked: true,
                                    enChecked: false,
                                });
                            }
                        },
                        checked: this.state.bgChecked,
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
                        text: 'Save',
                        handler: async (option): Promise<void> => {
                            if (option.length === 1) {
                                let currentUserSettings = this.props.userStore?.userSettings;

                                currentUserSettings.language = option[0];

                                let userSettings: IUserSettingsCreateUpdate = {
                                    language: currentUserSettings.language,
                                };

                                await this.props.userStore.updateUserSettings(userSettings);

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
