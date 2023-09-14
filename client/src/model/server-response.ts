export class ServerResponse{
    validationStatus: Validation[];

    constructor(validationStatus: Validation[]){
        this.validationStatus = validationStatus;
    }
}

export class Validation{
    constructor(type: string, message: string) {
        this.type = type;
        this.message = message;
    }
    type: string;
    message: string;
}