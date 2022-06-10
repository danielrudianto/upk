export interface BillerCallback {
    id_transaksi: string;
    time_request: string;
    id_produk: string;
    id_pelanggan: string;
    nominal: string | number;
    sn: string;
    reff: string;
    response_code: string;
    keterangan: string;
}