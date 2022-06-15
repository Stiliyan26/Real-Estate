const router = require('express').Router();
const { register, login } = require('../services/user');
const mapErrors = require('../util/mappers');
const { isGuest, isUser } = require('../middleware/guards');

router.get('/register', isGuest(), (req, res) => {
    res.render('register', { title: 'Register' });
});

//TODO check form action, method, filed names
router.post('/register', isGuest(), async (req, res) => {
    try {
        if (req.body.password.trim().length == 0) {
            throw new Error('Password is required');
        }
        if (req.body.password != req.body.repass) {
            throw new Error('Passwords don\'t match');
        }

        const user = await register(req.body.name, req.body.username, req.body.password);
        req.session.user = user;
        res.redirect('/'); //TODO check redirect requirements

    } catch (err) {
        console.error(err);
        const errors = mapErrors(err);
        res.render('register', { title: 'Register', data: {name: req.body.name, username: req.body.username }, errors });
    }
});

router.get('/login', isGuest(), (req, res) => {
    res.render('login', { title: 'Login' });
});

//TODO check form action, method, field names
router.post('/login', isGuest(), async (req, res) => {
    try {
        const user = await login(req.body.username, req.body.password);
        req.session.user = user;
        res.redirect('/'); //TODO check redirect requirements

    } catch (err) {
        console.error(err);
        const errors = mapErrors(err);
        res.render('login', { title: 'Login', data: { username: req.body.username }, errors });
    }
});

router.get('/logout', isUser(), (req, res) => {
    delete req.session.user;
    res.redirect('/');
});

module.exports = router;