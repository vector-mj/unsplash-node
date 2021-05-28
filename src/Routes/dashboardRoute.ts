import { Router } from "express";
import * as auth from "./../Controllers/authController";
import * as pages from './../Controllers/dashboardController';
const router:Router = Router();

router.route('/').get(auth.protect,pages.dashboard);
router.route('/wallpaper').get(auth.protect,pages.wallpapers);
router.route('/user').get(auth.protect,pages.info);
router.route('/tables').get(auth.protect,pages.tables);

module.exports = router;