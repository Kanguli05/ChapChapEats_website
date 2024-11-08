import express from "express";
import RestaurantController from "../controllers/RestaurantController";
import { param } from "express-validator";

const router = express.Router();


router.get("/:restaurantId", param("restaurantId")
  .isString()
  .trim()
  .notEmpty()
  .withMessage("RestaurantId Parameter must be a valid string"),
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
     await RestaurantController.getRestaurant(req, res);
    } catch (error) {
      next(error);
    }
  }
);



// api/restaurant/search/:city
router.get("/search/:city", param("city").isString()
    .trim().notEmpty().withMessage("City must be a string"), 
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      try {
        await RestaurantController.searchRestaurant(req, res);
      } catch (error) {
        next(error);
      }
    });
    
  //RestaurantController.searchRestaurant);


export default router;