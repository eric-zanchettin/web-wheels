const carsData = {
    allCars: [],
    carNameContainer: document.querySelector('div.car-name'),
    input: document.querySelector('input[name="car_model"]'),
    async getData() {
        const cars = await axios.get('http://localhost:3000/api/cars/data');
        for (car of cars.data) {
            this.allCars.push(car.carname);
        };
    },

    async filterCar(carName) {
        if (carName == '' || carName == ' ') return;

        let search = this.allCars.filter(car => {
            if (car.toLowerCase().includes(carName.toLowerCase())) return car;
        });

        let searchLimit = [];
        
        for (i = 0; i < search.length; i++) {
            searchLimit.push(search[i]);
            if (i >= 8) break;
        };

        this.createSearchElement(searchLimit, carName);
    },

    createSearchElement(suggestions, carName) {
        this.removeSearchElement();
        
        suggestionContainer = document.createElement('div');
        suggestionContainer.classList.add('suggestions');
        suggestionContainer.style.position = "absolute";
        suggestionContainer.style.marginLeft = "-320px";
        this.carNameContainer.appendChild(suggestionContainer)
        for (suggestion of suggestions) {
            let divSugg = document.createElement('div');
            divSugg.classList.add('sugg')
            let sugg = document.createElement('p');
            sugg.innerHTML = suggestion.replace(`${carName}`, `<b>${carName}</b>`);
            divSugg.appendChild(sugg);
            divSugg.onclick = function() {
                carsData.input.value = divSugg.querySelector('p').innerHTML.replace('<b>', '').replace('</b>', '')
                carsData.removeSearchElement();
            }; 
            suggestionContainer.appendChild(divSugg);
        };

        this.carNameContainer.onmouseleave = function() {
            carsData.removeSearchElement();
        };   
    },

    removeSearchElement() {
        let suggestionContainer = document.querySelector('div.suggestions');
        if (suggestionContainer) suggestionContainer.remove();
    },
};

const colorChange = {
    respSelect: document.querySelector('select#color'),
    colorInput: document.querySelector('input#color-preview'),
    previewBoxColor() {
        let switchKey = this.respSelect[this.respSelect.options.selectedIndex].value;

        switch (switchKey) {
            case 'Dourado':
                this.colorInput.value = '#FCC726'
                break;
            case 'Azul':
                this.colorInput.value = '#000280'
                break;
            case 'Branco':
                this.colorInput.value = '#FFFFFF'
                break;
            case 'Laranja':
                this.colorInput.value = '#ED840C'
                break;
            case 'Marrom':
                this.colorInput.value = '#593000'
                break;
            case 'Prata':
                this.colorInput.value = '#B0B0B0'
                break;
            case 'Preto':
                this.colorInput.value = '#000000'
                break;
            case 'Rosa':
                this.colorInput.value = '#C53ECF'
                break;
            case 'Roxo':
                this.colorInput.value = '#662482'
                break;
            case 'Verde':
                this.colorInput.value = '#0B420C'
                break;
            case 'Vermelho':
                this.colorInput.value = '#C70C0C'
                break;
            case 'Outra':
                this.colorInput.value = '#FFFFFF'
                break;
            default:
                break;
        }
    },
};

const handleImage = {
    divInput: document.querySelector('.border'),
    input: document.querySelector('input[type="file"]'),
    previewContainer: document.querySelector('.preview-images'),
    uploadLimit: 6,
    files: [],
    startPreview(event) {
        const { files: fileList } = event.target;

        if (this.hasLimit(event)) return;

        const imageList = Array.from(fileList);
        imageList.forEach(image => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(image);

            handleImage.files.push(image);

            fileReader.onload = () => {
                const imageCrt = new Image();
                imageCrt.src = String(fileReader.result);

                this.getPreviewContainer(imageCrt);
            };
        });

        event.target.files = this.updateFiles();
    },

    hasLimit(event) {
        const { files: fileList } = event.target;
        const { uploadLimit, files } = handleImage;

        if (fileList.length > uploadLimit) {
            alert(`Envie no máximo ${uploadLimit} fotos.`);
            event.preventDefault();
            return true;
        };

        if (files.length == 6) {
            alert('Você já atingiu o limite máximo de fotos Enviadas!');
            event.preventDefault();
            return true;
        };

        if (files.length + fileList.length > 6) {
            alert(`Desculpe, você tentou adicionar ${fileList.length} fotos, porém, a lista de arquivos já possui ${files.length} imagens, você só poderá adicionar mais ${uploadLimit - files.length} foto(s) do seu carro. Se deseja remover algumas, passe o mouse acima da imagem e clique no "X"`)
            event.preventDefault();
            return true;
        };
    },

    updateFiles() {
        const transfer = new ClipboardEvent("").clipboardData || new DataTransfer();

        this.files.forEach(file => transfer.items.add(file));

        return transfer.files;
    },

    getPreviewContainer(imgEl) {
        divContainer = document.createElement('div');
        divContainer.appendChild(imgEl);
        removeButton = this.applyRemoveButton();
        divContainer.appendChild(removeButton);

        this.previewContainer.appendChild(divContainer);
    },

    applyRemoveButton() {
        const removeButton = document.createElement('i');
        removeButton.classList.add('material-icons');
        removeButton.innerHTML = 'clear';
        removeButton.onclick = this.removeImage
        return removeButton;
    },

    removeImage(event) {
        let { files, previewContainer, input } = handleImage;
        
        const clickedImageDiv = event.target.parentNode;
        const previewContainerDiv = Array.from(previewContainer.children);
        const index = previewContainerDiv.indexOf(clickedImageDiv);

        files.splice(index, 1);
        input.files = handleImage.updateFiles();
        
        clickedImageDiv.remove();
    },
};

carsData.getData();

carsData.input.addEventListener('change', () => {
    let removeValidator = document.querySelector('.car-valid');
    if (removeValidator) removeValidator.remove();
    
    let removeValidatorIcon = document.querySelector('.valid-icon');
    if (removeValidatorIcon) removeValidatorIcon.remove();

    if (carsData.input.value == '') return;
    setTimeout(function() {
        let validator = document.createElement('div');
        validator.style.position = 'absolute';
        validator.style.marginTop = '4px';
        validator.classList.add('car-valid');
        
        let validIcon = document.createElement('i');
        validIcon.classList.add('material-icons');
        validIcon.classList.add('valid-icon');
        validIcon.style.position = 'absolute';
        validIcon.style.margin = '25px 0 0 4px';
        
        if (carsData.allCars.indexOf(carsData.input.value) > -1) {
            validator.innerHTML = 'Este carro consta em nossa Base de Dados!';
            validator.style.marginLeft = '146px';
            validator.style.color = '#6BC437';

            validIcon.innerHTML = 'check_circle';
            validIcon.style.color = '#6BC437';
        } else {
            validator.innerHTML = 'Este carro não consta em nossa Base de Dados!';
            validator.style.marginLeft = '130px';
            validator.style.color = '#FF4747';

            validIcon.innerHTML = 'cancel';
            validIcon.style.color = '#FF4747';
        };

        carsData.carNameContainer.appendChild(validator);
        carsData.carNameContainer.appendChild(validIcon);
    }, 600);
});

const selectItens = document.querySelector('select[name="itens-select"]');
const buttonAdd = document.querySelector('.add-box');
const itensContainer = document.querySelector('.itens-container');
const carItensInput = document.querySelector('input[name="itens_array"]')
const carItens = [];
buttonAdd.addEventListener('click', () => {
    if (selectItens.selectedIndex == 0) {
        alert('OPÇÃO INVÁLIDA: Você deve escolher algum item para adicionar!');
        return;
    };
    
    let actualItem = selectItens.options[selectItens.selectedIndex].value;
    
    if (carItens.indexOf(actualItem) > -1) {
        alert('OPÇÃO INVÁLIDA: Este item já foi adicionado!');
        return;
    };

    carItens.push(actualItem);
    var actualItemComma = ''
    if (carItensInput.value == '') {
        actualItem = actualItem;
        carItensInput.value += actualItem;
    } else {
        actualItemComma = `, ${actualItem}`;
        carItensInput.value += actualItemComma;
    };

    const pRemoval = document.querySelector('#removal');
    if (pRemoval) pRemoval.remove();

    const itemContent = document.createElement('h5');
    itemContent.innerHTML = actualItem;
    itensContainer.appendChild(itemContent);
});

const changedCep = {
    ask() {
        let cepInput = document.querySelector('input[name="cep"]').value
        let cepSystem = document.querySelector('input[name="adressAvailabilityCheck"]').value
        let cepValidation = (cepInput == cepSystem)

        if (!cepValidation) {
            let updateOrNot = confirm('Notamos que alterou/incluiu um novo endereço, gostaria de manter seus dados atualizados no sistema para uma eventual próxima venda?');
            if (updateOrNot) {
                let dynamicUpdate = document.querySelector('input[name="updateOrNot"]');
                dynamicUpdate.value = "1";
            };
        };
    },
};