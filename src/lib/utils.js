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
        price = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price/100)
        
        return price;
    },
};

module.exports = {
    DateRelational,
    formatData,
};