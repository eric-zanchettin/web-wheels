const DateRelational = {
    age(date) {
        try {
            const today = new Date();
            const dateToWork = new Date(date);

            const day = dateToWork.getUTCDate();
            const month = dateToWork.getUTCMonth();
            const year = dateToWork.getUTCFullYear();

            const todayDay = today.getUTCDate();
            const todayMonth = today.getUTCMonth();
            const todayYear = today.getUTCFullYear();

            let age = (todayYear - year);
            if (age >= 18) {
                if ((todayMonth - month) < 0) {
                    age -= 1;
                    if (age >= 18) {
                        if ((todayDay - day) < 0) {
                            age -= 1;
                        };
                    };
                };
            };

            return age >= 18 ? true : false

        } catch (err) {
            console.log(err);
        };
    },

    formatIso(date) {
        const day = date.getUTCDate();
        let month = (date.getUTCMonth()) + 1;
        const year = date.getUTCFullYear();

        month = String(month).length == 1 ? '0' + month : month;

        const iso = year + '-' + month + '-' + day;

        return iso;
    },
};

const formatData = {
    formatKm(km) {
        km = String(km);

        if (km.length <= 3) km = km.replace(/(\d{1,3})/, '$1 m');
        if (km.length > 3 && km.length <= 6) km = km.replace(/(\d{1,3})(\d{3})/, '$1.$2 Km');
        
        return km;
    },

    formatPrice(price) {
        price = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price/100);
        
        return price;
    },

    formatCep(cep) {
        cep = cep.replace(/(\d{5})(\d{3})/, '$1-$2');

        return cep;
    },

    formatPhone(phone) {
        phone = phone.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3');

        return phone;
    },

    formatAdInfo(adInfo) {
        let { car_model, km, itens_array, ipva, owner, price, } = adInfo;
        let carFabric = car_model.split(' ')[0];
        let carName = car_model.split(' ')[1];

        ipva ? ipva = 'Sim' : ipva = 'Não';
        owner ? owner = 'Sim' : owner = 'Não';
        km = formatData.formatKm(km);
        price = formatData.formatPrice(price);

        let carInfo = {
            ...adInfo,
            itens: itens_array.split(','),
            carFabric,
            carName,
            ipva,
            owner,
            price,
            km,
        };

        return carInfo;
    },

    formatUserInfo(userInfo) {
        let { phone, cep } = userInfo;

        cep = formatData.formatCep(cep);
        phone = formatData.formatPhone(phone);

        const formattedUserInfo = {
            ...userInfo,
            phone,
            cep,
        };

        return formattedUserInfo;
    },
};

module.exports = {
    DateRelational,
    formatData,
};