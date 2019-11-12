import {Actor} from "../scenes/Actors/types";
import * as localForage from "localforage";

export class ActorService {
    private dummyActors: Actor[] = [];

    constructor() {
        this.dummyActors = [
            {id: this.makeid(32), name: 'SteckdoseA1215', system: 'openHAB', status: 'online'},
            {id: this.makeid(32), name: 'SteckdoseA7523', system: 'openHAB', status: 'online'},
            {id: this.makeid(32), name: 'SteckdoseB1234', system: 'openHAB', status: 'offline'},
            {id: this.makeid(32), name: 'SteckdoseC54321', system: 'openHAB', status: 'unknown'},
        ];
    }

    private async initiallySaveDummyActorsToLocalStorage(dummyActors: Actor[]): Promise<void> {
        const storedActors = await localForage.getItem('actors');
        if (storedActors === null) {
            await localForage.setItem('actors', dummyActors);
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

    async getAllactors(): Promise<Actor[]> {
        const storedActors: Actor[] = await localForage.getItem('actors');
        if (storedActors !== null) {
            return storedActors;
        } else {
            this.initiallySaveDummyActorsToLocalStorage(this.dummyActors);
            return this.dummyActors
        }
    }

    async deleteActors(actorId: string | string[]) {
        const storedActors: Actor[] = await this.getAllactors();
        let storedActorsWithoutDeleted: Actor[] = [];

        if (storedActors !== null) {
            if (Array.isArray(actorId)) {
                storedActors.filter(actor => actor.id);
                storedActorsWithoutDeleted = storedActors.filter(actor => actorId.indexOf(actor.id) === -1);
            } else {
                storedActorsWithoutDeleted = storedActors.filter(actor => actor.id !== actorId);
            }
            await localForage.setItem('actors', storedActorsWithoutDeleted);
            return;
        }
        console.error('[actorservice.deleteactors] No stored user permissions found');
    }

    async addActor(actorName: string, actorDescription: string) {
        const storedActors: Actor[] = await this.getAllactors();
        const generatedId = this.makeid(32);
        const possibleStatuses = ['online', 'offline', 'unknown'];
        const status: string = possibleStatuses[Math.floor(Math.random()*possibleStatuses.length)];

        storedActors.push(<Actor>{id: generatedId, name: actorName, status});
        await localForage.setItem('actors', storedActors);
    }

    async editActor(actorId: string, actorName: string) {
        const storedActors: Actor[] = await this.getAllactors();
        const ActorIndexToEdit = storedActors.findIndex(actor => actor.id === actorId);
        storedActors[ActorIndexToEdit].name = actorName;
        await localForage.setItem('actors', storedActors);
    }
}