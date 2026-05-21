export const sanitizeProjectRequest = (request) => ({
  id: request._id?.toString() || request.id,
  projectName: request.projectName,
  companyName: request.companyName,
  budget: request.budget,
  timeline: request.timeline,
  goals: request.goals,
  notes: request.notes,
  status: request.status,
  adminDecisionNote: request.adminDecisionNote,
  client: request.clientId
    ? {
        id: request.clientId._id?.toString() || request.clientId.id,
        name: request.clientId.name,
        email: request.clientId.email
      }
    : null,
  service: request.serviceId
    ? {
        id: request.serviceId._id?.toString() || request.serviceId.id,
        title: request.serviceId.title,
        slug: request.serviceId.slug,
        category: request.serviceId.category
      }
    : null,
  createdAt: request.createdAt,
  updatedAt: request.updatedAt
});

