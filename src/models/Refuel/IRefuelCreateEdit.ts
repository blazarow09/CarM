export interface IRefuelCreateEdit {
    quantity: number;
    pricePerLtr: number;
    mileage: number;
    totalCost: number;
    notes: string;
    fillingStation: string;
    reason: string;
    date: string; // Not sure for the type of this one.
    time: string; // Not sure for the type of this one.
}