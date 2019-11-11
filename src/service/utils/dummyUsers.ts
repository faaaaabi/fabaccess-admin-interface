import makeId from "./makeId";
import User from "../UserService/types/User";

const dummyUsers: User[] = [
    new User(
        'Mr.',
        '',
        'Fabian',
        'Meyer',
        '28.04.1988',
        {
            street: 'Lürmannstr.',
            houseNumber: '10',
            city: 'Düsseldorf',
            country: 'Deutschland',
            postalCode: '50226',
            state: ''
        },
        '01234/5678910',
        '',
        'f@bian-meyer.de',
        true,
        'A2B3C5D6',
        '0000',
        [],
        '',
        makeId(32)
    ),
    new User(
        'Mr.',
        '',
        'Maximilian',
        'Voigt',
        '01.01.1970',
        {
            street: 'Dorfstr..',
            houseNumber: '1',
            city: 'Stadtstadt',
            country: 'Deutschland',
            postalCode: '12345',
            state: ''
        },
        '01234/5678910',
        'undefined',
        'mail@mail.de',
        true,
        'B2C3A5D6',
        '1234',
        [],
        '',
        makeId(32)
    ),
    new User(
        'Mr.',
        '',
        'Konrad',
        'Schneidenbach',
        '01.01.1970',
        {
            street: 'Stadtstr..',
            houseNumber: '12',
            city: 'Dorfstadt',
            country: 'Deutschland',
            postalCode: '44321',
            state: ''
        },
        '01234/5678910',
        '',
        'konrad@mail.de',
        true,
        'D2C3B5D6',
        '4321',
        [],
        '',
        makeId(32)
    ),
];

export default dummyUsers;