import * as React from 'react';
import { IonRow, IonCol, IonLabel, IonInput, IonItem } from '@ionic/react';
import './TextFieldSuffix.css';

interface TextFieldSuffixProps {
    handleInput?: (event: any) => void;
    value?: string;
    type?: any;
    inputName?: string;
    suffix: string;
    labelPosition?: 'fixed' | 'stacked' | 'floating';
    labelText?: string;
    borderColor?: string;
    readonly?: boolean;
}

/**
 *
 */
export default class TextFieldSuffix extends React.Component<TextFieldSuffixProps> {
    public render() {
        return (
            <IonItem className={`c-input-field-${this.props.borderColor ? this.props.borderColor : 'default'}`}>
                <IonRow>
                    <IonCol size="9" className="c-input-column">
                        <IonLabel position={this.props.labelPosition}>{this.props.labelText}</IonLabel>
                        <IonInput
                            onIonChange={this.props.handleInput ? (event): void => this.props.handleInput(event) : null}
                            className="c-veh-input"
                            value={this.props.value}
                            type={this.props.type ? this.props.type : 'text'}
                            name={this.props.inputName}
                            readonly={!!this.props.readonly}
                        />
                    </IonCol>
                    <IonCol size="3">
                        <span className="c-input-suffix">{this.props.suffix}</span>
                    </IonCol>
                </IonRow>
            </IonItem>
        );
    }
}
