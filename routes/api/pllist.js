const express = require( "express" );
const router = express.Router();
const { check, validationResult } = require( "express-validator" );

const Hodling = require( "../../models/PLlist" );

// @route 		GET api/pllist
// @desc 			Get Profit / Loss Details
// @access 		Public
router.get( "/", async ( req, res ) => {
  // Get header from request
  const uid = req.headers.uid;
  let record = null;
  if ( uid )
    record = await Hodling.find( { uid } );
  else
    record = await Hodling.find();
  res.status( 200 ).json( { status: "success", message: record } );
} );

router.post(
  "/",
  [
    check( "uid", "User ID not provided" ).not().isEmpty(),
    check( "coin", "Coin name required" ).not().isEmpty(),
    check( "pair", "Pair name required" ).not().isEmpty(),
    check( "qty", "Coin quantity required" ).not().isEmpty(),
    check( "buyPrice", "Buy price required" ).not().isEmpty(),
    check( "soldPrice", "Sold price required" ).not().isEmpty(),
    check( "term", "Add Term/Comment" ).not().isEmpty()
  ],
  async ( req, res ) => {
    const errors = validationResult( req );
    if ( !errors.isEmpty() )
      return res.status( 400 ).json( { errors: errors.array() } );

    const { coin, pair, qty, buyPrice, soldPrice, term, uid, id } = req.body;
    try {
      const coinPair = new Hodling( {
        coin,
        pair,
        qty,
        buyPrice,
        soldPrice,
        term,
        uid
      } );

      await coinPair.save();
      return res.status( 200 ).json( { status: "success", msg: "Profit/Loss row inserted", id: coinPair.id } );

      // return jsonwebtoken
    } catch ( error ) {
      return res.status( 500 ).send( error );
    }
  }
);

router.post( "/delete", [
  check( "id", "ID required" ).not().isEmpty()
],
async ( req, res ) => {
  const errors = validationResult( req );
  if ( !errors.isEmpty() )
    return res.status( 400 ).json( { errors: errors.array() } );

  const { coin, pair, qty, buyPrice, soldPrice, term, uid, id } = req.body;

  try {
    await Hodling.deleteOne( { _id: id } );
    return res.status( 200 ).json( { status: "success", msg: "Coin deleted" } );
  } catch ( err ) {
    return res.status( 200 ).json( { status: "invalid", msg: "Coin deleted failed" } );
  }
} );

router.post(
  "/update",
  [
    check( "uid", "User ID not provided" ).not().isEmpty(),
    check( "coin", "Coin name required" ).not().isEmpty(),
    check( "pair", "Pair name required" ).not().isEmpty(),
    check( "qty", "Coin quantity required" ).not().isEmpty(),
    check( "buyPrice", "Buy price required" ).not().isEmpty(),
    check( "soldPrice", "Sold price required" ).not().isEmpty(),
    check( "term", "Add Term/Comment" ).not().isEmpty()
  ],
  async ( req, res ) => {
    const errors = validationResult( req );
    if ( !errors.isEmpty() )
      return res.status( 400 ).json( { errors: errors.array() } );

    const { coin, pair, qty, buyPrice, soldPrice, term, uid, id } = req.body;
    try {
      await Hodling.updateOne(
        {
          _id: id
        },
        {
          $set: {
            coin,
            pair,
            qty: +qty,
            buyPrice: +buyPrice,
            soldPrice: +soldPrice,
            term
          }
        }
      );

      res.status( 200 ).json( { status: "success", msg: "Coin updated" } );
    } catch ( error ) { }
  } );

module.exports = router;
