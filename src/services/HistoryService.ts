import { firestore } from '../firebase/firebaseConfig.dev';
import IHistoryEntry from '../models/History/IHistoryEntry';

export default class HistoryService {
    private getHistoryCollectionRef(vehicleId: string) {
        return firestore.collection('users').doc(window.authContext?.userId).collection('vehicles').doc(vehicleId).collection('logHistory');
    }

    public async getHistoryEntryByReferenceId(vehicleId: string, referenceId: string): Promise<IHistoryEntry> {
        if (vehicleId && referenceId) {
            const historyRef = this.getHistoryCollectionRef(vehicleId);

            let historyEntry: IHistoryEntry;
            await historyRef
                .where('referenceId', '==', referenceId)
                .get()
                .then((snapshot) => {
                    // The history entry by reference id should be only one in the snapshot.docs collection.
                    historyEntry = this.mapHistoryEntryViewModel(snapshot.docs[0]);
                });

            return historyEntry;
        }
    }

    public async addHistoryEntry(vehicleId: string, historyEntry: IHistoryEntry): Promise<void> {
        if (vehicleId && historyEntry) {
            const historyRef = this.getHistoryCollectionRef(vehicleId);

            await historyRef.add(historyEntry);
        }
    }

    public async editHistoryEntry(vehicleId: string, historyEntry: IHistoryEntry): Promise<void> {
        if (vehicleId && historyEntry) {
            const historyRef = this.getHistoryCollectionRef(vehicleId);

            if (historyEntry?.uid) {
                await historyRef.doc(historyEntry.uid).update(historyEntry);
            }
        }
    }

    public async getHistoryEntries(vehicleId: string): Promise<IHistoryEntry[]> {
        if (window.authContext?.userId && vehicleId) {
            const historyRef = this.getHistoryCollectionRef(vehicleId);

            let historyData = await historyRef.get();

            let historyDataCollection: IHistoryEntry[] = new Array<IHistoryEntry>();

            if (historyData?.docs?.length > 0) {
                historyDataCollection = historyData.docs.map((historyEntry): IHistoryEntry => this.mapHistoryEntryViewModel(historyEntry));
            }

            historyDataCollection.sort(function (a, b) {
                return new Date(b.date).getTime() - new Date(a.date).getTime();
            });

            return historyDataCollection;
        }
    }

    private mapHistoryEntryViewModel(historyEntry: any): IHistoryEntry {
        return {
            uid: historyEntry.id,
            date: historyEntry.data()?.date,
            cost: historyEntry.data()?.cost,
            mileage: historyEntry.data()?.mileage,
            referenceId: historyEntry.data()?.referenceId,
            title: historyEntry.data()?.title,
            type: historyEntry.data()?.type,
        };
    }
}
