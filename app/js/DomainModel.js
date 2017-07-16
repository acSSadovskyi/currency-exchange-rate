


        const { request } = require('http');
        const DBWorker = require('./DBWorker');
        let i = 0;
        class DomainModel
        {
            constructor()
            {
                this.currentData = null;
                this.lastRemovedData = null;
                this.lastStoragedData = null;
                this.elemPerPage = null;
                this.subscribers = Object();
                Reflect.defineProperty(this.subscribers, 'dbwritecomplite', {value: Array()});
            };

            async getRemoteData()
            {
                try
                {
                    console.log('reuqest' + i++);
                    let responseData = await requestRemotely('resources.finance.ua', 
                                             '/ru/public/currency-cash.json');
                    responseData.body = this.formatData(responseData.body);
                    this.elemPerPage = responseData.body.length;
                    let formatedData = {error: null, data: responseData};    
                    this.currentData = this.lastRemovedData = formatedData;
                    this.writeToDataBase(responseData);
                }
                catch(err)
                {
                    this.currentData = this.lastRemovedData = {error: err, data: undefined}
                }  
                finally
                {
                    if(!this.currentData.error)
                        return this.modifyData();
                    else
                        return this.currentData;
                }
            };

            async getStorageData(dateQuery)
            {
                
                let result = Object();
                Reflect.defineProperty(result, 'error', {value: null, writable: true});
                Reflect.defineProperty(result, 'data', {value: Object()});
                Reflect.defineProperty(result.data, 'date', {value: null, writable: true});
                Reflect.defineProperty(result.data, 'body', {value: null, writable: true});

                if(!dateQuery)
                {
                    try
                    {
                        result.data.body = await DBWorker.readRequestDates();
                    }
                    catch (error)
                    {
                        result.error = error;
                    }
                    finally
                    {
                        return result;
                    }    
                }
                else
                {
                    try
                    {
                        result.data.body = Array();
                        result.data.date = dateQuery;
                        let dbQueryResult = await DBWorker.readRequestBody(dateQuery);
                        let length = dbQueryResult.length;
                        for(let i = 0; i < length; i++)
                        {
                            let resultEntry = Object();
                            Reflect.defineProperty(resultEntry, 'title', {value: dbQueryResult[i].title})
                            Reflect.defineProperty(resultEntry, 'currencies', {value: Object()});
                            Reflect.defineProperty(resultEntry.currencies, 'USD', {value: Object()});
                            Reflect.defineProperty(resultEntry.currencies.USD, 'ask', {value: dbQueryResult[i].usd_ask});
                            Reflect.defineProperty(resultEntry.currencies.USD, 'bid', {value: dbQueryResult[i].usd_bid});
                            result.data.body.push(resultEntry);
                        }
                    }
                    catch (error)
                    {
                        result.error = error;
                    }
                    finally
                    {
                        return result; 
                    }   
                }         
            };

            modifyData(page = 1)
            {
                let length = this.elemPerPage;
                let start = (page - 1) * length;
                let end = (start + length - 1) <= this.currentData.length ? 
                        start + length - 1 : undefined;
                let date =  this.currentData.data.date;
                let body = this.currentData.data.body.slice(start, end);  ;
                
                return {error: null, data: {date, body}}
            }
            
            formatData(data)
            {
                return data.filter(dataEntry => Reflect.has(dataEntry.currencies, 'USD'))
                           .map(dataEntry => {
                                let USD = dataEntry.currencies.USD
                                return {title: dataEntry.title, currencies: {USD}}
                            });
            };

            async writeToDataBase(data)
            {
                console.log(data);
                await DBWorker.write(data);
                if(this.subscribers['dbwritecomplite'][0])
                        this.subscribers['dbwritecomplite'].forEach(subscriber => process.nextTick(subscriber, data));
            };

            on(eventName, callback)
            {
                if (Reflect.has(this.subscribers, eventName))
                    this.subscribers[eventName].push(callback);
            };
        };

        function requestRemotely(hostname, path)
        {
            let req = request({method: 'GET',protocol: 'http:', hostname, path})
            req.end();
            let requestDate = Date.now();
            return new Promise((res, rej) => {

                req.on('response', response => {
                    let r = "";
                    response.on('data', chunk => {
                        r += chunk.toString()
                    });

                    response.on('end', () => {
                        let data = JSON.parse(r);
                        res({date: requestDate, body: data.organizations});
                    });
                });

                req.on('socket', socket => {
                    socket.on('error', error => {
                        rej(error);
                    });
                });
            });
        }

        function formatDateString(dates)
        {
            return dates.map(date => {
                let srtDate = (new Date(date.reqdate)).toString();
                let fStrDate = srtDate.substr(0, srtDate.indexOf("GMT") - 1);
                return {date: fStrDate};
            })
        }

        module.exports = DomainModel;   

        