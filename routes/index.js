const { getUserStatus } = require('../controllers/user');
const { getAllOffers } = require('../controllers/offer');

module.exports = (app) => {
    app.get('/', getUserStatus, async (req, res) => {
        const isLoggedIn = req.isLoggedIn;
        if (isLoggedIn) {
            let offers = await getAllOffers();
            res.render('home', {
                'title': 'Home Page',
                isLoggedIn,
                fullName: req.userFullName,
                offers
            })
        } else {
            res.render('home', {
                'title': 'Home Page',
                isLoggedIn,
            })
        }

    })

    app.use('*', (req, res) => {
        res.render('404', {
            "title": 'Error 404'
        });
    });
}