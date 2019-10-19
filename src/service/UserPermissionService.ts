import {UserPermission} from "../scenes/Permissions/types";
import * as localForage from "localforage";

export class UserPermissionService {
    private dummyUserPermissions: UserPermission[] = [];

    constructor() {
        this.dummyUserPermissions = [
            {id: this.makeid(32), name: 'Sägen Benutzen', description: "Der Benutzer darf Sägen benutzen"},
            {id: this.makeid(32), name: '3D-Drucker benutzen', description: "Der Benutzer darf 3D Drucker benutzen"},
            {id: this.makeid(32), name: 'Drehmaschinen benutzen', description: "Der Benutzer darf Drehmaschinen benutzen"},
            {id: this.makeid(32), name: 'Lasercutter benutzen', description: "Der Benutzer darf Lasercutter benutzen"},
        ];
    }

    private async initiallySaveDummyUserPermissionsToLocalStorage(dummyPermissions: UserPermission[]): Promise<void> {
        const storedUserPermissions = await localForage.getItem('userPermissions');
        if (storedUserPermissions === null) {
            await localForage.setItem('userPermissions', dummyPermissions);
        }
    }

    private makeid = (length: number): string => {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    };

    async getAllUserPermissions(): Promise<UserPermission[]> {
        const storedUserPermissions: UserPermission[] = await localForage.getItem('userPermissions');
        if (storedUserPermissions !== null) {
            return storedUserPermissions;
        } else {
            this.initiallySaveDummyUserPermissionsToLocalStorage(this.dummyUserPermissions);
            return this.dummyUserPermissions
        }
    }

    async deleteUserPermissions(userPermissionId: string | string[]) {
        const storedUserPermissions: UserPermission[] = await this.getAllUserPermissions();
        let storedUserPermissionsWithoutDeleted: UserPermission[] = [];

        if (storedUserPermissions !== null) {
            if (Array.isArray(userPermissionId)) {
                storedUserPermissions.filter(userPermission => userPermission.id);
                storedUserPermissionsWithoutDeleted = storedUserPermissions.filter(userPermission => userPermissionId.indexOf(userPermission.id) === -1);
            } else {
                storedUserPermissionsWithoutDeleted = storedUserPermissions.filter(userPermission => userPermission.id !== userPermissionId);
            }
            await localForage.setItem('userPermissions', storedUserPermissionsWithoutDeleted);
            return;
        }
        console.error('[UserPermissionService.deleteUserPermissions] No stored user permissions found');
    }

    async addUserPermission(userPermissionName: string, userPermissionDescription: string) {
        const storedUserPermissions: UserPermission[] = await this.getAllUserPermissions();
        const generatedId = this.makeid(32);

        storedUserPermissions.push({id: generatedId, name: userPermissionName, description: userPermissionDescription});
        await localForage.setItem('userPermissions', storedUserPermissions);
    }

    async editUserPermission(userPermissionId: string, userPermissionName: string, userPermissionDescription: string) {
        const storedUserPermissons: UserPermission[] = await this.getAllUserPermissions();
        const userPermissionIndexToEdit = storedUserPermissons.findIndex(userPermisson => userPermisson.id === userPermissionId);
        storedUserPermissons[userPermissionIndexToEdit].name = userPermissionName;
        storedUserPermissons[userPermissionIndexToEdit].description = userPermissionDescription;
        await localForage.setItem('userPermissions', storedUserPermissons);
    }
}