import {FormControl, InputLabel, Input, FormHelperText} from '@material-ui/core';
import React from 'react';

export type FieldProps = {
    value: string
    id: string
    name: string
    label: string
    className?: string
    onChangeFunction?: Function
    onBlurFunction?: Function
    required: boolean
    hasError?: boolean
    errorText?: string
}

const FormControlledField = (props: FieldProps) => {
    return (
        <FormControl fullWidth={true} className={props.className}>
            <InputLabel
                error={props.hasError}
                required={props.required}
                htmlFor={props.id}
            >
                {props.label}
            </InputLabel>
            <Input
                required={true}
                fullWidth={true}
                error={props.hasError}
                id={props.id}
                name={props.name}
                value={props.value}
                onChange={(event) => {
                    if(props.onChangeFunction) {
                        props.onChangeFunction(event)
                    }
                }}
                onBlur={(event) => {
                    if(props.onBlurFunction) {
                        props.onBlurFunction(event)
                    }
                }}
            />
            <FormHelperText error={props.hasError}>{props.errorText}</FormHelperText>
        </FormControl>
    )
};

export default FormControlledField