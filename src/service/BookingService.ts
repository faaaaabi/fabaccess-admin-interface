import {Booking} from "../scenes/Bookings/types";
import * as localForage from "localforage";
import moment from "moment";

export class BookingService {
    private dummyBookings: Booking[] = [];

    constructor() {
        this.dummyBookings = [
            {
                id: this.makeid(32),
                startedAt: this.generateRandomTimeStampInPast(120),
                machineName: '3D Drucker',
                userName: 'Fabian Meyer'
            },
            {
                id: this.makeid(32),
                startedAt: this.generateRandomTimeStampInPast(120),
                machineName: 'Tischkreissäge',
                userName: 'Maximilian Voigt'
            },
            {
                id: this.makeid(32),
                startedAt: this.generateRandomTimeStampInPast(120),
                machineName: 'Laser Cutter',
                userName: 'Konrad Schneidenbach'
            },
        ];
    }

    private async initiallySaveDummyBookingsToLocalStorage(dummyBookings: Booking[]): Promise<void> {
        const storedBookings = await localForage.getItem('bookings');
        if (storedBookings === null) {
            await localForage.setItem('bookings', dummyBookings);
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

    private generateRandomTimeStampInPast = (maxRangeInMinutes: number) => {
        return moment().add(maxRangeInMinutes * Math.random(), 'minutes').unix();
    };

    async getAllBookings(): Promise<Booking[]> {
        const storedBookings: Booking[] = await localForage.getItem('bookings');
        if (storedBookings !== null) {
            return storedBookings;
        } else {
            this.initiallySaveDummyBookingsToLocalStorage(this.dummyBookings);
            return this.dummyBookings
        }
    }

    async endBooking(bookingId: string | string[]) {
        const storedBookings: Booking[] = await this.getAllBookings();
        let storedBookingsWithoutDeleted: Booking[] = [];

        if (storedBookings !== null) {
            if (Array.isArray(bookingId)) {
                storedBookingsWithoutDeleted = storedBookings.filter(booking => bookingId.indexOf(booking.id) === -1);
            } else {
                storedBookingsWithoutDeleted = storedBookings.filter(booking => booking.id !== bookingId);
            }
            await localForage.setItem('bookings', storedBookingsWithoutDeleted);
            return;
        }
        console.error('[Booking.deleteBookings] No stored user bookings found');
    }
}