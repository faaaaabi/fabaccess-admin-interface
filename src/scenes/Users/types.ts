import Address from "../../types/Address";

export type User = {
    id?: string
    preferredSalutation: 'Mr.' | 'Mrs.' | 'Mx.' | undefined
    title?: string
    firstName: string
    lastName: string
    dateOfBirth: string
    address: Address
    phoneNumber?: string
    mobileNumber?: string
    emailAddress: string
    isAdmin: boolean
    accessTokenId?: string
    pin: string
    permissionIds: string[]
    freeTextField?: string
}