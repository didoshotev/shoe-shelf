const { registerUser, verifyUser, guestAccess } = require('../controllers/user');


module.exports = (app) => {
    app.get('/login', guestAccess, (req, res) => {
        res.render('login', {
            'title': "Login"
        })
    });

    app.post('/login', async (req, res) => {
        const verifyStatus = await verifyUser(req, res);
        if (verifyStatus.status === false) {
            res.redirect('/login?error=true');
        } else {
            res.redirect('/');
        }
    });


    app.get('/register', guestAccess, (req, res) => {
        res.render('register', {
            'title': 'Register Page'
        })
    });

    app.post('/register', async (req, res) => {
        const { email, fullName, password, rePassword } = req.body;
        try {
            if (email.length < 3) {
                throw new TypeError('Please provide valid credentials');
            } else if (password.length < 3) {
                throw new TypeError('Please provide valid credentials');
            } else if (password !== rePassword) {
                throw new TypeError('Please provide valid credentials');
            }
            const statusObj = await registerUser(req, res);
            if (statusObj.status === false) {
                throw new TypeError('Please provide valid credentials')
            }
        } catch (err) {
            res.status(400);
            res.redirect('/register?error=true');
            return
        };

        res.redirect('/')
    });


}