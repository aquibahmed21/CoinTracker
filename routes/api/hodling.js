const express = require( "express" );
const app = express();
const router = express.Router();
const { check, validationResult } = require( "express-validator" );
const cors = require( 'cors' );

app.use(cors());
app.options('*', cors());

const Hodling = require("../../models/Hodling");

// @route 		GET api/hodling
// @desc 			Get Hodling amout details
// @access 		Public
router.get( "/", async ( req, res ) =>
{
  const record = await Hodling.find();
	res.status( 200 ).json( record );
} );

// @route 		POST api/hodling
// @desc 			POST Hodling amout details
// @access 		Public
router.post(
  "/",
  [
    check("coin", "Coin name required").not().isEmpty(),
		check( "pair", "Pair name required" ).not().isEmpty(),
		check( "qty", "Coin quantity required" ).not().isEmpty(),
		check( "price", "Price required" ).not().isEmpty(),
		check("term", "Add Term/Comment").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult( req );
    const { coin, pair, qty, price, term } = req.body;
    console.log(req.body);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });



    // const { coin, pair, qty, price, term } = req.body;
    try {

     const coinPair = new Hodling({
			 coin,
			 pair,
			 qty,
			 price,
			 term
      });

      await coinPair.save();
      return res.status( 200 ).json( { msg: "Hodling row inserted" });

      // return jsonwebtoken
    } catch (error) {
      return res.status(500).send(error);
    }
  }
);

// @route 		POST api/hodling/update
// @desc 			Get Hodling amout details
// @access 		Public
router.post( "/update", async ( req, res ) =>
{
  const { id, coin, coinOld, pair, qty, price, term } = req.body;
  await Hodling.updateOne(
    {
      "coin": coinOld,
      "pair": "inr",
    },
    {
      $set: {
        "coin": coin,
      }
    }
  );
  res.status( 200 ).json( { status: "ok" } );
} );

// @route 		POST api/hodling/delete
// @desc 			Delete Hodling amout details
// @access 		Public
router.post( "/delete", async ( req, res ) =>
{
  const { id, coin, coinOld, pair, qty, price, term } = req.body;
  await Hodling.deleteOne( {
    "coin": coinOld,
    "pair": "inr",
  } );
  res.status( 200 ).json( { status: "ok" } );
} );

module.exports = router;