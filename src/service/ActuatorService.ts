import {Actuator} from "../scenes/Actuators/components/ActorOverview/types";
import * as localForage from "localforage";

export class ActuatorService {
    private dummyActuators: Actuator[] = [];

    constructor() {
        this.dummyActuators = [
            {id: this.makeid(32), name: 'SteckdoseA1215', type: 'switch',  system: 'openHAB', status: 'online'},
            {id: this.makeid(32), name: 'SteckdoseA7523', type: 'switch', system: 'openHAB', status: 'online'},
            {id: this.makeid(32), name: 'SteckdoseB1234', type: 'switch', system: 'openHAB', status: 'offline'},
            {id: this.makeid(32), name: 'SteckdoseC54321', type: 'switch', system: 'openHAB', status: 'unknown'},
        ];
    }

    private async initiallySaveDummyActuatorsToLocalStorage(dummyActuators: Actuator[]): Promise<void> {
        const storedActuators = await localForage.getItem('actuators');
        if (storedActuators === null) {
            await localForage.setItem('actuators', dummyActuators);
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

    async getAllactuators(): Promise<Actuator[]> {
        const storedActuators: Actuator[] = await localForage.getItem('actuators');
        if (storedActuators !== null) {
            return storedActuators;
        } else {
            this.initiallySaveDummyActuatorsToLocalStorage(this.dummyActuators);
            return this.dummyActuators
        }
    }

    async deleteActuators(actuatorId: string | string[]) {
        const storedActuators: Actuator[] = await this.getAllactuators();
        let storedActuatorsWithoutDeleted: Actuator[] = [];

        if (storedActuators !== null) {
            if (Array.isArray(actuatorId)) {
                storedActuators.filter(actuator => actuator.id);
                storedActuatorsWithoutDeleted = storedActuators.filter(actuator => actuatorId.indexOf(actuator.id) === -1);
            } else {
                storedActuatorsWithoutDeleted = storedActuators.filter(actuator => actuator.id !== actuatorId);
            }
            await localForage.setItem('actuators', storedActuatorsWithoutDeleted);
            return;
        }
        console.error('[actuatorservice.deleteactuators] No stored user permissions found');
    }

    async addActor(actuatorName: string, system: 'openHAB', type: 'switch' | 'messageDriven') {
        const storedActuators: Actuator[] = await this.getAllactuators();
        const generatedId = this.makeid(32);
        const possibleStatuses = ['online', 'offline', 'unknown'];
        const status: string = possibleStatuses[Math.floor(Math.random()*possibleStatuses.length)];

        storedActuators.push({id: generatedId, name: actuatorName, status, type, system: system} as Actuator);
        await localForage.setItem('actuators', storedActuators);
    }

    async editActor(actuatorId: string, actuatorName: string) {
        const storedActuators: Actuator[] = await this.getAllactuators();
        const ActorIndexToEdit = storedActuators.findIndex(actuator => actuator.id === actuatorId);
        storedActuators[ActorIndexToEdit].name = actuatorName;
        await localForage.setItem('actuators', storedActuators);
    }
}