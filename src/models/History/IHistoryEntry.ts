export default class IHistoryEntry {
    cost: number;
    date: string;
    mileage: number;
    referenceId: string;
    title: string;
    type: 'refuel' | 'repair';
}