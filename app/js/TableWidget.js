


        const pug = require('pug');    
        let compiledPug = pug.compileFile('./app/templates/table-template.pug');

        class TableWidget
        {
            constructor()
            {
                this.element = null;
                this.loadProcessElement = null;
                this._initTableWidgetElement();
                this._initLoadProcessElement();
            };

            _initLoadProcessElement()
            {
                this.loadProcessElement = document.createElement('div');
                let loadImg = document.createElement('img');
                loadImg.src = './img/loading-table.png';

                this.loadProcessElement.className = 'loadprocess-visible';
                loadImg.className = "load-img-animate";

                this.loadProcessElement.appendChild(loadImg);
                this.element.appendChild(this.loadProcessElement);

                this.hideLoadProcess();
            };

            _initTableWidgetElement()
            {
                this.element = document.createElement('div');
                this.element.classList = "table-container"
            };

            showLoadProcess()
            {
                this.loadProcessElement.style = "visibility: visible";
            };

            hideLoadProcess()
            {
                this.loadProcessElement.style = "visibility: hidden";
            };

            render(dataObj)
            {
                this.hideLoadProcess();
                this.element.classList.add('table-container-visible');
                if(!dataObj.error)
                {
                    let innerDiv = this.element.querySelector('.inner-div');
                    if(!innerDiv)
                    {
                        innerDiv = document.createElement('div');
                        innerDiv.className = 'inner-div';
                        this.element.appendChild(innerDiv);
                    }
                    innerDiv.innerHTML = compiledPug({dataObj: dataObj.data});
                }
                
            };
        };

        module.exports = TableWidget;
