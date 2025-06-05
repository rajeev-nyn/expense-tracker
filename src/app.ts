import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseList } from './components/ExpenseList';
import { TransactionPage } from './components/TransactionPage';
import { Expense } from './types';
import './styles/main.css';

class App {
    private expenseForm: ExpenseForm;
    private expenseList: ExpenseList;
    private transactionPage: TransactionPage;
    private currentView: 'home' | 'transactions' = 'home';

    constructor() {
        this.expenseList = new ExpenseList();
        this.expenseForm = new ExpenseForm(this.handleExpenseSubmit.bind(this));
        this.transactionPage = new TransactionPage();
        this.initialize();
        this.handleRouting();
    }

    private handleExpenseSubmit = (expense: Expense): void => {
        this.expenseList.addExpense(expense);
    };

    private handleRouting(): void {
        window.addEventListener('popstate', () => this.updateView());
        
        window.addEventListener('load', () => {
            this.updateView();
        });
    }

    private updateView(): void {
        const path = window.location.pathname;
        const container = document.getElementById('app');
        if (!container) return;

        container.innerHTML = '';
        
        if (path === '/transactions') {
            this.currentView = 'transactions';
            container.appendChild(this.createNav());
            container.appendChild(this.transactionPage.render());
        } else {
            this.currentView = 'home';
            container.appendChild(this.createNav());
            const mainContent = document.createElement('div');
            mainContent.appendChild(this.expenseForm.render());
            mainContent.appendChild(this.expenseList.getElement());
            container.appendChild(mainContent);
        }
    }

    private createNav(): HTMLElement {
        const nav = document.createElement('nav');
        nav.className = 'nav-bar';        const homeLink = document.createElement('a');
        homeLink.textContent = 'Home';
        homeLink.href = '/';
        homeLink.className = this.currentView === 'home' ? 'active' : '';
        homeLink.onclick = (e) => {
            e.preventDefault();
            history.pushState(null, '', '/');
            this.updateView();
        };        const transactionsLink = document.createElement('a');
        transactionsLink.textContent = 'Transactions';
        transactionsLink.href = '/transactions';
        transactionsLink.className = this.currentView === 'transactions' ? 'active' : '';
        transactionsLink.onclick = (e) => {
            e.preventDefault();
            history.pushState(null, '', '/transactions');
            this.updateView();
        };

        nav.appendChild(homeLink);
        nav.appendChild(transactionsLink);
        return nav;
    }

    private initialize(): void {
        this.updateView();
    }
}

new App();