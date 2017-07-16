


        const BaseController = require('./BaseController');

        class ButtonController extends BaseController
        {
            constructor(pController)
            {
                super(pController);
                this._bindPrimaryController();
            };

            _bindPrimaryController() 
            {
                this.pController.addEventListener('click', e => this.action());
            };
        };

        module.exports = ButtonController;