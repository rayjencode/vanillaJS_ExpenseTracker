class UI {
    constructor() {
        this.budgetFeedback = document.querySelector('.budget-feedback');
        this.expenseFeedback = document.querySelector('.expense-feedback');
        this.budgetForm = document.getElementById('budget-form');
        this.budgetInput = document.getElementById('budget-input');
        this.budgetAmount = document.getElementById('budget-amount');
        this.expenseAmount = document.getElementById('expense-amount');
        this.balance = document.getElementById('balance');
        this.balanceAmount = document.getElementById('balance-amount');
        this.expenseForm = document.getElementById('expense-form');
        this.expenseInput = document.getElementById('expense-input');
        this.amountInput = document.getElementById('amount-input');
        this.expenseList = document.getElementById('expense-list');
        this.expenseSubmit = document.getElementById('expense-submit');
        this.itemList = [];
        this.itemID = 1;
    }

    getLocalStorage() {
        const self = this;
        if (localStorage.getItem('expenses') === null) {
            this.itemList = [];
        } else {
            let expenses = (this.itemList = JSON.parse(
                localStorage.getItem('expenses')
            ));
            expenses.forEach(function (item) {
                self.addExpense(item);
                self.totalExpense();
                self.showBalance();
            });
        }

        this.budgetAmount.textContent = localStorage.getItem('budget');
        this.totalExpense();
        this.showBalance();
    }

    submitBudgetForm() {
        const value = this.budgetInput.value;

        if (value === '' || value < 0) {
            this.setAlert(
                this.budgetFeedback,
                'Please Enter a valid amount',
                'alert-danger'
            );
        } else {
            this.budgetAmount.textContent = parseInt(value);
            this.setAlert(
                this.budgetFeedback,
                'New Budget Successfully Updated!',
                'alert-success'
            );

            localStorage.setItem('budget', value);
            this.showBalance();
            this.clearFields(this.budgetInput);
        }
    }

    submitExpenseForm() {
        const handleSubmit = (id) => {
            const self = this;
            let expense = {
                id: id,
                title: expenseTitle.value,
                amount: expenseAmount.value,
            };

            this.itemID++;

            this.itemList.push(expense);

            this.addExpense(expense);
            this.totalExpense();
            this.showBalance();

            localStorage.setItem('expenses', JSON.stringify(self.itemList));

            this.clearFields(expenseAmount);
            this.clearFields(expenseTitle);
        };

        const expenseTitle = this.expenseInput;
        const expenseAmount = this.amountInput;

        if (this.expenseSubmit.dataset.id > 0) {
            if (
                expenseTitle.value === '' ||
                expenseAmount.value === '' ||
                expenseAmount.value < 0
            ) {
                this.setAlert(
                    this.expenseFeedback,
                    'please enter a valid expense',
                    'alert-danger'
                );
                expenseTitle.focus();
            } else {
                this.expenseSubmit.textContent = 'Add Expense';

                const id = parseInt(this.expenseSubmit.dataset.id);

                const newItemList = this.itemList.filter(function (item) {
                    return item.id !== id;
                });

                this.itemList = newItemList;

                handleSubmit(id);

                this.setAlert(
                    this.expenseFeedback,
                    'Expense Successfully Updated!',
                    'alert-success'
                );

                console.log(this.itemList);
            }
        } else {
            if (
                expenseTitle.value === '' ||
                expenseAmount.value === '' ||
                expenseAmount.value < 0
            ) {
                this.setAlert(
                    this.expenseFeedback,
                    'please enter a valid expense!',
                    'alert-danger'
                );
            } else {
                handleSubmit(this.itemID);

                this.setAlert(
                    this.expenseFeedback,
                    'New Expense Successfully Added',
                    'alert-success'
                );
            }
        }
    }

    addExpense(expense) {
        const div = document.createElement('div');
        div.classList.add('expense');
        div.innerHTML = `
      <div
      class="expense-item d-flex justify-content-between align-items-baseline"
  >
      <h6
          class="expense-title mb-0 text-uppercase list-item"
      >-
          ${expense.title}
      </h6>
      <h5
          class="expense-amount mb-0 list-item"
      >
          ${expense.amount}
      </h5>

      <div class="expense-icons list-item">
          <a
              href="#"
              class="edit-icon mx-2"
              data-id="${expense.id}"
          >
              <i class="fas fa-edit"></i>
          </a>
          <a
              href="#"
              class="delete-icon"
              data-id="${expense.id}"
          >
              <i class="fas fa-trash"></i>
          </a>
      </div>
  </div>
      `;

        this.expenseList.appendChild(div);
    }

    clearFields(x) {
        x.value = ``;
        x.focus();
    }

    setAlert(element, message, alert) {
        element.classList.add('showItem', `${alert}`);
        element.textContent = `${message}`;

        setTimeout(() => {
            element.classList.remove('showItem', `${alert}`);
            element.textContent = ``;
        }, 3000);
    }

    showBalance() {
        const expense = parseInt(this.expenseAmount.textContent);
        const balance = parseInt(this.budgetAmount.textContent) - expense;
        this.balance.textContent = balance;

        if (balance < 0) {
            this.balance.classList.add('showRed');
            this.balance.classList.remove('showGreen', 'showBlack');
        } else if (balance === 0) {
            this.balance.classList.add('showBlack');
            this.balance.classList.remove('showRed', 'showGreen');
        } else {
            this.balance.classList.add('showGreen');
            this.balance.classList.remove('showBlack', 'showRed');
        }
    }
    totalExpense() {
        let expense = this.itemList.reduce(function (a, b) {
            return a + parseInt(b.amount);
        }, 0);

        this.expenseAmount.textContent = expense;

        return expense;
    }
    deleteExpense(element) {
        const id = parseInt(element.dataset.id);

        let newItems = this.itemList.filter(function (item) {
            return item.id !== id;
        });

        this.itemList = newItems;

        this.totalExpense();
        this.showBalance();

        this.expenseList.removeChild(
            element.parentElement.parentElement.parentElement
        );

        localStorage.setItem('expenses', JSON.stringify(newItems));
    }

    editExpense(element) {
        const id = parseInt(element.dataset.id);

        const expenseInput = this.expenseInput;
        const amountInput = this.amountInput;
        const expenseSubmit = this.expenseSubmit;

        this.itemList.forEach(function (item) {
            if (item.id === id) {
                expenseInput.value = item.title;
                amountInput.value = item.amount;
                expenseSubmit.dataset.id = item.id;
            }
        });

        this.expenseSubmit.textContent = 'Update Expense';

        this.expenseList.removeChild(
            element.parentElement.parentElement.parentElement
        );
    }
}

function eventListener() {
    const budgetForm = document.getElementById('budget-form');
    const expenseForm = document.getElementById('expense-form');
    const expenseList = document.getElementById('expense-list');

    const ui = new UI();

    budgetForm.addEventListener('submit', function (e) {
        e.preventDefault();

        ui.submitBudgetForm();
    });

    expenseForm.addEventListener('submit', function (e) {
        e.preventDefault();

        ui.submitExpenseForm();
    });

    expenseList.addEventListener('click', function (e) {
        const target = e.target;
        if (target.parentElement.classList.contains('edit-icon')) {
            ui.editExpense(target.parentElement);
        } else if (target.parentElement.classList.contains('delete-icon')) {
            ui.deleteExpense(target.parentElement);
        }
    });
    ui.getLocalStorage();
}

document.addEventListener('DOMContentLoaded', function () {
    eventListener();
});
