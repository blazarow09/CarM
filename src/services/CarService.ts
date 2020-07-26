import { firestore } from '../firebase/firebaseConfig.dev';
import { ICar } from '../models/Car/ICar';

export default class CarService {
    private getCollectionRef(userId: string) {
        return firestore.collection('users').doc(userId).collection('cars');
    }

    public async getAvailablecars(userId: string): Promise<ICar[]> {
        const carsRef = this.getCollectionRef(userId);

        let cars = await carsRef.get();
        let carsCollection: ICar[];

        if (cars?.docs?.length > 0) {
            carsCollection = cars.docs.map(
                (car): ICar => ({
                    uid: car.data()?.uid,
                    brand: car.data()?.brand,
                    model: car.data()?.model,
                    mileage: car.data()?.mileage,
                    year: car.data()?.year
                })
            );
        }

        return carsCollection;
    }
}
