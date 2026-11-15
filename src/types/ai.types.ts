export interface AiProductCard {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category: string;
  basePrice?: number;
  discountPrice?: number;
  effectivePrice?: number;
  formattedPrice: string;
  image: string;
  gender?: string;
  sizes: (string | number)[];
  colors?: string[];
  totalStock?: number;
  inStock: boolean;
  description?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedProducts?: AiProductCard[];
  isError?: boolean;
}

export interface ChatApiResponse {
  success: boolean;
  reply: string;
  suggestedProducts: AiProductCard[];
}
