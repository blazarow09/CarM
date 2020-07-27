import * as React from 'react';
import { IonFab, IonFabButton, IonIcon, IonFabList, IonLabel } from '@ionic/react';
import { arrowUpCircleOutline as arrowUpButton, carOutline as vehicleIcon } from 'ionicons/icons';
import { observer, inject } from 'mobx-react';
import { IUiStore, Modals } from '../../stores/UiStore/UiStore';

interface HomeButtonProps {
    uiStore?: IUiStore;
}

@inject('uiStore')
@observer
export default class HomeButton extends React.Component<HomeButtonProps> {
    public render() {
        return (
            <IonFab vertical="bottom" horizontal="center" className="c-home-button">
                <IonFabButton color="primary">
                    <IonIcon icon={arrowUpButton} />
                </IonFabButton>
                <IonFabList side="top">
                    <IonLabel>Vehicle</IonLabel>
                    <IonFabButton color="secondary" onClick={(): void => this.props.uiStore.openCloseModal(Modals.AddCarModal, 'open')}>
                        <IonIcon icon={vehicleIcon} />
                    </IonFabButton>
                </IonFabList>
            </IonFab>
        );
    }
}
