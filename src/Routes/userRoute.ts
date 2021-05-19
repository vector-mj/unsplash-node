import { Router, Request, Response } from 'express';
import * as userController from './../Controllers/userController';
import * as authController from './../Controllers/authController';
import * as validation from './../utils/Validation';


const router: Router = Router();

router.route('/login')
.post(authController.login);

router.route('/forgotpassword').post(authController.forgotPassword);
router.route('/resetpassword/:token').get(authController.resetPassword);

router.route('/signup')
.post(
    validation.createUserValidator(),
    validation.validate,
    userController.userPost
);

router
.route('/')
.get(
    authController.protect,
    userController.getAllUser
);

router.route('/:id')
.get(userController.getUser)
.delete(
    authController.protect,
    authController.license('admin','user'),
    userController.deleteUser
)
.put(userController.updateUser);

module.exports = router;