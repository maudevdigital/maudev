import { Router, type IRouter } from "express";
import healthRouter from "./health";
import productsRouter from "./products";
import ordersRouter from "./orders";
import paymentsRouter from "./payments";
import emailRouter from "./email";
import adminRouter from "./admin";
import pricesRouter from "./prices";
import storageRouter from "./storage";
import uploadsRouter from "./uploads";
import campaignsRouter from "./campaigns";
import blogRouter from "./blog";

const router: IRouter = Router();

router.use(healthRouter);
router.use(productsRouter);
router.use(ordersRouter);
router.use(paymentsRouter);
router.use(emailRouter);
router.use(adminRouter);
router.use(pricesRouter);
router.use(storageRouter);
router.use(uploadsRouter);
router.use(campaignsRouter);
router.use(blogRouter);

export default router;
