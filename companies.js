const express = require("express");
const ExpressError = require("./expressError")
const router = express.Router();
const db = require("./db");


//REMEMBER:  /companies is already defined in app.js so the PATH IN THE ROUTER doesn't require /companies
router.get('/', async (req, res, next) => {
    try {
      const results = await db.query(`SELECT * FROM companies`);
      return res.json({ companies: results.rows })
    } catch (e) {
      return next(e);
    }
  });

  router.post('/', async (req, res, next) => {
    try {
        const { code, name, description } = req.body;
        const results = await db.query('INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING code, name, description', [code, name, description]);
        return res.status(201).json({ companies: results.rows[0] })
      } catch (e) {
        return next(e)
      }
    });


  router.get('/:code', async (req, res, next) => {
    try {
      const { code } = req.params;
      const results = await db.query('SELECT * FROM companies WHERE code = $1', [code]);
    
      if (results.rows.length === 0) {
        throw new ExpressError(`Can't find company with code of ${code}`, 404);
      }
      return res.send({ company: results.rows[0] });
    } catch (e) {
      return next(e);
    }
  });

  router.put('/:code', async (req, res, next) => {
    try {
      const { code } = req.params;
      const { name, description } = req.body;

      const checkExist = await db.query('SELECT * FROM companies WHERE code = $1', [code]);
      if (checkExist.rows.length === 0) {

        throw new ExpressError(`Can't find company with code of ${code}`, 404);
      }
  //removed const for testing dbquery directly
   //   const updateQuery = `
   //   UPDATE companies
   //   SET name = $1, description = $2
   //   WHERE code = $3
   //   RETURNING *;  
   // `;
    const updateResult = 
    await db.query
    (`UPDATE companies SET name = $1, description = $2 WHERE code = $3 RETURNING *`, [name, description, code]);

      return res.json({ company: updateResult.rows[0]});

    } catch (e) {
      return next(e);
    }
  });

  
router.delete('/:code', async (req, res, next) => {

  try {
    const { code } = req.params;
    const results = await db.query('SELECT * FROM companies WHERE code = $1', [code]);
    if(results.rows.length === 0) {
      throw new ExpressError(`Can't find the company code of ${code}`, 404);
    }
 
    const updateResults = await db.query(`DELETE FROM companies WHERE code = $1`, [code]);
    return res.send({ msg: `Deleted ${code}`});
  } catch (e) {
    return next(e)
  }
});



  module.exports = router;