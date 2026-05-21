import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware.js";
import { authorizeRoles } from "../../middleware/role.middleware.js";
import {
  getAdminDashboard,
  getContactsByRole,
  getClientDashboard,
  getMyProfile
} from "./users.controller.js";

const router = Router();

router.use(authenticate);

router.get("/me", getMyProfile);
router.get("/contacts/:role", getContactsByRole);
router.get("/admin/dashboard", authorizeRoles("admin"), getAdminDashboard);
router.get("/client/dashboard", authorizeRoles("client"), getClientDashboard);

export default router;
