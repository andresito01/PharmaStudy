import { createVendiaClient } from "@vendia/client";

const client = createVendiaClient({
    apiUrl: `https://vyrid9lth5.execute-api.us-west-2.amazonaws.com/graphql/`,
    websocketUrl: `wss://ehwhl6zyak.execute-api.us-west-2.amazonaws.com/graphql`,
    apiKey: `8LcbR4bYMXK5EDpKdn9f23cspm6CR99jTk5wrYVPooAt`, // <---- API key
  })

const { entities } = client;

const useBavaria = () => {
    return { entities };
};

export default useBavaria;