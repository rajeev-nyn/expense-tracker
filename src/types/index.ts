export interface Expense {
    id: string;
    amount: number;
    description: string;
    type: 'debit' | 'credit';
    date: Date;
}

export interface MonthlyTotal {
    totalDebit: number;
    totalCredit: number;
    netBalance: number;
}