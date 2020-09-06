import * as React from 'react';
import { Grid, TextField, InputAdornment, GridSize } from '@material-ui/core';
import { IonIcon } from '@ionic/react';
import './CustomTextField.css';
import TextFieldPropsBase from './TextFieldPropsBase';

interface TextFieldWithIconProps extends TextFieldPropsBase {
    type?: 'number' | 'text';
    trailingFields?: JSX.Element[];
    trailingFieldsCount?: 1 | 2;
    // multiline?: boolean;
    // rows?: number;
}

export default class CustomTextField extends React.Component<TextFieldWithIconProps> {
    public render() {
        if (this.props.icon) return this.getTextFieldWithIcon();
        else return this.getTextField();
    }

    private getTextField(): JSX.Element {
        return (
            <TextField
                onChange={this.props.onChange}
                name={this.props.name && this.props.name}
                className={`c-text-field`}
                value={this.props.value && this.props.value}
                label={this.props.label}
                fullWidth={this.props.fullWidth && this.props.fullWidth}
                type={this.props.type && this.props.type}
                InputProps={{
                    endAdornment: this.props.withAdornment && this.props.adornmentPosition === 'end' && (
                        <InputAdornment position="end">{this.props.adornmentText}</InputAdornment>
                    ),
                    startAdornment: this.props.withAdornment && this.props.adornmentPosition === 'start' && (
                        <InputAdornment position="start">{this.props.adornmentText}</InputAdornment>
                    ),
                }}
                helperText={this.props.helperText && this.props.helperText}
                // multiline={this.props.multiline && this.props.multiline}
                // rows={this.props.multiline && this.props.rows && this.props.rows}
                // rowsMax={10}
            />
        );
    }

    private getTextFieldWithIcon(): JSX.Element {
        const iconClassName = this.props.helperText ? 'c-icon-customization-with-helper-text' : 'c-icon-customization';
        let gridXsSizeWithIcon: GridSize = 11;
        let gridXsSizeTrailing: GridSize;

        if (this.props.trailingFields && this.props.trailingFieldsCount) {
            if (this.props.trailingFieldsCount == 1 && this.props.trailingFields?.length === 1) {
                gridXsSizeWithIcon = 6;
                gridXsSizeTrailing = 5;
            } else if (this.props.trailingFieldsCount == 2 && this.props.trailingFields?.length === 2) {
                gridXsSizeWithIcon = 3;
                gridXsSizeTrailing = 4;
            }
        }

        return (
            <Grid container spacing={1}>
                <Grid item xs={1}>
                    {typeof this.props.icon === 'string' ? (
                        <IonIcon className={iconClassName} icon={this.props.icon} />
                    ) : (
                        <div className={iconClassName}>
                            <this.props.icon />
                        </div>
                    )}
                </Grid>
                <Grid item xs={gridXsSizeWithIcon} className="c-field-grid">
                    {this.getTextField()}
                </Grid>
                {this.props.trailingFields?.length > 0 &&
                    this.props.trailingFields.map((field, index) => {
                        return (
                            <Grid item xs={gridXsSizeTrailing} key={index}>
                                {field}
                            </Grid>
                        );
                    })}
            </Grid>
        );
    }

    private onlyNumberValidation(event: React.KeyboardEvent<HTMLDivElement>): void {
        const keyCode = event.keyCode || event.which;
        const keyValue = String.fromCharCode(keyCode);

        const pattern = /([0-9])/;

        if (!pattern.test(keyValue)) {
            event.preventDefault();
        }
    }
}
