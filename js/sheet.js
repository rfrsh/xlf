class Sheet {

    constructor(rowCount, cellCount,id){
        this.rowCount = rowCount;
        this.cellCount = cellCount;
        this.id = id;
        this.dataObj ={};
        this.mainTable;
        this.mainInput;
        this.bindInputClick;
        this.bindTdClick;
    }

    init(){
        //debugger;
        this.getSheetData();
        this.renderSheet();

        var table = document.querySelector('#table');

        //console.log(this.dataObj);
        table.addEventListener('scroll',this.addRowsAndCells.bind(this));

        var tdAttr;
        var cellLetter, cellNumber;

        var mainTable = document.querySelector('.main-table');
        this.mainTable = document.querySelector('.main-table');
        var bindTdClick = tdClick.bind(this);
        this.bindTdClick =bindTdClick;
        mainTable.addEventListener('click',bindTdClick);


        var mainInput = document.querySelector('.main-input input');
        this.mainInput = document.querySelector('.main-input input');
        var bindInputClick = inputClick.bind(this);
        this.bindInputClick=bindInputClick;
        mainInput.addEventListener('click', bindInputClick);

        this.redError();

        function tdClick(e){
            if(e.target.localName=='td') {


                //var mainTable = document.querySelector('.main-table');
                mainTable.removeEventListener('click',bindTdClick);

                var td = e.target;
                tdAttr = td.getAttribute("data-cell");
                //console.log(tdAttr);

                //console.log(td.parentElement.rowIndex);
                cellLetter = document.querySelectorAll('div[data-name="trow"] div')[td.cellIndex];
                //console.log('cellLetter1', cellLetter);
                cellLetter.classList.add("cell-selected");
                cellNumber = document.querySelectorAll('div[data-name="tcol"] div')[td.parentElement.rowIndex];
                cellNumber.classList.add("cell-selected");

                var input = document.createElement('input');
                input.setAttribute("type", "text");

                var cell = td.getAttribute('data-cell');
                if (this.dataObj[cell] != undefined)input.value = this.dataObj[cell];
                td.innerHTML = '';
                td.appendChild(input);
                mainInput.value = input.value;
                input.focus();

                //if(input.value.charAt(0) == "=") {
                    if (input.value != undefined) {
                        if(input.value.charAt(0) == "=") {
                            var highlighting = input.value.substring(1).split(/\+|\*|\/|-/);
                            //console.log(highlighting);
                            for (var l = 0; l < highlighting.length; l++) {
                                var hi = "td[data-cell=" + '"' + highlighting[l].toUpperCase() + '"]';
                                var hil = document.querySelector(hi);
                                var formulaSelected = 'formula-selected-' + l;
                                if (hil != null) hil.classList.add(formulaSelected);
                            }
                        }
                    }

                    input.addEventListener('input', function (e) {
                        var selectedTDs = document.querySelectorAll('td[class^=formula-selected]');
                        [].forEach.call(selectedTDs, function(selectedTD) {
                            selectedTD.setAttribute('class','');
                        });

                        if(input.value.charAt(0) == "=") {
                            var highlighting;
                            if (input.value != undefined) {
                                highlighting = input.value.substring(1).split(/\+|\*|\/|-/);
                                for (var l = 0; l < highlighting.length; l++) {
                                    var hi = "td[data-cell=" + '"' + highlighting[l].toUpperCase() + '"]';
                                    var hi2 = document.querySelector(hi);
                                    var formulaSelected = 'formula-selected-' + l;
                                    if (hi2 != null) hi2.classList.add(formulaSelected);
                                }

                                //console.log('ddd');
                            }
                        }
                        mainInput.value = input.value;


                    });


                    var clCell;


                    mainTable.addEventListener('mousedown', function (e) {
                        var td = e.target;
                        clCell = td.getAttribute("data-cell");
                    });
                //}

                    input.addEventListener('blur', cellClick);
                    function cellClick(e) {
                        //input.removeEventListener('blur', cellClick);
                        input.focus();
                        if(input.value.charAt(0) == "=") {

                            //if()

                            if (clCell == undefined)return;
                            //if (input.value=='')return;

                            if(input.value.charAt(input.value.length-1).search(/\+|\-|\*|\/|\=/)!=0){
                                var foundMin = input.value.lastIndexOf('+');
                                var foundPl = input.value.lastIndexOf('-');
                                var foundMul = input.value.lastIndexOf('*');
                                var foundDiv = input.value.lastIndexOf('/');
                                var foundEq = input.value.lastIndexOf('=');
                                var max1 = Math.max(foundMin, foundPl, foundMul, foundDiv, foundEq);
                                input.value = input.value.substring(0,max1+1)+ clCell;
                            }
                            else input.value = input.value + clCell;


                            clCell = '';

                            var event = new Event("input");
                            input.dispatchEvent(event);
                        }
                    }





                input.addEventListener('keydown', (function (e) {
                    if (e.which == 13) {
                        cellLetter.classList.remove("cell-selected");
                        cellNumber.classList.remove("cell-selected");
                        //this.dataObj[cell] = e.target.value;


                        if(e.target.value!=undefined){
                            if(e.target.value==''){
                                delete this.dataObj[cell];
                                if (e.target.value.charAt(0) == "=") td.innerHTML = this.calcCell(e.target.value);
                                else td.innerHTML=e.target.value;
                            }
                            else {
                                this.dataObj[cell] = e.target.value;
                                if (e.target.value.charAt(0) == "=") td.innerHTML = this.calcCell(e.target.value);
                                else td.innerHTML = e.target.value;
                            }
                        }

                        var selectedTDs = document.querySelectorAll('td[class^=formula-selected]');
                        [].forEach.call(selectedTDs, function(selectedTD) {
                            selectedTD.setAttribute('class','');
                        });

                        this.updateTDs();

                        input.value = '';
                        mainInput.value = '';
                        mainTable.addEventListener('click',bindTdClick);
                        if(cellClick != undefined){
                            input.removeEventListener('blur', cellClick);
                        }
                        tdAttr = null;
                    }

                    if (e.keyCode === 27) {
                        cellLetter.classList.remove("cell-selected");
                        cellNumber.classList.remove("cell-selected");
                        //this.dataObj[cell] = e.target.value;

                        if (e.target.value.charAt(0) == "=") {
                            if(this.dataObj[cell] == undefined) td.innerHTML = '';
                            else td.innerHTML = this.calcCell(this.dataObj[cell]);
                        }
                        else {
                            if(this.dataObj[cell] == undefined) td.innerHTML = '';
                            else td.innerHTML = this.dataObj[cell];
                        }




                        var selectedTDs = document.querySelectorAll('td[class^=formula-selected]');
                        [].forEach.call(selectedTDs, function(selectedTD) {
                            selectedTD.setAttribute('class','');
                        });

                        this.updateTDs();

                        input.value = '';
                        mainInput.value = '';
                        mainTable.addEventListener('click',bindTdClick);
                        tdAttr = null;
                    }


                }).bind(this));


            }

        }

        function inputClick(){
            mainTable.removeEventListener('click',bindTdClick);
            mainInput.removeEventListener('click', bindInputClick);


            if(cellLetter!=undefined) {
                //cellLetter.classList.remove("cell-selected");
                //cellNumber.classList.remove("cell-selected");
            }




            var adSrting = 'td[data-cell='+tdAttr+']';
            var adSrting1 = adSrting + ' input';
            //console.log('111',adSrting,adSrting1);
            var td1 = document.querySelector(adSrting);
            if(td1==null){
                alert('Please Select A Cell');
                mainInput.blur();
                mainTable.addEventListener('click',bindTdClick);
                mainInput.addEventListener('click',bindInputClick);
                mainInput.removeEventListener('input', bindchangeInput);
                return;
            }
            console.log('td1',td1);
            td1.classList.add('black-color');
            var tdInput = document.querySelector(adSrting1);
            //console.log(tdInput);
            //console.log(this.dataObj);
            mainInput.value = tdInput.value;
            td1.innerHTML = tdInput.value;
            mainInput.focus();

            var bindInputEnter = inputEnter.bind(this);
            mainInput.addEventListener('keydown', bindInputEnter);

            function inputEnter(e) {
                if (e.keyCode === 13) {
                    mainInput.removeEventListener('keydown', bindInputEnter);

                    cellLetter.classList.remove("cell-selected");
                    cellNumber.classList.remove("cell-selected");



                    if(e.target.value!=undefined){
                        if(e.target.value==''){
                            delete this.dataObj[cell];
                            if (e.target.value.charAt(0) == "=") td1.innerHTML = this.calcCell(mainInput.value);
                            else td1.innerHTML=mainInput.value;
                        }
                        else {
                            this.dataObj[tdAttr] = mainInput.value;
                            if (e.target.value.charAt(0) == "=") td1.innerHTML = this.calcCell(mainInput.value);
                            else td1.innerHTML = mainInput.value;
                        }
                    }


                    mainInput.value = '';
                    //mainInput.blur();

                    this.updateTDs();

                    var selectedTDs = document.querySelectorAll('td[class^=formula-selected]');
                    [].forEach.call(selectedTDs, function(selectedTD) {
                        selectedTD.setAttribute('class','');
                        //
                    });
                    td1.setAttribute('class','');

                    //td = null;

                    mainTable.addEventListener('click',bindTdClick);
                    mainInput.addEventListener('click',bindInputClick);
                    //td=null;
                    mainInput.removeEventListener('input', bindchangeInput);
                    mainInput.removeEventListener('blur',bindmainInputCellClick);

                    //mainInput.removeEventListener('click',bindInputClick);
                    td1 = null;
                    tdAttr = null;
                    mainInput.blur();


                }

                if (e.keyCode === 27) {
                    mainInput.removeEventListener('keydown', bindInputEnter);

                    cellLetter.classList.remove("cell-selected");
                    cellNumber.classList.remove("cell-selected");
                    //this.dataObj[cell] = e.target.value;

                    if (e.target.value.charAt(0) == "=") {
                        if(this.dataObj[tdAttr] == undefined) td1.innerHTML = '';
                        else td1.innerHTML = this.calcCell(this.dataObj[tdAttr]);
                    }
                    else {
                        if(this.dataObj[tdAttr] == undefined) td1.innerHTML = '';
                        else td1.innerHTML = this.dataObj[tdAttr];
                    }

                    mainInput.value = '';
                    //mainInput.blur();

                    this.updateTDs();

                    var selectedTDs = document.querySelectorAll('td[class^=formula-selected]');
                    [].forEach.call(selectedTDs, function(selectedTD) {
                        selectedTD.setAttribute('class','');
                    });

                    td1.setAttribute('class','');


                    mainTable.addEventListener('click',bindTdClick);
                    mainInput.addEventListener('click',bindInputClick);
                    //td=null;
                    mainInput.removeEventListener('input', bindchangeInput);
                    mainInput.removeEventListener('blur',bindmainInputCellClick);

                    //mainInput.removeEventListener('click',bindInputClick);
                    td1 = null;
                    tdAttr = null;
                    mainInput.blur();

                }
            }



            function changeInput(e) {
                td1.innerHTML =  mainInput.value;

            }
            var bindchangeInput = changeInput.bind(this)
            mainInput.addEventListener('input', bindchangeInput);


            mainInput.addEventListener('input',  function (e) {
                var selectedTDs = document.querySelectorAll('td[class^=formula-selected]');
                [].forEach.call(selectedTDs, function(selectedTD) {
                    selectedTD.setAttribute('class','');
                });

                var highlighting;
                if (mainInput.value != undefined) {
                    highlighting = mainInput.value.substring(1).split(/\+|\*|\/|-/);
                    for (var l=0;l< highlighting.length;l++){
                        var hi = "td[data-cell="+'"'+highlighting[l].toUpperCase()+'"]';
                        var hi2 = document.querySelector(hi);
                        var formulaSelected = 'formula-selected-' +l;
                        if(hi2!=null) hi2.classList.add(formulaSelected);
                    }
                }

            });

            var clCell;
            mainTable.addEventListener('mousedown', function(e){
                var td = e.target;

                clCell = td.getAttribute("data-cell");
                mainInput.focus();
            });

            function mainInputCellClick(e) {
                if(tdAttr!=null)mainInput.focus();
                if(clCell==undefined)return;
                if(mainInput.value=='')return;


                if(clCell==undefined)return;

                if(mainInput.value.charAt(mainInput.value.length-1).search(/\+|\-|\*|\/|\=/)!=0){
                    var foundMin = mainInput.value.lastIndexOf('+');
                    var foundPl = mainInput.value.lastIndexOf('-');
                    var foundMul = mainInput.value.lastIndexOf('*');
                    var foundDiv = mainInput.value.lastIndexOf('/');
                    var foundEq = mainInput.value.lastIndexOf('=');
                    var max1 = Math.max(foundMin, foundPl, foundMul, foundDiv, foundEq);
                    mainInput.value = mainInput.value.substring(0,max1+1)+ clCell;
                }
                else mainInput.value=mainInput.value+clCell;


                clCell='';

                var event = new Event("input");
                mainInput.dispatchEvent(event);



            }
            var bindmainInputCellClick = mainInputCellClick.bind(this)

            mainInput.addEventListener('blur',bindmainInputCellClick);


        }








    }

    deleteListeners(mainTable,bindTdClick,mainInput,bindInputClick){
        mainTable.removeEventListener('click',bindTdClick);
        mainInput.removeEventListener('click', bindInputClick);
    }

    getSheetData(){

        /*this.sheetList = {1:'Sher', 2:'Sheet2',3:'Sheet3',4:'ss'};
         console.log(this.sheetList);*/
        var localSheet = 'dataObj'+this.id;
        if(localStorage[localSheet]){
            this.dataObj = JSON.parse(localStorage[localSheet]);
        }
        else {
            var url1 = 'http://rangebag.org/data/getJson.php?file='+this.id+'.json';
            this.getJSONData(url1, (function (data) {
                this.dataObj = data;
            }).bind(this));
        }
        //console.log(this.dataObj);
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

    renderSheet() {
        //console.log(this.dataObj);
        var mainTable = document.createElement('table');
        mainTable.className = 'main-table';
        var divTable = document.querySelector('div[data-name="table"]');

        var tableBody = document.createElement('tbody');
        mainTable.appendChild(tableBody);
        var tableHeader = mainTable.createTHead();
        var tableRow = tableHeader.insertRow(0);

        var divTLet = document.querySelector('div[data-name="trow"]');
        var fragmentLet = document.createDocumentFragment();
        for(var j=0; j<this.cellCount;j++) {
            var divLet = document.createElement('div');
            divLet.innerHTML = this.numToLet(j);
            fragmentLet.appendChild(divLet);
        }
        divTLet.appendChild(fragmentLet);

        var divTNum = document.querySelector('div[data-name="tcol"]');
        var fragmentNum = document.createDocumentFragment();
        for(var t=0; t<=this.rowCount;t++) {
            var divNum = document.createElement('div');
            if(t==0) divNum.innerHTML = '@';
            else divNum.innerHTML = t;
            fragmentNum.appendChild(divNum);
        }
        divTNum.appendChild(fragmentNum);


        for(var i=0;i<this.rowCount;i++){
            var tableRow1 = tableBody.insertRow(-1);
            for(var k=0; k<this.cellCount;k++){
                var tableCell1 = tableRow1.insertCell(-1);
                var cellValue = ''+this.numToLet(k)+ (i+1);
                tableCell1.setAttribute('data-cell', cellValue);
                if(this.dataObj[cellValue]!=undefined){
                    if (String(this.dataObj[cellValue]).charAt(0) == "=") tableCell1.innerHTML = this.calcCell(this.dataObj[cellValue]);
                    else tableCell1.innerHTML=this.dataObj[cellValue];
                }
            }

        }
        divTable.appendChild(mainTable);
        console.log('renderSheet');
    }

    numToLet(n){
        var r = '';
        for(; n >= 0; n = Math.floor(n / 26) - 1) {
            r = String.fromCharCode(n%26 + 0x41) + r;
        }
        return r;
    }

    calcCell(cell){

        if (cell==undefined)return;
        if (cell.charAt(0) != "=")return;
        var value = cell.toUpperCase();
        //console.log("tt",value);


        //console.log(value);    console.log(cell);
        //var value = '=s1_A1-s1_B1-s1_C1-s1_D1'.substring(1);
        //value.lastIndexOf('=')
        //var value = value.substring(value.lastIndexOf('=')+1);
        var value = value.substring(1);
        if (value.length==0)return;
        var flag;
        if (value.charAt(0) == "-"){
            value = value.substring(1);
            flag = true;

        }

        //console.log(value);
        //console.log(value);
        //var indexPlus = '+',indexMinus = '-', indexDev= '/', indexMult = '*';
        var i=0;
        var newValue = '';
        dodo: do {

            var foundPlus = value.indexOf('+');
            var foundMinus = value.indexOf('-');
            var foundDev = value.indexOf('/');
            var foundMult = value.indexOf('*');
            if (value.charAt(0) == "=") value = value.substring(1);
            ifif: if(foundPlus==-1&&foundMinus==-1&&foundDev==-1&&foundMult==-1){
                //var tt ='s1_'+(value);
                var tt1 = this.dataObj[value];//localStorage[tt];
                tt1 = (tt1+'').toLocaleUpperCase();
                //console.log('IIIIIIII',tt1);
                if (tt1.charAt(0) == "=") {
                    var adRecursion =  this.calcCell(tt1);
                    newValue+=adRecursion;
                    //console.log('TTTTTTTTTT',newValue);
                    // value=value.substring(foundPlus+1);
                    break ifif;
                }

                for(var key1 in this.dataObj){

                    if(key1==value){
                        if(this.dataObj[key1]==undefined)this.dataObj[key1]=0;
                        newValue+=this.dataObj[key1];
                        break dodo;
                    }

                }


                if(value.search(/^[A-Z]{1,4}\d{1,4}$/)!=-1){
                    value=0;
                    newValue+=value;
                    break dodo;
                }
                newValue+=value;
                break;
            }
            if(foundPlus==-1&&foundMinus==-1&&foundDev==-1&&foundMult==-1)break;



            //console.log(foundPlus,foundMinus);
            if(foundPlus == -1)foundPlus=100;
            if(foundMinus == -1)foundMinus=100;
            if(foundDev == -1)foundDev=100;
            if(foundMult == -1)foundMult=100;

            //console.log('----------');
            //console.log(value);
            //console.log(newValue);
            forfor: if(foundPlus<foundMinus&&foundPlus<foundDev&&foundPlus<foundMult){
                //var tt ='s1_'+(value.substring(0,foundPlus));
                var tt1 = this.dataObj[value.substring(0,foundPlus)];//localStorage[tt];
                tt1 = (tt1+'').toLocaleUpperCase();
                //console.log('IIIIIIII',tt1);
                if (tt1.charAt(0) == "=") {
                    var adRecursion =  this.calcCell(tt1);
                    newValue+=adRecursion+'+';
                    //console.log('TTTTTTTTTT',newValue);
                    value=value.substring(foundPlus+1);
                    break forfor;
                }

                /*for(var key2 in this.dataObj){

                    if(this.dataObj[key2]==undefined)this.dataObj[key2]=0;
                    //var s2='s1_'+value.substring(0,foundPlus);
                    if(key2==value.substring(0,foundPlus)){
                        newValue+=this.dataObj[key2]+'+';
                    }


                }*/

                if(value.substring(0,foundPlus).search(/^[A-Z]{1,4}\d{1,4}$/)!=-1 && tt1=='UNDEFINED'){
                    newValue+=0+'+';
                }
                else if(!isNaN(parseFloat(value.substring(0,foundPlus))) ){
                    newValue+=value.substring(0,foundPlus)+'+';
                }
                else if(tt1=='UNDEFINED'){
                    newValue='Error';
                }

                else{
                    newValue+=this.dataObj[value.substring(0,foundPlus)]+'+';
                }

                /*if(!isNaN(value.substring(0,foundPlus)))  {
                    newValue+=value.substring(0,foundPlus)+'+';
                }*/
                value=value.substring(foundPlus+1);
            }
            else if (foundMinus<foundPlus&&foundMinus<foundDev&&foundMinus<foundMult){
                //var tt ='s1_'+(value.substring(0,foundMinus));
                var tt1 = this.dataObj[value.substring(0,foundMinus)];//localStorage[tt];
                tt1 = (tt1+'').toLocaleUpperCase();
                if (tt1.charAt(0) == "=") {
                    var adRecursion =  this.calcCell(tt1);
                    newValue+=adRecursion+'-';
                    value=value.substring(foundMinus+1);
                    break forfor;
                }

                /*for(var key3 in this.dataObj){
                    if(this.dataObj[key3]==undefined)this.dataObj[key3]=0;
                    //var s3='s1_'+value.substring(0,foundMinus);
                    if(key3==value.substring(0,foundMinus)){
                        //if(key3==(value.substring(0,foundMinus))){
                        newValue+=this.dataObj[key3]+'-';
                    }
                }
                if(!isNaN(value.substring(0,foundMinus)))  {
                    newValue+=value.substring(0,foundMinus)+'-';
                }*/
                if(value.substring(0,foundMinus).search(/^[A-Z]{1,4}\d{1,4}$/)!=-1 && tt1=='UNDEFINED'){
                    newValue+=0+'-';
                }
                else if(!isNaN(parseFloat(value.substring(0,foundMinus))) ){
                    newValue+=value.substring(0,foundMinus)+'-';
                }
                else if(tt1=='UNDEFINED'){
                    newValue='Error';
                }

                else{
                    newValue+=this.dataObj[value.substring(0,foundMinus)]+'-';
                }

                value=value.substring(foundMinus+1);

            }
            else if (foundMult<foundPlus&&foundMult<foundDev&&foundMult<foundMinus){
                var tt1 = this.dataObj[value.substring(0,foundMult)];
                tt1 = (tt1+'').toLocaleUpperCase();
                if (tt1.charAt(0) == "=") {
                    var adRecursion =  this.calcCell(tt1);
                    newValue+=adRecursion+'*';
                    value=value.substring(foundMult+1);
                    break forfor;
                }

                /*for(var key4 in this.dataObj){
                    if(this.dataObj[key4]==undefined)this.dataObj[key4]=0;
                    if(key4==value.substring(0,foundMult)){
                        newValue+=this.dataObj[key4]+'*';
                    }
                }
                if(!isNaN(value.substring(0,foundMult)))  {
                    newValue+=value.substring(0,foundMult)+'*';
                }*/
                if(value.substring(0,foundMult).search(/^[A-Z]{1,4}\d{1,4}$/)!=-1 && tt1=='UNDEFINED'){
                    newValue+=0+'*';
                }
                else if(!isNaN(parseFloat(value.substring(0,foundMult))) ){
                    newValue+=value.substring(0,foundMult)+'*';
                }
                else if(tt1=='UNDEFINED'){
                    newValue='Error';
                }

                else{
                    newValue+=this.dataObj[value.substring(0,foundMult)]+'*';
                }

                value=value.substring(foundMult+1);

            }
            else if (foundDev<foundPlus&&foundDev<foundMult&&foundDev<foundMinus){
                var tt1 = this.dataObj[value.substring(0,foundDev)];
                tt1 = (tt1+'').toLocaleUpperCase();
                if (tt1.charAt(0) == "=") {
                    var adRecursion =  this.calcCell(tt1);
                    newValue+=adRecursion+'/';
                    value=value.substring(foundDev+1);
                    break forfor;
                }

                /*for(var key4 in this.dataObj){
                    if(this.dataObj[key4]==undefined)this.dataObj[key4]=0;
                    //var s4='s1_'+value.substring(0,foundDev);
                    if(key4==value.substring(0,foundDev)){
                        //if(key3==(value.substring(0,foundDev))){
                        newValue+=this.dataObj[key4]+'/';
                    }
                }
                if(!isNaN(value.substring(0,foundDev)))  {
                    newValue+=value.substring(0,foundDev)+'/';
                }*/
                if(value.substring(0,foundDev).search(/^[A-Z]{1,4}\d{1,4}$/)!=-1 && tt1=='UNDEFINED'){
                    newValue+=0+'/';
                }
                else if(!isNaN(parseFloat(value.substring(0,foundDev))) ){
                    newValue+=value.substring(0,foundDev)+'/';
                }
                else if(tt1=='UNDEFINED'){
                    newValue='Error';
                }

                else{
                    newValue+=this.dataObj[value.substring(0,foundDev)]+'/';
                }

                value=value.substring(foundDev+1);

            }
            else{}
            i++;



        }while(i<100)


        newValue = newValue.replace(/--/gi, "+");
        //console.log(newValue);
        if(flag == true) newValue='-'+newValue;

        try {
            //console.log('EVAL',newValue);
            //adRecursion =eval(newValue);
            return eval(newValue);
            //console.log(newValue);
            //return Math.eval(newValue);


        } catch(err){
            //console.log('!!!!!',newValue);
            return 'Error';

        }
        //return elm.value;

    }

    addRowsAndCells(){


        var trCount = document.querySelectorAll('[data-name="tcol"] div');
        var tdCount = document.querySelectorAll('[data-name="trow"] div');

        if(table.scrollHeight - table.scrollTop === table.clientHeight){

            var divTNum = document.querySelector('div[data-name="tcol"]');
            var fragmentNum = document.createDocumentFragment();
            for(var t=0; t<10;t++) {
                var divNum = document.createElement('div');
                divNum.innerHTML = trCount.length+t;
                fragmentNum.appendChild(divNum);
            }
            divTNum.appendChild(fragmentNum);

            var tableBody = document.querySelector('.main-table tbody');
            // var fragmentRows = document.createDocumentFragment();
            for(var i=0;i<10;i++){
                var tableRow1 = tableBody.insertRow(-1);
                for(var k=0; k<tdCount.length;k++){
                    var tableCell1 = tableRow1.insertCell(-1);
                    var cellValue = ''+this.numToLet(k)+ (trCount.length+i);
                    tableCell1.setAttribute('data-cell', cellValue);

                    if(this.dataObj[cellValue]!=undefined){
                        if (String(this.dataObj[cellValue]).charAt(0) == "=") tableCell1.innerHTML = this.calcCell(this.dataObj[cellValue]);
                        else tableCell1.innerHTML=this.dataObj[cellValue];
                    }
                }
            }
        }
        if(table.scrollWidth - table.scrollLeft === table.clientWidth) {

            var divTLet = document.querySelector('div[data-name="trow"]');
            var divTLet1 = document.querySelector('div[data-name="tcol-table"]');
            divTLet.style.width = table.scrollWidth+270+"px";
            divTLet1.style.width = table.scrollWidth+0+"px";


            var fragmentLet = document.createDocumentFragment()
            for(var j=0; j<4;j++) {
                var divLet = document.createElement('div');
                divLet.innerHTML = this.numToLet(tdCount.length+j);
                fragmentLet.appendChild(divLet);
            }
            divTLet.appendChild(fragmentLet);



            var theadTrs = document.querySelectorAll('.main-table tbody tr');
            for(var k=0; k<trCount.length-1;k++){
                for(var i=0;i<4;i++){
                    var tableCell3 = theadTrs[k].insertCell(-1);

                    var cellValue = ''+this.numToLet(tdCount.length+i)+ (k+1);
                    tableCell3.setAttribute('data-cell', cellValue);

                    if(this.dataObj[cellValue]!=undefined){
                        if (this.dataObj[cellValue].charAt(0) == "=") tableCell3.innerHTML = this.calcCell(this.dataObj[cellValue]);
                        else tableCell3.innerHTML = this.dataObj[cellValue];
                    }
                }
            }
        }
    }

    updateTDs(){

        for (var key in this.dataObj){
            if (String(this.dataObj[key]).charAt(0) == "=") {
                var tt = 'td[data-cell="'+key+'"]';
                var td =document.querySelector(tt);
                if(td!=null)td.innerHTML = this.calcCell(this.dataObj[key]);
            }
        }
        this.redError();

    }

    redError(){
        var currentRedErrors = document.querySelectorAll('td[data-cell][style]');
        [].forEach.call(currentRedErrors, function(currentRedErrors) {
            currentRedErrors.style.color = "black";
        });

        var cells = document.getElementById("table").getElementsByTagName("td");
        for (var i = 0; i < cells.length; i++) {
            if (cells[i].innerHTML == "function Error() { [native code] }") {
                cells[i].innerHTML = "Error"
                cells[i].style.color = "red";
            }
            if (cells[i].innerHTML == "Error") {
                cells[i].style.color = "red";
            }
        }
    }

    saveSheet(){
        var localSheet = 'dataObj'+this.id;
        localStorage.setItem(localSheet, JSON.stringify(this.dataObj));
        var url1 = 'http://rangebag.org/data/setJson.php?file='+this.id+'.json';
        this.setJSONData(url1,this.dataObj);
    }

}
