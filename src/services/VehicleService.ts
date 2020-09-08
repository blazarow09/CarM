import { firestore } from '../firebase/firebaseConfig.dev';
import { IVehicleViewModel } from '../models/Vehicle/IVehicleViewModel';
import { IRepair } from '../models/Repair/IRepair';
import { IVehicleCreateEdit } from '../models/Vehicle/IVehicleCreateEdit';

export default class VehicleService {
    private getVehiclesCollectionRef() {
        return firestore.collection('users').doc(window?.authContext?.userId).collection('vehicles');
    }

    private getVehiclesCollectionRefById(vehicleId: string) {
        return firestore.collection('users').doc(window?.authContext?.userId).collection('vehicles').doc(vehicleId);
    }

    private getRepairsCollectionRef(vehicleId: string) {
        return firestore.collection('users').doc(window?.authContext?.userId).collection('vehicles').doc(vehicleId).collection('repairs');
    }

    private getUsersCollectionRef() {
        return firestore.collection('users').doc(window?.authContext?.userId);
    }

    //#region Repair Operations
    public async saveRepair(repair: IRepair, userId: string, vehicleId: string): Promise<string> {
        const repairsRef = this.getRepairsCollectionRef(vehicleId);

        let repairResult = await repairsRef.add(repair);

        return repairResult.id;
    }

    public async getRepairsByVehicleId(vehicleId: string, userId: string): Promise<IRepair[]> {
        const repairsRef = this.getRepairsCollectionRef(vehicleId);

        let repairs = await repairsRef.get();

        let repairsCollection: IRepair[];
        if (repairs?.docs?.length > 0) {
            repairsCollection = repairs.docs.map(
                (repair): IRepair => ({
                    uid: repair.id,
                    repair: repair.data()?.repair,
                    cost: repair.data()?.cost,
                    mileage: repair.data()?.mileage,
                    city: repair.data()?.city,
                    note: repair.data()?.note,
                    place: repair.data()?.place,
                    phone: repair.data()?.phone,
                    date: repair.data()?.date,
                })
            );
        }

        return repairsCollection;
    }
    //#endregion

    //#region Vehicle Operations
    public async getLastOdometerForVehicle(vehicleId: string): Promise<string> {
        let singleVehicleRef = this.getVehiclesCollectionRefById(vehicleId);

        let singleVehicleData = await singleVehicleRef.get();

        let lastOdometer = singleVehicleData.data()?.lastOdometer;

        return lastOdometer;
    }

    public async saveLastOdometerForVehicle(vehicleId: string, odometer: number): Promise<void> {
        let preferredRef = this.getVehiclesCollectionRefById(vehicleId);

        let lastOdometer = await preferredRef.get();

        await lastOdometer.ref.set({ lastOdometer: odometer });
    }

    public async getPreferredVehicle(userId: string): Promise<string> {
        let preferredRef = this.getUsersCollectionRef();

        let preferredVehicleData = await preferredRef.get();

        let preferredVehicleId = preferredVehicleData.data()?.preferredVehicleId;

        return preferredVehicleId;
    }

    public async savePreferredVehicle(vehicleId: string, userId: string): Promise<void> {
        let preferredRef = this.getUsersCollectionRef();

        let preferred = await preferredRef.get();

        if (preferred?.exists == false) {
            await preferred.ref.set({ preferredVehicleId: vehicleId });
        } else {
            await preferred.ref.update({ preferredVehicleId: vehicleId });
        }
    }

    public async saveVehicle(vehicle: IVehicleViewModel, userId: string): Promise<void> {
        const vehiclesRef = this.getVehiclesCollectionRef();

        let vehicleToSave = vehicle as IVehicleCreateEdit;

        await vehiclesRef.add(vehicleToSave);
    }

    public async removeVehicle(vehicleId: string, userId: string): Promise<void> {
        const vehiclesRef = this.getVehiclesCollectionRef();

        // CR: should delete and the references as repairs and so on.
        await vehiclesRef.doc(vehicleId).delete();
    }

    public async editVehicle(vehicle: IVehicleViewModel, vehicleId: string, userId: string): Promise<void> {
        const vehicleRef = this.getVehiclesCollectionRef();

        let vehicleToSave = vehicle as IVehicleCreateEdit;

        await vehicleRef.doc(vehicleId).update(vehicleToSave);
    }

    public async getAvailablecars(): Promise<IVehicleViewModel[]> {
        const vehiclesRef = this.getVehiclesCollectionRef();

        let cars = await vehiclesRef.get();
        let carsCollection: IVehicleViewModel[];

        if (cars?.docs?.length > 0) {
            carsCollection = cars.docs.map(
                (car): IVehicleViewModel => ({
                    uid: car.id,
                    type: car.data()?.type,
                    manufacturer: car.data()?.manufacturer,
                    model: car.data()?.model,
                    vehicleName: car.data()?.vehicleName,
                    licensePlate: car.data()?.licensePlate,
                    year: car.data()?.year,
                    fuelTanksCount: car.data()?.fuelTanksCount,
                    tankCapacity: car.data()?.tankCapacity,
                })
            );
        }

        return carsCollection;
    }
    //#endregion
}
