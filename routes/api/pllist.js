const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const Hodling = require("../../models/PLlist");

// @route 		GET api/pllist
// @desc 			Get Profit / Loss Details
// @access 		Public
router.get( "/", ( req, res ) =>
{
	res.send( "hodling route" );
} );

router.post(
  "/",
  [
    check("coin", "Coin name required").not().isEmpty(),
		check( "pair", "Pair name required" ).not().isEmpty(),
		check( "qty", "Coin quantity required" ).not().isEmpty(),
		check( "buyPrice", "Buy price required" ).not().isEmpty(),
		check( "soldPrice", "Sold price required" ).not().isEmpty(),
		check("term", "Add Term/Comment").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { coin, pair, qty, buyPrice, soldPrice, term } = req.body;
    try {

     const coinPair = new Hodling({
			 coin,
			 pair,
			 qty,
			 buyPrice,
			 soldPrice,
			 term
      });

      await coinPair.save();
      return res.status(200).send("Profit/Loss row inserted");

      // return jsonwebtoken
    } catch (error) {
      return res.status(500).send(error);
    }
  }
);

module.exports = router;