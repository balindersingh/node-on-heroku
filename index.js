const http = require('http');
const path = require('path');
const url = require('url');
const fs = require('fs');
const constantObj = require('./constants');
const routepath = require('./routepath');
const fileExt = require('./helper/fileExt');
const pageService = require('./pageService');
var appOptions={};
var app = function (request, response) {
  if(request.url.indexOf('/static/')>=0){
    return pageService.staticFiles(request, response);
  }
  else if (request.method == constantObj.HTTP_METHOD_TYPE.POST) {
    console.log('POST');
    var body = '';
    request.on('data', function (data) {
      body += data;
    });

    request.on('end', function () {
      try {

        var routeInfo = routepath.reroute(request, body);
        if (routeInfo == routepath.constants.ROOT) {
          pageService.pageRoot(request,response,constantObj.HTTP_METHOD_TYPE.POST);          
        }else if (routeInfo == routepath.constants.APPUI){
          pageService.pageAppUI(request,response,constantObj.HTTP_METHOD_TYPE.POST,body);          
        }else if (routeInfo == routepath.constants.PDF){
          pageService.pagePDF(request,response,constantObj.HTTP_METHOD_TYPE.POST,body);          
        } else {
          pageService.pageError(request,response,constantObj.HTTP_METHOD_TYPE.POST);          
        }

      } catch (err) {
        pageService.pageError(request,response,constantObj.HTTP_METHOD_TYPE.POST);
        response.end(JSON.stringify({
          "error": "Request processed with errors",
          "errorDetail": "" + err
        }));
      }
    });
  } else {
    
      try {
        var routeInfo = routepath.reroute(request);
        console.log('GET Route Info:'+routeInfo);
        if (routeInfo == routepath.constants.APPUI){
          pageService.pageAppUI(request,response,constantObj.HTTP_METHOD_TYPE.GET);          
        }else if (routeInfo == routepath.constants.PDF) {
          pageService.pagePDF(request,response,constantObj.HTTP_METHOD_TYPE.GET);        
        }else if (routeInfo == routepath.constants.ROOT) {
          pageService.pageRoot(request,response,constantObj.HTTP_METHOD_TYPE.GET);        
        }else if(routeInfo == routepath.constants.IGNORE){
          // DO NOTHING. it is favicon request. TODO
        }else{
          pageService.pageError(request,response,constantObj.HTTP_METHOD_TYPE.GET);          
        }
      }catch(err){
        pageService.pageUnexpected(request,response,constantObj.HTTP_METHOD_TYPE.GET,err);
      }
    }
};

var appServer = http.createServer(appOptions, app);
console.log('ENVIRONMENT : '+constantObj.ENV_VARS.Environment);
const port = process.env.PORT || 5000 
appServer.listen(port, function () {
  console.log('Server listening on port: ' + port);
});
