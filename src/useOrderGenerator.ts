import { useState, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { IOrderData } from "./orderTypes";

function poissonRandom(lambda: number): number {
  let L = Math.exp(-lambda);
  let k = 0;
  let p = 1;

  do {
    k++;
    p *= Math.random();
  } while (p > L);

  return k - 1;
}

const getRandomSide = () => (Math.random() > 0.5 ? "Ask" : "Bid");
const getRandomQuantity = () => Math.floor(Math.random() * 5) + 1;

const getPrice = (side: "Ask" | "Bid"): number => {
  const lambda = 4;
  if (side === "Ask") {
    const poissonValue = poissonRandom(lambda);
    return Math.max(85, Math.min(102, 102 - poissonValue));
  } else {
    const poissonValue = poissonRandom(lambda);
    return Math.max(98, Math.min(115, poissonValue + 98));
  }
};

const useOrderGenerator = (ordersUrl: string) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const generateOrder = useCallback(async () => {
    const orderData: IOrderData = {
      id: uuidv4(),
      side: getRandomSide(),
      quantity: getRandomQuantity(),
      price: getPrice(getRandomSide()),
    };

    try {
      await fetch(ordersUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
    } catch (error) {
      console.error("Error posting order:", error);
    }
  }, [ordersUrl]);

  const toggleGenerating = useCallback(() => {
    if (isGenerating && intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
      setIsGenerating(false);
    } else {
      const id = setInterval(generateOrder, 1000);
      setIntervalId(id);
      setIsGenerating(true);
    }
  }, [isGenerating, intervalId, generateOrder]);

  useEffect(() => {
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [intervalId]);

  return { isGenerating, toggleGenerating };
};

export default useOrderGenerator;
