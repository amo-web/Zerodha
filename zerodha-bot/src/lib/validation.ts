import { z } from "zod";

export const credentialsSchema = z.object({
  apiKey: z.string().min(1),
  apiSecret: z.string().min(1),
});

export const orderSchema = z.object({
  exchange: z.enum(["NSE", "BSE", "NFO", "BFO", "MCX"]).default("NSE"),
  tradingsymbol: z.string().min(1),
  transaction_type: z.enum(["BUY", "SELL"]),
  quantity: z.number().int().positive(),
  product: z.enum(["CNC", "MIS", "NRML", "BO", "CO"]).default("CNC"),
  order_type: z.enum(["MARKET", "LIMIT"]).default("MARKET"),
  price: z.number().nonnegative().optional(),
});

export type OrderInput = z.infer<typeof orderSchema>;
