


        const db = require('sqlite');

        class DBWorker
        {
            static open(path)
            {
                return Promise.resolve()
                .then(() => db.open(path, {Promise}))
                .catch(err => console.log(err));
            };

            static async write(requestData)
            {
                let date = requestData.date;
                let bodies = requestData.body;
                
                await DBWorker.writeRequestDate(date);
                for(let i = 0; i < bodies.length; i++)
                    await DBWorker.writeRequestBody(date, bodies[i]);
            };

            static writeRequestDate(date)
            {
                return Promise.resolve()
                .then(() => db.all(`INSERT INTO requestDates (reqdate) VALUES ('${date}')`))
            };

            static writeRequestBody(date, body)
            {
                return Promise.resolve()
                .then(() => db.all(`INSERT INTO requestData (date, title, usd_ask, usd_bid) 
                                    VALUES ('${date}', '${body.title}', '${body.currencies.USD.ask}', '${body.currencies.USD.bid}')`))
            }

            static readRequestDates()
            {
               return Promise.resolve()
               .then(() => db.all(`SELECT * FROM requestDates`)); 
            };

            static readRequestBody(requestDate)
            {
                return Promise.resolve()
               .then(() => db.all(`SELECT * FROM requestData WHERE date=${requestDate}`));
            }
        };


        DBWorker.open('./app/database/exchangeRatesUSD.sqlite');
        module.exports = DBWorker;