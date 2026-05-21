import { env } from "../../config/env.js";
import { getPublicServices } from "../services/services.service.js";

const buildFallbackAnswer = (message, services) => {
  const lowerMessage = message.toLowerCase();
  const matchedServices = services.filter((service) =>
    [
      service.title,
      service.category,
      service.categoryLabel,
      service.shortDescription
    ]
      .join(" ")
      .toLowerCase()
      .includes(lowerMessage)
  );

  const suggestions = (matchedServices.length > 0 ? matchedServices : services)
    .slice(0, 3)
    .map(
      (service) =>
        `- ${service.title}: ${service.shortDescription} (from $${service.priceFrom})`
    )
    .join("\n");

  return `I can help with company services, solution fit, and next steps.\n\nRecommended services:\n${suggestions}\n\nIf you want, tell me your goal, timeline, and budget and I will suggest the best match.`;
};

export const getChatbotReply = async (payload) => {
  const services = await getPublicServices();
  const userMessage = payload.message?.trim() || "";

  if (!userMessage) {
    return {
      reply:
        "Tell me what you want to build, improve, or secure, and I will suggest the most relevant service."
    };
  }

  if (!env.OPENAI_API_KEY) {
    return {
      reply: buildFallbackAnswer(userMessage, services),
      mode: "fallback"
    };
  }

  const systemPrompt = `You are a customer-support assistant for a software company.\nYou help visitors understand services, answer questions, and suggest the best service.\nBase your answers on this service catalog:\n${services
    .map(
      (service) =>
        `${service.title} | ${service.categoryLabel} | ${service.shortDescription} | from $${service.priceFrom}`
    )
    .join("\n")}`;

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: env.OPENAI_MODEL,
      input: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: userMessage
        }
      ]
    })
  });

  if (!response.ok) {
    return {
      reply: buildFallbackAnswer(userMessage, services),
      mode: "fallback"
    };
  }

  const data = await response.json();
  const outputText = data.output_text || buildFallbackAnswer(userMessage, services);

  return {
    reply: outputText,
    mode: "openai"
  };
};

