import { createVendiaClient } from "@vendia/client";

const client = createVendiaClient({
  apiUrl: `https://g4vh737qn6.execute-api.us-west-1.amazonaws.com/graphql/`,
  websocketUrl: `wss://iuns9euixa.execute-api.us-west-1.amazonaws.com/graphql`,
  apiKey: `5hp67TNWqLAU6gPs2bh9PZ2oEhMZAyRcPAc2Y4xsY1Fs`, // <---- API key
});

const { entities } = client;

const useFDA = () => {
  return { entities };
};

export default useFDA;
