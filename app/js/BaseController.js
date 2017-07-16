


        class BaseController
        {
            constructor(pController)
            {
                this.pController = pController || null;

                /**@abstract */
                this.action = null;
            };

            /**@abstract */
            _bindPrimaryController() {};      
            
            getElement()
            {
                return this.pController;
            };
        };

        module.exports = BaseController;
