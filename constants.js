
const config = require('./config');
const  EnvironmentVars = {
    Debug: process.env.Debug || config.debug,
    Environment:process.env.Environment||config.environment,
    SecurityCodes:process.env.SECURITY_CODES || config.securityCodes
};
const HttpInfo ={
    OK :{CODE:200,DETAIL:"Ok"},
    NOT_FOUND:{CODE:404,DETAIL:"Not Found"},
    FORBIDDEN:{CODE:403,DETAIL:"Request not allowed"},
    METHOD_NOT_ALLOWED:{CODE:405,DETAIL:"Method not allowed"}
};
const HttpMethodType ={POST:"POST",GET:"GET"};
const CONSTANTS = {ENV_VARS:EnvironmentVars,HTTP_INFO:HttpInfo,HTTP_METHOD_TYPE:HttpMethodType};
module.exports = CONSTANTS;