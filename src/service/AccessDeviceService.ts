import {AccessDevice} from "../scenes/AccessDevices/types";
import * as localForage from "localforage";

export class AccessDeviceService {
    private dummyAccessDevices: AccessDevice[] = [];

    constructor() {
        this.dummyAccessDevices = [
            {id: this.makeid(32), name: 'Access Device 2', apiKey: this.makeid(64), placeId: "EpP273UdLSEoFwzYMoaYVyermpdv0VGA"},
            {id: this.makeid(32), name: 'Access Device 1', apiKey: this.makeid(64), placeId: "EpP273UdLSEoFwzYMoaYVyermpdv0VGA"},
            {id: this.makeid(32), name: 'Access Device 3', apiKey: this.makeid(64), placeId: "ur3Bntyl7l87m4uDJb3SIjqOjvyYS6oi"},
            {id: this.makeid(32), name: 'Access Device 4', apiKey: this.makeid(64), placeId: "ur3Bntyl7l87m4uDJb3SIjqOjvyYS6oi"},
            {id: this.makeid(32), name: 'Access Device 5', apiKey: this.makeid(64), placeId: "ur3Bntyl7l87m4uDJb3SIjqOjvyYS6oi"},
            {id: this.makeid(32), name: 'Access Device 6', apiKey: this.makeid(64), placeId: "ur3Bntyl7l87m4uDJb3SIjqOjvyYS6oi"},
            {id: this.makeid(32), name: 'Access Device 7', apiKey: this.makeid(64), placeId: "sAtvPAt9J8XzpLvyQaHTQ9UBAnwDLs8P"},
            {id: this.makeid(32), name: 'Access Device 8', apiKey: this.makeid(64), placeId: "UqEAlJYgsWdCHZGaak5jFNdsbJ57h7pQ"},
            {id: this.makeid(32), name: 'Access Device 9', apiKey: this.makeid(64), placeId: "mo2zg53I1JzDFb3AowMDkuOw29EV0W85"},
            {id: this.makeid(32), name: 'Access Device 10', apiKey: this.makeid(64), placeId: "mo2zg53I1JzDFb3AowMDkuOw29EV0W85"}
        ];
    }

    private async initiallySaveDummyAccessDevicesToLocalStorage(dummyAccessDevices: AccessDevice[]): Promise<void> {
        const storedAccessDevices = await localForage.getItem('accessDevices');
        if (storedAccessDevices === null) {
            await localForage.setItem('accessDevices', dummyAccessDevices);
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

    async getAllAccessDevices(): Promise<AccessDevice[]> {
        const storedAccessDevices: AccessDevice[] = await localForage.getItem('accessDevices');
        if (storedAccessDevices !== null) {
            return storedAccessDevices;
        } else {
            this.initiallySaveDummyAccessDevicesToLocalStorage(this.dummyAccessDevices);
            return this.dummyAccessDevices
        }
    }

    async deleteAccessDevices(accessDeviceIds: string | string[]) {
        const storedAccessDevices: AccessDevice[] = await this.getAllAccessDevices();
        let storedAccessDevicesWithoutDeleted: AccessDevice[] = [];

        console.log('accessDeviceToDelete:', accessDeviceIds);

        if (storedAccessDevices !== null) {
            if (Array.isArray(accessDeviceIds)) {
                storedAccessDevices.filter(accessDevice => accessDevice.id);
                storedAccessDevicesWithoutDeleted = storedAccessDevices.filter(accessDevice => accessDeviceIds.indexOf(accessDevice.id) === -1);
            } else {
                storedAccessDevicesWithoutDeleted = storedAccessDevices.filter(accessDevice => accessDevice.id !== accessDeviceIds);
            }

            await localForage.setItem('accessDevices', storedAccessDevicesWithoutDeleted);

            return;
        }

        console.error('[AccessDeviceService.deleteAccessDevice] No stored access devices found');
    }

    async addDevice(deviceName: string, placeId?: string) {
        const storedAccessDevices: AccessDevice[] = await this.getAllAccessDevices();
        const generatedId = this.makeid(32);
        const apiKey = this.makeid(64);

        storedAccessDevices.push({id: generatedId, name: deviceName, apiKey, placeId});
        await localForage.setItem('accessDevices', storedAccessDevices);
    }

    async editDevice(accessDeviceId: string, accessDeviceName: string, placeId?: string) {
        const storedAccessDevices: AccessDevice[] = await this.getAllAccessDevices();
        const accessDeviceIndexToEdit = storedAccessDevices.findIndex(accessDevice => accessDevice.id === accessDeviceId);
        console.log(accessDeviceIndexToEdit);
        storedAccessDevices[accessDeviceIndexToEdit].name = accessDeviceName;
        storedAccessDevices[accessDeviceIndexToEdit].placeId = placeId;
        await localForage.setItem('accessDevices', storedAccessDevices);
    }
}