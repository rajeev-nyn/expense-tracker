import { Expense, MonthlyTotal } from '../types';

export class ExpenseList {
    private element: HTMLElement;
    private expenses: Expense[];
    private totalsElement: HTMLElement;
    private readonly STORAGE_KEY = 'expenses';

    constructor() {
        this.element = document.createElement('div');
        this.element.className = 'expense-list';
        this.expenses = this.loadExpenses();
        this.totalsElement = document.createElement('div');
        this.totalsElement.className = 'monthly-total';
        this.render();
    }

    private loadExpenses(): Expense[] {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
            const expenses = JSON.parse(stored);
            return expenses.map((exp: any) => ({
                ...exp,
                date: new Date(exp.date)
            }));
        }
        return [];
    }

    private saveExpenses(): void {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.expenses));
    }

    private calculateMonthlyTotals(): MonthlyTotal {
        const currentMonth = new Date().getMonth();
        const monthlyExpenses = this.expenses.filter(
            expense => expense.date.getMonth() === currentMonth
        );

        return monthlyExpenses.reduce((totals: MonthlyTotal, expense) => {
            if (expense.type === 'debit') {
                totals.totalDebit += expense.amount;
            } else {
                totals.totalCredit += expense.amount;
            }
            totals.netBalance = totals.totalCredit - totals.totalDebit;
            return totals;
        }, { totalDebit: 0, totalCredit: 0, netBalance: 0 });
    }

    private updateTotals(): void {
        const totals = this.calculateMonthlyTotals();
        this.totalsElement.innerHTML = `
            <div class="total-item debit">Debit: ₹${totals.totalDebit.toFixed(2)}</div>
            <div class="total-item credit">Credit: ₹${totals.totalCredit.toFixed(2)}</div>
            <div class="total-item ${totals.netBalance >= 0 ? 'credit' : 'debit'}">
                Balance: ₹${totals.netBalance.toFixed(2)}
            </div>
        `;
    }

    public addExpense(expense: Expense): void {
        this.expenses.unshift(expense);
        this.saveExpenses();
        this.render();
    }

    public deleteExpense(id: string): void {
        const expenseElement = this.element.querySelector(`[data-id="${id}"]`) as HTMLElement;
        if (expenseElement) {
            expenseElement.classList.add('deleting');
            setTimeout(() => {
                this.expenses = this.expenses.filter(e => e.id !== id);
                this.saveExpenses();
                this.render();
            }, 300);
        }
    }

    private createExpenseElement(expense: Expense): HTMLElement {
        const expenseElement = document.createElement('div');
        expenseElement.className = `expense-item ${expense.type}`;
        expenseElement.setAttribute('data-id', expense.id);
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'expense-content';
        contentDiv.innerHTML = `
            <div class="expense-amount">₹${expense.amount.toFixed(2)}</div>
            <div class="expense-description">${expense.description}</div>
            <div class="expense-date">${expense.date.toLocaleDateString()}</div>
        `;

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-transaction-btn';
        deleteBtn.innerHTML = '×';
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            this.deleteExpense(expense.id);
        };

        expenseElement.appendChild(contentDiv);
        expenseElement.appendChild(deleteBtn);

        return expenseElement;
    }

    private render(): void {
        this.element.innerHTML = '';
        this.updateTotals();
        this.element.appendChild(this.totalsElement);
        
        const listContainer = document.createElement('div');
        listContainer.className = 'expenses-container';
        
        this.expenses.forEach(expense => {
            listContainer.appendChild(this.createExpenseElement(expense));
        });
        
        this.element.appendChild(listContainer);
    }

    public getElement(): HTMLElement {
        return this.element;
    }
}