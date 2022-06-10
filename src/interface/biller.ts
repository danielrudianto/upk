export interface PhoneBill {
    KODE_PRODUK: string;
    WAKTU: string;
    NO_HP: string;
    UID: string;
    PIN: string;
    SN: string;
    NOMINAL: string | number;
    REF1: string;
    REF2: string;
    KET: string;
    STATUS: string;
    STATUS_TRX: string;
}

export interface ElectricityBill {

}

export interface InsuranceInquiry {
    KODE_PRODUK: string;
    WAKTU: string;
    IDPEL1: string;
    IDPEL2: string;
    IDPEL3: string;
    NAMA_PELANGGAN: string;
    PERIODE: string;
    NOMINAL: string | number;
    ADMIN: string | number;
    UID: string;
    PIN: string;
    REF1: string;
    REF2: string;
    STATUS: string;
    KET: string;
}

export interface InsuranceBill {
    KODE_PRODUK: string;
    WAKTU: string;
    IDPEL1: string;
    IDPEL2: string;
    IDPEL3: string;
    NAMA_PELANGGAN: string;
    PERIODE: string;
    NOMINAL: string | number;
    ADMIN: string | number;
    UID: string;
    PIN: string;
    REF1: string;
    REF2: string;
    STATUS: string;
    KET: string;
}