import * as React from 'react';
import { MuiPickersUtilsProvider, KeyboardDatePicker, KeyboardTimePicker } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import { DateFormat } from '../../models/Constants/DateFormat';
import { PropTypes, Grid, GridSize } from '@material-ui/core';
import { IonIcon } from '@ionic/react';
import './CustomTextField.css';

interface CustomTimePickerProps {
    label?: string;
    value?: string;
    margin?: PropTypes.Margin;
    onChange: (event: any) => void;
}

interface CustomDatePickerProps {
    format?: string;
    margin?: PropTypes.Margin;
    label?: string;
    value?: string;
    name?: string;
    icon?: any;
    fullWidth?: any;
    withTimePicker?: boolean;
    timePickerProps?: CustomTimePickerProps;
    onChange: (event: any) => void;
}

export default class CustomDatePicker extends React.Component<CustomDatePickerProps> {
    public render() {
        return this.props.icon ? this.getPickerWithIcon() : this.getDatePicker();
    }

    private getDatePicker(): JSX.Element {
        return (
            <KeyboardDatePicker
                format={this.props.format ? this.props.format : DateFormat.defaultDateFormat}
                margin={this.props.margin ? this.props.margin : 'normal'}
                label={this.props.label && this.props.label}
                value={this.props.value && this.props.value}
                onChange={this.props.onChange}
                name={this.props.name && this.props.name}
                fullWidth={this.props.fullWidth && this.props.fullWidth}
                KeyboardButtonProps={{
                    'aria-label': 'change date',
                }}
            />
        );
    }

    private getTimePicker(): JSX.Element {
        return (
            <KeyboardTimePicker
                margin={this.props.timePickerProps.margin ? this.props.timePickerProps.margin : 'normal'}
                label={this.props.timePickerProps.label && this.props.timePickerProps.label}
                value={this.props.timePickerProps.value}
                onChange={this.props.timePickerProps.onChange}
                KeyboardButtonProps={{
                    'aria-label': 'change time',
                }}
            />
        );
    }

    private getPickerWithIcon(): JSX.Element {
        let gridXsSizeDatePicker: GridSize = 11;
        let gridXsSizeTimePicker: GridSize;

        if (this.props.withTimePicker && this.props.timePickerProps) {
            gridXsSizeDatePicker = 6;
            gridXsSizeTimePicker = 5;
        }

        return (
            <Grid container spacing={1}>
                <Grid item xs={1}>
                    {typeof this.props.icon === 'string' ? (
                        <IonIcon className="c-icon-customization-date-picker" icon={this.props.icon} />
                    ) : (
                        <div className="c-icon-customization-date-picker">
                            <this.props.icon />
                        </div>
                    )}
                </Grid>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                    <Grid item xs={gridXsSizeDatePicker} className="c-field-grid">
                        {this.getDatePicker()}
                    </Grid>
                    {this.props.withTimePicker && this.props.timePickerProps && (
                        <Grid item xs={gridXsSizeTimePicker}>
                            {this.getTimePicker()}
                        </Grid>
                    )}
                </MuiPickersUtilsProvider>
            </Grid>
        );
    }
}
