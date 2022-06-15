//TODO replace with actual service
const postService = require('../services/post');

function preload(populate) {
    return async function (req, res, next) {
        const id = req.params.id;
        
        if (populate){
            res.locals.house = await postService.getHouseAndUsers(id);
        } else {
            res.locals.house = await postService.getHouseById(id);
        }
        
        next();
    };
}

module.exports = preload;