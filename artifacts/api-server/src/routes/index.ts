import { Router, type IRouter } from "express";
import healthRouter from "./health";
import productsRouter from "./products";
import ordersRouter from "./orders";
import paymentsRouter from "./payments";
import emailRouter from "./email";
import adminRouter from "./admin";
import pricesRouter from "./prices";

const router: IRouter = Router();

router.use(healthRouter);
router.use(productsRouter);
router.use(ordersRouter);
router.use(paymentsRouter);
router.use(emailRouter);
router.use(adminRouter);
router.use(pricesRouter);

export default router;
