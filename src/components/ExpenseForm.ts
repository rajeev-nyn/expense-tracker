import { Expense } from '../types';

export class ExpenseForm {
    private element: HTMLElement;
    public onSubmit: (expense: Expense) => void;
    private type: 'debit' | 'credit' = 'debit';

    constructor(onSubmit: (expense: Expense) => void) {
        this.element = document.createElement('div');
        this.element.className = 'expense-form';
        this.onSubmit = onSubmit;
        this.initializeForm();
    }

    private parseInput(input: string): { amount: number; description: string } | null {
        const numberMatch = input.match(/\d+(\.\d+)?/);
        if (!numberMatch) return null;

        const amount = parseFloat(numberMatch[0]);
        const description = input.replace(numberMatch[0], '').trim();
        
        return { amount, description };
    }

    private initializeForm(): void {
        const form = document.createElement('form');
        
        const inputContainer = document.createElement('div');
        inputContainer.className = 'input-container';

        const mainInput = document.createElement('input');
        mainInput.type = 'text';        mainInput.placeholder = 'Enter transaction (e.g., lunch 50)';
        mainInput.className = 'smart-input';
        mainInput.required = true;

        const toggleContainer= document.createElement('div');
        toggleContainer.className = 'toggle-container';

        const toggleSwitch = document.createElement('div');
        toggleSwitch.className = 'toggle-switch';

        const toggleLabel = document.createElement('label');
        toggleLabel.className = 'switch';

        const toggleInput = document.createElement('input');
        toggleInput.type = 'checkbox';
        
        const slider = document.createElement('span');
        slider.className = 'slider';

        const toggleText = document.createElement('div');
        toggleText.className = 'toggle-text';
        toggleText.innerHTML = '<span class="debit-text">Debit</span><span class="credit-text">Credit</span>';

        toggleInput.onchange = (e) => {
            const target = e.target as HTMLInputElement;
            this.type = target.checked ? 'credit' : 'debit';
            toggleContainer.className = 'toggle-container ' + this.type;
        };

        const submitBtn = document.createElement('button');
        submitBtn.textContent = 'Add Transaction';
        submitBtn.className = 'submit-btn';
        submitBtn.type = 'submit';

        form.onsubmit = (e) => {
            e.preventDefault();
            const parsed = this.parseInput(mainInput.value);
            if (parsed) {
                this.onSubmit({
                    id: Date.now().toString(),
                    amount: parsed.amount,
                    description: parsed.description || 'Untitled',
                    type: this.type,
                    date: new Date()
                });
                form.reset();
                toggleInput.checked = false;
                this.type = 'debit';
                toggleContainer.className = 'toggle-container debit';
            }
        };

        toggleLabel.appendChild(toggleInput);
        toggleLabel.appendChild(slider);
        toggleSwitch.appendChild(toggleLabel);
        toggleContainer.appendChild(toggleText);
        toggleContainer.appendChild(toggleSwitch);        inputContainer.appendChild(mainInput);

        form.appendChild(inputContainer);
        form.appendChild(toggleContainer);
        form.appendChild(submitBtn);

        this.element.appendChild(form);
    }

    public render(): HTMLElement {
        return this.element;
    }
}