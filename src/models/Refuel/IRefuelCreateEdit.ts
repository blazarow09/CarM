export interface IRefuelCreateEdit {
    uid?: string;
    quantity: string;
    pricePerLtr: string;
    mileage: string;
    totalCost: string;
    notes: string;
    fillingStation: string;
    fuel: string;
    reason: string;
    date: string; // Not sure for the type of this one.
    time: string; // Not sure for the type of this one.
}