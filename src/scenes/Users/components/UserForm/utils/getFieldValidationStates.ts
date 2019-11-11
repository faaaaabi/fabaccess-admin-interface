const computeFieldValidationStates = (name: string, value: string, formErrors: { [key: string]: { isValid: boolean, hasBeenTouched: boolean, errorText: string } }) => {
    let isFirstNameValid = formErrors.firstName.isValid, firstNameErrorText = formErrors.firstName.errorText,
        hasFirstNameBeenTouched = formErrors.firstName.hasBeenTouched,
        isLastNameValid = formErrors.lastName.isValid, lastNameErrorText = formErrors.lastName.errorText,
        hasLastNameBeenTouched = formErrors.lastName.hasBeenTouched,
        isEmailAddressValid = formErrors.emailAddress.isValid,
        emailAddressErrorText = formErrors.emailAddress.errorText,
        hasEmailAddressBeenTouched = formErrors.emailAddress.hasBeenTouched,
        isStreetNameValid = formErrors.streetName.isValid, streetNameErrorText = formErrors.streetName.errorText,
        hasStreetNameBeenTouched = formErrors.streetName.hasBeenTouched,
        isHouseNumberValid = formErrors.houseNumber.isValid, houseNumberErrorText = formErrors.houseNumber.errorText,
        hasHouseNumberBeenTouched = formErrors.houseNumber.hasBeenTouched,
        isCityValid = formErrors.city.isValid, cityErrorText = formErrors.city.errorText,
        hasCityBeenTouched = formErrors.houseNumber.hasBeenTouched,
        isZipCodeValid = formErrors.zipCode.isValid, zipCodeErrorText = formErrors.zipCode.errorText,
        hasZipCodeBeenTouched = formErrors.zipCode.hasBeenTouched,
        isCountryValid = formErrors.country.isValid, countryErrorText = formErrors.country.errorText,
        hasCountryBeenTouched = formErrors.country.hasBeenTouched,
        isAccessTokenIdUidValid = formErrors.accessTokenId.isValid,
        accessTokenIdErrorText = formErrors.accessTokenId.errorText,
        hasAccessTokenIdBeenTouched = formErrors.accessTokenId.hasBeenTouched,
        isPinValid = formErrors.pin.isValid, pinErrorText = formErrors.pin.errorText,
        hasPinBeenTouched = formErrors.pin.hasBeenTouched;

    switch (name) {
        case 'firstName':
            hasFirstNameBeenTouched = true
            isFirstNameValid = value.length > 0;
            firstNameErrorText = isFirstNameValid ? '' : 'Dieses Feld muss ausgefüllt werden';
            break;
        case 'lastName':
            hasLastNameBeenTouched = true
            isLastNameValid = value.length > 0;
            lastNameErrorText = isLastNameValid ? '' : 'Dieses Feld muss ausgefüllt werden';
            break;
        case 'emailAddress':
            hasEmailAddressBeenTouched = true
            const emailRegexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            const isEmailAddressFieldEmpty = value.length === 0;
            const isWellFormedEmailAddress = emailRegexp.test(value);
            isEmailAddressValid = !isEmailAddressFieldEmpty && isWellFormedEmailAddress;
            emailAddressErrorText = '';

            if (isEmailAddressFieldEmpty) {
                emailAddressErrorText = 'Dieses Feld muss ausgefüllt werden';
            } else if (!isWellFormedEmailAddress) {
                emailAddressErrorText = 'Bitte gib einen gültige E-Mail-Addresse an';

            }
            break;
        case 'streetName':
            hasStreetNameBeenTouched = true;
            isStreetNameValid = value.length > 0;
            streetNameErrorText = isStreetNameValid ? '' : 'Dieses Feld muss ausgefüllt werden';
            break;
        case 'houseNumber':
            hasHouseNumberBeenTouched = true;
            isHouseNumberValid = value.length > 0;
            houseNumberErrorText = isHouseNumberValid ? '' : 'Dieses Feld muss ausgefüllt werden';
            break;
        case 'city':
            hasCityBeenTouched = true;
            isCityValid = value.length > 0;
            cityErrorText = isCityValid ? '' : 'Dieses Feld muss ausgefüllt werden';
            break;
        case 'zipCode':
            hasZipCodeBeenTouched = true;
            const isZipCodeEmpty = value.length === 0;
            const isZipCodeAnInteger = Number.isInteger(parseInt(value));
            isZipCodeValid = !isZipCodeEmpty && isZipCodeAnInteger;
            zipCodeErrorText = '';

            if (isZipCodeEmpty) {
                zipCodeErrorText = 'Dieses Feld muss ausgefüllt werden';
            } else if (!isZipCodeAnInteger) {
                zipCodeErrorText = 'Bitte gib eine gültige Postleitzahl an';
            }
            break;
        case 'country':
            hasCountryBeenTouched = true;
            isCountryValid = value.length > 0;
            countryErrorText = isCountryValid ? '' : 'Dieses Feld muss ausgefüllt werden';
            break;
        case 'accessTokenId':
            hasAccessTokenIdBeenTouched = true;
            const hexUidRegex = /^[0-9A-F]+$/;
            const isWellFormedUID = hexUidRegex.test(value);
            const isRfidUidToShort = value.length < 6;
            const isRfidUidToLong = value.length > 6;
            const isRfidEmpty = value.length === 0;
            isAccessTokenIdUidValid = isWellFormedUID && !isRfidUidToShort && !isRfidUidToLong && !isRfidEmpty;
            accessTokenIdErrorText = '';
            if (isRfidEmpty) {
                accessTokenIdErrorText = 'Dieses Feld muss ausgefüllt werden';
            } else if (isRfidUidToShort || isRfidUidToLong) {
                accessTokenIdErrorText = 'Die ID muss genau 6 Zeichen lang sein';
            } else if (!isWellFormedUID) {
                accessTokenIdErrorText = 'Die ID darf nur aus gültigen Hex zeichen bestehen';
            }
            break;
        case 'pin':
            hasPinBeenTouched = true;
            const isPinANumber = Number.isInteger(parseInt(value));
            const isPinToShort = value.length < 4;
            const isPinToLong = value.length > 4;
            const isPinEmpty = value.length === 0;
            pinErrorText = '';
            isPinValid = isPinANumber && !isPinToShort && !isPinToLong;
            if (!isPinANumber) {
                pinErrorText = 'Bitte gib eine gültige PIN an. Diese darf nut als Zahlen bestehen'
            } else if (isPinEmpty) {
                pinErrorText = 'Diese Feld muss ausgefüllt werden';
            } else if (isPinToLong || isPinToShort) {
                pinErrorText = 'Die angegebene PIN muss genau 4 Zeichen lang sein'
            }
            break;
    }

    return {
        firstName: {isValid: isFirstNameValid, errorText: firstNameErrorText, hasBeenTouched: hasFirstNameBeenTouched},
        lastName: {isValid: isLastNameValid, errorText: lastNameErrorText, hasBeenTouched: hasLastNameBeenTouched},
        emailAddress: {
            isValid: isEmailAddressValid,
            errorText: emailAddressErrorText,
            hasBeenTouched: hasEmailAddressBeenTouched
        },
        streetName: {
            isValid: isStreetNameValid,
            errorText: streetNameErrorText,
            hasBeenTouched: hasStreetNameBeenTouched
        },
        houseNumber: {
            isValid: isHouseNumberValid,
            errorText: houseNumberErrorText,
            hasBeenTouched: hasHouseNumberBeenTouched
        },
        city: {isValid: isCityValid, errorText: cityErrorText, hasBeenTouched: hasCityBeenTouched},
        zipCode: {isValid: isZipCodeValid, errorText: zipCodeErrorText, hasBeenTouched: hasZipCodeBeenTouched},
        country: {isValid: isCountryValid, errorText: countryErrorText, hasBeenTouched: hasCountryBeenTouched},
        accessTokenId: {
            isValid: isAccessTokenIdUidValid,
            errorText: accessTokenIdErrorText,
            hasBeenTouched: hasAccessTokenIdBeenTouched
        },
        pin: {isValid: isPinValid, errorText: pinErrorText, hasBeenTouched: hasPinBeenTouched}
    };
};

export default computeFieldValidationStates