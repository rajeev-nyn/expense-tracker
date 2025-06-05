import { Expense } from '../types';

export class TransactionPage {
    private element: HTMLElement;
    private expenses: Expense[];

    constructor() {
        this.element = document.createElement('div');
        this.element.className = 'transaction-page';
        this.expenses = this.loadExpenses();
        this.initialize();
    }

    private loadExpenses(): Expense[] {
        const stored = localStorage.getItem('expenses');
        if (stored) {
            const expenses = JSON.parse(stored);
            return expenses.map((exp: any) => ({
                ...exp,
                date: new Date(exp.date)
            })).sort((a: Expense, b: Expense) => b.date.getTime() - a.date.getTime());
        }
        return [];
    }

    private downloadPDF(): void {
        // @ts-ignore
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Add title
        doc.setFontSize(20);
        doc.text('Expense Transactions', 15, 15);
        doc.setFontSize(12);

        // Create the table data
        const headers = [['Date', 'Description', 'Amount', 'Type']];
        const data = this.expenses.map(expense => [
            new Date(expense.date).toLocaleDateString(),
            expense.description,
            `₹${expense.amount.toFixed(2)}`,
            expense.type.toUpperCase()
        ]);

        // Add the table
        (doc as any).autoTable({
            head: headers,
            body: data,
            startY: 25,
            theme: 'grid',
            styles: {
                fontSize: 10,
                cellPadding: 5,
                overflow: 'linebreak'
            },
            headStyles: {
                fillColor: [43, 161, 209],
                textColor: [255, 255, 255]
            },
            alternateRowStyles: {
                fillColor: [245, 245, 245]
            }
        });

        doc.save('expense-transactions.pdf');
    }

    private initialize(): void {
        const header = document.createElement('div');
        header.className = 'page-header';
        header.innerHTML = '<h1>Transaction History</h1>';

        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'download-btn';
        downloadBtn.innerHTML = '<span class="btn-text">Download PDF</span>';
        downloadBtn.onclick = () => this.downloadPDF();

        const transactionList = document.createElement('div');
        transactionList.className = 'transaction-list';

        if (this.expenses.length === 0) {
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.textContent = 'No transactions yet!';
            transactionList.appendChild(emptyState);
        } else {
            this.expenses.forEach(expense => {
                const item = document.createElement('div');
                item.className = `transaction-item ${expense.type}`;
                item.innerHTML = `
                    <div class="transaction-date">${new Date(expense.date).toLocaleDateString()}</div>
                    <div class="transaction-desc">${expense.description}</div>
                    <div class="transaction-amount ${expense.type}">
                        ${expense.type === 'debit' ? '-' : '+'}₹${expense.amount.toFixed(2)}
                    </div>
                `;
                transactionList.appendChild(item);
            });
        }

        this.element.appendChild(header);
        this.element.appendChild(downloadBtn);
        this.element.appendChild(transactionList);
    }

    public render(): HTMLElement {
        return this.element;
    }
}