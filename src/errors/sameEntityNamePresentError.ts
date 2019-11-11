export class SameEntityNamePresentError extends Error {
    constructor() {
        super();

        Object.setPrototypeOf(this, SameEntityNamePresentError.prototype);
    }
}