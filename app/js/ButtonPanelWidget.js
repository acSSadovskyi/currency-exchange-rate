


        const pug = require('pug');
        let compiledPug = pug.compileFile('./app/templates/button-panel-template.pug');    

        class ButtonPanelWidget
        {
            constructor(elemPerPage, className)
            {
                this.element = null;
                this.elemPerPage = elemPerPage;
                this.dataLength = null;
                this.baseClassName = className;
                this._init();
            };

            _init()
            {
                this.element = document.createElement('div');
                this.element.className = this.baseClassName;
            };

            show()
            {
                this.element.style = "visibility: visible";
            };

            hide()
            {
                this.element.style = "visibility: hidden";
            };

            render(buttons)
            {  
                this.element.innerHTML = compiledPug({buttons});
            };

            getElement()
            {
                return this.element;
            };

            onDataLengthChange(data)
            {
                if(this.dataLength !== data.length)
                {
                    this.dataLength = data.length;
                    let buttons = Math.ceil(this.dataLength / this.elemPerPage);
                    this.render(buttons);
                }
            };
        };

        module.exports = ButtonPanelWidget;