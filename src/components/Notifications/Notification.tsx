import { IonToast } from '@ionic/react';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { IUiStore } from '../../stores/UiStore/UiStore';

interface NotificationProps {
    uiStore?: IUiStore;
}

@observer
@inject('uiStore')
export default class Notification extends React.Component<NotificationProps> {
    public render() {
        return (
            <IonToast
                isOpen={this.props.uiStore.notificationOpen}
                onDidDismiss={() => this.props.uiStore.showHideNotification(false)}
                message={this.props.uiStore.notificationMessage}
                duration={this.props.uiStore.notificationDuration}
                color={this.props.uiStore.notificationColor}
            />
        );
    }
}
