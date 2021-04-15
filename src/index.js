import ReactDom from "react-dom";
import App from "./App";

const application = <App />;
const nodeElement = document.querySelector("#root");

ReactDom.render(application, nodeElement);
