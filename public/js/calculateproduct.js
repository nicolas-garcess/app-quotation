//Toma información que le envía la vista
const products = JSON.parse(document.querySelector('.data').dataset.products);

//Función para generar las opciones del datalist
function appendDatalist (datalist) {
    //const datalist = document.querySelector('#products');

    let fragmentList = document.createDocumentFragment();
    
    //Genera los option del datalist
    for (let product of products) {
        const option = document.createElement("option");
        option.value = `${product.Name} ${product.Brand} ${product.Capacity}`;
        option.dataset.id = product.ID;
        fragmentList.appendChild(option);
    }
    
    datalist.appendChild(fragmentList);
}

//Función para mostrar datos en la vista dependiendo del producto seleccionado
function selectProductValues () {

    const productList = document.querySelectorAll('.product-name');
    
    //Evento cuando se completa el producto seleccionado retorna su precio unitario e IVA
    productList.forEach(productElement => {
        productElement.addEventListener('input', (e) => {

            //Define los elementos padres de los hijos que serán modificados cuando sea seleccionado el producto
            let parentElement = e.target.parentNode;
            let priceElement = parentElement.nextElementSibling;
            let ivaElement = priceElement.nextElementSibling;
            
            try {
                //Recoge el id del producto que está en la vista
                const productID = document.querySelector(`#${e.target.getAttribute('list')} option[value="${e.target.value}"]`).dataset.id;
    
                for (let product of products) {
                    if (productID === product.ID) {
                        priceElement.firstElementChild.value = product["Price"];
                        ivaElement.firstElementChild.value = product["IVA"];
                    }
                }
            } catch (error) {
                priceElement.firstElementChild.value = 0;
                ivaElement.firstElementChild.value = 0;
            }      

            //Calcula el costo total del producto cuando se modifica la cantidad. Por parámetro se pasa el elemento tr, que es el padre de todas las celdas
            calculateTotalProductCost(e.target.parentNode.parentNode);
            totalQuotation();
        });
    });
}

//Cuando el cliente ingresa la cantidad de cada producto calcula el precio total por cada producto
function TotalProductPrice () {
    
    const quantityList = document.querySelectorAll('.product-quantity');

    quantityList.forEach(quantityElement => { 

        quantityElement.addEventListener('input', (e) => {
            //Calcula el costo total del producto cuando se modifica la cantidad. Por parámetro se pasa el elemento tr, que es el padre de todas las celdas
            calculateTotalProductCost(e.target.parentNode.parentNode);
            totalQuotation();
        });
    });
}

function calculateTotalProductCost (element) {
    //Define los elementos padres de los hijos que serán modificados cuando sea introducido la cantidad en la cotización
    let parentElement = element;
    let priceElement = parentElement.firstElementChild.nextElementSibling;
    let ivaElement = priceElement.nextElementSibling;
    let quantityElement = ivaElement.nextElementSibling;

    //Input donde se mostrá el costo total del producto
    const totalCostElement = quantityElement.nextElementSibling.firstElementChild;
    
    if (priceElement.children[0].value >= 0 && quantityElement.children[0].value >= 0 && ivaElement.children[0].value) {
        
        totalCostElement.value = priceElement.children[0].value * quantityElement.children[0].value * (1 + ivaElement.children[0].value/100); 
    }
}

function totalQuotation() {
    let costElements = document.querySelectorAll('.product-totalprice')

    let totalCost = 0;
    costElements.forEach(element => {
        totalCost = totalCost + Number(element.value);
    });

    let costTotalElement = document.querySelector('.product-total');
    costTotalElement.value = totalCost;
}

export default {appendDatalist, selectProductValues, TotalProductPrice, totalQuotation};
