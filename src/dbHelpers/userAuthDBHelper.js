let userAuthDBAdapter;

module.exports = injectedUserAuthDBAdapter => {
	userAuthDBAdapter = injectedUserAuthDBAdapter;
	return {
		   	getUserFromCrentials,
		   	getAccessToken,
			saveAccessToken  
	}
}

/**
 * getUserFromCrentials
 * 
 * @param {object} client_id
 * @param {object} client_secert
 * @param {object} username 
 * @param {object} password 
 * @param {Func} callback 
 */
const getUserFromCrentials = (client_id, client_secert, username, password, callback) => {
	userAuthDBAdapter.query(client_id, client_secert, username, password, (dataResponseObject)=> {
		callback(dataResponseObject.error, 
			dataResponseObject.results !== null && dataResponseObject.results.length === 1 
			? dataResponseObject.results[0]
			: null
		)
	})	
};

/**
 * saveAccessToken
 * @param {object} accessToken 
 * @param {object} username 
 * @param {Func} callback 
 */
const saveAccessToken = (accessToken, username, callback) => {
	userAuthDBAdapter.saveAccessToken(accessToken,username, (dataResponseObject)=>{
		callback(dataResponseObject.error);
	})
};

const getAccessToken = (accessToken, callback) => {
	userAuthDBAdapter.getAccessToken(accessToken, dataResponseObject=>{
		callback(dataResponseObject.error, 
			dataResponseObject.results 
		)
	});
}
