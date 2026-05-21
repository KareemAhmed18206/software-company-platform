import { asyncHandler } from "../../utils/async-handler.js";
import { User } from "../../models/User.js";
import {
  getClientRequestMetrics,
  getProjectRequestMetrics
} from "../project-requests/project-requests.service.js";
import { getServiceMetrics } from "../services/services.service.js";

export const getMyProfile = asyncHandler(async (req, res) => {
  res.status(200).json({
    user: req.user
  });
});

export const getContactsByRole = asyncHandler(async (req, res) => {
  const allowedRoles = new Set(["admin", "client"]);
  const role = req.params.role;

  if (!allowedRoles.has(role)) {
    res.status(400).json({
      message: "Role must be admin or client."
    });
    return;
  }

  const contacts = await User.find({
    role,
    _id: { $ne: req.user.id }
  })
    .select("name email role")
    .sort({ createdAt: 1 })
    .lean();

  res.status(200).json({
    contacts: contacts.map((contact) => ({
      id: contact._id.toString(),
      name: contact.name,
      email: contact.email,
      role: contact.role
    }))
  });
});

export const getAdminDashboard = asyncHandler(async (req, res) => {
  const [
    totalClients,
    { totalActiveServices },
    { pendingRequests, acceptedRequests, rejectedRequests }
  ] = await Promise.all([
    User.countDocuments({ role: "client" }),
    getServiceMetrics(),
    getProjectRequestMetrics()
  ]);

  res.status(200).json({
    message: "Admin dashboard data loaded successfully.",
    stats: {
      totalClients,
      totalActiveServices,
      pendingRequests,
      acceptedRequests,
      rejectedRequests,
      activeProjects: 8,
      unreadMessages: 5
    },
    user: req.user
  });
});

export const getClientDashboard = asyncHandler(async (req, res) => {
  const [
    { totalActiveServices },
    { pendingRequests, acceptedRequests, rejectedRequests }
  ] = await Promise.all([
    getServiceMetrics(),
    getClientRequestMetrics(req.user)
  ]);

  res.status(200).json({
    message: "Client dashboard data loaded successfully.",
    overview: {
      availableServices: totalActiveServices,
      pendingRequests,
      acceptedRequests,
      rejectedRequests,
      activeProjects: 2,
      pendingInvoices: 1,
      unreadMessages: 3
    },
    user: req.user
  });
});
