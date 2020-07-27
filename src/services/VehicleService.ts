import { firestore } from '../firebase/firebaseConfig.dev';
import { IVehicle } from '../models/Vehicle/IVehicle';
import { IRepair } from '../models/Repair/IRepair';

export default class VehicleService {
    private getVehiclesCollectionRef(userId: string) {
        return firestore.collection('users').doc(userId).collection('vehicles');
    }

    private getRepairsCollectionRef(userId: string, vehicleId: string) {
        return firestore.collection('users').doc(userId).collection('vehicles').doc(vehicleId).collection('repairs');
    }

    public async saveVehicle(vehicle: IVehicle, userId: string): Promise<void> {
        const vehiclesRef = this.getVehiclesCollectionRef(userId);

        await vehiclesRef.add(vehicle);
    }

    public async saveRepair(repair: IRepair, userId: string, vehicleId: string): Promise<void> {
        const vehiclesRef = this.getRepairsCollectionRef(userId, vehicleId);

        await vehiclesRef.add(repair);
    }

    public async getAvailablecars(userId: string): Promise<IVehicle[]> {
        const vehiclesRef = this.getVehiclesCollectionRef(userId);

        let cars = await vehiclesRef.get();
        let carsCollection: IVehicle[];

        if (cars?.docs?.length > 0) {
            carsCollection = cars.docs.map(
                (car): IVehicle => ({
                    uid: car.id,
                    type: car.data()?.type,
                    brand: car.data()?.brand,
                    model: car.data()?.model,
                    engine: car.data()?.engine,
                    variant: car.data()?.variant,
                    mileage: car.data()?.mileage,
                    fuel: car.data()?.fuel,
                })
            );
        }

        return carsCollection;
    }
}
