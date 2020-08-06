import * as React from 'react';
import { IonList, IonItem, IonLabel, IonPage, IonContent, IonButtons, IonBackButton, IonRow, IonCol } from '@ionic/react';
import MainHeader from '../MainHeader/MainHeader';
import { GlobalColors } from '../../models/Constants/GlobalColors';
import { AppRoutes } from '../AppRoutes';
import './SettingsScreen.css';

export default class SettingsScreen extends React.Component {
    public render() {
        return (
            <IonPage>
                <MainHeader toolbarColor={GlobalColors.defaultColor} title="Settings" extraContent={this.extraContent} />
                <IonContent>
                    <IonList>
                        <IonLabel className="c-title">Experience</IonLabel>
                        <IonItem button lines="none">
                            <IonRow>
                                <IonCol>
                                    <IonLabel>Language</IonLabel>
                                    <IonLabel className="c-option-secondary">Bulgarian</IonLabel>
                                </IonCol>
                            </IonRow>
                        </IonItem>
                    </IonList>
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
}
