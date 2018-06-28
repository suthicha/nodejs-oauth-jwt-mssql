
const testpage = (req, res, next) => {
    res
        .status(200)
        .json({
            status:'OK'
        })
}

module.exports = { testpage }