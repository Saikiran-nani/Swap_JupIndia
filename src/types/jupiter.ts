export interface Token {
  address: string;
  chainId: number;
  decimals: number;
  name: string;
  symbol: string;
  logoURI?: string;
  tags?: string[];
}

export interface QuoteRequest {
  inputMint: string;
  outputMint: string;
  amount: string;
  slippageBps: number;
  onlyDirectRoutes?: boolean;
  asLegacyTransaction?: boolean;
}

export interface QuoteResponse {
  inputMint: string;
  inAmount: string;
  outputMint: string;
  outAmount: string;
  otherAmountThreshold: string;
  swapMode: string;
  slippageBps: number;
  platformFee?: {
    feeBps: number;
    feeAccounts: Record<string, string>;
  };
  priceImpactPct: string;
  routePlan: RoutePlan[];
  contextSlot: number;
  timeTaken: number;
}

export interface RoutePlan {
  swapInfo: SwapInfo;
  percent: number;
}

export interface SwapInfo {
  amm: {
    label: string;
    inputMint: string;
    outputMint: string;
    inAmount: string;
    outAmount: string;
    feeAmount: string;
    feeMint: string;
  };
  tokenIn: string;
  tokenOut: string;
  inAmount: string;
  outAmount: string;
  feeAmount: string;
  feeMint: string;
  feePct: string;
}

export interface SwapRequest {
  quoteResponse: QuoteResponse;
  userPublicKey: string;
  wrapUnwrapSOL?: boolean;
}

export interface SwapResponse {
  swapTransaction: string;
}

export interface SwapFormData {
  fromToken: Token | null;
  toToken: Token | null;
  amount: string;
  slippage: number;
}

export interface SwapState {
  loading: boolean;
  error: string | null;
  quote: QuoteResponse | null;
  tokens: Token[];
} 