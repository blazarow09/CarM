import * as React from 'react';
import { IonPage, IonButtons, IonIcon, IonBackButton, IonContent, IonList, IonItem, IonLabel } from '@ionic/react';
import MainHeader from '../MainHeader/MainHeader';
import { AppRoutes } from '../AppRoutes';
import { star as proIcon } from 'ionicons/icons';
import './MoreOptionsScreen.css';

export default class MoreOptionsScreen extends React.Component {
    public render() {
        return (
            <IonPage>
                <MainHeader title="Dashboard" />
                <IonContent>
                    <IonList>
                        <IonItem button lines="none" className="c-more-opt-item">
                            <IonIcon className="c-nav-icon" color="green" icon={proIcon} />
                            <IonLabel>PRO Version</IonLabel>
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
