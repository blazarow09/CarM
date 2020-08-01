import { firestore } from '../firebase/firebaseConfig.dev';
import { IRefuelView } from '../models/Refuel/IRefuelView';
import { IRefuelCreateEdit } from '../models/Refuel/IRefuelCreateEdit';

export default class RefuelService {
    private getRefuelCollectionRef(userId: string, vehicleId: string) {
        return firestore.collection('users').doc(userId).collection('vehicles').doc(vehicleId).collection('refuels');
    }

    private getVehiclesCollectionRef(userId: string) {
        return firestore.collection('users').doc(userId).collection('vehicles');
    }

    public async saveRefuel(refuel: IRefuelCreateEdit, userId: string, vehicleId: string): Promise<void> {
        const repairsRef = this.getRefuelCollectionRef(userId, vehicleId);

        await repairsRef.add(refuel);

        const vehicleRef = this.getVehiclesCollectionRef(userId);

        // let preferredRef = this.getUsersCollectionRef(userId);

        // let preferred = await preferredRef.get();

        // if (preferred?.exists == false) {
        //     await preferred.ref.set({ preferredVehicleId: vehicleId });
        // } else {
        //     await preferred.ref.update({ preferredVehicleId: vehicleId });
        // }
    }

    public async getIRefuelsByVehicleId(vehicleId: string, userId: string): Promise<IRefuelView[]> {
        let refuelsCollection: IRefuelView[];

        try {
            const repairsRef = this.getRefuelCollectionRef(userId, vehicleId);

            let refuels = await repairsRef.get();

            if (refuels?.docs?.length > 0) {
                refuelsCollection = refuels.docs.map(
                    (refuel): IRefuelView => ({
                        uid: refuel.id,
                        quantity: refuel.data()?.quantity,
                        pricePerLtr: refuel.data()?.pricePerLtr,
                        mileage: refuel.data()?.mileage,
                        totalCost: refuel.data()?.totalCost,
                        notes: refuel.data()?.notes,
                        fillingStation: refuel.data()?.fillingStation,
                        date: refuel.data()?.date,
                    })
                );
            }
        } catch (error) {
            console.log(error);
        }

        return refuelsCollection;
    }
}
