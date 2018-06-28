module.exports = (router, oAuth, testRoutesMethods) => {
    router.get('/page',oAuth.checkAuth, testRoutesMethods.testpage)
    return router;
};