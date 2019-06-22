const https = require('https');
const child_process = require('child_process');
const fs = require('fs');
const url = require('url');
const path = require('path');
const request = require('request');
const puppeteer = require('puppeteer');
var qs = require('querystring');
var FormData = require('form-data');
const constantObj = require('./constants');
const fileExt = require('./helper/fileExt');
const pdfService = require('./pdfService');

var appUIPage = function (request, response, httpMethod,body) {
    if(httpMethod == constantObj.HTTP_METHOD_TYPE.POST){
        var postedBody = qs.parse(body);
        var submittedSecurityCode = postedBody["securitycode"];
        var securityCodes = constantObj.ENV_VARS.SecurityCodes;
        if(securityCodes!==undefined){
            var allowedSecurityCodeList = securityCodes.split(',');
            if(allowedSecurityCodeList.indexOf(submittedSecurityCode)>-1){
                // allowed
                // Do your thing
            }else{
                // not allowed
                responseCallback("ERROR_SECURITY_CODE","Security code you provided did not match to our system.",response);
            }
        }else{
            responseCallback("ERROR_SECURITY_CODE","Security code you provided did not match to our system.",response);
        }
    }else{
        fs.readFile('public/app-ui.html', function (err, data) {
            response.writeHead(constantObj.HTTP_INFO.OK.CODE, {
                'Content-Type': 'text/html',
                'Content-Length': data.length
            });
            response.write(data);
            response.end();
        });
    }
};
var pdfPage = function (request, response, httpMethod,body) {
    if(httpMethod == constantObj.HTTP_METHOD_TYPE.POST){
        var postedBody = qs.parse(body);
        var websiteLink = postedBody["websiteLink"];
        var templateContent = postedBody["templateContent"];
        var mergeFieldsContentData = postedBody["mergeFieldsContent"];
        try{
            var sampleData = {"name":"Balinder Singh","jobtitle":"Software Engineer","company":"Formstack","location":"Canada","profession":"Web and Application development"}
            if(mergeFieldsContentData===undefined || mergeFieldsContentData==""){
                mergeFieldsContentData = sampleData;
            }
            var contentInfoObj = pdfService.getContentInfo(websiteLink,templateContent,mergeFieldsContentData);
            pdfService.createPDFFromHTML(contentInfoObj).then((pdfName) => {
                var fileName = pdfName.substring(pdfName.lastIndexOf('/'));
                responseCallback("SUCEES_PDF_GENERATED","<a target='_blank' href='" + pdfName+"'>"+fileName+"</a>",response);
            });
        }catch(err){
            responseCallback("ERROR_UNKNOWN_PDF",err,response);
        }
    }else{
        fs.readFile('public/pdf.html', function (err, data) {
            response.writeHead(constantObj.HTTP_INFO.OK.CODE, {
                'Content-Type': 'text/html',
                'Content-Length': data.length
            });
            response.write(data);
            response.end();
        });
    }
};
var errorPage = function (request, response, httpMethod) {
    if(httpMethod == constantObj.HTTP_METHOD_TYPE.POST){
    console.log('POST ERROR');
    fs.readFile('public/error.html', function (err, data) {
        response.writeHead(constantObj.HTTP_INFO.OK.CODE, {
            'Content-Type': 'text/html',
            'Content-Length': data.length
        });
        response.write(data);
        response.end();
    });
    }else{
    console.log('GET ERROR');
    fs.readFile('public/error.html', function (err, data) {
        response.writeHead(constantObj.HTTP_INFO.OK.CODE, {
            'Content-Type': 'text/html',
            'Content-Length': data.length
        });
        response.write(data);
        response.end();
    });
}
};
var unexpectedPage = function (request, response, httpMethod,errorMessage) {
     
    console.log('unexpectedPage ERROR Method type:'+httpMethod);
    console.log(errorMessage);
    fs.readFile('public/404.html', function (err, data) {
        response.writeHead(constantObj.HTTP_INFO.OK.CODE, {
            'Content-Type': 'text/html',
            'Content-Length': data.length
        });
        response.write(data);
        response.end();
    });
    /// UNKNOW ERROR
    /*
        response.end(JSON.stringify({
          "error": "Request processed with errors",
          "errorDetail": "" + err
        }));*/
};
var rootPage = function (request, response, httpMethod) {
    console.log('[ROOT Endpoint]');
    if(httpMethod == constantObj.HTTP_METHOD_TYPE.POST){
    response.end(JSON.stringify({
        "error": "Method Not Allowed Here",
        "errorDetail": "" + request.url
    }));
}else{
    console.log('GET');
    fs.readFile('public/index.html', function (err, data) {
        response.writeHead(constantObj.HTTP_INFO.OK.CODE, {
            'Content-Type': 'text/html',
            'Content-Length': data.length
        });
        response.write(data);
        response.end();
    });
}
};

var serverStaticFiles = function (request, response) {
    var filePath = url.parse(request.url).pathname;
    var extName = fileExt.ext.getExt(filePath);
    filePath = __dirname + filePath;
    var contentType = fileExt.ext.getContentType(extName);

    var s = fs.createReadStream(filePath);
    s.on('open', function () {
        response.setHeader('Content-Type', contentType);
        s.pipe(response);
    });
    s.on('error', function () {
        response.setHeader('Content-Type', 'text/plain');
        response.statusCode = 404;
        response.end('Not found');
    });
    return;
};
function responseCallback(shortMessage,detailedMessage,response){
    response.end(JSON.stringify({
        "shortMessage": shortMessage,
        "detailMessage": detailedMessage
    }));
};
module.exports = {
    pageAppUI: function (request, response, httpMethod,body) {
        appUIPage(request, response, httpMethod,body);
    },
    pagePDF: function (request, response, httpMethod,body) {
        pdfPage(request, response, httpMethod,body);
    },
    pageError: function (request, response, httpMethod) {
        errorPage(request, response, httpMethod);
    },
    pageUnexpected: function (request, response, httpMethod,errorMessage) {
        unexpectedPage(request, response,httpMethod,errorMessage);
    },
    pageRoot: function (request, response, httpMethod) {
        rootPage(request, response, httpMethod);
    },
    staticFiles: function (request, response) {
        serverStaticFiles(request, response);
    }
};