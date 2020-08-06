import * as React from 'react';
import { IonCol } from '@ionic/react';

interface IConBaseProps {
    className?: string;
}

export default class IconBase<TProps extends IConBaseProps> extends React.Component<TProps> {
    protected renderIcon(): JSX.Element {
        return null;
    }

    public render() {
        return (
            <IonCol size="1">
                <div className={`c-entry-thumbnail ${this.props?.className}`}>{this.renderIcon()}</div>
            </IonCol>
        );
    }
}
