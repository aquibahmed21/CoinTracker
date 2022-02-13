require( "dotenv" ).config();

const express = require( "express" );
const router = express.Router();
const auth = require( "../../middleware/auth" );
const { check, validationResult } = require( "express-validator" );
const bcrycpt = require( "bcryptjs" );
const jwt = require( "jsonwebtoken" );

const User = require( "../../models/Users" );

// @route 		GET api/auth
// @desc 			Test router
// @access 		Public
router.get( "/", auth, async ( req, res ) =>
{
  try {
    const user = await User.findById( req.user.id ).select( "-password" );
    res.status( 200 ).json( { status: "success", user } );
  } catch ( error ) {
    console.log( error );
    res.status( 200 ).json( { status: "invalid", error } );
  }
} );

// @route 		POST api/auth
// @desc 			Validate User
// @access 		Public
router.post(
  "/",
  [
    check( "email", "Please input valid email" ).isEmail(),
    check(
      "password",
      "Password is required"
    ).exists()
  ],
  async ( req, res ) =>
  {
    const { email, password } = req.body;
    const errors = validationResult( req );
    if ( !errors.isEmpty() )
      return res.status( 400 ).json( { errors: errors.array() } );

    // const { email, password } = req.body;

    try {
      // See if user exists
      let user = await User.findOne( { email } );

      if ( !user )
        return res
          .status( 200 ).json( { status: "invalid", msg: "User does not exist" } );

      const isMatch = await bcrycpt.compare( password, user.password );

      if ( !isMatch )
        return res
          .status( 200 ).json( { status: "invalid", msg: "Passwords do not match" } );

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
            console.log( err );
          else
            res.status( 200 ).json( { status: "success", token } );
          ``;
        } );

    } catch ( error ) {
      return res.status( 500 ).send( error );
    }
  }
);

module.exports = router;