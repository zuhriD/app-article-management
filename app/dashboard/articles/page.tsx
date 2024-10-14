"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useArticle } from "@/context/ArticleContext";
import { useRouter } from "next/navigation";

// Define the structure of an article
interface Article {
  id: string;
  slug: string;
  title: string;
  image: string | null;
  video: string | null;
  audio: string | null;
  caption: string | null;
  description: string ;
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
  video_metadata: any | null; // Adjust this based on the metadata structure you expect
  status: string;
  source_url: string;
  date: string; // If this is returned as a string, otherwise use Date if you plan to parse it
}

export default function ArticlePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const { data: session } = useSession();
  const { setSelectedArticle } = useArticle(); // Get function to set article in context
  const router = useRouter();

  const fetchArticles = useCallback(async (page: number) => {
    if (!session?.accessToken) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/articles?page=${page}`, 
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        }
      );

      const articlesData = response.data.data;

      if (Array.isArray(articlesData)) {
        setArticles(articlesData);
      } else {
        console.error("Expected articles to be an array but got:", articlesData);
      }
    } catch (error) {
      console.error("Error fetching articles", error);
    } finally {
      setLoading(false);
    }
  }, [session?.accessToken]);

  useEffect(() => {
    fetchArticles(currentPage);
  }, [currentPage, fetchArticles]);


  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <main className="p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <Card
            key={article.id}
            className="bg-white shadow-md rounded-lg overflow-hidden"
          >
            <CardHeader>
              <Image
                className="w-full h-48 object-cover"
                src={"https://images.pexels.com/photos/1374510/pexels-photo-1374510.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"}
                alt={article.title || "Article image"}
                width={500}
                height={500}
                priority
              />
            </CardHeader>
            <CardContent>
              <CardTitle className="text-xl font-semibold mb-2">
                {article.title}
              </CardTitle>
              <Link href={{ 
                pathname: "/dashboard/articles/read", 
                query: { id: article.id, title: article.title, description: article.description, source_url: article.source_url }
               }} className="text-blue-600 hover:underline">
                Read more
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between mt-6">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`px-4 py-2 text-white bg-primary rounded ${
            currentPage === 1 ? "bg-gray-500 cursor-not-allowed" : ""
          }`}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 text-white bg-primary rounded ${
            currentPage === totalPages ? "bg-gray-500 cursor-not-allowed" : ""
          }`}
        >
          Next
        </button>
      </div>
    </main>
  );
}
