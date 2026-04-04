import axios, { AxiosInstance } from "axios";

type GetTokenFn = () => Promise<string>;

export class ApiService {
  private api: AxiosInstance;

  constructor(getToken: GetTokenFn, baseUrl: string) {
    this.api = axios.create({
      baseURL: baseUrl,
      withCredentials: true,
    });

    this.api.interceptors.request.use(
      async (requestConfig) => {
        try {
          const token = await getToken();
          if (token) {
            requestConfig.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.error("Error fetching token:", error);
        }
        return requestConfig;
      },
      (error) => Promise.reject(error),
    );
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
