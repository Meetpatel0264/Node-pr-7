const checkLoginStatus = (req) => {
    // Old cookie-only login check kept for reference as requested.
    // return req.cookies && req.cookies.userId;
    return (req.isAuthenticated && req.isAuthenticated()) || (req.cookies && req.cookies.userId);
};

module.exports = {
    checkLoginStatus
};
