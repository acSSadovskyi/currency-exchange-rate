


        const BaseController = require('./BaseController');
        const pug = require('pug');

        let compiledPug = pug.compileFile('./app/templates/button-panel-template.pug');

        class BtPanelViewController extends BaseController
        {
            constructor()
            {
                super();
                this.elemPerPage = null;
                this.dataLength = null;
                this._bindPrimaryController();
            };

            _bindPrimaryController() 
            {
                this.pController = document.createElement('div');
                this.pController.className = 'panel-button-container';
                this.pController.addEventListener('click', e => {

                    this.action(Number.parseInt(e.srcElement.innerText));
                });
            };      

            _render(buttons)
            {
                this.pController.innerHTML = compiledPug({buttons});
            };

            onDataChange(eventArg)
            {
                if(this.dataLength !== eventArg.dataLength || this.elemPerPage !== eventArg.pages)
                {
                    this.dataLength = eventArg.dataLength;
                    this.elemPerPage = eventArg.pages;
                    let buttons = Math.ceil(this.dataLength / this.elemPerPage);
                    this._render(buttons);
                }
            };
        };

        module.exports = BtPanelViewController;