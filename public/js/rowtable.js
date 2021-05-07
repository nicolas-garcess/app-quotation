//import calculate from './calculateproduct.js'
import calculate from './calculateproduct'

//Función para insertar una fila a la tabla. Esta fila contiene los campos para seleccionar el producto y calcular su costo total.
function addRow (element, elementIndex) {
    let tbody = document.querySelector('.table-products__body');

    let row = document.createElement('tr');
    row.classList.add("table-products__row");

    const cellsName = ["list", "priceu", "iva", "quantity", "totalprice", ["plus", "delete"]];

    let fragmentTable = document.createDocumentFragment();

    //Genera las celdas que serán agregadas a la tabla
    for (let cellN of cellsName) {
        let cell = document.createElement('td');
        cell.classList.add("table-products__data");
        if (cellN === "list") {
            cell.appendChild(createList()[0]);
            cell.appendChild(createList()[1]);
        } else if (typeof cellN === "object") {
            cell.appendChild(createImage(`product-${cellN[0]}`,`${cellN[0]}-icon`, `/assets/img/${cellN[0]}.png`));
            //Sólo agrega la imagen de eliminar si hay más de una fila agregada. Evita que la primera fila sea eliminada.
            if (tbody.children.length !== 0) {
                cell.appendChild(createImage(`product-${cellN[1]}`,`${cellN[1]}-icon`, `/assets/img/${cellN[1]}.png`));
            }
        } else {
            cell.appendChild(createCell(cellN));
        }
        fragmentTable.appendChild(cell);
    }

    row.appendChild(fragmentTable);
    //Decisión de cuando adiciona al dom la primera fila u otra después de estar la primera fila agregada
    if (element === null) {
        tbody.appendChild(row);
    } else {
        tbody.insertBefore(row, tbody.children[elementIndex + 1]);
    }

    calculate.selectProductValues();
    calculate.TotalProductPrice();
}

//Función para agregar el pie de tabla con la celda de suma total de costos.
function addTableFoot () {
    let table = document.querySelector('.table-products');
    let tfoot = document.createElement('tfoot');
    let row = document.createElement('tr');
    row.classList.add("table-products__row");

    let cell = document.createElement('td');
    cell.classList.add("table-products__total")
    cell.colSpan = 5;

    let label = document.createElement('label');
    label.innerHTML = "Total";
    cell.appendChild(label);
    cell.appendChild(createCell("total"));

    row.appendChild(cell);
    tfoot.appendChild(row)
    table.appendChild(tfoot);
}

//Permite que se retrase la adición tanto de la primera fila como del pie de la tabla a dom. Esto para que le de tiempo al observador de dectar la primera adición al cuerpo de la tabla
setTimeout(() => {
    addRow(null, 0);
    addTableFoot();
    let tbody = document.querySelector('.table-products__body');
    //Agrega las opciones a la lista del primer elemento del cuerpo de la tabla
    calculate.appendDatalist(tbody.firstElementChild.firstElementChild.lastElementChild);
}, 10);

//Función para crear la lista de productos
function createList () {
    let list = document.createElement('input');
    list.setAttribute('list', 'products');
    list.name = "product";
    list.className = "product-name";
    list.required = true;

    let datalist = document.createElement('datalist');
    datalist.id = "products";

    return [list, datalist];
}

//Función para crear celda de la tabla
function createCell (class_name) {
    let inputText = document.createElement('input');
    inputText.className = `product-${class_name}`;
    inputText.name = class_name;
    inputText.required = true;

    if (class_name !== "quantity") {
        inputText.type = "text";
        inputText.readOnly = true;
        inputText.step = 0.01;
    } else {
        inputText.type = "number";
        inputText.min = 1;
        inputText.value = 1;
    }

    return inputText;
}

//Función para crear elemento imagen
function createImage (class_name, altName, srcURL) {
    let image = document.createElement('img');
    image.src = srcURL;
    image.alt = altName;
    image.className = class_name;

    return image;
}

const tbody = document.querySelector('.table-products__body');

//Función que perite eliminar la fila seleccionada
function deleteRow (elementIndex) {
    let tbodyChildren = tbody.children;
    tbody.removeChild(tbodyChildren[elementIndex]);
}

//Observador para cuando ocurre alguna adición o eliminación dentro del cuerpo de la tabla
const observer = new MutationObserver(mutations => {
    //console.log(mutations[0]);
    //Decisión para determinar si se agrega o elimina algo del cuerpo de la tabla
    if (mutations[0].addedNodes.length === 1) {
        //Selecciona el elemento agregado y obtiene el elemento imagen de agregar
        const elementAdded = mutations[0].addedNodes[0];
        const imagePlus = elementAdded.lastChild.firstChild;
        //Evento para cuando se presione agregar fila en la tabla
        imagePlus.addEventListener('click', (e) => {
            const imagePlusList = document.querySelectorAll('.product-plus');
            //Determina el índice del elemento que fue oprimido
            let elementIndex = Array.from(imagePlusList).indexOf(e.target);
            addRow(e.target.parentNode.parentNode, elementIndex);

            //Agrega las opciones de la lista al nuevo elemento agregado
            calculate.appendDatalist(e.target.parentNode.parentNode.nextElementSibling.firstElementChild.lastElementChild);
        });
        
        //Con esta decisión se evita que a la primera fila se agregue un evento que no le corresponde a la imagen de agregar fila.
        if (elementAdded.lastChild.children.length > 1) {
            //Obtiene el elemento imagen de eliminar
            const imageDelete = elementAdded.lastChild.lastChild;
            //Evento para cuando se presione eliminar fila en la tabla
            imageDelete.addEventListener('click', (e) => {
                const imageDeleteList = document.querySelectorAll('.product-delete');
                //Determina el índice del elemento que fue oprimido
                let elementIndex = Array.from(imageDeleteList).indexOf(e.target);
                
                //Se le debe incrementar uno ya que la primera fila de la tabla no tiene botón de eliminar.
                deleteRow(elementIndex + 1);
                calculate.totalQuotation();
            });
        }
    }
});

//Indica cuando ocurre algún cambio dentro del cuerpo de la tabla
observer.observe(tbody, {
    childList: true,
});