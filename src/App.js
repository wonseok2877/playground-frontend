import React from "react";
import { ApolloProvider } from "@apollo/client";
import { client } from "./apolloClient";
import Router from "./Router";
import "./styles/style.css";
import "./styles/custom.css";

const App = () => {
  return (
    <ApolloProvider client={client}>
      <Router />
    </ApolloProvider>
  );
};

export default App;
