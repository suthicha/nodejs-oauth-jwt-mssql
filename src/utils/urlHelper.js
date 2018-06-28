let url;

module.exports = injectedUrl => {
    url = injectedUrl;
    return {
        getUrl: (req)=>{
            return url.format({
                protocal: req.protocal,
                host: req.get('host'),
                pathname: req.originalUrl
            })
        }
    }
}