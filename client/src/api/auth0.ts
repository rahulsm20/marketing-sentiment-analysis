import { ApiService } from "./apiService.ts";

export const createSchedulerApi = (
  getAccessTokenSilently: () => Promise<string>,
) => {
  const service = new ApiService(
    getAccessTokenSilently,
    import.meta.env.VITE_SCHEDULER_SERVICE_URL,
  );
  return service;
};
export const createChatApi = (getAccessTokenSilently: () => Promise<string>) =>
  new ApiService(getAccessTokenSilently, import.meta.env.VITE_CHAT_SERVICE_URL);
