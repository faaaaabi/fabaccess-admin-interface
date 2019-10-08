import {AccessDevice} from "../types";

export class AccessDeviceService {

    private dummyAccessDevices: AccessDevice[] = [];

    constructor() {
        const accessDevices: AccessDevice[] = [
            {name: 'Access Device 1', apiKey: 'SDFJK23432ASDLK2344'},
            {name: 'Access Device 2', apiKey: 'SDFJK23432ASDLK2344'},
            {name: 'Access Device 3', apiKey: 'SDFJK23432ASDLK2344'},
            {name: 'Access Device 4', apiKey: 'SDFJK23432ASDLK2344'},
            {name: 'Access Device 5', apiKey: 'SDFJK23432ASDLK2344'},
            {name: 'Access Device 6', apiKey: 'SDFJK23432ASDLK2344'},
            {name: 'Access Device 7', apiKey: 'SDFJK23432ASDLK2344'},
            {name: 'Access Device 8', apiKey: 'SDFJK23432ASDLK2344'},
            {name: 'Access Device 9', apiKey: 'SDFJK23432ASDLK2344'},
            {name: 'Access Device 10', apiKey: 'SDFJK23432ASDLK2344'}
        ];

        accessDevices.forEach((accessDevice: AccessDevice) => this.dummyAccessDevices.push(accessDevice))
    }

    getAllAccessDevices(): AccessDevice[] {
        return this.dummyAccessDevices;
    }

}