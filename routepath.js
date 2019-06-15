const https = require('https');
const url = require('url');
const constantObj = require('./constants');
const re_route = {
  APPUI:'app-ui',
  PDF:'pdf',
  ROOT:'',
  ERROR:'error',
  IGNORE:'ignore'
}
module.exports = {
  constants: re_route,
  reroute: function (request, data) {
    //var userpass = new Buffer((request.headers.authorization || '').split(' ')[1] || '', 'base64').toString();
    /*if (userpass !== 'appadmin:sf2019##') {
      response.writeHead(401, {
        'WWW-Authenticate': 'Basic realm="nope"'
      });
      response.end('HTTP Error 401 Unauthorized: Access is denied');
      return;
    }*/
    var url_parts = url.parse(request.url);
    console.log('Is Debugging On:'+constantObj.ENV_VARS.Debug)
    if(constantObj.ENV_VARS.Debug){
      console.log('PATH:' +url_parts.pathname);
      console.log('URL PARTS:');
      console.log(url_parts);
      console.log('DATA:');
      console.log(data);
    }
    if(url_parts.pathname.toLowerCase()=='/pdf'){
      return re_route.PDF;
    }else if(url_parts.pathname.toLowerCase()=='/app-ui'){
        return re_route.APPUI;
    }else if(url_parts.pathname=='/favicon.ico'){
      return re_route.IGNORE;
    }else if(url_parts.pathname.length>1){
      //console.log('Path not supported:'+url_parts.pathname);
      return re_route.ERROR;
    }
    console.log('ROOT PATH:'+url_parts.pathname);
    return re_route.ROOT;
  }
  
};