import {AccessDevice} from "../types";
import * as localForage from "localforage";

export class AccessDeviceService {
    constructor() {
        const accessDevices: AccessDevice[] = [
            {id: '1', name: 'Access Device 2', apiKey: 'SDFJK23432ASDLK2344'},
            {id: '2', name: 'Access Device 1', apiKey: 'SDFJK23432ASDLK2344'},
            {id: '3', name: 'Access Device 3', apiKey: 'SDFJK23432ASDLK2344'},
            {id: '4', name: 'Access Device 4', apiKey: 'SDFJK23432ASDLK2344'},
            {id: '5', name: 'Access Device 5', apiKey: 'SDFJK23432ASDLK2344'},
            {id: '6', name: 'Access Device 6', apiKey: 'SDFJK23432ASDLK2344'},
            {id: '7', name: 'Access Device 7', apiKey: 'SDFJK23432ASDLK2344'},
            {id: '8', name: 'Access Device 8', apiKey: 'SDFJK23432ASDLK2344'},
            {id: '9', name: 'Access Device 9', apiKey: 'SDFJK23432ASDLK2344'},
            {id: '10', name: 'Access Device 10', apiKey: 'SDFJK23432ASDLK2344'}
        ];

        const dummyAccessDevices: AccessDevice[] = [];

        accessDevices.forEach((accessDevice: AccessDevice) => dummyAccessDevices.push(accessDevice))

        this.initiallySaveDummyAccessDevicesToLocalStorage(dummyAccessDevices);
    }

    private async initiallySaveDummyAccessDevicesToLocalStorage(dummyAccessDevices: AccessDevice[]): Promise<void>  {
        const storedAccessDevices = await localForage.getItem('accessDevices');
        if(storedAccessDevices === null) {
            await localForage.setItem('accessDevices', dummyAccessDevices);
        }
    }

    async getAllAccessDevices(): Promise<AccessDevice[]> {
        const storedAccessDevices: AccessDevice[] = await localForage.getItem('accessDevices');
        if (storedAccessDevices !== null) {
            return storedAccessDevices;
        }

        console.log('[AccessDeviceService.getAllAccessDevices] No stored access devices found');
        return [];
    }

    async deleteAccessDevices(accessDeviceIds: string | string[]) {
        const storedAccessDevices: AccessDevice[] | null = await localForage.getItem('accessDevices');
        let storedAccessDevicesWithoutDeleted: AccessDevice[] = [];

        console.log('accessDeviceToDelete:', accessDeviceIds);

        if (storedAccessDevices !== null) {
            if(Array.isArray(accessDeviceIds)) {
                storedAccessDevices.filter(accessDevice => accessDevice.id)
                storedAccessDevicesWithoutDeleted = storedAccessDevices.filter(accessDevice => accessDeviceIds.indexOf(accessDevice.id) === -1);
            } else {
                storedAccessDevicesWithoutDeleted = storedAccessDevices.filter(accessDevice => accessDevice.id !== accessDeviceIds);
            }

            await localForage.setItem('accessDevices', storedAccessDevicesWithoutDeleted);

            return;
        }

        console.error('[AccessDeviceService.deleteAccessDevice] No stored access devices found');
    }
}