import { observable, action, IObservableArray } from 'mobx';
import IHistoryEntry from '../../models/History/IHistoryEntry';
import HistoryService from '../../services/HistoryService';

export interface IContentStore {
    getHistoryEntries(vehicleId: string): Promise<void>;
    getHistoryEntryByReferenceId(vehicleId: string, referenceId: string): Promise<IHistoryEntry>;
    saveHistoryEntry(vehicleId: string, historyEntry: IHistoryEntry): Promise<void>;
    editHistoryEntry(vehicleId: string, historyEntry: IHistoryEntry): Promise<void>;

    historyEntries: IObservableArray<IHistoryEntry>;
}

export default class ContentStore implements IContentStore {
    private _historyService: HistoryService;

    public constructor(historyService: HistoryService) {
        this._historyService = historyService;
    }

    @observable public historyEntries: IObservableArray<IHistoryEntry> = observable([]);

    public async getHistoryEntryByReferenceId(vehicleId: string, referenceId: string): Promise<IHistoryEntry> {
        return await this._historyService.getHistoryEntryByReferenceId(vehicleId, referenceId);
    }

    @action
    public async getHistoryEntries(vehicleId: string): Promise<void> {
        let historyEntries = await this._historyService.getHistoryEntries(vehicleId);

        this.historyEntries.replace(historyEntries);
    }

    public async saveHistoryEntry(vehicleId: string, historyEntry: IHistoryEntry): Promise<void> {
        if (vehicleId && historyEntry) {
            await this._historyService.addHistoryEntry(vehicleId, historyEntry);

            await this.getHistoryEntries(vehicleId);
        }
    }

    public async editHistoryEntry(vehicleId: string, historyEntry: IHistoryEntry): Promise<void> {
        if (vehicleId && historyEntry) {
            await this._historyService.editHistoryEntry(vehicleId, historyEntry);

            await this.getHistoryEntries(vehicleId);
        }
    }
}
