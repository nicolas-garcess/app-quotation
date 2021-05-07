const download = document.querySelector(".button-report");   

//Evento que permite la descarga de la cotización
download.addEventListener('click', async (e) => {
    e.preventDefault() //- Evita que se refresque el sitio web
        
    //Lista con la información del cliente y los productos de la cotización. 
    let inputListUpper = Array.from(document.querySelector('.container-data').getElementsByTagName('input'));
    let inputListtBody = Array.from(document.querySelector('.table-products__body').getElementsByTagName('input'));
    console.log(inputListtBody);
    let inputtfoot = document.querySelector('.product-total');

    let dataClient = generateObjectClient(inputListUpper);
    const canBeDownloaded = (dataClient.name !== "" && dataClient.dnitype !== "" && dataClient.dni !== "");

    //Validación para determinar si el usuario ingresó los datos completos
    if (canBeDownloaded) {
        //Array con la información que será enviada al back-end para crear el pdf
        let data = [dataClient, generateObjectProduct(inputListtBody), {"name":inputtfoot.name, "value":inputtfoot.value}];
        
        let fileName = "quotation.pdf";
        let fileType = "pdf";

        fetch('/quotation/pdf-file', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({type: fileType, data: data}) 
        })
        .then(async res => ({
                filename: fileName,
                blob: await res.blob()
            }))
        .then(resObj => {
            // It is necessary to create a new blob object with mime-type explicitly set for all browsers except Chrome, but it works for Chrome too.
            const newBlob = new Blob([resObj.blob], { type: `application/${fileType}`});
    
            // MS Edge and IE don't allow using a blob object directly as link href, instead it is necessary to use msSaveOrOpenBlob
            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(newBlob);
            } else {
                // For other browsers: create a link pointing to the ObjectURL containing the blob.
                const objUrl = window.URL.createObjectURL(newBlob);
    
                let link = document.createElement('a');
                link.href = objUrl;
                link.download = resObj.filename;
                link.click();
    
                // For Firefox it is necessary to delay revoking the ObjectURL.
                setTimeout(() => { window.URL.revokeObjectURL(objUrl); }, 250);
            }
        })
        .catch((error) => {
            console.log('DOWNLOAD ERROR', error);
        });                        
    } else {
        alert("Complete los datos");
    }
});

//Función para crear el objeto con la información del cliente
function generateObjectClient (array) {
    let objectData = {};

    for (let i = 0; i < array.length; i++) {
        objectData[array[i].name] = array[i].value;
    }

    return objectData;
}

//Función para crear el objeto con los productos de la cotización
function generateObjectProduct (array) {
    let objectRow = {};
    let totalData = {};
    let j = 0;
    for (let i = 0; i < array.length; i++) {
        objectRow[array[i].name] = array[i].value;
        //Cuando hay 5 elementos significa que ya se tiene un producto agregado, entonces debe cambiar al siguiente
        if (Object.keys(objectRow).length === 5) {
            totalData[j] = objectRow;
            objectRow = {}; 
            j = j + 1;
        }        
    }
    return totalData;
}
