import * as React from 'react';
import { IonModal, IonButton, IonHeader, IonToolbar, IonTitle, IonButtons } from '@ionic/react';
import { inject, observer } from 'mobx-react';
import { IUiStore, Modals } from '../../../stores/UiStore/UiStore';

interface AddCarModalProps {
    uiStore?: IUiStore;
}

@inject('uiStore')
@observer
export default class AddCarModal extends React.Component<AddCarModalProps> {
    private visible(): boolean {
        return this.props.uiStore?.modals.addCarModal;
    }

    public render() {
        return (
            <>
                <IonModal isOpen={this.visible()} swipeToClose={true} onDidDismiss={(): void => this.props.uiStore.openCloseModal(Modals.AddCarModal, 'close')}>
                    <IonHeader >
                        <IonToolbar color="primary">
                            <IonTitle>Add car</IonTitle>
                            <IonButtons slot="end">
                                <IonButton onClick={(): void => this.props.uiStore.openCloseModal(Modals.AddCarModal, 'close')}>Close</IonButton>
                            </IonButtons>
                        </IonToolbar>
                    </IonHeader>
                </IonModal>
                {/* <IonButton onClick={() => setShowModal(true)}>Show Modal</IonButton> */}
            </>
        );
    }
}
