import { firestore, functions } from '../firebase/firebaseConfig.dev';
import { IVehicleViewModel } from '../models/Vehicle/IVehicleViewModel';
import { IVehicleCreateEdit } from '../models/Vehicle/IVehicleCreateEdit';

export default class VehicleService {
    private getVehiclesCollectionRef() {
        return firestore.collection('users').doc(window?.authContext?.userId).collection('vehicles');
    }

    private getVehicleCollectionRefById(vehicleId: string) {
        return firestore.collection('users').doc(window?.authContext?.userId).collection('vehicles').doc(vehicleId);
    }

    private getRepairsCollectionRef(vehicleId: string) {
        return firestore.collection('users').doc(window?.authContext?.userId).collection('vehicles').doc(vehicleId).collection('repairs');
    }

    private getRefuelsCollectionRef(vehicleId: string) {
        return firestore.collection('users').doc(window?.authContext?.userId).collection('vehicles').doc(vehicleId).collection('refuels');
    }

    private getLogHistoryCollectionRef(vehicleId: string) {
        return firestore
            .collection('users')
            .doc(window?.authContext?.userId)
            .collection('vehicles')
            .doc(vehicleId)
            .collection('logHistory');
    }

    private getUsersCollectionRef() {
        return firestore.collection('users').doc(window?.authContext?.userId);
    }

    public async getLastOdometerForVehicle(vehicleId: string): Promise<string> {
        let singleVehicleRef = this.getVehicleCollectionRefById(vehicleId);

        let singleVehicleData = await singleVehicleRef.get();

        let lastOdometer = singleVehicleData.data()?.lastOdometer;

        return lastOdometer;
    }

    public async saveLastOdometerForVehicle(vehicleId: string, odometer: string, lastUpdatedOdometer: string): Promise<void> {
        let preferredRef = this.getVehicleCollectionRefById(vehicleId);

        let lastOdometer = await preferredRef.get();

        await lastOdometer.ref.update({ lastOdometer: odometer, lastUpdatedOdometer: lastUpdatedOdometer });
    }

    public async getPreferredVehicle(): Promise<string> {
        let preferredRef = this.getUsersCollectionRef();

        let preferredVehicleData = await preferredRef.get();

        let preferredVehicleId = preferredVehicleData.data()?.preferredVehicleId;

        return preferredVehicleId;
    }

    public async savePreferredVehicle(vehicleId: string): Promise<void> {
        let preferredRef = this.getUsersCollectionRef();

        let preferred = await preferredRef.get();

        if (preferred?.exists == false) {
            await preferred.ref.set({ preferredVehicleId: vehicleId });
        } else {
            await preferred.ref.update({ preferredVehicleId: vehicleId });
        }
    }

    public async saveVehicle(vehicle: IVehicleViewModel): Promise<void> {
        const vehiclesRef = this.getVehiclesCollectionRef();

        let vehicleToSave = vehicle as IVehicleCreateEdit;
        // Initialy set the last odometer to 0.
        vehicleToSave.lastOdometer = '0';
        vehicleToSave.lastUpdatedOdometer = '0';

        await vehiclesRef.add(vehicleToSave);
    }

    public async removeVehicle(vehicleId: string): Promise<void> {
        const vehiclesRef = this.getVehiclesCollectionRef();

        // await this.cleanupAfterVehicleRemove(vehicleId)
        await this.cleanupBeforeVehicleRemove(vehicleId);

        await vehiclesRef.doc(vehicleId).delete();
    }

    private async cleanupBeforeVehicleRemove(vehicleId: string): Promise<void> {
        const repairsRef = this.getRepairsCollectionRef(vehicleId);
        const refuelsRef = this.getRefuelsCollectionRef(vehicleId);
        const logHistoryRef = this.getLogHistoryCollectionRef(vehicleId);

        let repairs = await repairsRef.get();
        repairs.forEach(async (doc) => await doc.ref.delete());

        let refuels = await refuelsRef.get();
        refuels.forEach(async (doc) => await doc.ref.delete());

        let logHistory = await logHistoryRef.get();
        logHistory.forEach(async (doc) => await doc.ref.delete());
    }

    private async cleanupAfterVehicleRemove(vehicleId: string): Promise<void> {
        let cleanupAfterVehicleFunction = functions.httpsCallable('cleanupAfterVehicle');

        await cleanupAfterVehicleFunction({ userId: window.authContext.userId, vehicleId: vehicleId }).then((result) =>
            console.log(result)
        );
    }

    public async editVehicle(vehicle: IVehicleViewModel, vehicleId: string): Promise<void> {
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
                    chassisNumber: car.data()?.chassisNumber,
                    vin: car.data()?.vin,
                    mainFuelType: car.data()?.mainFuelType,
                    mainTankCapacity: car.data()?.mainTankCapacity,
                    secondFuelType: car.data()?.secondFuelType,
                    secondTankCapacity: car.data()?.secondTankCapacity,
                    notes: car.data()?.notes,
                })
            );
        }

        return carsCollection;
    }
}
