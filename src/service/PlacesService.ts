import {Place} from "../scenes/Places/types";
import * as localForage from "localforage";
import {Machine} from "../scenes/Machines/types";

export class PlacesService {
    private dummyPlaces: Place[] = [];

    constructor() {
        this.dummyPlaces = [
            {id: this.makeid(32), name: 'Drehbankbereich', description: 'Phantasievolle Ortsbeschreibung', assignedMachineIds: []},
            {id: this.makeid(32), name: '3D Drucker Regal', description: 'Phantasievolle Ortsbeschreibung', assignedMachineIds: []},
            {id: this.makeid(32), name: 'Fräsen Ecke', description: 'Phantasievolle Ortsbeschreibung', assignedMachineIds: []},
            {id: this.makeid(32), name: 'Rumplekammer', description: 'Phantasievolle Ortsbeschreibung', assignedMachineIds: []},
        ];
    }

    private async initiallySaveDummyPlacesToLocalStorage(dummyPlaces: Place[]): Promise<void> {
        const storedPlaces = await localForage.getItem('places');
        if (storedPlaces === null) {
            await localForage.setItem('places', dummyPlaces);
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

    async getAllPlaces(): Promise<Place[]> {
        const storedPlaces: Place[] = await localForage.getItem('places');
        if (storedPlaces !== null) {
            return storedPlaces;
        } else {
            this.initiallySaveDummyPlacesToLocalStorage(this.dummyPlaces);
            return this.dummyPlaces
        }
    }

    async deletePlaces(placeId: string | string[]) {
        const storedPlaces: Place[] = await this.getAllPlaces();
        let storedPlacesWithoutDeleted: Place[] = [];

        if (storedPlaces !== null) {
            if (Array.isArray(placeId)) {
                storedPlaces.filter(place => place.id);
                storedPlacesWithoutDeleted = storedPlaces.filter(place => placeId.indexOf(place.id) === -1);
            } else {
                storedPlacesWithoutDeleted = storedPlaces.filter(place => place.id !== placeId);
            }
            await localForage.setItem('places', storedPlacesWithoutDeleted);
            return;
        }
        console.error('[placeService.deletePlaces] No stored places found');
    }

    async addPlace(name: string, description: string, assignedMaschineIds: string[]) {
        const storedPlaces: Place[] = await this.getAllPlaces();
        const generatedId = this.makeid(32);

        storedPlaces.push({id: generatedId, name, description, assignedMachineIds: assignedMaschineIds} as Place);
        await localForage.setItem('places', storedPlaces);
    }

    async editPlace(placeId: string, name: string, description: string, assignedMaschineIds: string[]) {
        const storedPlaces: Place[] = await this.getAllPlaces();
        const PlaceIndexToEdit = storedPlaces.findIndex(place => place.id === placeId);
        storedPlaces[PlaceIndexToEdit].name = name;
        storedPlaces[PlaceIndexToEdit].description = description;
        storedPlaces[PlaceIndexToEdit].assignedMachineIds = assignedMaschineIds;
        await localForage.setItem('places', storedPlaces);
    }

    async getPlaceById(placeId: string) {
        const storedPlaces: Place[] = await localForage.getItem('places');
        const wantedPlaceIndex = storedPlaces.findIndex(existingPlace => existingPlace.id === placeId);
        return storedPlaces[wantedPlaceIndex];
    }

    async getAllAssignedMachineIds(): Promise<string[]> {
        const storedPlaces: Place[] = await this.getAllPlaces();
        return storedPlaces.flatMap(place => place.assignedMachineIds)
    }
}