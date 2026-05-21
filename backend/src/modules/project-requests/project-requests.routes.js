import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware.js";
import { authorizeRoles } from "../../middleware/role.middleware.js";
import {
  createClientProjectRequest,
  listAdminProjectRequests,
  listMyProjectRequests,
  updateAdminProjectRequestStatus
} from "./project-requests.controller.js";

const router = Router();

router.post("/", authenticate, authorizeRoles("client"), createClientProjectRequest);
router.get("/my", authenticate, authorizeRoles("client"), listMyProjectRequests);
router.get("/admin/all", authenticate, authorizeRoles("admin"), listAdminProjectRequests);
router.patch(
  "/:id/status",
  authenticate,
  authorizeRoles("admin"),
  updateAdminProjectRequestStatus
);

export default router;

