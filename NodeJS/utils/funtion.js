exports.isAdmin = (req, res) => {
    const { permissions } = req.auth
    if (permissions != 0) {
        return true
    }
}
exports.isAudit = (req, res) => {
    const { permissions } = req.auth
    if (permissions != 1) {
        return true
    }
}
exports.isUser = (req, res) => {
    const { permissions } = req.auth
    if (permissions != 2) {
        return true    }
}


