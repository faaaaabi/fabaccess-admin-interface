import * as localForage from "localforage";
import makeId from "../utils/makeId";
import dummyUsers from "../utils/dummyUsers";
import {UserDTO} from "../../scenes/Users/components/UserForm/types";
import User from "./types/User";
import {userDtoToUserMapper, userToUserDtoMapper}  from "./UserDtoToUserMapper";

export class UserService {
    private dummyUsers: User[] = [];

    constructor() {
        this.dummyUsers = dummyUsers;
    }

    private async initiallySaveDummyUsersToLocalStorage(dummyUsers: User[]): Promise<void> {
        const storedUsers = await localForage.getItem('users');
        if (storedUsers === null) {
            await localForage.setItem('users', dummyUsers);
        }
    }


    async getAllUsers(): Promise<UserDTO[]> {
        const storedUsers: User[] | null = await localForage.getItem('users');
        if (storedUsers !== null) {
            const userDTOs: UserDTO[] = storedUsers.map(storedUser => userToUserDtoMapper(storedUser));
            return userDTOs;
        } else {
            this.initiallySaveDummyUsersToLocalStorage(this.dummyUsers);
            return this.dummyUsers.map(dummyUser => userToUserDtoMapper(dummyUser));
        }
    }

    async deleteUsers(userIdsToDelete: string | string[]) {
        const storedUsers: User[] = await localForage.getItem('users');
        let storedUsersWithoutDeleted: User[] = [];

        if (storedUsers !== null) {
            if (Array.isArray(userIdsToDelete)) {

                storedUsersWithoutDeleted = storedUsers.filter(existingUser => {
                    const existingUserId = existingUser.id ? existingUser.id : '';
                    return userIdsToDelete.indexOf(existingUserId) === -1
                });
            } else {
                storedUsersWithoutDeleted = storedUsers.filter(user => user.id !== userIdsToDelete);
            }
            await localForage.setItem('users', storedUsersWithoutDeleted);
            return;
        }
        console.error('[UserService.deleteUsers] No stored users found');
    }

    async addUser(userDTO: UserDTO) {
        const newUser = userDtoToUserMapper(userDTO);
        newUser.id = makeId(32);

        const storedUsers: User[] = await localForage.getItem('users');
        storedUsers.push(newUser);
        await localForage.setItem('users', storedUsers);
    }

    async updateUser(userToUpdate: UserDTO) {
        const storedUsers: User[] = await localForage.getItem('users');
        const userToEditIndex = storedUsers.findIndex(existingUser => existingUser.id === userToUpdate.id);
        storedUsers[userToEditIndex] = userDtoToUserMapper(userToUpdate);
        await localForage.setItem('users', storedUsers);
    }

    async getUserById(userId: string) {
        const storedUsers: User[] = await localForage.getItem('users');
        const wantedUserId = storedUsers.findIndex(existingUser => existingUser.id === userId);
        return userToUserDtoMapper(storedUsers[wantedUserId]);
    }
}