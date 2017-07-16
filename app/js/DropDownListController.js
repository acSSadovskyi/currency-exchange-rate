


        const BaseController = require('./BaseController');
        const pug = require('pug');
        let compiledPug = pug.compileFile('./app/templates/ddlist-template.pug');
        
        class DropDownListController extends BaseController
        {
            constructor(pController)
            {
                super(pController);
                this._bindPrimaryController();
                this.listItemsData = Array();
                this.isVisible = false;
            };

            _bindPrimaryController()
            {
                this.pController.addEventListener('click', e => {
                    console.log(e.srcElement.getAttribute('data-val'));
                    let index = e.srcElement.getAttribute('data-val')
                    if(index)
                        this.action(this.listItemsData[index]);                    
                });
            }

            _render(dataObj)
            {
                let innerDiv = this.pController.querySelector('.inner-div');
                if(!innerDiv)
                {
                    innerDiv = document.createElement('div');
                    innerDiv.className = 'inner-div';
                    this.pController.appendChild(innerDiv);
                }
                innerDiv.style = `overflow-y: auto; height: 400px;`;

                innerDiv.innerHTML = compiledPug({dataObj});
                this.pController.appendChild(innerDiv);
            };

            show()
            {
                this.pController.style = "visibility: visible";
                this.isVisible = true;
            };

            hide()
            {
                this.pController.style = "visibility: hidden";
                this.isVisible = false;
            };

            onDataChange(dataObj)
            {
                if(this.isVisible)
                {
                    let length = dataObj.data.body.length;
                    this.listItemsData = Array();
                    let formatedData = Array();

                    for(let i = 0; i < length; i++)
                    {
                        this.listItemsData.push(dataObj.data.body[i].reqdate);
                        formatedData = formatDateString(dataObj.data.body);
                    }

                    this._render(formatedData);
                }   
            };
        };

        function formatDateString(dates)
        {
            return dates.map(date => {
                let srtDate = (new Date(date.reqdate)).toString();
                let fStrDate = srtDate.substr(0, srtDate.indexOf("GMT") - 1);
                return {date: fStrDate};
            })
        }

        module.exports = DropDownListController;
