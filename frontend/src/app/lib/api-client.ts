// lib/api-client.ts
const API_URL =
  `${process.env.NEXT_PUBLIC_API_URL}:${process.env.NEXT_PUBLIC_API_PORT}` ||
  "http://localhost:4000";

class ApiClient {
  private readonly baseUrl: string;

  constructor(baseUrl: string = API_URL) {
    this.baseUrl = baseUrl;
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const headers = {
      "Content-Type": "application/json",
      "Origin": "http://localhost:3000",
      ...options.headers,
    };

    // const token = localStorage.getItem("token");
    // if (token) {
    //   headers["Authorization"] = `Bearer ${token}`;
    // }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    // if (!response.ok) {
    //   // const error = await response.json().catch(() => ({
    //   //   message: `HTTP ${response.status}`,
    //   // }));
    //   // throw new Error(error.message || "Request failed");
    //   throw new Error("Request failed");
    // }

    return (await response.json()) as T;
  }

  get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  // post<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
  //   return this.request<T>(endpoint, {
  //     ...options,
  //     method: "POST",
  //     body: data ? JSON.stringify(data) : undefined,
  //   });
  // }

  // аналогично put, patch, delete
}

export const apiClient = new ApiClient();
