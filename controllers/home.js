const { isUser } = require('../middleware/guards');
const preload = require('../middleware/preload');
const { getAllHouses, getHousesByType } = require('../services/post');
const router = require('express').Router();

router.get('/', async (req, res) => {
    const houses = await getAllHouses();
    res.render('home', { title: 'Home page', houses });
});

router.get('/catalog', async (req, res) => {
    const houses = await getAllHouses();
    res.render('catalog', { title: 'Catalog', houses });
});

router.get('/catalog/:id', preload(true), (req, res) => {
    const house = res.locals.house;
    house.availablePices = house.avPieces - house.rentedHome.length;
    house.retersList = house.rentedHome.map(u => u.name).join(', ');

    if (req.session.user) {
        house.hasUser = true;
        house.isOwner = req.session.user._id == house.owner._id;
        if (house.rentedHome.some(u => u._id == req.session.user._id)) {
            house.hasRented = true;
        }
    }
    res.render('details', { title: house.name });
});

router.get('/search', isUser(), async (req, res) => {
    const searched = false;
    res.render('search', { title: 'Search'}, searched);
});

router.post('/search', isUser(), async (req, res) => {
    houses = await getHousesByType(req.body.search);
    const searched = true;
    res.render('search', { title: 'Search', houses, searched });
});



module.exports = router;