import { Router } from 'express';
import * as viewPage from './../Controllers/pageController';
import * as auth from './../Controllers/authController';
const router: Router = Router();

router.route('/').get(viewPage.index);
router.route('/register').get(viewPage.register);
router.route('/login').get(viewPage.login);

module.exports = router
