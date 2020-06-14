exports.requestTime = (req, res, next) => {
	req.requestTime = Date.now();
	next();
};
