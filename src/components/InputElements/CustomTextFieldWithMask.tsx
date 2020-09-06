import * as React from 'react';
import './CustomTextField.css';
import { Grid, TextField, InputAdornment } from '@material-ui/core';
import { IonIcon } from '@ionic/react';
import InputMask from 'react-input-mask';
import TextFieldPropsBase from './TextFieldPropsBase';

interface CustomTextFieldWithMaskProps extends TextFieldPropsBase {
    mask: string;
    maskChar: string;
}

export default class CustomTextFieldWithMask extends React.Component<CustomTextFieldWithMaskProps> {
    public render() {
        return (
            <InputMask
                mask={this.props.mask}
                maskChar={this.props.maskChar}
                value={this.props.value}
                onChange={this.props.onChange}
                name={this.props.name}
            >
                {() => (this.props.icon ? this.getTextFieldWithIcon() : this.getTextField())}
            </InputMask>
        );
    }

    private getTextField(): JSX.Element {
        return (
            <TextField
                className={`c-text-field`}
                name={this.props.name}
                // value={this.props.value && this.props.value}
                label={this.props.label}
                fullWidth={this.props.fullWidth && this.props.fullWidth}
                InputProps={{
                    endAdornment: this.props.withAdornment && this.props.adornmentPosition === 'end' && (
                        <InputAdornment position="end">{this.props.adornmentText}</InputAdornment>
                    ),
                    startAdornment: this.props.withAdornment && this.props.adornmentPosition === 'start' && (
                        <InputAdornment position="start">{this.props.adornmentText}</InputAdornment>
                    ),
                }}
                helperText={this.props.helperText && this.props.helperText}
            />
        );
    }

    private getTextFieldWithIcon(): JSX.Element {
        const iconClassName = this.props.helperText ? 'c-icon-customization-with-helper-text' : 'c-icon-customization';
        return (
            <Grid container>
                <Grid item xs={1}>
                    {typeof this.props.icon === 'string' ? (
                        <IonIcon className={iconClassName} icon={this.props.icon} />
                    ) : (
                        <div className={iconClassName}>
                            <this.props.icon />
                        </div>
                    )}
                </Grid>
                <Grid item xs={11} className="c-field-grid">
                    {this.getTextField()}
                </Grid>
            </Grid>
        );
    }
}
