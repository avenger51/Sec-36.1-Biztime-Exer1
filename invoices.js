const express = require("express");
const ExpressError = require("./expressError")
const router = express.Router();
const db = require("./db");
//
//
////REMEMBER:  /companies is already defined in app.js so the PATH IN THE ROUTER doesn't require /companies
router.get('/', async (req, res, next) => {
    try {
      const results = await db.query(`SELECT * FROM invoices`);
      return res.json({ companies: results.rows })
    } catch (e) {
      return next(e);
    }
  });
//
  router.post('/', async (req, res, next) => {
    try {
        const { comp_code, amt} = req.body;
        const results = await db.query('INSERT INTO invoices (comp_code, amt) VALUES ($1, $2) RETURNING comp_code, amt', [comp_code, amt]);
        return res.status(201).json({ invoices: results.rows[0] })
      } catch (e) {
        return next(e)
      }
    });


  router.get('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      const results = await db.query('SELECT * FROM invoices WHERE id = $1', [id]);
    
      if (results.rows.length === 0) {
        throw new ExpressError(`Can't find invoice with code of ${id}`, 404);
      }
      return res.send({ invoice: results.rows[0] });
    } catch (e) {
      return next(e);
    }
  });
//
  router.put('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      const { amt } = req.body;

      const checkExist = await db.query('SELECT * FROM invoices WHERE id = $1', [id]);
      if (checkExist.rows.length === 0) {

        throw new ExpressError(`Can't find invoice with code of ${id}`, 404);
      }
//  //removed const for testing dbquery directly
//   //   const updateQuery = `
//   //   UPDATE companies
//   //   SET name = $1, description = $2
//   //   WHERE code = $3
//   //   RETURNING *;  
//   // `;
    const updateResult = 
    await db.query
    (`UPDATE invoices SET amt = $1  WHERE id = $2 RETURNING *`, [amt, id]);

      return res.json({ invoice: updateResult.rows[0]});

    } catch (e) {
      return next(e);
    }
  })
  
router.delete('/:id', async (req, res, next) => {

  try {
    const { id } = req.params;
    const results = await db.query('SELECT * FROM invoices WHERE id = $1', [id]);
    if(results.rows.length === 0) {
      throw new ExpressError(`Can't find the invoice code of ${id}`, 404);
    }
 
    const updateResults = await db.query(`DELETE FROM invoices WHERE id = $1`, [id]);
    return res.send({ msg: `Deleted ${id}`});
  } catch (e) {
    return next(e)
  }
});


module.exports = router;