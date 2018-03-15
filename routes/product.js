var express = require('express');
var router = express.Router();
var oauth = require('../oauth/index');
var pg = require('pg');
var path = require('path');
var config = require('../config.js');

var pool = new pg.Pool(config);

router.get('/', oauth.authorise(), (req, res, next) => {
  const results = [];
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    const query = client.query("SELECT * FROM product_master pm LEFT OUTER JOIN category_master ctm on pm.pm_ctm_id = ctm.ctm_id where pm_status = 0 order by pm_id desc");
    query.on('row', (row) => {
      results.push(row);
    });
    query.on('end', () => {
      done();
      // pg.end();
      return res.json(results);
    });
    done(err);
  });
});

router.get('/:productId', oauth.authorise(), (req, res, next) => {
  const results = [];
  const id = req.params.productId;
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Select Data
    const query = client.query('SELECT * FROM product_master pm LEFT OUTER JOIN category_master ctm on pm.pm_ctm_id = ctm.ctm_id where pm.pm_status=0 and pm.pm_id=$1',[id]);
    query.on('row', (row) => {
      results.push(row);
    });
    query.on('end', () => {
      done();
      // pg.end();
      return res.json(results);
    });
    done(err);
  });
});

router.post('/add', oauth.authorise(), (req, res, next) => {
  const results = [];

  const product = req.body;
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Insert Data
    client.query('INSERT INTO product_master(pm_description, pm_ctm_id, pm_rate, pm_status) values($1,$2,$3,0)',[product.pm_description,product.pm_ctm_id.ctm_id,product.pm_rate]);
    
	// SQL Query > Select Data
    const query = client.query('SELECT * FROM product_master');
    query.on('row', (row) => {
      results.push(row);
    });
    query.on('end', () => {
      done();
      // pg.end();
      return res.json(results);
    });
    done(err);
  });
});

router.post('/edit/:productId', oauth.authorise(), (req, res, next) => {
  const results = [];
  const id = req.params.productId;
  const product = req.body;

  pool.connect(function (err, client, done){
    if(err) {
      done();
      pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    client.query('BEGIN;');
    // SQL Query > Insert Data
    client.query('UPDATE product_master SET pm_description=$1, pm_ctm_id=$2, pm_rate=$3 where pm_id=$4',[product.pm_description,product.pm_ctm.ctm_id,product.pm_rate,id]);
    // SQL Query > Select Data
    client.query('COMMIT;');
    const query = client.query('SELECT * FROM product_master');
    query.on('row', (row) => {
      results.push(row);
    });
    query.on('end', () => {
      done();
      // pg.end();
      return res.json(results);
    });
    done(err);
  });
});

router.post('/delete/:productId', oauth.authorise(), (req, res, next) => {
  const results = [];
  const id = req.params.productId;
  pool.connect(function (err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }

    client.query('UPDATE product_master SET pm_status=1 WHERE pm_id=($1)', [id]);
    // SQL Query > Select Data
    const query = client.query('SELECT * FROM product_master');
    query.on('row', (row) => {
      results.push(row);
    });
    query.on('end', () => {
      done();
      // pg.end();
      return res.json(results);
    });
    done(err);
  });
});

module.exports = router;
