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
    const query = client.query("SELECT *,CM_NAME||' - '||CM_MOBILE||' - '||CM_ADDRESS AS CM_SEARCH FROM CUSTOMER_MASTER where cm_status = 0 order by cm_id desc");
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

router.get('/:custId', oauth.authorise(), (req, res, next) => {
  const results = [];
  const id = req.params.custId;
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Select Data
    const query = client.query('SELECT * FROM customer_master where cm_id=$1',[id]);
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
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Insert Data
    client.query('INSERT INTO customer_master( cm_code, cm_name, cm_mobile, cm_address, cm_balance, cm_debit, cm_email, cm_gst, cm_status) values($1,$2,$3,$4,$5,$6,$7,$8,0)',[req.body.cm_code,req.body.cm_name,req.body.cm_mobile,req.body.cm_address,req.body.cm_balance,req.body.cm_debit,req.body.cm_email,req.body.cm_gst]);
    // SQL Query > Select Data
    const query = client.query('SELECT * FROM customer_master');
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

router.post('/edit/:custId', oauth.authorise(), (req, res, next) => {
  const results = [];
  const id = req.params.custId;
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    client.query('BEGIN;');
    // SQL Query > Insert Data
    client.query('UPDATE customer_master SET cm_name=$1, cm_mobile=$2, cm_address=$3, cm_email=$4, cm_gst=$5 where cm_id=$6',[req.body.cm_name,req.body.cm_mobile,req.body.cm_address,req.body.cm_email,req.body.cm_gst,id]);
    // SQL Query > Select Data
    client.query('COMMIT;');
    const query = client.query('SELECT * FROM customer_master');
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

router.post('/delete/:custId', oauth.authorise(), (req, res, next) => {
  const results = [];
  const id = req.params.custId;
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }

    client.query('UPDATE customer_master SET cm_status=1 WHERE cm_id=($1)', [id]);
    // SQL Query > Insert Data
    // client.query('UPDATE customer_master SET cm_code=$1, cm_name=$2, cm_mobile=$3, cm_email=$4, cm_address=$5, cm_city=$6, cm_state=$7, cm_pin_code=$8, cm_car_name=$9, cm_car_model=$10, cm_car_number=$11 where cm_id=$12',[req.body.cm_code,req.body.cm_name,req.body.cm_mobile,req.body.cm_email,req.body.cm_address,req.body.cm_city,req.body.cm_state,req.body.cm_pin_code,req.body.cm_car_name,req.body.cm_car_model,req.body.cm_car_number,id]);
    // SQL Query > Select Data
    const query = client.query('SELECT * FROM customer_master');
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

router.get('/details/:vmId', oauth.authorise(), (req, res, next) => {
  const results = [];
  const id = req.params.vmId;
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    const querystr =  "(select sm.sm_invoice_no as invoice,sm.sm_date as date,sm.sm_amount as debit,0 as credit,'Invoice' as type, '1' as num from sale_master sm LEFT OUTER JOIN customer_master vm on sm.sm_cm_id=vm.cm_id where sm.sm_status=0 and vm.cm_id = $1) UNION "+
                      "(select ''||em.em_id as invoice,em.em_date as date,em.em_amount as debit,em.em_credit as credit,'Cashbook' as type, '2' as num from expense_master em LEFT OUTER JOIN customer_master vm on em.em_cm_id=vm.cm_id where vm.cm_id = $2) order by date,num asc";
    const query = client.query(querystr,[id,id]);
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

router.get('/code/no', oauth.authorise(), (req, res, next) => {
  const results = [];
  pool.connect(function(err, client, done){
    if(err) {
      done();
      // pg.end();
      console.log("the error is"+err);
      return res.status(500).json({success: false, data: err});
    }
    const query = client.query("SELECT * from customer_master where cm_status=0 order by cm_id desc limit 1;");
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
