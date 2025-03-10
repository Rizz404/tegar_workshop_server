import app from "@/index";
import serverless from "serverless-http";

// * Intinya biar serverless lah
export const handler = serverless(app);
