function postAjax(url, data, success) {
    var params = typeof data == 'string' ? data : Object.keys(data).map(
            function(k){ return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) }
        ).join('&');

    var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    xhr.open('POST', url);
    xhr.onreadystatechange = function() {
        if (xhr.readyState>3 && xhr.status==200) { success(xhr.responseText); }
    };
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(params);
    return xhr;
}
function successCallback(responsetxt){
    processProgress("Done",false);
    console.log('RESPONSE');
    var responseObj;
    try{
        responseObj = JSON.parse(responsetxt);
        if(responseObj.shortMessage.indexOf('ERROR')==0){
            showAlertBox(responseObj.detailMessage,'danger');
        }else{
            showAlertBox(responseObj.detailMessage,'success');
        }
    }catch(err){
        showAlertBox(responsetxt,'warning');
    }
}
function showAlertBox(message,errorType){
    console.log('RESPONSE');
    console.log(message);
    var alertClass="alert";
    if(errorType && errorType!=''){
        alertClass+=" alert-"+errorType;
    }
    var alertBoxElement = document.createElement("div");
    alertBoxElement.setAttribute('class',alertClass);
    alertBoxElement.innerHTML = message;
    document.getElementById("msgBox").appendChild(alertBoxElement);
}
function clearAlertBox(){
    var msgBoxElement = document.getElementById('msgBox');
    msgBoxElement.innerHTML=""; 
}
function createAnOrg(){
    var sfEdition = document.getElementById('sfedition').value;
    var securityCode = document.getElementById('securitycode').value;
    if(securityCode===undefined || securityCode==""){
        showAlertBox('Please provide valid security code.','danger');
        return ;
    }
    var shouldInstallFSPackage = document.getElementById('chkinstallfspackage').checked;
    var dataObj="sfedition="+sfEdition+"&securitycode="+securityCode+"&chkinstallfspackage="+shouldInstallFSPackage;
    var url ="/app-ui";
    processProgress("Processing...",false);
    postAjax(url,dataObj,successCallback);
}
function createPDF(){
    var websiteLink = document.getElementById('websiteLink').value;
    var url ="/pdf";
    var dataObj = "websiteLink="+websiteLink;
    processProgress("Processing...",false);
    /*var params = typeof dataInput == 'string' ? dataInput : Object.keys(dataInput).map(
        function(k){ return encodeURIComponent(k) + '=' + encodeURIComponent(dataInput[k]) }
    ).join('&');
    fetch(url, {
        body: params,
        method: 'POST'
    }).then(res => {
        return res
            .arrayBuffer()
            .then(res => {
                const blob = new Blob([res], { type: 'application/pdf' })
                saveAs(blob, 'invoice.pdf')
            })
            .catch(e => alert(e))
    });*/
    postAjax(url,dataObj,successCallback);
}
function processProgress(btnText,isProcessDone){
    if(isProcessDone){
        document.getElementById('submitBtn').value=btnText;
    }else{
        document.getElementById('submitBtn').value=btnText;
    }
}