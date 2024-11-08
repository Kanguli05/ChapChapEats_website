import express from "express";
import multer from "multer";
import MyRestaurantController from "../controllers/MyRestaurantController";
import { jwtCheck, jwtParse } from "../middleware/auth";
import { validateMyRestaurantRequest } from "../middleware/validation";
import { Request, Response, NextFunction } from "express";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB
    }
});

//router.get("/order", jwtCheck, jwtParse, MyRestaurantController.getMyRestaurantOrders);
router.get("/order", jwtCheck, async (req, res, next) => {
    await jwtParse(req, res, next);
    MyRestaurantController.getMyRestaurantOrders(req, res);
});

//router.patch("/order/:orderId/status", jwtCheck, jwtParse, MyRestaurantController.updateOrderStatus);
router.patch("/order/:orderId/status", jwtCheck, async (req, res, next) => {
    await jwtParse(req, res, next);
    MyRestaurantController.updateOrderStatus(req, res);
});

//router.get("/", jwtCheck, jwtParse, MyRestaurantController.getMyRestaurant);
router.get("/", jwtCheck, async (req, res, next) => {
    await jwtParse(req, res, next);
    MyRestaurantController.getMyRestaurant(req, res);
});


// /api/my/restaurant
//router.post("/", upload.single("imageFile"), MyRestaurantController.createMyRestaurant);
router.post("/", jwtCheck , 

    async (req, res, next) => {
    await jwtParse(req, res, next);
    upload.single("imageFile")(req, res, next);
    next();
    }, 
    (req, res, next) => {
        validateMyRestaurantRequest.forEach(validation => validation(req, res, next));
        next();
        } ,
    
    async (req, res, next) => {
    try {
        await MyRestaurantController.createMyRestaurant(req, res);
    } catch (error) {
        next(error);
    }
    
});

//router.put("/", jwtCheck, jwtParse, upload.single("imageFile"), validateMyRestaurantRequest, MyRestaurantController.updateMyRestaurant ); 
//router.put("/", jwtCheck, jwtParse, upload.single("imageFile"), validateMyRestaurantRequest, MyRestaurantController.updateMyRestaurant);
router.put("/", jwtCheck, async (req, res, next) => {
    await jwtParse(req, res, next);
    upload.single("imageFile")(req, res, next);
    validateMyRestaurantRequest.forEach(validation => validation(req, res, next));
    MyRestaurantController.updateMyRestaurant(req, res, next);
});


export default router;