


        const DataManager = require('./DataManager');
        const ButtonPanelWidget = require('./ButtonPanelWidget');
        const TableWidget = require('./TableWidget');
        const ButtonController = require('./ButtonController');
        const DomainModel = require('./DomainModel');
        const BtPanelViewController = require('./BtPanelViewController');
        const DropDownListController = require('./DropDownListController');

        let appMainContainer = document.querySelector('#app-main-container');
        let tableContainer = document.querySelector('#table-container');
        let navContainer = document.querySelector('#navigation-container');
        let navbar = document.querySelector('#navbar');

        let Data = new DomainModel();
        let dataManager = new DataManager(Data);
        Data.on('dbwritecomplite', () => dataManager.onDBWriteComplite());


        let table = new TableWidget();
        appMainContainer.appendChild(table.element);


        // Net request controller
        let rButton = document.createElement('button');
        rButton.innerHTML = 'Exchange rate';
        rButton.className = 'button-netrequest';
        let requestController = new ButtonController(rButton);
        requestController.action = async () => {
            table.showLoadProcess(); 
            dataManager.changeData();
        };
        // --------------------------------------


        // Database request controller
        let dbButton = document.createElement('button');
        dbButton.innerHTML = 'History';
        dbButton.className = 'button-netrequest';
        let dbReqController = new ButtonController(dbButton);
        dbReqController.action = () => {
            ddListController.show();
            dataManager.onDBWriteComplite();
            navbar.appendChild(ddListController.getElement());
        }
        // ---------------------------------------

        navbar.appendChild(rButton);
        navbar.appendChild(dbButton);


        // Drop down list controller
        let ddlist = document.createElement('div');
        ddlist.className = 'dd-list';
        let ddListController = new DropDownListController(ddlist);
        ddListController.action = data => dataManager.changeData(data);
        // ----------------------------------


        // DataManager sunscribers
        dataManager.on('reqdatechange', data => ddListController.onDataChange(data));

        dataManager.on('datachange', data => {
            table.showLoadProcess();
            navbar.className = "move-right";
            table.render(data);
        });
        // -----------------------------------


        let cButton = document.createElement('div');
        cButton.className = 'close-button';

        let closeDdListController = new ButtonController(cButton);
        ddlist.appendChild(closeDdListController.getElement());
        closeDdListController.action = () => ddListController.hide();













