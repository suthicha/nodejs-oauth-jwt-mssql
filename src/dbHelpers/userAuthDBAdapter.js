let connection 	= null;
let settings;
let mssql;

module.exports = (injectedMssql, injectedSettings) => {
	mssql 		= injectedMssql;
	settings 	= injectedSettings;

	return {
		query,
		register,
		getAccessToken,
		saveAccessToken
	}
}

const initConnection = () => {
	connection = new mssql.ConnectionPool(settings.ConnectionSettings);
}

/**
 * query
 * @param {object} client_id
 * @param {object} client_secert
 * @param {object} username 
 * @param {object} password 
 * @param {Func} callback 
 */
const query = (client_id, client_secert, username, password, callback) => {
	initConnection();
	connection.connect().then(()=>{
		const req = new mssql.Request(connection);
		req.input('Username', username)
		.input('Password', password)
		.input('ConsumerId', client_id)
		.input('ConsumerKey', client_secert)
		.execute('sp_oauth2_login', (err, results) => {
			connection.close();
			callback(createDataResponseObject(err, results.recordset))
		})
	})
}


/**
 * register
 * @param {object} username 
 * @param {object} password 
 * @param {object} client_name 
 * @param {object} client_id 
 * @param {object} client_key 
 * @param {object} client_token 
 * @param {Func} callback 
 */
const register = (username, password, client_name, client_id, client_key, client_token, callback) => {
	initConnection();
	connection.connect().then(()=>{
		const req = new mssql.Request(connection);
		req.input('Username', username)
		.input('Password', password)
		.input('ConsumerName', client_name)
		.input('CosumerId', client_id)
		.input('ConsumerKey', client_key)
		.input('ConsumerToken', client_token)
		.execute('sp_oauth2_user_insert', (err, results) => {
			connection.close();
			callback(createDataResponseObject(err, results))
		})
	})
}


/**
 * saveAccessToken
 * @param {object} username 
 * @param {object} accessToken 
 * @param {Func} callback 
 */
const saveAccessToken = (accessToken, username, callback) => {
	initConnection();
	connection.connect().then(()=> {
		const req = new mssql.Request(connection);
		req.input('Username', username)
		.input('AccessToken', accessToken)
		.execute('sp_oauth2_accesstokens_insert', (err, results) => {
			connection.close();
			callback(createDataResponseObject(err, results))
		})
	})
}


/**
 * getAccessToken
 * 
 * @param {object} accessToken 
 * @param {Func} callback 
 */
const getAccessToken = (accessToken, callback) => {
	initConnection();
	connection.connect().then(()=>{
		const req = new mssql.Request(connection);
		req.input('AccessToken', accessToken)
		.execute('sp_oauth2_usertoken', (err, results) => {
			connection.close();
			callback(createDataResponseObject(err, results));
		})
	})
}

const createDataResponseObject = (error, results) => {
	return {
		error,
		results: results === undefined ? null : results === null ? null : results
	}
};



