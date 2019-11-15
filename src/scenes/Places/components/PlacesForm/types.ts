export type UserDTO = {
    id?: string,
    preferedSalutation: 'Mr.' | 'Mrs.' | 'Mrx.',
    title?: string,
    firstName: string,
    lastName: string,
    dateOfBirth: string,
    emailAddress: string,
    streetName: string,
    houseNumber: string,
    phoneNumber: string,
    mobileNumber: string
    city: string,
    state: string,
    zipCode: string,
    country: string,
    freeTextField: string,
    accessTokenId: string,
    pin: string,
    permissionIds: string[],
    isAdmin: boolean
}

export type FormFieldValidationState = {
    isValid: boolean,
    hasBeenTouched: boolean,
    errorText: string
}

export type FormErrors = {
    firstName: FormFieldValidationState,
    lastName: FormFieldValidationState,
    emailAddress: FormFieldValidationState,
    streetName: FormFieldValidationState,
    houseNumber: FormFieldValidationState,
    city: FormFieldValidationState,
    zipCode: FormFieldValidationState,
    country: FormFieldValidationState,
    accessTokenId: FormFieldValidationState,
    pin: FormFieldValidationState,
    [key: string]: FormFieldValidationState;
}
