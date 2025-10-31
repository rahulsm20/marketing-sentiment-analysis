import { Client } from "@elastic/elasticsearch";
import { config } from "../config";

const client = new Client({
  node: config.elasticsearch.url,
  auth: {
    username: config.elasticsearch.username,
    password: config.elasticsearch.password,
  },
});

export default client;
