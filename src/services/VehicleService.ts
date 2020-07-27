import { firestore } from '../firebase/firebaseConfig.dev';
import { IVehicle } from '../models/Vehicle/IVehicle';

export default class VehicleService {
    private getCollectionRef(userId: string) {
        return firestore.collection('users').doc(userId).collection('cars');
    }

    public async saveVehicle(vehicle: IVehicle, userId: string): Promise<void> {
        const vehiclesRef = this.getCollectionRef(userId);

        await vehiclesRef.add(vehicle);
    }

    public async getAvailablecars(userId: string): Promise<IVehicle[]> {
        const vehiclesRef = this.getCollectionRef(userId);

        let cars = await vehiclesRef.get();
        let carsCollection: IVehicle[];

        if (cars?.docs?.length > 0) {
            carsCollection = cars.docs.map(
                (car): IVehicle => ({
                    uid: car.data()?.uid,
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
