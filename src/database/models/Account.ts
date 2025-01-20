import mongoose, { Schema, Document } from "mongoose";

interface IAccountNumber {
    iban?: string;
    bic?: string;
}

interface IProvider {
    provider_id: string;
    display_name: string;
}

interface IAccount {
    update_timestamp: Date;
    account_id: string;
    account_type: string;
    display_name: string;
    currency: string;
    account_number: IAccountNumber;
    provider: IProvider;
}

interface IAccounts extends Document {
    results: IAccount[];
    status: string;
}

const AccountNumberSchema = new Schema<IAccountNumber>({
    iban: { type: String }, // Optional field
    bic: { type: String },  // Optional field
});

const ProviderSchema = new Schema<IProvider>({
    provider_id: { type: String, required: true },
    display_name: { type: String, required: true },
});

const AccountSchema = new Schema<IAccount>({
    update_timestamp: { type: Date, required: true },
    account_id: { type: String, required: true },
    account_type: { type: String, required: true },
    display_name: { type: String, required: true },
    currency: { type: String, required: true },
    account_number: { type: AccountNumberSchema, required: true },
    provider: { type: ProviderSchema, required: true },
});

const AccountsSchema = new Schema<IAccounts>({
    results: { type: [AccountSchema], required: true },
    status: { type: String, required: true },
});

const AccountsModel = mongoose.model<IAccounts>("Accounts", AccountsSchema);

export default AccountsModel;
