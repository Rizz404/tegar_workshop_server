import express from "express";
import carBrandRouter from "./routes/car-brand-routes";
import authRouter from "./routes/auth-routes";
import workshopRouter from "./routes/workshop-routes";
import carsRouter from "./routes/user-car-routes";
import userRouter from "./routes/user-routes";
import carModelRouter from "./routes/car-model-routes";
import carServiceRouter from "./routes/car-service-routes";
import colorRouter from "./routes/color-routes";
import carModelYearRouter from "./routes/car-model-year-routes";
import paymentMethodRouter from "./routes/payment-method-routes";
import orderRouter from "./routes/order-routes";
import transactionRouter from "./routes/transaction-routes";
import eTicketRouter from "./routes/e-ticket-routes";
import carModelYearColorRouter from "./routes/car-model-year-color-routes";
import historyRouter from "./routes/histories-routes";

const routes = express.Router();

routes.use("/auth", authRouter);
routes.use("/users", userRouter);
routes.use("/car-brands", carBrandRouter);
routes.use("/car-models", carModelRouter);
routes.use("/car-services", carServiceRouter);
routes.use("/colors", colorRouter);
routes.use("/car-model-years", carModelYearRouter);
routes.use("/car-model-year-colors", carModelYearColorRouter);
routes.use("/user-cars", carsRouter);
routes.use("/workshops", workshopRouter);
routes.use("/payment-methods", paymentMethodRouter);
routes.use("/orders", orderRouter);
routes.use("/transactions", transactionRouter);
routes.use("/histories", historyRouter);
routes.use("/e-tickets", eTicketRouter);

export default routes;
