import { createVendiaClient } from "@vendia/client";

const client = createVendiaClient({
    apiUrl: `https://1wcospig11.execute-api.us-west-2.amazonaws.com/graphql/`,
    websocketUrl: `wss://aizicnzngg.execute-api.us-west-2.amazonaws.com/graphql`,
    apiKey: `2KPUwei9m95K4NDJUsQnYyWgXt1HECLVpAC69buwjy1h`, // <---- API key
  })