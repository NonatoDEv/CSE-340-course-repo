import bcrypt from 'bcrypt';
import { createUser } from '../models/users.js';
import { authenticateUser } from '../models/users.js';

const showUserRegistrationForm = (req,res) =>{
    res.render('register', { title: 'Registration' });
};

const processUserRegistrationForm = async (req, res) => {
    const {name, email, password} = req.body;
    try{
        //hash the password before storing it
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Create the user in the database
        await createUser(name, email, passwordHash);

        //redirect to the Home page after successful registration
        req.flash('success', 'Registration successful! Please log in.');
        res.redirect('/');

    }
    catch (error) {
        console.error('Error during user registration:', error);
        req.flash('error', 'An error occurred during registration. Please try again.');
        res.redirect('/register');
    }
};

const showLoginForm = async(req, res) =>{
    res.render('login', { title: 'Login' });
}

const processLoginForm = async(req, res) =>{
    const {email, password} = req.body;

    try{
        const authUser = await authenticateUser(email, password);
        if(authUser){
            req.session.user = authUser;
            req.flash('success', 'Login successful!');
            if(res.locals.NIDE_ENV === 'development'){
                console.log('User logged in:', authUser);
            }
            res.redirect('/dashboard');
        }
        else{
            req.flash('error', 'Invalid email or password.');
            res.redirect('/login');
        }
    }
    catch(error) {
        console.error('Error during user login:', error);
        req.flash('error', 'An error occurred during login. Please try again.');
        res.redirect('/login');
    }
}

const processLogout = (req, res) => {
   if (req.session.user) {
        delete req.session.user;
    }

    req.flash('success', 'Logout successful!');
    res.redirect('/login');
};

const showDashboard = (req, res) => {
    const user = req.session.user;
    res.render( 'dashboard', {
        title: 'Dashboard',
        name: user.name,
        email: user.email 
        });
}

const requireRole = (role) => {
    return (req, res, next) => {
        if (!req.session || !req.session.user) {
            req.flash('error', 'You must be logged in to access that page.');
            return res.redirect('/login');
        }
         if (req.session.user.role_name !== role) {
            req.flash('error', 'You do not have permission to access that page.');
            return res.redirect('/');
         }
         next();
    };
};
export { showUserRegistrationForm, processUserRegistrationForm, showLoginForm, processLoginForm, processLogout, showDashboard, requireRole };