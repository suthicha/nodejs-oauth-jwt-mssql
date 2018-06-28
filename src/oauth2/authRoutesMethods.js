let oAuthTokenModel;
let urlHelper;

module.exports = (injectedOAuthTokenModel, injectedUrlHelper) => {
    oAuthTokenModel = injectedOAuthTokenModel;
    urlHelper       = injectedUrlHelper;
    return {
        login,
        checkAuth
    }
}

const loginResponse = (res, client) => {
    oAuthTokenModel.sign(client,(status, clientAccessToken)=>{
        sendResponse(res, {
            ...clientAccessToken
        }, 200)
    })
}

const loginErrorResponse = (res) => {
    sendResponse(res, {
        error: "invalid_login",
        error_description: "invalid verify credentials"
    },400);
}

const login = (req, res) => {
    const { client_id, client_secert, username, password } = req.body;
    
    oAuthTokenModel.getUser(client_id, client_secert, username, password, (err, data) => {
        if(data){
            let client = oAuthTokenModel.getClient(client_id, client_secert, username);
            client.client_token = data.client_token;
            client.instance_url = urlHelper.getUrl(req);
            loginResponse(res, client);
        }else{
            loginErrorResponse(res);
        }
    })
    
}

const checkAuth = (req, res, next) => {
    const token = req.param('token');
    if (token){
        oAuthTokenModel.checkAuth(token, (status, decode)=>{
            if (status){
                res.userData = decode;
                next();
            }else{
                res
                .status(404)
                .json({
                    error: "invalid_token",
                    error_description: "invalid or expired token"
                })
            }
        })
    }else{
        res
        .status(400)
        .json({
            error: "invalid_token",
            error_description: "not found token"
        })
    }
}

const sendResponse = (res, message, status) => {
    res.status(status)
    .json({
        ...message
    })
}