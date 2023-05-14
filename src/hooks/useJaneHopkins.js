import { createVendiaClient } from "@vendia/client";

const client = createVendiaClient({
  apiUrl: `https://7i1z6vzwy1.execute-api.us-west-1.amazonaws.com/graphql/`,
  websocketUrl: `wss://sicmjunumf.execute-api.us-west-1.amazonaws.com/graphql`,
  apiKey: `itGyYoDwRrD6Mffkco4maoPCV7PXk7kyX6bxwfSo7Zk`, // <---- API key
});

const { entities } = client;

const useJaneHopkins = () => {
  return { entities };
};

export default useJaneHopkins;
