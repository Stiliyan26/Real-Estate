const router = require('express').Router();
const mapErrors = require('../util/mappers');
const { isUser, isOwner } = require('../middleware/guards');
const preload = require('../middleware/preload');
const { createHousing, updateHouse, deleteById, rentsHouseAction } = require('../services/post');

router.get('/create', isUser(), (req, res) => {
    res.render('create', { title: 'Create' });
});

router.post('/create', isUser(), async (req, res) => {
    const userId = req.session.user._id;

    const house = {
        name: req.body.name,
        type: req.body.type,
        year: req.body.year,
        city: req.body.city,
        image: req.body.image,
        description: req.body.description,
        avPieces: req.body.avPieces,
        owner: userId
    };

    try {
        await createHousing(house);
        res.redirect('/catalog');
    } catch (err) {
        console.error(err);
        const errors = mapErrors(err);
        res.render('create', { title: 'Create', data: house, errors });
    }
});

router.get('/edit/:id', preload(false), isOwner(), (req, res) => {
    const house = res.locals.house;
    res.render('edit', { title: `Edit ${house.name}` });
});

router.post('/edit/:id', preload(false), isOwner(), async (req, res) => {
    const name = res.locals.house.name;
    const id = req.params.id;

    const house = {
        name: req.body.name,
        type: req.body.type,
        year: req.body.year,
        city: req.body.city,
        image: req.body.image,
        description: req.body.description,
        avPieces: req.body.avPieces,
    };


    try {
        await updateHouse(id, house);
        res.redirect(`/catalog/${id}`);
    } catch (err) {
        console.error(err);
        const errors = mapErrors(err);
        house._id = id;
        res.render('edit', { title: `Edit ${name}`, house, errors });
    }
});

router.get('/delete/:id', preload(false), isOwner(), async (req, res) => {
    await deleteById(req.params.id);
    res.redirect('/catalog');
});

router.get('/rent/:id', isUser(), async (req, res) => {
    const houseId = req.params.id;
    const userId = req.session.user._id;

    try {
        await rentsHouseAction(userId, houseId);
    } catch (err) {
        console.error(err);
    } finally {
        res.redirect(`/catalog/${houseId}`);
    }
});

module.exports = router;