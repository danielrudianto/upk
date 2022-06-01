export interface transaction {
    id?: number;
    created_by?: number;
    created_at?: Date;
    value: number;
    service: number;
    discount: number;
}