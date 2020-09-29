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
};

module.exports = {
    DateRelational,
};