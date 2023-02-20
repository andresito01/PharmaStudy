import { createVendiaClient } from "@vendia/client";

const client = createVendiaClient({
    apiUrl: `https://dd1qkotodb.execute-api.us-west-2.amazonaws.com/graphql/`,
    websocketUrl: `wss://1z9xq0syl3.execute-api.us-west-2.amazonaws.com/graphql`,
    apiKey: `EJVikCvZ9Jg8ZJU3C928TFnXjcUEJdTVKGBGMdENRMVd`, // <---- API key
  })

const { entities } = client;

const useJaneHopkins = () => {
    return { entities };
};

export default useJaneHopkins;
