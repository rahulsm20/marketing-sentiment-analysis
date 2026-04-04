import { useAuth0 } from "@auth0/auth0-react";
import { createContext, useContext, useMemo } from "react";
import { ApiService } from "./apiService";
import { createSchedulerApi } from "./auth0";

const ApiContext = createContext<ApiService | null>(null);

export const ApiProvider = ({ children }: { children: React.ReactNode }) => {
  const { getAccessTokenSilently } = useAuth0();
  const schedulerApi = useMemo(
    () => createSchedulerApi(getAccessTokenSilently),
    [getAccessTokenSilently]
  );
  return <ApiContext.Provider value={schedulerApi}>{children}</ApiContext.Provider>;
};

export const useApi = () => {
  const ctx = useContext(ApiContext);
  if (!ctx) throw new Error("useApi must be used within ApiProvider");
  return ctx;
};