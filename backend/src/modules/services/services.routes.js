import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware.js";
import { authorizeRoles } from "../../middleware/role.middleware.js";
import {
  createAdminService,
  deleteAdminService,
  getServiceBySlug,
  listAdminServices,
  listServices,
  updateAdminService
} from "./services.controller.js";

const router = Router();

router.get("/admin/all", authenticate, authorizeRoles("admin"), listAdminServices);
router.get("/", listServices);
router.get("/:slug", getServiceBySlug);
router.post("/", authenticate, authorizeRoles("admin"), createAdminService);
router.patch("/:id", authenticate, authorizeRoles("admin"), updateAdminService);
router.delete("/:id", authenticate, authorizeRoles("admin"), deleteAdminService);

export default router;
