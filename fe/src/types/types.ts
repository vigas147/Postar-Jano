export interface Event {
    id: number;
    title: string;
    description: string;
    photo: string;
    dateFrom: string;
    dateTo: string;
    location: string;
    ageMin: number;
    ageMax: number;
    price: number;
    capacity: Capacity;
    owner: Owner;
    moreInfo: string;
    days: Day[]
}

interface Capacity {
    now: number;
    total: number;
    boys_now: number;
    boys_max: number;
    girls_now: number;
    girls_max: number;
}

interface Day {
    id: number;
    capacity: Capacity;
    description: string;
}

interface Owner {
    name: string;
    surname: string;
    gender: Gender;
    email: string;
    phone: string;
}

export interface Registration {
    child: Child;
    days: number[]; // ids of days
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
    takes: boolean | null;
    drugs: string;
}

interface Health {
    hasProblmes: boolean | null;
    problems: string;
}

interface Child {
    name: string;
    surname: string;
    gender: Gender | null;
    city: string;
    dateOfBirth: Date | null;
    finishedSchoolYear: number | null;
    attendedPreiousEvents: boolean | null;
}

interface Parent {
    name: string;
    surname: string;
    email: string;
    phone: string;
}

export enum Gender {
    Male = "male",
    Female = "female"
}