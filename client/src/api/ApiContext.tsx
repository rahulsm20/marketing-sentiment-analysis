import { useAuth0 } from "@auth0/auth0-react";
import { createContext, useContext, useMemo } from "react";
import { ApiService } from "./apiService";
import { createChatApi, createSchedulerApi } from "./auth0";

const ApiContext = createContext<{
  schedulerApi: ApiService | null;
  chatApi: ApiService | null;
}>({ schedulerApi: null, chatApi: null });

/**
 * ApiProvider is a wrapper around the ApiService that provides the API Clients for the scheduler and chat services
 *
 */
export const ApiProvider = ({ children }: { children: React.ReactNode }) => {
  const { getAccessTokenSilently } = useAuth0();
  const schedulerApi = useMemo(
    () => createSchedulerApi(getAccessTokenSilently),
    [getAccessTokenSilently],
  );
  const chatApi = useMemo(
    () => createChatApi(getAccessTokenSilently),
    [getAccessTokenSilently],
  );
  return (
    <ApiContext.Provider value={{ schedulerApi, chatApi }}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => {
  const ctx = useContext(ApiContext);
  if (!ctx) throw new Error("useApi must be used within ApiProvider");
  return ctx;
};
