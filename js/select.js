class Select {

    constructor(){
        this.sheetList={}
    }

    init(){
        this.getSelectData();
        this.renderSelect();
        var select = document.querySelector('select[data-select="sel"]');
        select.addEventListener('change',function(){
            sheet.saveSheet();
            sheet.deleteListeners(sheet.mainTable,sheet.bindTdClick,sheet.mainInput,sheet.bindInputClick);

            //console.log(select.value);

            document.querySelector('#table').innerHTML ='<div id="top-nav"><div data-name="trow"></div></div><div data-name="tcol-table"><div data-name="tcol"></div><div data-name="table"></div></div>';
            var divIdTable = document.querySelector('div#table');
            divIdTable.scrollTop = 0;
            divIdTable.scrollLeft = 0;

            /*document.querySelector('div[data-name="table"]').innerHTML = '';
             document.querySelector('div[data-name="tcol"]').innerHTML = '';
             document.querySelector('div[data-name="trow"]').innerHTML = '';

             var divIdTable = document.querySelector('div#table');
             divIdTable.style.width = "1300px";
             divIdTable.scrollTop = 0;
             divIdTable.scrollLeft = 0;
             divIdTable.style.height = "500px";
             var divTLet = document.querySelector('div[data-name="trow"]');
             var divTLet1 = document.querySelector('div[data-name="tcol-table"]');
             var divTNum = document.querySelector('div[data-name="tcol"]');
             divTLet.style.width = "2000px";
             divTLet1.style.width = "2060px";
             divTLet1.style.height = "940px";
             divTNum.style.height = "940px";*/



            sheet = undefined;
            sheet = new Sheet(45,25,select.value);
            sheet.init();

        });

        var plusButton = document.querySelector('.glyphicon.glyphicon-plus').parentNode;
        plusButton.addEventListener('click',toggleBl);
        function toggleBl(){
            var addBlock = document.querySelector('.navbar-form');
            addBlock.classList.toggle('display-none');
        }

        this.addOption();
        this.saveOption();




    }

    renderSelect(){
        var select = document.querySelector('select[data-select="sel"]');
        select.innerHTML = '';
        var fragmentSel = document.createDocumentFragment();
        for (var key in this.sheetList){
            var option = document.createElement('option');
            option.setAttribute('value',key);
            option.innerHTML = this.sheetList[key];
            fragmentSel.appendChild(option);
        }
        select.appendChild(fragmentSel);
    }

    getSelectData(){

        //this.sheetList = {1:'Sher', 2:'Sheet2',3:'Sheet3',4:'ss'};
        //console.log(this.sheetList);
        if(localStorage['sheetList']){
            this.sheetList = JSON.parse(localStorage['sheetList']);
        }
        else {
            this.getJSONData('http://rangebag.org/data/getJson.php?file=sheetlist.json', (function (data) {
                this.sheetList = data;

            }).bind(this));
        }

    }

    getJSONData(url, callback){
        var httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = function() {
            if (httpRequest.readyState === 4) {

                if (httpRequest.status === 200) {
                    var data = JSON.parse(httpRequest.responseText);
                    if (callback) callback(data);
                    console.log('data',data);

                }
            }
        };
        httpRequest.open('GET', url, false);
        httpRequest.send();

    }

    setJSONData(url, data) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open('POST', url, true);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        var sendd = 'jsonData='+encodeURIComponent(JSON.stringify(data));
        xmlhttp.send(sendd);
    }

    addOption(){
        var addButton = document.querySelector('.btn.btn-success');
        var inputB = document.querySelector('.form-control');
        addButton.addEventListener('click',addOp.bind(this));
        function addOp(){
            if (inputB.value == '') {
                alert('Sheet Field is Empty');
                return;
            }
            console.log(this.sheetList);
            var nextKey = +Object.keys(this.sheetList)[Object.keys(this.sheetList).length-1]+1;
            this.sheetList[nextKey] = inputB.value;
            console.log(this.sheetList);
            inputB.value = '';
            var addBlock = document.querySelector('.navbar-form');
            addBlock.classList.add('display-none');
            this.renderSelect();
            var select = document.querySelector('select[data-select="sel"]');
            select.value = +Object.keys(this.sheetList)[Object.keys(this.sheetList).length-1];

            /*document.querySelector('div[data-name="table"]').innerHTML = '';
             document.querySelector('div[data-name="tcol"]').innerHTML = '';
             document.querySelector('div[data-name="trow"]').innerHTML = '';
             var divIdTable = document.querySelector('div#table');
             divIdTable.style.width = "1300px";
             divIdTable.scrollTop = 0;
             divIdTable.scrollLeft = 0;
             divIdTable.style.height = "500px";
             var divTLet = document.querySelector('div[data-name="trow"]');
             var divTLet1 = document.querySelector('div[data-name="tcol-table"]');
             var divTNum = document.querySelector('div[data-name="tcol"]');
             divTLet.style.width = "2000px";
             divTLet1.style.width = "2060px";
             divTLet1.style.height = "940px";
             divTNum.style.height = "940px";*/
            document.querySelector('#table').innerHTML ='<div id="top-nav"><div data-name="trow"></div></div><div data-name="tcol-table"><div data-name="tcol"></div><div data-name="table"></div></div>';
            var divIdTable = document.querySelector('div#table');
            divIdTable.scrollTop = 0;
            divIdTable.scrollLeft = 0;

            sheet.saveSheet();
            sheet.deleteListeners(sheet.mainTable,sheet.bindTdClick,sheet.mainInput,sheet.bindInputClick);
            sheet = undefined;
            sheet = new Sheet(45,25,+Object.keys(this.sheetList)[Object.keys(this.sheetList).length-1]);
            sheet.init();

        }

    }

    saveOption(){
        var saveButton = document.querySelector('.glyphicon.glyphicon-floppy-disk').parentNode;
        saveButton.addEventListener('click',saveData.bind(this));

        function saveData() {
            var localSheet1 = 'sheetList';
            localStorage.setItem(localSheet1, JSON.stringify(this.sheetList));
            var url1 = 'http://rangebag.org/data/setJson.php?file=sheetlist.json';
            this.setJSONData(url1,this.sheetList);

            sheet.saveSheet();


        }



    }

}

