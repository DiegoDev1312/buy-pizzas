const getElement = (element) => document.querySelector(element);
const getAllElement = (element) => document.querySelectorAll(element);

let qtdPizza = 1;
let cart = [];
let selectedPizza;

function convertCurrency(price) {
    return price.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });
}

function createPizzaCard(pizzaArea, pizzaItem) {
    pizzaArea.querySelector('.pizza-item--img img').src = pizzaItem.img;
    pizzaArea.querySelector('.pizza-item--price').innerHTML = convertCurrency(pizzaItem.price);
    pizzaArea.querySelector('.pizza-item--name').innerHTML = pizzaItem.name;
    pizzaArea.querySelector('.pizza-item--desc').innerHTML = pizzaItem.description;

    pizzaArea.querySelector('a').addEventListener('click', (event) => {
        event.preventDefault();
        qtdPizza = 1;
        selectedPizza = pizzaItem;

        getElement('.pizzaInfo--qt').textContent = qtdPizza;
        getElement('.pizzaWindowArea').style.opacity = 0;
        getElement('.pizzaWindowArea').style.display = 'flex';
        setTimeout(() => {
            getElement('.pizzaWindowArea').style.opacity = 1;
        }, 200);
        
        createModalInfo(pizzaItem);
    });
}

function createModalInfo(pizzaItem) {
    getAllElement('.pizzaInfo--size').forEach((pizzaSizeArea, index) => {
        if (index === 2) {
            pizzaSizeArea.classList.add('selected');
        } else {
            pizzaSizeArea.classList.remove('selected');
        }
    });
    getElement('.pizzaBig img').src = pizzaItem.img;
    getElement('.pizzaInfo--actualPrice').innerHTML = convertCurrency(pizzaItem.price);
    getElement('.pizzaInfo h1').innerHTML = pizzaItem.name;
    getElement('.pizzaInfo--desc').innerHTML = pizzaItem.description;
    getAllElement('.pizzaInfo--size span').forEach((spanSizeText, index) => {
        spanSizeText.textContent = pizzaItem.sizes[index];
    });
}

function updateCart() {
    closeModal();
    createCartArea();
}

function addToCart() {
    let size = getElement('.pizzaInfo--size.selected').getAttribute('data-key');
    let identifier = `${selectedPizza.id}@${parseInt(size)}`;
    let includesCartIndex = cart.findIndex((cartValue) => cartValue.identifier === identifier);
    if (includesCartIndex > -1) {
        cart[includesCartIndex].qtd += qtdPizza;
    } else {
        const cartBody = {
            identifier,
            id: selectedPizza.id,
            size: parseInt(size),
            qtd: qtdPizza,
            price: selectedPizza.price,
        };
        cart.push(cartBody);
    }
    updateCart();
}

function closeMobileCart() {
    getElement('aside').style.left = '100vw';
}

getElement('.menu-openner').addEventListener('click', () => {
    if (cart.length > 0) {
        getElement('aside').style.left = '0';
    }
});

getElement('.menu-closer').addEventListener('click', () => {
    closeMobileCart();
});

function createCartArea() {
    getElement('.menu-openner span').textContent = cart.length;
    
    if (cart.length > 0) {
        getElement('aside').classList.add('show');
        getElement('.cart').innerHTML = '';
        let calcPrice = 0;
        let calcDesc = 0;

        for (let i in cart) {
            let userSelectedPizza = pizzaJson.find((pizza) => pizza.id === cart[i].id);
            const cartArea = document.querySelector('.models .cart--item').cloneNode(true);
            calcPrice += (userSelectedPizza.price * cart[i].qtd);
            calcDesc = calcPrice * 0.1;
            createCartInfo(i, cartArea, userSelectedPizza);
            getElement('.cart').append(cartArea);
        }

        getElement('.cart--totalitem.subtotal span:last-child').textContent = convertCurrency(calcPrice);
        getElement('.cart--totalitem.desconto span:last-child').textContent = convertCurrency(calcDesc);
        getElement('.cart--totalitem.total.big span:last-child').textContent = convertCurrency(calcPrice - calcDesc);
    } else {
        getElement("aside").classList.remove('show');
        closeMobileCart();
    }
}

function createCartInfo(index, cartArea, userSelectedPizza) {
    cartArea.querySelector('img').src = userSelectedPizza.img;
    let pizzaSizeName;
    switch(cart[index].size) {
        case 0: 
            pizzaSizeName = 'P';
            break;
        case 1:
            pizzaSizeName = 'M';
            break;
        case 2:
            pizzaSizeName = 'G';
            break;
    }
    cartArea.querySelector('.cart--item-nome').textContent = `${userSelectedPizza.name} - ${pizzaSizeName}`;
    cartArea.querySelector('.cart--item--qt').textContent = cart[index].qtd;
    cartArea.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
        if (cart[index].qtd > 1) {
            cart[index].qtd--;
        } else {
            cart.splice(index, 1);
        }
        updateCart();
    });
    cartArea.querySelector('.cart--item-qtmais').addEventListener('click', () => {
        cart[index].qtd++;
        updateCart();
    });
}

function closeModal() {
    getElement('.pizzaWindowArea').style.opacity = 0;

    setTimeout(() => {
        getElement('.pizzaWindowArea').style.display = 'none';
    }, 200);
}

function init() {
    pizzaJson.forEach((pizzaItem) => {
        const pizzaArea = document.querySelector('.models .pizza-item').cloneNode(true);
        createPizzaCard(pizzaArea, pizzaItem);
        getElement('.pizza-area').appendChild(pizzaArea);
    });
}

getAllElement('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((closeButton) => {
    closeButton.addEventListener('click', closeModal);
});

getElement('.pizzaInfo--qtmenos').addEventListener('click', () => {
    if (qtdPizza > 1) {
        qtdPizza--;
        getElement('.pizzaInfo--actualPrice').innerHTML = convertCurrency(selectedPizza.price * qtdPizza);
        getElement('.pizzaInfo--qt').textContent = qtdPizza;
    }
});

getElement('.pizzaInfo--qtmais').addEventListener('click', () => {
    qtdPizza++;
    getElement('.pizzaInfo--actualPrice').innerHTML = convertCurrency(selectedPizza.price * qtdPizza);
    getElement('.pizzaInfo--qt').textContent = qtdPizza;
});

getAllElement('.pizzaInfo--size').forEach((pizzaSizeArea) => {
    pizzaSizeArea.addEventListener('click', () => {
        getElement('.pizzaInfo--size.selected').classList.remove('selected');
        pizzaSizeArea.classList.add('selected');
    });
});

getElement('.pizzaInfo--addButton').addEventListener('click', addToCart);

init();
