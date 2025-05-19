import { useState, useEffect, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";
import "./orderBook.css";
import { IDeal, IDepthOfMarket, DataBar } from "./orderTypes";
import useOrderGenerator from "./useOrderGenerator";

const OrderBook = () => {
  const { isGenerating, toggleGenerating } = useOrderGenerator(
    "https://alicebob.ru/api/orders"
  );
  const [depthOfMarketData, setDepthOfMarketData] = useState<IDepthOfMarket>({
    ask: [],
    bid: [],
  });
  const [deals, setDeals] = useState<IDeal[]>([]);

  const connectWebSocketDeals = () => {
    const wsDeals = new WebSocket("wss://alicebob.ru/api/dealbook");
    wsDeals.onmessage = (e) => {
      const newDeals: IDeal[] = JSON.parse(e.data);
      setDeals((prev) => [...prev, ...newDeals]);
    };

    wsDeals.onclose = (e) => {
      connectWebSocketDeals();
    };
  };

  const connectWebSocketOrderBook = () => {
    const wsOrderBook = new WebSocket("wss://alicebob.ru/api/orderbook");
    wsOrderBook.onmessage = (e) => {
      const data: IDepthOfMarket = JSON.parse(e.data);
      setDepthOfMarketData(data);
    };

    wsOrderBook.onclose = (e) => {
      connectWebSocketDeals();
    };
  };

  useEffect(() => {
    connectWebSocketDeals();
    connectWebSocketOrderBook();
  }, []);

  const dealsData = useMemo(() => {
    return deals
      .map((deal) => ({
        time: new Date(deal.time).toLocaleTimeString(),
        price: deal.price,
      }))
      .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
  }, [deals]);

  const combinedDataBars = useMemo(() => {
    const askDataBars = depthOfMarketData.ask.map(
      (item) => new DataBar(item.price, item.quantity, 0)
    );
    const bidDataBars = depthOfMarketData.bid.map(
      (item) => new DataBar(item.price, 0, item.quantity)
    );
    return [...askDataBars, ...bidDataBars].sort((a, b) => a.price - b.price);
  }, [depthOfMarketData]);

  return (
    <div className="order-book-container">
      <button className="toggle-button" onClick={toggleGenerating}>
        {isGenerating ? "Stop Generating" : "Start Generating"}
      </button>
      <div className="charts-row">
        <div className="chart">
          <h3>Order Book</h3>
          <BarChart width={800} height={400} data={combinedDataBars}>
            <CartesianGrid strokeDasharray="3" />
            <XAxis
              dataKey="price"
              tick={{ fontSize: "clamp(8px, 2vw, 12px)" }}
              interval={window.innerWidth < 600 ? 2 : 0}
            />
            <YAxis />
            <Bar dataKey="ask_quantity" fill="#00C90D" name="Ask" />
            <Bar dataKey="bid_quantity" fill="#FF4040" name="Bid" />
          </BarChart>
        </div>
        <div className="chart">
          <h3>Price History</h3>
          <LineChart width={800} height={400} data={dealsData}>
            <CartesianGrid strokeDasharray="3" />
            <XAxis dataKey="time" />
            <YAxis scale="log" domain={["auto", "auto"]} />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#82ca9d"
              strokeWidth={2}
              dot={{ r: 2 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </div>
      </div>
    </div>
  );
};

export default OrderBook;
