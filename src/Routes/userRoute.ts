import { Router, Request, Response } from 'express';
import * as userController from './../Controllers/userController';
import * as validation from './../utils/Validation';


const router: Router = Router();
router
.route('/')
.post(
    validation.createUserValidator(),
    validation.validate,
    userController.userPost)
.get(userController.getAllUser);

router.route('/:id')
.get(userController.getUser)
.delete(userController.deleteUser)
.put(userController.updateUser);

module.exports = router;