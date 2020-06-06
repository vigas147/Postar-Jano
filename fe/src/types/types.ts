export interface Event {
    title: string;
    description: string;
    photo: string;
    dateFrom: string;
    dateTo: string;
    location: string;
    ageMin: number;
    ageMax: number;
    price: number;
    capacity: number;
    owner: Owner;
    moreInfo: string;
}

interface Owner {
    name: string;
    surname: string;
    gender: string;
    email: string;
    phone: string;
}

export interface Registration {
    child: Child;
    medicine: Medicine;
    health: Health;
    parent: Parent;
    memberShip: MemberShip; 
    notes: string;
}

interface MemberShip {
    attendedActivities: string;
}

interface Medicine {
    takes: boolean;
    drugs: string;
}

interface Health {
    hasProblmes: boolean;
    problems: string;
}

interface Child {
    name: string;
    surname: string;
    gender: string;
    city: string;
    dateOfBirth: Date;
    finishedSchoolYear: number
    attendedPreiousEvents: boolean;
}

interface Parent {
    name: string;
    surname: string;
    email: string;
    phone: string;
}