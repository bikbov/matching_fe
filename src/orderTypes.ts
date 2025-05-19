export interface IOrderData {
  id: string;
  side: "Ask" | "Bid";
  quantity: number;
  price: number;
}

export interface IDeal {
  time: string;
  price: number;
}

export interface IDepthOfMarket {
  ask: Array<{ price: number; quantity: number }>;
  bid: Array<{ price: number; quantity: number }>;
}

export class DataBar {
  price: number;
  ask_quantity: number;
  bid_quantity: number;

  constructor(price: number, ask_quantity: number, bid_quantity: number) {
    this.price = price;
    this.ask_quantity = ask_quantity;
    this.bid_quantity = bid_quantity;
  }
}
