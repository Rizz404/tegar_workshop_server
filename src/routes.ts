import express from "express";
import motorcycleBrandRouter from "./routes/motorcycle-brand-routes";
import authRouter from "./routes/auth-routes";
import workshopRouter from "./routes/workshop-routes";
import motorcyclesRouter from "./routes/user-motorcycle-routes";
import userRouter from "./routes/user-routes";
import motorcycleModelRouter from "./routes/motorcycle-model-routes";
import motorcycleServiceRouter from "./routes/motorcycle-service-routes";
import motorcycleModelYearRouter from "./routes/motorcycle-model-year-routes";
import paymentMethodRouter from "./routes/payment-method-routes";
import orderRouter from "./routes/order-routes";
import transactionRouter from "./routes/transaction-routes";
import eTicketRouter from "./routes/e-ticket-routes";
import historyRouter from "./routes/histories-routes";

const routes = express.Router();

routes.use("/auth", authRouter);
routes.use("/users", userRouter);
routes.use("/motorcycle-brands", motorcycleBrandRouter);
routes.use("/motorcycle-models", motorcycleModelRouter);
routes.use("/motorcycle-services", motorcycleServiceRouter);
routes.use("/motorcycle-model-years", motorcycleModelYearRouter);
routes.use("/user-motorcycles", motorcyclesRouter);
routes.use("/workshops", workshopRouter);
routes.use("/payment-methods", paymentMethodRouter);
routes.use("/orders", orderRouter);
routes.use("/transactions", transactionRouter);
routes.use("/histories", historyRouter);
routes.use("/e-tickets", eTicketRouter);

export default routes;
