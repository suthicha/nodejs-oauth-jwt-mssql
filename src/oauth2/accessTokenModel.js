
let userAuthDBHelper;
let jwt;

module.exports = (injectedJWT, injectedUserAuthDBHelper) => {
		userAuthDBHelper 	= injectedUserAuthDBHelper;
		jwt					= injectedJWT;

		return {
				sign,
				checkAuth,
				getClient,
				getUser,
				saveAccessToken
		}
};

const sign = (client, callback) => {
	if (client !== null && client !== undefined){
		const { client_id, client_secert, client_token, instance_url, username } = client;
		const access_timeout = 3600;
		const issued_at = Date.now();
		const expires_in = issued_at + access_timeout;
		const access_token = jwt.sign({
			client_id,
			client_secert,
			issued_at,
			expires_in
		}, client_token, { expiresIn: access_timeout });
		
		userAuthDBHelper.saveAccessToken(access_token, username, error =>{
			if(!error){
				callback(true, {
					access_token,
					issued_at,
					expires_in,
					instance_url
				});
			}
		})
		
	}else {
		callback(false, null);
	}
}

const handleAfterSignComplete = (accessToken, username) => {
	userAuthDBHelper.saveAccessToken(accessToken, username, cb =>{
		console.log(cb);
		return cb;
	})
}

const checkAuth = (token, callback) => {
	
		userAuthDBHelper.getAccessToken(token, (err, results) => {
			if (results.recordset.length > 0){
				try{
					const { client_token } = results.recordset[0];
					const decode = jwt.verify(token, client_token);
					console.log(decode);
	
					callback(true, decode);
				}catch(e){
					callback(false, e.message);
				}
			}else{
				callback(false, null);
			}
		})
}

const getClient = (client_id, client_secert, username, password) => {
		const client = {
				client_id,
				client_secert,
				username,
				client_token: null,
		}
	return client;
};

const getUser = (client_id, client_secert, username, password, callback) => {
		userAuthDBHelper.getUserFromCrentials(client_id, client_secert, username, password, callback);
};

const saveAccessToken = (accessToken, username, callback) => {
		userAuthDBHelper.saveAccessToken()
};



