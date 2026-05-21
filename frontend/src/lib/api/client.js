const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const apiRequest = async (
  path,
  { method = "GET", body, token } = {}
) => {
  const headers = {};

  if (body) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store"
  });

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const error = new Error(
      typeof data === "string" ? data : data?.message || "Request failed."
    );

    error.status = response.status;
    error.data = data;

    throw error;
  }

  return data;
};

