import { Router } from "https://deno.land/x/oak@v12.6.0/mod.ts";
import * as indexCtrl from "../controllers/index.controller.ts";

const router = new Router();

router.get("/", ({ response }) => {
  response.body = "Welcome to my API!";
});

router.post("/users", indexCtrl.createUser);
router.get("/users", indexCtrl.getUsers);
router.get("/users/:id", indexCtrl.getUserId);
router.delete("/users/:id", indexCtrl.deleteUser);
router.put("/users/:id", indexCtrl.updateUser);

export default router;
