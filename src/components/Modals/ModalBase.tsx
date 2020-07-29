import React from 'react';
import { IonModal } from '@ionic/react';
import { IUiStore } from '../../stores/UiStore/UiStore';

export interface IModalBaseProps {
    // onDidDismiss(): void;
    swipeToClose?: boolean;

    uiStore?: IUiStore;
}

export interface IModalBaseState {}

export default class ModalBase<TProps extends IModalBaseProps, TState extends IModalBaseState> extends React.Component<TProps, TState> {
    protected visible(): boolean {
        return false;
    }

    protected hideDialog(): void {
        console.log('ModalBase: hiding modal');

        // request child classes to clear their stores
        this.resetStores();

        // close the modal and all others
        this.props.uiStore.closeAllModals();

        this.afterClose();
    }

    protected afterClose(): void {}

    protected resetStores(): void {}

    protected content(): JSX.Element {
        return null;
    }

    public render(): JSX.Element {
        return (
            <IonModal
                isOpen={this.visible()}
                swipeToClose={this.props.swipeToClose ? this.props.swipeToClose : false}
                // onDidDismiss={(): void => this.props.onDidDismiss()}
            >
                {this.content()}
            </IonModal>
        );
    }
}
