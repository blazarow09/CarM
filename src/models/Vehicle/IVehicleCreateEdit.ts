export interface IVehicleCreateEdit {
    type: string;
    brand: string;
    model: string;
    variant: string;
    engine: string;
    fuel: string;
    mileage: string;
    fuelTanksCount?: string;
    tankCapacity?: string;
}