export interface PricePoint {
  date: string;
  priceAuec: number;
  priceEur: number;
}

export type PriceHistory = Record<string, PricePoint[]>;

// Simulated price evolution data (quarterly snapshots)
export const priceHistory: PriceHistory = {
  "1":  [{ date: "2023-Q1", priceAuec: 22000, priceEur: 36 }, { date: "2023-Q2", priceAuec: 23000, priceEur: 38 }, { date: "2023-Q3", priceAuec: 24000, priceEur: 40 }, { date: "2023-Q4", priceAuec: 24500, priceEur: 41 }, { date: "2024-Q1", priceAuec: 25000, priceEur: 42 }, { date: "2024-Q2", priceAuec: 25000, priceEur: 42 }, { date: "2024-Q3", priceAuec: 25000, priceEur: 42 }, { date: "2024-Q4", priceAuec: 25000, priceEur: 42 }],
  "2":  [{ date: "2023-Q1", priceAuec: 45000, priceEur: 60 }, { date: "2023-Q2", priceAuec: 47000, priceEur: 63 }, { date: "2023-Q3", priceAuec: 48000, priceEur: 65 }, { date: "2023-Q4", priceAuec: 49000, priceEur: 67 }, { date: "2024-Q1", priceAuec: 50000, priceEur: 69 }, { date: "2024-Q2", priceAuec: 50000, priceEur: 69 }, { date: "2024-Q3", priceAuec: 50000, priceEur: 69 }, { date: "2024-Q4", priceAuec: 50000, priceEur: 69 }],
  "3":  [{ date: "2023-Q1", priceAuec: 80000, priceEur: 73 }, { date: "2023-Q2", priceAuec: 82000, priceEur: 75 }, { date: "2023-Q3", priceAuec: 85000, priceEur: 78 }, { date: "2023-Q4", priceAuec: 88000, priceEur: 80 }, { date: "2024-Q1", priceAuec: 90000, priceEur: 82 }, { date: "2024-Q2", priceAuec: 90000, priceEur: 82 }, { date: "2024-Q3", priceAuec: 90000, priceEur: 82 }, { date: "2024-Q4", priceAuec: 90000, priceEur: 82 }],
  "4":  [{ date: "2023-Q1", priceAuec: 85000, priceEur: 92 }, { date: "2023-Q2", priceAuec: 88000, priceEur: 95 }, { date: "2023-Q3", priceAuec: 92000, priceEur: 98 }, { date: "2023-Q4", priceAuec: 95000, priceEur: 100 }, { date: "2024-Q1", priceAuec: 98000, priceEur: 105 }, { date: "2024-Q2", priceAuec: 100000, priceEur: 110 }, { date: "2024-Q3", priceAuec: 100000, priceEur: 110 }, { date: "2024-Q4", priceAuec: 100000, priceEur: 110 }],
  "5":  [{ date: "2023-Q1", priceAuec: 95000, priceEur: 98 }, { date: "2023-Q2", priceAuec: 100000, priceEur: 102 }, { date: "2023-Q3", priceAuec: 105000, priceEur: 105 }, { date: "2023-Q4", priceAuec: 108000, priceEur: 108 }, { date: "2024-Q1", priceAuec: 110000, priceEur: 110 }, { date: "2024-Q2", priceAuec: 110000, priceEur: 110 }, { date: "2024-Q3", priceAuec: 110000, priceEur: 110 }, { date: "2024-Q4", priceAuec: 110000, priceEur: 110 }],
  "6":  [{ date: "2023-Q1", priceAuec: 190000, priceEur: 195 }, { date: "2023-Q2", priceAuec: 200000, priceEur: 205 }, { date: "2023-Q3", priceAuec: 210000, priceEur: 215 }, { date: "2023-Q4", priceAuec: 218000, priceEur: 220 }, { date: "2024-Q1", priceAuec: 225000, priceEur: 225 }, { date: "2024-Q2", priceAuec: 225000, priceEur: 225 }, { date: "2024-Q3", priceAuec: 225000, priceEur: 225 }, { date: "2024-Q4", priceAuec: 225000, priceEur: 225 }],
  "7":  [{ date: "2023-Q1", priceAuec: 650000, priceEur: 600 }, { date: "2023-Q2", priceAuec: 670000, priceEur: 620 }, { date: "2023-Q3", priceAuec: 690000, priceEur: 640 }, { date: "2023-Q4", priceAuec: 710000, priceEur: 660 }, { date: "2024-Q1", priceAuec: 725000, priceEur: 675 }, { date: "2024-Q2", priceAuec: 725000, priceEur: 675 }, { date: "2024-Q3", priceAuec: 725000, priceEur: 675 }, { date: "2024-Q4", priceAuec: 725000, priceEur: 675 }],
  "8":  [{ date: "2023-Q1", priceAuec: 500000, priceEur: 500 }, { date: "2023-Q2", priceAuec: 530000, priceEur: 530 }, { date: "2023-Q3", priceAuec: 560000, priceEur: 555 }, { date: "2023-Q4", priceAuec: 580000, priceEur: 575 }, { date: "2024-Q1", priceAuec: 600000, priceEur: 600 }, { date: "2024-Q2", priceAuec: 600000, priceEur: 600 }, { date: "2024-Q3", priceAuec: 600000, priceEur: 600 }, { date: "2024-Q4", priceAuec: 600000, priceEur: 600 }],
  "9":  [{ date: "2023-Q1", priceAuec: 130000, priceEur: 138 }, { date: "2023-Q2", priceAuec: 135000, priceEur: 142 }, { date: "2023-Q3", priceAuec: 140000, priceEur: 148 }, { date: "2023-Q4", priceAuec: 148000, priceEur: 152 }, { date: "2024-Q1", priceAuec: 155000, priceEur: 155 }, { date: "2024-Q2", priceAuec: 155000, priceEur: 155 }, { date: "2024-Q3", priceAuec: 155000, priceEur: 155 }, { date: "2024-Q4", priceAuec: 155000, priceEur: 155 }],
  "10": [{ date: "2023-Q1", priceAuec: 350000, priceEur: 360 }, { date: "2023-Q2", priceAuec: 365000, priceEur: 375 }, { date: "2023-Q3", priceAuec: 375000, priceEur: 385 }, { date: "2023-Q4", priceAuec: 390000, priceEur: 395 }, { date: "2024-Q1", priceAuec: 400000, priceEur: 400 }, { date: "2024-Q2", priceAuec: 400000, priceEur: 400 }, { date: "2024-Q3", priceAuec: 400000, priceEur: 400 }, { date: "2024-Q4", priceAuec: 400000, priceEur: 400 }],
  "11": [{ date: "2023-Q1", priceAuec: 300000, priceEur: 280 }, { date: "2023-Q2", priceAuec: 310000, priceEur: 290 }, { date: "2023-Q3", priceAuec: 320000, priceEur: 300 }, { date: "2023-Q4", priceAuec: 330000, priceEur: 310 }, { date: "2024-Q1", priceAuec: 340000, priceEur: 315 }, { date: "2024-Q2", priceAuec: 340000, priceEur: 315 }, { date: "2024-Q3", priceAuec: 340000, priceEur: 315 }, { date: "2024-Q4", priceAuec: 340000, priceEur: 315 }],
  "12": [{ date: "2023-Q1", priceAuec: 230000, priceEur: 230 }, { date: "2023-Q2", priceAuec: 240000, priceEur: 238 }, { date: "2023-Q3", priceAuec: 248000, priceEur: 245 }, { date: "2023-Q4", priceAuec: 255000, priceEur: 252 }, { date: "2024-Q1", priceAuec: 260000, priceEur: 260 }, { date: "2024-Q2", priceAuec: 260000, priceEur: 260 }, { date: "2024-Q3", priceAuec: 260000, priceEur: 260 }, { date: "2024-Q4", priceAuec: 260000, priceEur: 260 }],
  "13": [{ date: "2023-Q1", priceAuec: 175000, priceEur: 195 }, { date: "2023-Q2", priceAuec: 185000, priceEur: 200 }, { date: "2023-Q3", priceAuec: 195000, priceEur: 210 }, { date: "2023-Q4", priceAuec: 205000, priceEur: 215 }, { date: "2024-Q1", priceAuec: 210000, priceEur: 220 }, { date: "2024-Q2", priceAuec: 210000, priceEur: 220 }, { date: "2024-Q3", priceAuec: 210000, priceEur: 220 }, { date: "2024-Q4", priceAuec: 210000, priceEur: 220 }],
  "14": [{ date: "2023-Q1", priceAuec: 800000, priceEur: 830 }, { date: "2023-Q2", priceAuec: 840000, priceEur: 870 }, { date: "2023-Q3", priceAuec: 880000, priceEur: 900 }, { date: "2023-Q4", priceAuec: 920000, priceEur: 930 }, { date: "2024-Q1", priceAuec: 950000, priceEur: 950 }, { date: "2024-Q2", priceAuec: 950000, priceEur: 950 }, { date: "2024-Q3", priceAuec: 950000, priceEur: 950 }, { date: "2024-Q4", priceAuec: 950000, priceEur: 950 }],
  "15": [{ date: "2023-Q1", priceAuec: 145000, priceEur: 155 }, { date: "2023-Q2", priceAuec: 150000, priceEur: 158 }, { date: "2023-Q3", priceAuec: 158000, priceEur: 165 }, { date: "2023-Q4", priceAuec: 165000, priceEur: 170 }, { date: "2024-Q1", priceAuec: 170000, priceEur: 175 }, { date: "2024-Q2", priceAuec: 170000, priceEur: 175 }, { date: "2024-Q3", priceAuec: 170000, priceEur: 175 }, { date: "2024-Q4", priceAuec: 170000, priceEur: 175 }],
  "16": [{ date: "2023-Q1", priceAuec: 250000, priceEur: 265 }, { date: "2023-Q2", priceAuec: 260000, priceEur: 275 }, { date: "2023-Q3", priceAuec: 272000, priceEur: 285 }, { date: "2023-Q4", priceAuec: 285000, priceEur: 290 }, { date: "2024-Q1", priceAuec: 295000, priceEur: 295 }, { date: "2024-Q2", priceAuec: 295000, priceEur: 295 }, { date: "2024-Q3", priceAuec: 295000, priceEur: 295 }, { date: "2024-Q4", priceAuec: 295000, priceEur: 295 }],
  "17": [{ date: "2023-Q1", priceAuec: 65000, priceEur: 68 }, { date: "2023-Q2", priceAuec: 68000, priceEur: 70 }, { date: "2023-Q3", priceAuec: 70000, priceEur: 73 }, { date: "2023-Q4", priceAuec: 73000, priceEur: 75 }, { date: "2024-Q1", priceAuec: 75000, priceEur: 77 }, { date: "2024-Q2", priceAuec: 75000, priceEur: 77 }, { date: "2024-Q3", priceAuec: 75000, priceEur: 77 }, { date: "2024-Q4", priceAuec: 75000, priceEur: 77 }],
  "18": [{ date: "2023-Q1", priceAuec: 95000, priceEur: 98 }, { date: "2023-Q2", priceAuec: 100000, priceEur: 102 }, { date: "2023-Q3", priceAuec: 105000, priceEur: 108 }, { date: "2023-Q4", priceAuec: 108000, priceEur: 112 }, { date: "2024-Q1", priceAuec: 110000, priceEur: 115 }, { date: "2024-Q2", priceAuec: 110000, priceEur: 115 }, { date: "2024-Q3", priceAuec: 110000, priceEur: 115 }, { date: "2024-Q4", priceAuec: 110000, priceEur: 115 }],
  "19": [{ date: "2023-Q1", priceAuec: 155000, priceEur: 162 }, { date: "2023-Q2", priceAuec: 160000, priceEur: 168 }, { date: "2023-Q3", priceAuec: 168000, priceEur: 175 }, { date: "2023-Q4", priceAuec: 175000, priceEur: 180 }, { date: "2024-Q1", priceAuec: 180000, priceEur: 185 }, { date: "2024-Q2", priceAuec: 180000, priceEur: 185 }, { date: "2024-Q3", priceAuec: 180000, priceEur: 185 }, { date: "2024-Q4", priceAuec: 180000, priceEur: 185 }],
  "20": [{ date: "2023-Q1", priceAuec: 95000, priceEur: 95 }, { date: "2023-Q2", priceAuec: 100000, priceEur: 100 }, { date: "2023-Q3", priceAuec: 105000, priceEur: 105 }, { date: "2023-Q4", priceAuec: 108000, priceEur: 108 }, { date: "2024-Q1", priceAuec: 110000, priceEur: 110 }, { date: "2024-Q2", priceAuec: 110000, priceEur: 110 }, { date: "2024-Q3", priceAuec: 110000, priceEur: 110 }, { date: "2024-Q4", priceAuec: 110000, priceEur: 110 }],
};

// Generate default price history for ships without specific data
export function getShipPriceHistory(shipId: string, currentPriceAuec: number, currentPriceEur: number): PricePoint[] {
  if (priceHistory[shipId]) return priceHistory[shipId];
  
  // Generate a plausible evolution: price grew ~15-25% over 2 years
  const growthFactor = 0.8 + Math.random() * 0.05; // start at 80-85% of current
  const quarters = ["2023-Q1", "2023-Q2", "2023-Q3", "2023-Q4", "2024-Q1", "2024-Q2", "2024-Q3", "2024-Q4"];
  
  return quarters.map((date, i) => {
    const progress = i / (quarters.length - 1);
    const factor = growthFactor + (1 - growthFactor) * progress;
    return {
      date,
      priceAuec: Math.round(currentPriceAuec * factor / 1000) * 1000,
      priceEur: Math.round(currentPriceEur * factor),
    };
  });
}
