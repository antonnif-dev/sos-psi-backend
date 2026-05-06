import cron from "node-cron";
import { resetarUsoMensal } from "../repositories/uso.repository.js";

cron.schedule("0 0 1 * *", async () => {
    await resetarUsoMensal();
});