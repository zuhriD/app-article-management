"use client";
import { createContext, useContext, useState, ReactNode } from "react";

// Define the structure of an article
interface Article {
  id: string;
  slug: string;
  title: string;
  image: string | null;
  video: string | null;
  audio: string | null;
  caption: string | null;
  description: string | null;
  description_splitter: string[] | null;
  categories: string[];
  like: number;
  viewer: number;
  share: number;
  is_like: boolean;
  author: string | null;
  website: {
    id: number;
    name: string;
    url: string;
  } | null;
  image_metadata: {
    width: number;
    height: number;
  } | null;
  video_metadata: any | null;
  status: string;
  source_url: string;
  date: string;
}

// Create context for article management
interface ArticleContextType {
  selectedArticle: Article | null;
  setSelectedArticle: (article: Article | null) => void;
}

const ArticleContext = createContext<ArticleContextType | undefined>(undefined);

export const ArticleProvider = ({ children }: { children: ReactNode }) => {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  return (
    <ArticleContext.Provider value={{ selectedArticle, setSelectedArticle }}>
      {children}
    </ArticleContext.Provider>
  );
};

// Custom hook to use the ArticleContext
export const useArticle = () => {
  const context = useContext(ArticleContext);
  if (!context) {
    throw new Error("useArticle must be used within an ArticleProvider");
  }
  return context;
};
