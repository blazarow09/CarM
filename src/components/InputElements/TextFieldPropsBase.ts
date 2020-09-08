export default interface TextFieldPropsBase {
    onChange?: (event: any) => void;
    label: string;
    value?: string;
    icon?: any;
    name?: string;
    withAdornment?: boolean;
    adornmentText?: string;
    adornmentPosition?: 'start' | 'end';
    helperText?: string;
    allowOnlyNumber?: boolean;
    fullWidth?: boolean;
}