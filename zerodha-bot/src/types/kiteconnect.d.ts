declare module "kiteconnect" {
  export class KiteConnect {
    constructor(params: { api_key: string; access_token?: string });
    getLoginURL(): string;
    generateSession(request_token: string, api_secret: string): Promise<{
      access_token: string;
      public_token: string;
      login_time?: string;
      user_id?: string;
      userid?: string;
    }>;
    setAccessToken(token: string): void;
    getProfile(): Promise<any>;
    margins(segment?: string): Promise<any>;
    placeOrder(
      variety: string,
      params: Record<string, any>
    ): Promise<{ order_id: string }>;
  }
}
