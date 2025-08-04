const enterButton = document.getElementById('enter-button');
        const addButton = document.getElementById('add-button');
        const descriptionInput = document.getElementById('expense-description');
        const nameInput = document.getElementById('name-input');
        const salaryInput = document.getElementById('salary-input');

        let transactions = [];

        // --- Event Listeners ---
        enterButton.addEventListener('click', function() {
            const name = nameInput.value;
            const salary = salaryInput.value;
            
            localStorage.setItem('userName', name);
            localStorage.setItem('userSalary', salary);

            alert('Details saved!');
            updateUI();
        });

        addButton.addEventListener('click', addTransaction);
        descriptionInput.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                addTransaction();
            }
        });

        // --- Main Functions ---
        function addTransaction() {
            const amountInput = document.getElementById('amount');
            const descriptionText = descriptionInput.value;
            const amountValue = parseFloat(amountInput.value) || 0;

            if (descriptionText.trim() === "" || amountValue <= 0) {
                alert("Please enter a valid description and a positive amount.");
                return;
            }

            const newTransaction = {
                id: Date.now(),
                description: descriptionText,
                amount: amountValue
            };

            transactions.push(newTransaction);
            localStorage.setItem('transactions', JSON.stringify(transactions));
            updateUI();

            descriptionInput.value = '';
            amountInput.value = '';
        }

        function updateUI() {
            const transactionList = document.getElementById('transaction-list');
            const totalExpensesDisplay = document.getElementById('total-expenses');
            const remainingSalaryDisplay = document.getElementById('remaining-salary');
            const userSalaryDisplay = document.getElementById('user-salary');

            transactionList.innerHTML = '';
            
            let totalExpenses = 0;

            transactions.forEach(transaction => {
                const listItem = document.createElement('li');
                const descriptionSpan = document.createElement('span');
                descriptionSpan.textContent = transaction.description;
                const amountSpan = document.createElement('span');
                amountSpan.textContent = `₹${transaction.amount.toFixed(2)}`;
                amountSpan.className = 'transaction-amount';
                listItem.appendChild(descriptionSpan);
                listItem.appendChild(amountSpan);
                transactionList.appendChild(listItem);
                totalExpenses += transaction.amount;
            });

            const savedSalary = parseFloat(localStorage.getItem('userSalary')) || 0;
            const savedName = localStorage.getItem('userName') || 'User';
            const remainingSalary = savedSalary - totalExpenses;

            userSalaryDisplay.textContent = `₹${savedSalary.toFixed(2)}`;
            totalExpensesDisplay.textContent = `₹${totalExpenses.toFixed(2)}`;
            remainingSalaryDisplay.textContent = `₹${remainingSalary.toFixed(2)}`;
            
            // Pre-fill the input fields with saved data
            nameInput.value = savedName;
            salaryInput.value = savedSalary;
        }

        // --- Initial Load ---
        function loadData() {
            const savedTransactions = localStorage.getItem('transactions');
            if (savedTransactions) {
                transactions = JSON.parse(savedTransactions);
            }
            updateUI();
        }

        loadData();

        const resetButton = document.getElementById('reset-button');
        if (resetButton) {
            resetButton.addEventListener('click', function() {
                if (confirm('Are you sure you want to reset all data?')) {
                    localStorage.removeItem('userName');
                    localStorage.removeItem('userSalary');
                    localStorage.removeItem('transactions');
                    transactions = [];
                    updateUI();
                    nameInput.value = '';
                    salaryInput.value = '';
                }
            });
        }