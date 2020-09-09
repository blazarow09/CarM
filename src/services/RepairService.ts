import { firestore } from '../firebase/firebaseConfig.dev';
import { IRepair } from '../models/Repair/IRepair';

export default class RepairService {
    private getRepairsCollectionRef(vehicleId: string) {
        return firestore.collection('users').doc(window?.authContext?.userId).collection('vehicles').doc(vehicleId).collection('repairs');
    }

    private getSingleRepairRef(vehicleId: string, repairId: string) {
        return firestore
            .collection('users')
            .doc(window?.authContext?.userId)
            .collection('vehicles')
            .doc(vehicleId)
            .collection('repairs')
            .doc(repairId);
    }

    public async saveRepair(repair: IRepair, vehicleId: string): Promise<string> {
        const repairsRef = this.getRepairsCollectionRef(vehicleId);

        let repairResult = await repairsRef.add(repair);

        return repairResult.id;
    }

    public async getSingleRepair(vehicleId: string, refuelId: string): Promise<IRepair> {
        let repairRef = this.getSingleRepairRef(vehicleId, refuelId);

        let repair = await repairRef.get();

        let repairModel = this.mapRepairViewModel(repair);

        return repairModel;
    }

    public async getRepairsByVehicleId(vehicleId: string): Promise<IRepair[]> {
        const repairsRef = this.getRepairsCollectionRef(vehicleId);

        let repairs = await repairsRef.get();

        let repairsCollection: IRepair[];
        if (repairs?.docs?.length > 0) {
            repairsCollection = repairs.docs.map((repair): IRepair => this.mapRepairViewModel(repair));
        }

        return repairsCollection;
    }

    private mapRepairViewModel(repair: any): IRepair {
        return {
            uid: repair.id,
            repair: repair.data()?.repair,
            cost: repair.data()?.cost,
            mileage: repair.data()?.mileage,
            city: repair.data()?.city,
            note: repair.data()?.note,
            place: repair.data()?.place,
            phone: repair.data()?.phone,
            date: repair.data()?.date,
        };
    }
}
