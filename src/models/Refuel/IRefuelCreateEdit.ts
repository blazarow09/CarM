export interface IRefuelCreateEdit {
    quantity: string;
    pricePerLtr: string;
    mileage: string;
    totalCost: string;
    notes: string;
    fillingStation: string;
    reason: string;
    date: string; // Not sure for the type of this one.
    time: string; // Not sure for the type of this one.
}