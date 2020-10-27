const { getUserStatus, authAccess } = require('../controllers/user');
const { saveOffer, getOfferById, findOneAndUpdate, deleteByID, buyOffer } = require('../controllers/offer');

module.exports = (app) => {
    app.get('/createOffer', authAccess, getUserStatus, (req, res) => {
        res.render('create', {
            'title': 'Create Offer',
            isLoggedIn: req.isLoggedIn
        });
    });

    app.post('/createOffer', getUserStatus, async (req, res) => {
        const { name, imageUrl, description, brand } = req.body;
        let price = req.body.price;

        if (name === "" || price === "" || isNaN(price) === true || imageUrl === "" || description === "" || brand === "") {
            res.redirect('/createOffer?error=true');
            console.log('ERROR');
            return
        }
        const creatorName = req.userFullName;
        await saveOffer({ name, price, imageUrl, brand, description, creatorName });
        res.redirect('/')
    });

    app.get('/details/:id', authAccess, getUserStatus, async (req, res) => {
        const offerID = req.params.id;
        const currentOffer = await getOfferById(offerID);
        const isCreator = currentOffer.creatorName === req.userFullName
        const isBought = currentOffer.buyers.map(el => {
            if (el === currentOffer.creatorName) {
                return true
            } else {
                return false
            }
        }).join('');

        res.render('details', {
            isLoggedIn: req.isLoggedIn,
            currentOffer,
            isCreator,
            isBought,
            fullName: req.userFullName
        })

    });

    app.get('/edit/:id', authAccess, getUserStatus, async (req, res) => {
        const offerID = req.params.id;
        const currentOffer = await getOfferById(offerID);

        res.render('edit', {
            'title': 'Edit',
            isLoggedIn: req.isLoggedIn,
            currentOffer,
            fullName: req.userFullName

        })
    });

    app.post('/edit/:id', authAccess, async (req, res) => {

        const offerID = req.params.id;
        const { name, imageUrl, description, brand } = req.body;
        let price = req.body.price.substring(1, req.body.price.length)
        if (name === "" || price === "" || isNaN(price) === true || imageUrl === "" || description === "" || brand === "") {
            res.redirect(`/edit/${offerID}?error=true`);
            console.log('ERROR');
            return
        }
        await findOneAndUpdate(offerID, { name, price, imageUrl, description, brand });
        res.redirect(`/details/${offerID}`);
    });

    app.get('/delete/:id', async (req, res) => {
        const offerID = req.params.id;
        const deleteStatus = await deleteByID(offerID);
        if (deleteStatus.n === 1) {
            res.redirect('/')
        } else {
            res.redirect(`/details/${offerID}?error=true`)
        }
    });

    app.get('/buy/:id', getUserStatus, async (req, res) => {
        const offerID = req.params.id;
        const currentUser = req.userFullName;
        const currentOffer = await getOfferById(offerID);
        if (!currentOffer.buyers.includes(currentUser)) {
            currentOffer.buyers.push(currentUser);
            const status = await buyOffer(offerID, {
                buyers: currentOffer.buyers
            });
            console.log(status);
            res.redirect('/')
        };

    });

};
