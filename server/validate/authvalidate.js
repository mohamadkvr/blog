module.exports.registerValidatorsBody = (req) =>{
         let {firstName , lastName , userName , password , email, phone} = req.body

         if (firstName && lastName && userName && password && email && phone) {
             return false;
         }  
           return true;

}

module.exports.validation = (body) =>{
            return [
              body("userName", "Username must be between 5 and 20 characters" ).isLength({ min: 5 , max: 20}),
              body("password", "Password must be between 5 and 10 characters" ).isLength({ min: 5 , max: 10}),
              body("email", "email is not valid" ).isEmail()
            ]
}

module.exports.updateValidatorsBody = (req) =>{
  let {firstName , lastName , userName  , email, phone} = req.body

  if (firstName && lastName && userName && email && phone) {
      return false;
  }  
    return true;

}

module.exports.validationUser = (body) =>{
  return [
    body("userName", "Username must be between 5 and 20 characters" ).isLength({ min: 5 , max: 20}),
    body("email", "email is not valid" ).isEmail()
  ]
}

module.exports.validationPass = (body) =>{
  return [
    body("password", "password must be between 5 and 20 characters" ).isLength({ min: 5 , max: 20}),
  ]

}

module.exports.validationlenghText = (text , description) =>{
                       
  if ( text.length < 500) {
    return "text"
  }else if(description.length < 99) {
    return "description"
  }
}