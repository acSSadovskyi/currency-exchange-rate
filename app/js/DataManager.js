


        class DataManager
        {
            constructor(model)
            {
                this.model = model;
                this.subscribers = Object();
                Reflect.defineProperty(this.subscribers, 'beforedatachange', {value: Array()});
                Reflect.defineProperty(this.subscribers, 'datachange', {value: Array()});
                Reflect.defineProperty(this.subscribers, 'reqdatechange', {value: Array()});
            };

            async changeData(inData)
            {
                if(!inData)
                {
                    let data = await this.model.getRemoteData();
                    if(this.subscribers['datachange'][0])
                        this.subscribers['datachange'].forEach(subscriber => process.nextTick(subscriber, data));
                }
                else
                {
                    let data = await this.model.getStorageData(inData);
                    if(this.subscribers['datachange'][0])
                        this.subscribers['datachange'].forEach(subscriber => process.nextTick(subscriber, data));
                }
                    
            };

            async onDBWriteComplite()
            {
                let data = await this.model.getStorageData();
                if(this.subscribers['reqdatechange'][0])
                    this.subscribers['reqdatechange'].forEach(subscriber => process.nextTick(subscriber, data));
            }

            on(eventName, callback)
            {
                if (Reflect.has(this.subscribers, eventName))
                    this.subscribers[eventName].push(callback);
            };
        };

        module.exports = DataManager;