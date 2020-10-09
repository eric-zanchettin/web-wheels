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