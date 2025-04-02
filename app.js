document.addEventListener('DOMContentLoaded', () => {
    const stocksData = JSON.parse(stockContent);
    const userData = JSON.parse(userContent);

    const deleteButton = document.querySelector('#btnDelete');
    const saveButton = document.querySelector('#btnSave');

    generateUserList(userData, stocksData);

    deleteButton.addEventListener('click', (event) => {
        event.preventDefault();
        const userId = document.querySelector('#userID').value.trim();
        const userIndex = userData.findIndex(user => user.id == userId);
        if (userIndex !== -1) {
            userData.splice(userIndex, 1);
            generateUserList(userData, stocksData);
            clearForm();
        }
    });

    saveButton.addEventListener('click', (event) => {
        event.preventDefault();
        const id = document.querySelector('#userID').value.trim();
        const user = userData.find(user => user.id == id);
        if (user) {
            Object.assign(user.user, {
                firstname: document.querySelector('#firstname').value.trim(),
                lastname: document.querySelector('#lastname').value.trim(),
                address: document.querySelector('#address').value.trim(),
                city: document.querySelector('#city').value.trim(),
                email: document.querySelector('#email').value.trim()
            });
            generateUserList(userData, stocksData);
        }
    });

    function generateUserList(users, stocks) {
        const userList = document.querySelector('.user-list');
        userList.innerHTML = users.map(({ user, id }) => `<li id="${id}">${user.lastname}, ${user.firstname}</li>`).join('');
        userList.addEventListener('click', (event) => handleUserListClick(event, users, stocks));
    }

    function handleUserListClick(event, users, stocks) {
        const user = users.find(user => user.id == event.target.id);
        if (user) {
            populateForm(user);
            renderPortfolio(user, stocks);
        }
    }

    function renderPortfolio(user, stocks) {
        const portfolioDetails = document.querySelector('.portfolio-list');
        portfolioDetails.innerHTML = user.portfolio.map(({ symbol, owned }) => `
            <div class="portfolio-item">
                <p>${symbol}</p>
                <p>${owned}</p>
                <button id="${symbol}" class="view-stock">View</button>
            </div>
        `).join('');

        portfolioDetails.addEventListener('click', (event) => {
            if (event.target.classList.contains('view-stock')) {
                viewStock(event.target.id, stocks);
            }
        });
    }

    function populateForm({ user, id }) {
        document.querySelector('#userID').value = id;
        document.querySelector('#firstname').value = user.firstname;
        document.querySelector('#lastname').value = user.lastname;
        document.querySelector('#address').value = user.address;
        document.querySelector('#city').value = user.city;
        document.querySelector('#email').value = user.email;
    }

    function viewStock(symbol, stocks) {
        const stock = stocks.find(s => s.symbol == symbol);
        if (stock) {
            document.querySelector('#stockName').textContent = stock.name;
            document.querySelector('#stockSector').textContent = stock.sector;
            document.querySelector('#stockIndustry').textContent = stock.subIndustry;
            document.querySelector('#stockAddress').textContent = stock.address;
        }
    }

    function clearForm() {
        ['#userID', '#firstname', '#lastname', '#address', '#city', '#email'].forEach(selector => {
            document.querySelector(selector).value = '';
        });
        document.querySelector('.portfolio-list').innerHTML = '';
    }
});
