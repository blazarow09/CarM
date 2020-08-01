export interface IRefuelView {
    uid?: string;
    quantity: number;
    pricePerLtr: number;
    mileage: number;
    totalCost: number;
    notes: string;
    fillingStation: string;
    date: string; // Not sure for the type of this one.
}