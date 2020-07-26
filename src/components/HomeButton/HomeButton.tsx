import * as React from 'react';
import { IonContent, IonFab, IonFabButton, IonIcon, IonFabList, IonLabel } from '@ionic/react';
import { arrowUpCircleOutline as arrowUpButton, walletOutline as walletIcon } from 'ionicons/icons';

export default class HomeButton extends React.Component {
    public render() {
        return (
            <IonContent>
                <IonFab vertical="bottom" horizontal="center">
                    <IonFabButton color="secondary">
                        <IonIcon icon={arrowUpButton} />
                    </IonFabButton>
                    <IonFabList side="top">
                        <IonLabel>Income</IonLabel>
                        <IonFabButton color="secondary">
                            <IonIcon icon={walletIcon} />
                        </IonFabButton>
                    </IonFabList>
                </IonFab>
            </IonContent>
        );
    }
}
