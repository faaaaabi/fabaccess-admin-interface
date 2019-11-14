import {Machine} from "../scenes/Machines/types";
import * as localForage from "localforage";
import User from "./UserService/types/User";
import {userToUserDtoMapper} from "./UserService/UserDtoToUserMapper";

export class MachineService {
    private dummyMachines: Machine[] = [];

    constructor() {
        this.dummyMachines = [
            {id: this.makeid(32), name: 'Drehbank', description: 'Drehbank Hypermaster 300'},
            {id: this.makeid(32), name: 'Fräse', description: 'Homeking FXY'},
            {id: this.makeid(32), name: 'Kreissäge', description: 'Sägomat 4R3'},
            {id: this.makeid(32), name: '3D-Drucker', description: 'Makerbot 123'},
        ];
    }

    private async initiallySaveDummyMachinesToLocalStorage(dummyMachines: Machine[]): Promise<void> {
        const storedMachines = await localForage.getItem('machines');
        if (storedMachines === null) {
            await localForage.setItem('machines', dummyMachines);
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

    async getAllMachines(): Promise<Machine[]> {
        const storedMachines: Machine[] = await localForage.getItem('machines');
        if (storedMachines !== null) {
            return storedMachines;
        } else {
            this.initiallySaveDummyMachinesToLocalStorage(this.dummyMachines);
            return this.dummyMachines
        }
    }

    async deleteMachines(machineId: string | string[]) {
        const storedMachines: Machine[] = await this.getAllMachines();
        let storedMachinesWithoutDeleted: Machine[] = [];

        if (storedMachines !== null) {
            if (Array.isArray(machineId)) {
                storedMachines.filter(machine => machine.id);
                storedMachinesWithoutDeleted = storedMachines.filter(machine => machineId.indexOf(machine.id) === -1);
            } else {
                storedMachinesWithoutDeleted = storedMachines.filter(machine => machine.id !== machineId);
            }
            await localForage.setItem('machines', storedMachinesWithoutDeleted);
            return;
        }
        console.error('[machineService.deleteMachines] No stored machines found');
    }

    async addMachine(name: string, description: string) {
        const storedMachines: Machine[] = await this.getAllMachines();
        const generatedId = this.makeid(32);

        storedMachines.push({id: generatedId, name, description} as Machine);
        await localForage.setItem('machines', storedMachines);
    }

    async editMachine(machineId: string, name: string, description: string) {
        const storedMachines: Machine[] = await this.getAllMachines();
        const MachineIndexToEdit = storedMachines.findIndex(machine => machine.id === machineId);
        storedMachines[MachineIndexToEdit].name = name;
        storedMachines[MachineIndexToEdit].description = description;
        await localForage.setItem('machines', storedMachines);
    }

    async getMachineById(MachineId: string) {
        const storedMachines: Machine[] = await localForage.getItem('machines');
        const wantedMachineIndex = storedMachines.findIndex(existingMachine => existingMachine.id === MachineId);
        return storedMachines[wantedMachineIndex];
    }
}