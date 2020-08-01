import React from 'react';
import { IonModal } from '@ionic/react';
import { IUiStore } from '../../stores/UiStore/UiStore';
import MainHeader from '../MainHeader/MainHeader';
import './ModalBase.css';

export interface IModalBaseProps {
    // onDidDismiss?: = (): void};
    swipeToClose?: boolean;
    uiStore?: IUiStore;
}

export interface IModalBaseState {
    headerTitle?: string;
    headerToolbarColor?: string;
}

export default class ModalBase<TProps extends IModalBaseProps, TState extends IModalBaseState> extends React.Component<TProps, TState> {
    private backButtonListener = (_event: any): any => {
        this.props.uiStore.closeAllModals();
    };

    public componentDidMount(): void {
        document.addEventListener('ionBackButton', this.backButtonListener, true);
    }

    componentWillUnmount(): void {
        document.removeEventListener('ionBackButton', this.backButtonListener, true);
    }

    protected visible(): boolean {
        return false;
    }

    protected hideModal(): void {
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

    protected extraContent(): JSX.Element {
        return null;
    }

    public render(): JSX.Element {
        return (
            <IonModal
                isOpen={this.visible()}
                swipeToClose={this.props.swipeToClose ? this.props.swipeToClose : false}
                // onDidDismiss={(): void => this.props.onDidDismiss()}
            >
                <MainHeader
                    extraContent={this.extraContent}
                    title={this.state?.headerTitle}
                    toolbarColor={this.state?.headerToolbarColor}
                />
                {this.content()}
            </IonModal>
        );
    }
}
