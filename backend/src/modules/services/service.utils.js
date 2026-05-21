export const serviceCategoryLabels = {
  web: "Web Development",
  mobile: "Mobile Apps",
  ai: "AI Solutions",
  cybersecurity: "Cybersecurity"
};

export const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const sanitizeService = (service) => ({
  id: service._id?.toString() || service.id,
  title: service.title,
  slug: service.slug,
  category: service.category,
  categoryLabel: serviceCategoryLabels[service.category],
  shortDescription: service.shortDescription,
  fullDescription: service.fullDescription,
  priceFrom: service.priceFrom,
  deliveryEstimate: service.deliveryEstimate,
  featured: service.featured,
  isActive: service.isActive,
  createdAt: service.createdAt,
  updatedAt: service.updatedAt
});

