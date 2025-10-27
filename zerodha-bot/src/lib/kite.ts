import { KiteConnect } from "kiteconnect";
import { readStore, setAccessTokens } from "@/lib/storage";

export async function createKiteFromStore(): Promise<{ kite: any; store: Awaited<ReturnType<typeof readStore>> }>
{
  const store = await readStore();
  if (!store.apiKey) {
    throw new Error("API key not configured. Set credentials first.");
  }
  const kite: any = new KiteConnect({ api_key: store.apiKey });
  if (store.accessToken) {
    kite.setAccessToken(store.accessToken);
  }
  return { kite, store };
}

export async function getLoginUrl(): Promise<string> {
  const { kite } = await createKiteFromStore();
  return kite.getLoginURL();
}

export async function exchangeRequestToken(requestToken: string): Promise<{ accessToken: string; publicToken?: string; userId?: string }>
{
  const { kite, store } = await createKiteFromStore();
  if (!store.apiSecret) throw new Error("API secret not configured. Set credentials first.");
  const resp = await kite.generateSession(requestToken, store.apiSecret);
  const accessToken = resp.access_token;
  const publicToken = resp.public_token;
  const userId = (resp as any).userid || (resp as any).user_id;
  await setAccessTokens({ accessToken, publicToken, userId });
  kite.setAccessToken(accessToken);
  return { accessToken, publicToken, userId };
}
