const express = require( "express" );
const app = express();
const router = express.Router();
const { check, validationResult } = require( "express-validator" );
const cors = require( "cors" );

app.use( cors() );
app.options( "*", cors() );

const Hodling = require( "../../models/Hodling" );

// @route 		GET api/hodling
// @desc 			Get Hodling amout details
// @access 		Public
router.get( "/", async ( req, res ) =>
{
  const uid = req.headers[ "uid" ];
  let record = null;
  if ( uid )
    record = await Hodling.find( { uid } );
  // else
  //   record = await Hodling.find();
  res.status( 200 ).json( { status: ( record ? "success" : "invalid" ), message: record } );
} );

// @route 		POST api/hodling
// @desc 			POST Hodling amount details
// @access 		Public
router.post(
  "/",
  [
    check( "coin", "Coin name required" ).not().isEmpty(),
    check( "pair", "Pair name required" ).not().isEmpty(),
    check( "qty", "Coin quantity required" ).not().isEmpty(),
    check( "price", "Price required" ).not().isEmpty(),
    check( "term", "Add Term/Comment" ).not().isEmpty(),
    check( "uid", "User ID required" ).not().isEmpty()
  ],
  async ( req, res ) =>
  {
    const errors = validationResult( req );
    const { coin, pair, qty, price, term, uid } = req.body;


    if ( !errors.isEmpty() )
      return res.status( 200 ).json( { status: "invalid", msg: errors.array() } );
    // const { coin, pair, qty, price, term } = req.body;
    try {

      const coinPair = new Hodling( {
        coin,
        pair,
        qty,
        price,
        term,
        uid
      } );
      await coinPair.save();
      return res.status( 200 ).json( { status: "success", msg: "Hodling row inserted" } );

      // return jsonwebtoken
    } catch ( error ) {
      return res.status( 200 ).json( { status: "invalid", msg: errors } );
    }
  }
);

// @route 		POST api/hodling/update
// @desc 			Get Hodling amout details
// @access 		Public
router.post( "/update", [
  check( "id", "Coin ID required" ).not().isEmpty(),
  check( "coin", "Coin name required" ).not().isEmpty(),
  check( "pair", "Pair name required" ).not().isEmpty(),
  check( "qty", "Coin quantity required" ).not().isEmpty(),
  check( "price", "Price required" ).not().isEmpty(),
  check( "term", "Add Term/Comment" ).not().isEmpty(),
],
  async ( req, res ) =>
  {
    const errors = validationResult( req );

    const { id, coin, pair, qty, price, term } = req.body;

    if ( !errors.isEmpty() )
      return res.status( 200 ).json( { status: "invalid", msg: errors.array() } );

    await Hodling.updateOne(
      {
        "_id": id,
      },
      {
        $set: {
          "coin": coin,
          "pair": pair,
          "qty": +qty,
          "price": +price,
          "term": term,
        }
      }
    );
    return res.status( 200 ).json( { status: "success", message: "Coin updated" } );
  } );

// @route 		POST api/hodling/delete
// @desc 			Delete Hodling amout details
// @access 		Public
router.post( "/delete",
  [
    check( "coin", "Coin name required" ).not().isEmpty(),
    check( "pair", "Pair name required" ).not().isEmpty(),
    check( "qty", "Coin quantity required" ).not().isEmpty(),
    check( "uid", "User ID required" ).not().isEmpty()
  ],
  async ( req, res ) =>
  {
    const errors = validationResult( req );
    if ( !errors.isEmpty() )
      return res.status( 400 ).json( { errors: errors.array() } );
    const { id, coin, pair, qty, price, term, uid } = req.body;

    // TODO: Refactor this (remove with coin id)
    // TODO: Surround with try catch block
    await Hodling.deleteOne( {
      coin,
      pair,
      qty,
      uid
    } );
    res.status( 200 ).json( { status: "success", message: "Coin Deleted successfully" } );
  } );

module.exports = router;