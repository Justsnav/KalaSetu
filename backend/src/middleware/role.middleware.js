const restrictTo = (...allowedRoles)=>{
    return (req,res,next)=>{
        if(!allowedRoles.includes(req.user.role)){
            return res.status(403).json({
                message : 'You do not have permission to perform this action'
            });
        }
<<<<<<< HEAD
        next();
=======
        next;
>>>>>>> a490129 (feat: add Product model)
    }
}

module.exports = restrictTo;