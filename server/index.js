var express = require('express');
var app = express();
var router = express.Router();
var http = require('http').Server(app);
var cors = require('cors');
var bodyParser = require('body-parser');
var db = require('./mongoose.js');
var port = process.env.port || 9000;


/***********************  Middleware  *********************/

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true }));
app.use('/v1', router);

/*********************************************************/


// Check the validity of the id for all request
router.param('id', function(req, res, next, id) {
    try {
        db.checkValidity(id);
        next();

    } catch (e) {
        res.send('Error: Invalid id');
        // res.status(401);
        res.end;
    }
})

// GET all shops
router.get('/shops', function(req, res) {
    db.Shop.find(function(err, shops) {
        res.statusCode = 200;
        res.send(shops);
        res.end();
    })
})

// Flush the data
router.get('/flush', function(req,res) {
    db.Shop.remove({}, function(err,obj) {
        if (err) {
            next(err);
        } else {
            console.log('FLushed');
            res.statusCode = 200;
            res.end();
        }
    })
})

// POST new shop
router.post('/shop', function(req, res) {
    console.log(req.body.name);

    var shop = new db.Shop({
        name: req.body.name,
        floor: req.body.floor,
        unit: req.body.unit
    });

    shop.save(function(err, shop) {
        if (err) {
            next(err);
        } else {
            res.statusCode = 200;
            res.send(shop);
            res.end();
        }
    })
})

// DELETE shop
router.delete('/shop/:id', function(req, res) {
    console.log(req.params.id);
    db.Shop.remove({
        _id: req.params.id
    }, function(err, body) {
        if (err) {
            next(err);

        } else {
            res.statusCode = 200;
            res.send(body);
            res.send();
        }
    })
});

// PATCH edit shops
router.patch('/shop/:id', function(req, res) {
    console.log(req.body);

    if (req.body._id) {
        delete req.body._id;
    }

    var newShop = {
        name: req.body.name,
        floor: req.body.floor,
        unit: req.body.unit
    }

    db.Shop.findOneAndUpdate({
        '_id': req.params.id
    }, {
        $set: newShop
    }, function(err, shop) {
        if (err) {
            next(err);
        } else {
            console.log('Patching');
            res.statusCode = 200;
            res.send(shop);
            res.end();
        }
    })
})

// Sync the data for importing
router.post('/shop/sync/', function(req, res) {
    // We assume it is not allowed to have two shops with the same name
    // console.log('Request received with flush= ' + req.params.flush);
    var newShop = {
        name: req.body.name,
        floor: req.body.floor,
        unit: req.body.unit
    };

    db.Shop.findOneAndUpdate({
        'name': req.body.name
    }, {
        $set: newShop
    }, function(err, obj) {
        //console.log(obj);
        if (err) {
            next(err);
        } else if (!obj) {
            console.log('Adding new record');

            var shop = new db.Shop(newShop);
            shop.save(function(err, shop) {
                if (err) {
                    next(err);
                } else {
                    res.statusCode = 200;
                    res.send(shop);
                    res.end();
                }
            })
        }


    })
})


http.listen(port, '0.0.0.0');
http.on('listening', function() {
    console.log('Listening on port ' + port);
})
