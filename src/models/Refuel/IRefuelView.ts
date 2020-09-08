export interface IRefuelView {
    uid?: string;
    quantity: string;
    pricePerLtr: string;
    mileage: string;
    totalCost: string;
    notes: string;
    reason: string;
    fillingStation: string;
    date: string; // Not sure for the type of this one.
    time: string; // Not sure for the type of this one.
}