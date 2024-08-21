exports.isNoRes = (result) => {
    if (result.status !== 0)
        return res.result(result.message)
}