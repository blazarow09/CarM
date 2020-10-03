export interface IVehicleCreateEdit {
    type?: string;
    manufacturer?: string;
    model?: string;
    vehicleName?: string;
    licensePlate?: string;
    year?: string;
    fuelTanksCount?: string;
    mainFuelType?: string;
    mainTankCapacity?: string;
    secondFuelType?: string;
    secondTankCapacity?: string;
    vin?: string;
    chassisNumber?: string;
    notes?: string;
    lastOdometer?: string;
    lastUpdatedOdometer: string;
}