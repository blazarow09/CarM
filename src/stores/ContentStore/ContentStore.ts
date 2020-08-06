import { observable, action, IObservableArray } from 'mobx';
import IHistoryEntry from '../../models/History/IHistoryEntry';
import HistoryService from '../../services/HistoryService';

export interface IContentStore {
    getHistoryEntries(vehicleId: string): Promise<void>;
    saveHistoryEntry(vehicleId: string, historyEntry: IHistoryEntry): Promise<void>;

    historyEntries: IObservableArray<IHistoryEntry>;
}

export default class ContentStore implements IContentStore {
    private _historyService: HistoryService;

    public constructor(historyService: HistoryService) {
        this._historyService = historyService;
    }

    @observable public historyEntries: IObservableArray<IHistoryEntry> = observable([]);

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
}
