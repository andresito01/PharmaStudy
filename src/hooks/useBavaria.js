import { createVendiaClient } from "@vendia/client";

const client = createVendiaClient({
  apiUrl: `https://chfvf44l61.execute-api.us-west-1.amazonaws.com/graphql/`,
  websocketUrl: `wss://ikpv50wk07.execute-api.us-west-1.amazonaws.com/graphql`,
  apiKey: `GDKkzq35m8JWDKdTCiCBaDqWrWRK6whJux5RoSDSAHjU`, // <---- API key
});

const { entities } = client;

const useBavaria = () => {
  return { entities };
};

export default useBavaria;
