import { Router,Request,Response } from 'express';
import * as userController from './../Controllers/userController';
import * as validation from './../utils/Validation';


const router: Router = Router();
router
    .route('/')
    .post(
        validation.createUserValidator(),
          validation.validate,
          userController.userPost);

// router
// .route('/:id')
// .get(userController)
// .put(userController)
// .delete(userController);

module.exports = router;