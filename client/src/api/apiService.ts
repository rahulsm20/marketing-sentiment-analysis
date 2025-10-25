import { config } from "@/utils/config";
import { Auth0Client } from "@auth0/auth0-spa-js";
import axios, { AxiosInstance } from "axios";

export class ApiService {
  private api: AxiosInstance;
  private auth0Client: Auth0Client;

  constructor(auth0Client: Auth0Client, baseUrl: string) {
    this.auth0Client = auth0Client;

    this.api = axios.create({
      baseURL: baseUrl,
      withCredentials: true,
    });

    this.api.interceptors.request.use(
      async (config) => {
        const token = await this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  private async getToken(): Promise<string | null> {
    try {
      return await this.auth0Client.getTokenSilently({
        authorizationParams: {
          scope: "openid profile email offline_access",
          audience: config.VITE_AUTH0_AUDIENCE,
        },
      });
    } catch (error) {
      console.error("Error fetching token:", error);
      return null;
    }
  }

  async addTask(company: string, category: string) {
    const { data } = await this.api.post("/tasks", {
      company,
      category,
    });
    return data;
  }

  async getConversation(id: string) {
    const { data } = await this.api.get(`/conversation/${id}`);
    return data;
  }

  async getConversations() {
    const { data } = await this.api.get("/conversation");
    return data;
  }

  async sendMessage(conversationId: string, message: string, type: string) {
    const { data } = await this.api.post(`/conversation/${conversationId}`, {
      message,
      type,
    });
    return data;
  }
  async deleteConversation(id: string) {
    const { data } = await this.api.delete(`/conversation/${id}`);
    return data;
  }
}
