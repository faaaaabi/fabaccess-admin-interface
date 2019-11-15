import {UserDTO} from "../../scenes/Users/components/UserForm/types";
import User from "./types/User";

const userDtoToUserMapper = (userDTO: UserDTO): User => {
    return new User(
        userDTO.preferedSalutation,
        userDTO.title,
        userDTO.firstName,
        userDTO.lastName,
        userDTO.dateOfBirth,
        {
            street: userDTO.streetName,
            houseNumber: userDTO.houseNumber,
            city: userDTO.city,
            postalCode: userDTO.zipCode,
            state: userDTO.state,
            country: userDTO.country
        },
        userDTO.phoneNumber,
        userDTO.mobileNumber,
        userDTO.emailAddress,
        userDTO.isAdmin,
        userDTO.accessTokenId,
        userDTO.pin,
        userDTO.permissionIds,
        userDTO.freeTextField,
        userDTO.id
    )

};

const userToUserDtoMapper = (user: User): UserDTO => {
    return {
        id: user.id,
        preferedSalutation: user.preferedSalutation,
        title: user.title,
        firstName: user.firstName,
        lastName: user.lastName,
        dateOfBirth: user.dateOfBirth,
        streetName: user.address.street,
        houseNumber: user.address.houseNumber,
        city: user.address.city,
        zipCode: user.address.postalCode,
        country: user.address.country,
        state: user.address.state,
        phoneNumber: user.phoneNumber,
        mobileNumber: user.mobileNumber,
        emailAddress: user.emailAddress,
        isAdmin: user.isAdmin,
        accessTokenId: user.accessTokenId,
        pin: user.pin,
        permissionIds: user.permissionIds,
        freeTextField: user.freeTextField
    }
};


export {userDtoToUserMapper, userToUserDtoMapper}

