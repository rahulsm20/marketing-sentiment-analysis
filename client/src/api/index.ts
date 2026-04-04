import { updateHistory } from "@/utils";
import { LOCAL_CACHE_KEYS, serverUrl } from "@/utils/constants";
import axios from "axios";
import { ApiService } from "./apiService";

export const api = axios.create({
  baseURL: serverUrl,
});

export const generateStrategies = async (schedulerApi: ApiService, company: string, category: string) => {
  let productData, data;

  const cachedStrategies = LOCAL_CACHE_KEYS.STRATEGIES(company, category);

  if (localStorage.getItem(cachedStrategies)) {
    data = JSON.parse(localStorage.getItem(cachedStrategies) as string);

    productData = JSON.parse(
      localStorage.getItem(
        LOCAL_CACHE_KEYS.PRODUCT_DATA(company, category)
      ) as string
    );
    // console.log({ key: LOCAL_CACHE_KEYS.PRODUCT_DATA(company, category) });
    if (productData && productData.length === 0) {
      localStorage.removeItem(LOCAL_CACHE_KEYS.PRODUCT_DATA(company, category));
    }

    return { data, productData };
  } else if (
    !localStorage.getItem(LOCAL_CACHE_KEYS.PRODUCT_DATA(company, category))
  ) {
    updateHistory(company, category);

    await schedulerApi.addTask(company, category);

    const { data } = await api.get(
      `/scrape?company=${company}&category=${category}`
    );

    productData = data.products;
    // const conversationId = data.conversationId;
    // console.log({ productData, conversationId });

    if (productData && productData.length > 0) {
      localStorage.setItem(
        LOCAL_CACHE_KEYS.PRODUCT_DATA(company, category),
        JSON.stringify(productData)
      );
    } else {
      localStorage.removeItem(LOCAL_CACHE_KEYS.PRODUCT_DATA(company, category));
    }
  } else {
    productData = JSON.parse(
      localStorage.getItem(
        LOCAL_CACHE_KEYS.PRODUCT_DATA(company, category)
      ) as string
    );

    if (productData && productData.length === 0) {
      localStorage.removeItem(LOCAL_CACHE_KEYS.PRODUCT_DATA(company, category));
    }
  }
  const formattedData = { productData, company, category };

  const { data: strategyData } = await axios.post(
    `${import.meta.env.VITE_GENERATION_SERVICE_URL}/strategies`,
    formattedData
  );

  localStorage.setItem(
    LOCAL_CACHE_KEYS.STRATEGIES(company, category),
    JSON.stringify(strategyData)
  );

  return { data: strategyData, productData };
};

export const fetchMessages = async (conversationId: string) => {
  const { data } = await api.get(`/conversations/${conversationId}/messages`);
  return data;
};

export const fetchConversations = async () => {
  const { data } = await api.get("/conversations");
  return data;
};

export const sendMessage = async (conversationId: string, message: string) => {
  const { data } = await api.post(`/conversations/${conversationId}/messages`, {
    message,
  });
  return data;
};
