module.exports = (router, authRoutesMethods) => {
    router.post('/token', authRoutesMethods.login)
    return router;
};