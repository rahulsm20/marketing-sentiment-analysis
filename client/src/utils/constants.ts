export const auth0ClientID = import.meta.env.VITE_AUTH0_CLIENT_ID;
export const auth0ClientDomain = import.meta.env.VITE_AUTH0_DOMAIN;
export const clientUrl = import.meta.env.VITE_CLIENT_URL;
export const serverUrl = import.meta.env.VITE_SERVER_URL;

export const LOCAL_CACHE_KEYS = {
  PRODUCT_DATA: (company: string, category: string) =>
    `productData?${company}&category=${category}`,
  STRATEGIES: (company: string, category: string) =>
    `strategies?${company}&category=${category}`,
  SENTIMENTS: (company: string, category: string) =>
    `sentiments?${company}&category=${category}`,
  CONVERSATIONS: "conversations",
  CONVERSATION: (id: string) => `conversation?${id}`,
};
