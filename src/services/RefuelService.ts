import { firestore } from '../firebase/firebaseConfig.dev';
import { IRefuelView } from '../models/Refuel/IRefuelView';
import { IRefuelCreateEdit } from '../models/Refuel/IRefuelCreateEdit';

export default class RefuelService {
    private getRefuelCollectionRef(vehicleId: string) {
        return firestore.collection('users').doc(window?.authContext?.userId).collection('vehicles').doc(vehicleId).collection('refuels');
    }

    private getSingleRefuelRef(vehicleId: string, refuelId: string) {
        return firestore
            .collection('users')
            .doc(window?.authContext?.userId)
            .collection('vehicles')
            .doc(vehicleId)
            .collection('refuels')
            .doc(refuelId);
    }

    public async getSingleRefuel(vehicleId: string, refuelId: string): Promise<IRefuelView> {
        let refuelRef = this.getSingleRefuelRef(vehicleId, refuelId);

        let refuel = await refuelRef.get();

        let refuelModel = this.mapRefuelViewModel(refuel);

        return refuelModel;
    }

    public async saveRefuel(refuel: IRefuelCreateEdit, vehicleId: string): Promise<string> {
        const repairsRef = this.getRefuelCollectionRef(vehicleId);

        let result;
        if (refuel && vehicleId) {
            result = await repairsRef.add(refuel);
        }

        // The id of the refuel entry.
        return result?.id;
    }

    public async editRefuel(refuel: IRefuelCreateEdit, vehicleId: string, refuelId: string): Promise<void> {
        const refuelRef = this.getRefuelCollectionRef(vehicleId);

        if (refuel && refuelId) await refuelRef.doc(refuelId).update(refuel);
    }

    public async getRefuelsByVehicleId(vehicleId: string): Promise<IRefuelView[]> {
        let refuelsCollection: IRefuelView[];

        try {
            const repairsRef = this.getRefuelCollectionRef(vehicleId);

            let refuels = await repairsRef.get();

            if (refuels?.docs?.length > 0) {
                refuelsCollection = refuels.docs.map((refuel): IRefuelView => this.mapRefuelViewModel(refuel));
            }

            refuelsCollection.sort(function (a, b) {
                return new Date(b.date).getTime() - new Date(a.date).getTime();
            });
        } catch (error) {
            console.log(error);
        }

        return refuelsCollection;
    }

    private mapRefuelViewModel(refuel: any): IRefuelView {
        return {
            uid: refuel.id,
            quantity: refuel.data()?.quantity,
            pricePerLtr: refuel.data()?.pricePerLtr,
            mileage: refuel.data()?.mileage,
            totalCost: refuel.data()?.totalCost,
            notes: refuel.data()?.notes,
            fillingStation: refuel.data()?.fillingStation,
            date: refuel.data()?.date,
            reason: refuel.data()?.reason,
            time: refuel.data()?.time,
            fuel: refuel.data()?.fuel,
        };
    }
}
