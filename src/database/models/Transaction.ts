import mongoose, { Schema, Document } from "mongoose";

interface IRunningBalance {
    currency: string;
    amount: number;
}

interface IMeta {
    provider_category: string;
    transaction_type: string;
    provider_id: string;
    counter_party_preferred_name?: string;
    user_comments?: string;
}

interface ITransaction {
    timestamp: Date;
    description: string;
    transaction_type: string;
    transaction_category: string;
    transaction_classification: string[];
    amount: number;
    currency: string;
    transaction_id: string;
    provider_transaction_id: string;
    normalised_provider_transaction_id: string;
    running_balance: IRunningBalance;
    meta: IMeta;
}

interface ITransactions extends Document {
    results: ITransaction[];
    status: string;
}

const MetaSchema = new Schema({
    provider_category: { type: String, required: true },
    transaction_type: { type: String, required: true },
    provider_id: { type: String, required: true },
    counter_party_preferred_name: { type: String }, // Optional
    user_comments: { type: String }, // Optional
});

const RunningBalanceSchema = new Schema({
    currency: { type: String, required: true },
    amount: { type: Number, required: true },
});

const TransactionSchema = new Schema({
    timestamp: { type: Date, required: true },
    description: { type: String, required: true },
    transaction_type: { type: String, required: true },
    transaction_category: { type: String, required: true },
    transaction_classification: { type: [String], required: false },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    transaction_id: { type: String, required: true },
    provider_transaction_id: { type: String, required: true },
    normalised_provider_transaction_id: { type: String, required: true },
    running_balance: { type: RunningBalanceSchema, required: true },
    meta: { type: MetaSchema, required: true },
});

const TransactionsSchema = new Schema({
    results: { type: [TransactionSchema], required: true },
    status: { type: String, required: true },
});

const TransactionModel = mongoose.model<ITransactions>("Transactions", TransactionsSchema);

export default TransactionModel;
