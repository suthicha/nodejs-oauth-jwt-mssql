const express 			= require('express');
const expressApp 		= express();
const router			= express.Router();
const mssql				= require('mssql');
const jwt				= require('jsonwebtoken');
const morgan 			= require('morgan');
const url				= require('url');
const bodyParser 		= require('body-parser');
const settings			= require('./settings');
const urlHelper			= require('./utils/urlHelper')(url);
const userAuthDBAdapter	= require('./dbHelpers/userAuthDBAdapter')(mssql, settings);
const userAuthDBHelper	= require('./dbHelpers/userAuthDBHelper')(userAuthDBAdapter);
const oAuthTokenModel 	= require('./oauth2/accessTokenModel')(jwt, userAuthDBHelper);

const authRoutesMethods	= require('./oauth2/authRoutesMethods')(oAuthTokenModel, urlHelper);
const authRoutes		= require('./oauth2/authRoutes')(router, authRoutesMethods);

const testRouteMethod 	= require('./components/test/testRouteMetods');
const testRoute 		= require('./components/test/testRoute')(router, authRoutesMethods, testRouteMethod);

expressApp.use(morgan('dev'));
expressApp.use(bodyParser.urlencoded({extended: false}));
expressApp.use(bodyParser.json());

expressApp.use((req, res, next) => {
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
		if(res.method === 'OPTIONS'){
				res.header('Access-Control-Allow-Methods', 'PUT, PATCH, POST, DELETE, GET');
				return res.status(200).json({});
		}
		next();
});

expressApp.use('/services/oauth2', authRoutes);
expressApp.use('/services/test', testRoute);

expressApp.use((req, res, next) => {
		const error = new Error('Not Found');
		error.status = 400;
		next(error);
});

expressApp.use((err, req, res, next) => {
		res.status(err.status || 500);
		res.json({
				error: {
						message: err.message
				}
		});
});

module.exports = expressApp;
