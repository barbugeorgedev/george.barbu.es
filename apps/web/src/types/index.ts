export interface SEOProps {
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  seoImage?: string;
  url?: string;
}

export interface EventParams {
  action: string;
  category: string;
  label: string;
  value: number;
}
