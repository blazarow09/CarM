import * as React from 'react';
import { IonHeader, IonToolbar, IonTitle } from '@ionic/react';

interface MainHeaderProps {
    title?: string;
    toolbarColor?: string;
    extraContent?: () => JSX.Element;
}

export default class MainHeader extends React.Component<MainHeaderProps> {
    public render() {
        return (
            <IonHeader>
                <IonToolbar color={this.props?.toolbarColor ? this.props?.toolbarColor : 'primary'}>
                    {this.props?.extraContent && this.props.extraContent()}
                    {this.props?.title && <IonTitle>{this.props.title}</IonTitle>}
                </IonToolbar>
            </IonHeader>
        );
    }
}
