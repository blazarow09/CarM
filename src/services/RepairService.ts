import { firestore } from '../firebase/firebaseConfig.dev';
import { IRepair } from '../models/Repair/IRepair';

export default class RepairService {
    private getRepairsCollectionRef(userId: string, vehicleId: string) {
        return firestore.collection('users').doc(userId).collection('vehicles').doc(vehicleId).collection('repairs');
    }

    //#region Repair Operations
    public async saveRepair(repair: IRepair, userId: string, vehicleId: string): Promise<void> {
        const repairsRef = this.getRepairsCollectionRef(userId, vehicleId);

        await repairsRef.add(repair);
    }

    public async getRepairsByVehicleId(vehicleId: string, userId: string): Promise<IRepair[]> {
        const repairsRef = this.getRepairsCollectionRef(userId, vehicleId);

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
}
