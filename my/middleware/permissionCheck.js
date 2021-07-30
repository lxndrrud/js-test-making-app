const mydb = require('../dbHelpers');


const check = async function(...allowed){
  return async function(req, res, next) {
    const rolePermissions = await mydb.getRolePermissions(req.signedCookies['ROLE']);
    res.clearCookie('PERMISSIONS');
    
    let intersection = allowed.filter(elem => rolePermissions.includes(elem));
    if(!intersection){
      res.render('permissionFail');
    }
    else{
      let signedOptions = {
        maxAge: 1000 * 60 * 60 *4 , // would expire after 4 hours
        httpOnly: false, // The cookie only accessible by the web server
        signed: true, // Indicates if the cookie should be signed
      }
      res.cookie('PERMISSIONS', intersection, signedOptions);
      next();
    }
    
  };
}

module.exports = check