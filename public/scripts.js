const menuScripts = {
    submenu: document.querySelector('div.submenu'),
    activeSubmenu() {
        this.submenu.classList.remove('menu-decactive')
    },
    decactiveSubmenu() {
        this.submenu.classList.add('menu-decactive')
    },
};

const myAccount = {
    basicForm: document.querySelector('div#form0'),
    addressForm: document.querySelector('div#form1'),
    actualForm: document.querySelector('div#form0'),
    activeForm(event) {
        this.actualForm.classList.add('form-hidden');

        if (event.innerHTML == 'Minha Conta') {
            this.basicForm.classList.remove('form-hidden')
            this.actualForm = this.basicForm;
        };

        if (event.innerHTML == 'Endereço') {
            this.addressForm.classList.remove('form-hidden')
            this.actualForm = this.addressForm;
        };
    },
};

const formatInputValues = {
    applyFormat(input, func,) {
        setTimeout(() => {
            input.value = formatInputValues[func](input.value);
        }, 1);
    },

    formatCpfCnpj(value) {
        value = value.replace(/\D/g, '');

        if (value.length > 14) value = value.slice(0, -1);

        if (value.length <= 11) {
            value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
        };

        if (value.length > 11) {
            value = value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
        };

        return value;
    },

    formatCep(value) {        
        value = value.replace(/\D/g, '');

        if (value.length > 8) value = value.slice(0, -1);

        value = value.replace(/(\d{5})(\d{3})/, '$1-$2')

        return value;
    },

    formatPhone(value) {
        value = value.replace(/\D/g, '');

        value = value.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3');

        if (value.length > 15) {
            value = value.slice(0, -1);
        };

        return value;
    },

    formatPrice(value) {
        value = value.replace(/\D/g, '')/100;
        let formattedValue = new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(value);

        return formattedValue;
    },

    formatKm(value) {
        value = value.replace(/\D/g, '')
        
        if (value.length > 6 || value === '0') {
            value = value.slice(0, -1);
        };

        if (value.length <= 3) value = value.replace(/(\d{1,3})/, '$1 m');
        if (value.length > 3 & value.length <= 6) value = value.replace(/(\d{1,3})(\d{3})/, '$1.$2 Km');

        return value;
    },
};

const sellingForm = {
    nextForm(part) {
        let actualForm = document.querySelector(`.part${Number(part)}`)
        let activeNextForm = document.querySelector(`.part${Number(part) + 1}`);

        actualForm.classList.add('form-hidden');
        activeNextForm.classList.remove('form-hidden');
    },

    previousForm(part) {
        let actualForm = document.querySelector(`.part${Number(part)}`)
        let activePreviousForm = document.querySelector(`.part${Number(part) - 1}`);

        actualForm.classList.add('form-hidden');
        activePreviousForm.classList.remove('form-hidden');
    },
};

const controlCarousel = {
    carouselIndex: document.querySelector('#carouselValue'),
    imgAmmount: document.querySelector('.img-carousel'),
    modalOverlay: document.querySelector('.modal-overlay'),
    modalImg: document.querySelector('.modal-overlay div img'),
    forward(event) {
        if (this.limitReached(event, 1)) return;

        this.changeViewIndex(1);

        this.movementImgs(1);

        this.disableArrows
    },

    backward(event) {
        if (this.limitReached(event, -1)) return;

        this.changeViewIndex(-1);

        this.movementImgs(-1);
    },

    limitReached(event, way) {
        let indexCorrection = (this.imgAmmount.childElementCount == 6 ? 1 : 0);
        let actualIndex = Math.ceil(this.carouselIndex.value);
        let imgAmmount = this.imgAmmount.childElementCount;
        
        if (way == 1) {
            if (actualIndex == imgAmmount) {
                this.disableArrows(event);
                return true;
            };
        } else {
            if (actualIndex == ((Math.ceil(imgAmmount / 2)) - indexCorrection)) {
                this.disableArrows(event);
                return true;
            };
        };
    },

    changeViewIndex(x) {
        let index = 0
        
        if (x == 1) {
            index = (Math.ceil(this.carouselIndex.value) + 1);
        } else {
            index = (Math.ceil(this.carouselIndex.value) - 1);
        };
        
        this.carouselIndex.value = index;
    },

    movementImgs(x) {
        if (x == 1) {
            for (img of this.imgAmmount.children) {
                let actualLeft = Number(getComputedStyle(img).left.replace('px', ''));
                let movement = actualLeft + (-600)
                img.style.left = `${movement}px`
            };
        } else {
            for (img of this.imgAmmount.children) {
                let actualLeft = Number(getComputedStyle(img).left.replace('px', ''));
                let movement = actualLeft + (600)
                img.style.left = `${movement}px`
            };
        };
    },

    disableArrows(arrow) {
        const arrowParent = document.querySelector('.control-carousel');

        arrowParent.classList.add('not-allowed');
        arrow.target.classList.add('not-allowed');

        setTimeout(() => {
            arrowParent.classList.remove('not-allowed');
            arrow.target.classList.remove('not-allowed');
        }, 700);
    },

    fullscreen(event) {
        this.modalImg.src = event.target.src;
        this.modalOverlay.style.display = 'block';
    },

    closeFullscreen() {
        this.modalOverlay.style.display = 'none';
    },
};