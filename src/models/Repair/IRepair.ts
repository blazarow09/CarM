export interface IRepair {
    uid?: string;
    repair: string;
    cost: number;
    mileage: number;
    city: string;
    note: string;
    place: string;
    phone: number;
    date: string; // Not sure for the type of this one.
}