import React from "react";
import ReactDOM from "react-dom/client";
import OrderBook from "./OrderBook";

const root: ReactDOM.Root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <div className="App">
      <OrderBook />
    </div>
  </React.StrictMode>
);
