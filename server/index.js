var express = require('express');
var app = express();
var router = express.Router();
var http = require('http').Server(app);
var mongoose = require('mongoose');
var cors = require('cors');
var bodyParser = require('body-parser');


var port = process.env.port || 9000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use('/v1', router);

mongoose.connect('mongodb://localhost/shopDirectoryDB');

var shopSchema = {
    name: String,
    floor: String,
    unit: String
};

var Shop = mongoose.model('Shop', shopSchema, 'shops'); // Lookup shops collections

router.param('id', function(req, res, next, id) {
    try {
        mongoose.Types.ObjectId(id); // If this is succesful, the id is valid. If it is not, it will be caught
        next();

    } catch (e) {
        res.send('Error: Invalid id');
        // res.status(401);
        res.end;
    }
})

// GET all shops
router.get('/shops', function(req, res) {
    Shop.find(function(err, shops) {
        res.statusCode = 200;
        res.send(shops);
        res.end();
    })
})

// POST new shop
router.post('/shop', function(req, res) {
    console.log(req.body.name);

    var shop = new Shop({
        name: req.body.name,
        floor: req.body.floor,
        unit: req.body.unit
    });

    shop.save(function(err, shop) {
        if (err) {
            // Handle error
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
    Shop.remove({
        _id: req.params.id
    }, function(err, body) {
        if (err) {
            // Handle error

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

    Shop.findOneAndUpdate({
        '_id': req.params.id
    }, {
        $set: req.body
    }, function(err, shop) {
        if (err) {
            // Handle Error
            console.log(err);
        } else {
            console.log('Patching');
            res.statusCode = 200;
            res.send(shop);
            res.end();
        }
    })
})

router.post('/shop/sync', function(req, res) {
    // We assume it is not allowed to have two shops with the same name
    console.log('Request received');
    var newShop = {
        name: req.body.name,
        floor: req.body.floor,
        unit: req.body.unit
    };

    Shop.findOneAndUpdate({
        'name': req.body.name
    }, {
        $set: newShop
    }, function(err, obj) {
        //console.log(obj);
        if (err) {
            // Handle err
        } else if (!obj) {
            console.log('Adding new record');

            var shop = new Shop(newShop);
            shop.save(function(err, shop) {
                if (err) {
                    // Handle error
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
