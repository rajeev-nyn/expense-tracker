import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseList } from './components/ExpenseList';
import { Expense } from './types';
import './styles/main.css';

class App {
    private expenseForm: ExpenseForm;
    private expenseList: ExpenseList;

    constructor() {
        this.expenseList = new ExpenseList();
        this.expenseForm = new ExpenseForm(this.handleExpenseSubmit.bind(this));
        this.initialize();
    }

    private handleExpenseSubmit = (expense: Expense): void => {
        this.expenseList.addExpense(expense);
    };

    private initialize(): void {
        const appContainer = document.getElementById('app');
        if (appContainer) {
            const title = document.createElement('h1');
            title.textContent = 'Expense Tracker';
            title.className = 'app-title';

            appContainer.appendChild(title);
            appContainer.appendChild(this.expenseForm.render());
            appContainer.appendChild(this.expenseList.getElement());
        }
    }
}

new App();