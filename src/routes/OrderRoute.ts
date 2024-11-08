import express from "express";
import { jwtCheck, jwtParse } from "../middleware/auth";
import OrderController from "../controllers/OrderController";

const router = express.Router();

//router.get("/", jwtCheck, jwtParse,  OrderController.getMyOrders)

router.get("/", jwtCheck, async (req, res, next) => {
    await jwtParse(req, res, next);
    OrderController.getMyOrders(req, res, next);
});

//router.post("/checkout/create-checkout-session", jwtCheck, jwtParse, OrderController.createCheckoutSession);
router.get("/checkout/create-checkout-session", jwtCheck, async (req, res, next) => {
    await jwtParse(req, res, next);
    OrderController.createCheckoutSession(req, res, next);
});

//router.post("/checkout/webhook", OrderController.stripeWebhookHandler);
router.post("/checkout/webhook", async (req, res, next) => {
    await OrderController.stripeWebhookHandler(req, res);
    next();
  }
);

export default router;