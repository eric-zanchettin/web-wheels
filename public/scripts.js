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