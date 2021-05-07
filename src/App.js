import React from "react";
import { ApolloProvider } from "@apollo/client";
import { client } from "./apolloClient";
import Router from "./Router";
import "./styles/style.css";
import "./styles/custom.css";
import { StateContextProvider } from "./context/stateContext";

const App = () => {
  return (
    <ApolloProvider client={client}>
      <StateContextProvider>
        <Router />
      </StateContextProvider>
    </ApolloProvider>
  );
};

export default App;
