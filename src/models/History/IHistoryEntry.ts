export default class IHistoryEntry {
    uid?: string;
    cost: string;
    date: string;
    mileage: string;
    referenceId: string;
    title: string;
    type: 'refuel' | 'repair';
}