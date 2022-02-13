require( "dotenv" ).config();

const express = require( "express" );
const router = express.Router();
const { check, validationResult } = require( "express-validator" );
const bcrycpt = require( "bcryptjs" );
const jwt = require( "jsonwebtoken" );

const User = require( "../../models/Users" );

// @route 		GET api/users
// @desc 			Register User
// @access 		Public
router.get( "/", ( req, res ) =>
{
  res.send( "User route" );
} );

// @route 		GET api/users
// @desc 			Register User
// @access 		Public
router.post(
  "/",
  [
    check( "email", "Please input valid email" ).isEmail(),
    check(
      "password",
      "Input valid password with minimum 6 characters"
    ).isLength( { min: 5 } ),
  ],
  async ( req, res ) =>
  {
    const errors = validationResult( req );
    if ( !errors.isEmpty() )
      return res.status( 400 ).json( { errors: errors.array() } );

    const { email, password } = req.body;

    try {
      // See if user exists
      let user = await User.findOne( { email } );
      if ( user )
        return res
          .status( 400 )
          .json( { errors: [ { msg: "User already exists" } ] } );


      user = new User( {
        email,
        password,
      } );

      // Encrypt password
      const salt = await bcrycpt.genSalt( 10 );
      user.password = await bcrycpt.hash( password, salt );
      await user.save();

      // return jsonwebtoken

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign( payload,
        process.env.JWT_SECRET,
        { expiresIn: 360000 },
        ( err, token ) =>
        {
          if ( err )
            return console.log( err );
          else
            res.status( 200).json( { status:"success", token} );
        } );

    } catch ( error ) {
      return res.status( 500 ).send( error );
    }
  }
);

module.exports = router;