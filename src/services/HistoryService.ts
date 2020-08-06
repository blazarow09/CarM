import { firestore } from '../firebase/firebaseConfig.dev';
import IHistoryEntry from '../models/History/IHistoryEntry';
import dayjs from 'dayjs';

export default class HistoryService {
    private getHistoryCollectionRef(vehicleId: string) {
        return firestore.collection('users').doc(window.authContext?.userId).collection('vehicles').doc(vehicleId).collection('logHistory');
    }

    public async addHistoryEntry(vehicleId: string, historyEntry: IHistoryEntry): Promise<void> {
        if (vehicleId && historyEntry) {
            const historyRef = this.getHistoryCollectionRef(vehicleId);

            await historyRef.add(historyEntry);
        }
    }

    public async getHistoryEntries(vehicleId: string): Promise<IHistoryEntry[]> {
        if (window.authContext?.userId && vehicleId) {
            const historyRef = this.getHistoryCollectionRef(vehicleId);

            let historyData = await historyRef.get();

            let historyDataCollection: IHistoryEntry[] = new Array<IHistoryEntry>();

            if (historyData?.docs?.length > 0) {
                historyDataCollection = historyData.docs.map(
                    (historyEntry): IHistoryEntry => ({
                        cost: historyEntry.data()?.cost,
                        date: historyEntry.data()?.date,
                        mileage: historyEntry.data()?.mileage,
                        referenceId: historyEntry.data()?.referenceId,
                        title: historyEntry.data()?.title,
                        type: historyEntry.data()?.type,
                    })
                );
            }

            historyDataCollection.sort(function (a, b) {
                return new Date(b.date).getTime() - new Date(a.date).getTime();
            });
            return historyDataCollection;
        }
    }
}
