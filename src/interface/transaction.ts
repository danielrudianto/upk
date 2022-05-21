export interface transaction {
    id?: number;
    created_by?: number;
    created_at?: Date;
    value: number;
    service: number;
    discount: number;
    
    id                 Int            @id @default(autoincrement())
  created_by         Int
  created_at         DateTime?      @db.DateTime(0)
  value              Decimal        @db.Decimal(50, 4)
  service            Decimal        @db.Decimal(50, 4)
  discount           Decimal        @db.Decimal(50, 4)
  purchase_type_id   Int?
  payment_id         String         @unique(map: "payment_id_UNIQUE") @db.VarChar(100)
  payment_method_id  Int
  is_paid            Boolean?       @default(false)
  is_delete          Boolean?       @default(false)
  paid_at            DateTime?      @db.DateTime(0)
  branch_transaction Boolean?       @default(false)
  payment_reference  String?        @unique(map: "payment_reference_UNIQUE") @db.VarChar(50)
  purchase_reference String         @db.VarChar(100)
  note               String?        @db.VarChar(200)
  user               user           @relation(fields: [created_by], references: [id], onDelete: NoAction, onUpdate: NoAction, map: "user_transaction_ibfk_1")
  payment_method     payment_method @relation(fields: [payment_method_id], references: [id], onDelete: NoAction, onUpdate: NoAction, map: "user_transaction_ibfk_3")
  purchase_type      purchase_type? @relation(fields: [purchase_type_id], references: [id], onDelete: NoAction, onUpdate: NoAction, map: "user_transaction_ibfk_2")

  @@index([created_by], map: "user_transaction_ibfk_1_idx")
  @@index([purchase_type_id], map: "user_transaction_ibfk_2_idx")
  @@index([payment_method_id], map: "user_transaction_ibfk_3_idx")
  @@index([note, purchase_reference], map: "user_transaction_fulltext")
}