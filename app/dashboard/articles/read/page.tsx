"use client";

import * as React from "react"; // Import React
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function ArticleFallback(){
  const searchParams = useSearchParams();
  const { push } = useRouter();

  // Extract query parameters
  const id = searchParams.get('id');
  const title = searchParams.get('title');
  const description = searchParams.get('description');
  const source_url = searchParams.get('source_url');
  return (
    <main className="p-8">
    <Card className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col items-center justify-center">
      <CardHeader>
        <Image
          src="https://images.pexels.com/photos/1374510/pexels-photo-1374510.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt={title as string}
          width={800}
          height={450}
          className="rounded-md mb-4"
        />
      </CardHeader>
      <CardContent>
        <CardTitle className="text-3xl font-bold mb-4">
          {title as string}
        </CardTitle>
        <p className="mb-4 text-justify">{description as string}</p>
        <Link
          href={source_url as string}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          Read more on the original site
        </Link>
      </CardContent>
      <Button
        onClick={() => push("/dashboard/articles")}
        className="mb-4"
        variant="default"
        color="gray-800"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back
      </Button>
    </Card>
  </main>
  )
}


export default function ArticleDetailPage() {
  

  return (
    <React.Suspense fallback={<div>Loading...</div>}> {/* Suspense boundary */}
      <ArticleFallback />
    </React.Suspense>
  );
}
