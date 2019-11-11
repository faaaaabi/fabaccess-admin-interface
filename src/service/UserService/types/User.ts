import Address from "../../../types/Address";

class User {
    id?: string | undefined;
    preferedSalutation : 'Mr.' | 'Mrs.' | 'Mrx.' ;
    title: string | undefined ;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    address: Address;
    phoneNumber: string;
    mobileNumber: string;
    emailAddress: string;
    isAdmin: boolean;
    accessTokenId: string;
    pin: string;
    permissionIds: string[];
    freeTextField: string;


    constructor(preferedSalutation: "Mr." | "Mrs." | "Mrx.", title: string | undefined, firstName: string, lastName: string, dateOfBirth: string, address: Address, phoneNumber: string, mobileNumber: string, emailAddress: string, isAdmin: boolean, accessTokenId: string, pin: string, permissionIds: string[], freeTextField: string, id?: string | undefined) {
        this.id = id;
        this.preferedSalutation = preferedSalutation;
        this.title = title;
        this.firstName = firstName;
        this.lastName = lastName;
        this.dateOfBirth = dateOfBirth;
        this.address = address;
        this.phoneNumber = phoneNumber;
        this.mobileNumber = mobileNumber;
        this.emailAddress = emailAddress;
        this.isAdmin = isAdmin;
        this.accessTokenId = accessTokenId;
        this.pin = pin;
        this.permissionIds = permissionIds;
        this.freeTextField = freeTextField;
    }
}

export default User;