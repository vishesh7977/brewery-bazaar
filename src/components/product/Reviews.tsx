
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, ThumbsUp } from "lucide-react";
import ReviewForm from "./ReviewForm";

interface ReviewsProps {
  productId: string;
  rating: number;
  reviewCount: number;
}

interface Review {
  id: string;
  author: string;
  date: string;
  rating: number;
  content: string;
  helpful: number;
}

export default function Reviews({ productId, rating, reviewCount }: ReviewsProps) {
  // Mock reviews data - in a real app, this would be fetched from an API
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: "1",
      author: "Raj Patel",
      date: "2023-05-15",
      rating: 5,
      content: "This is exactly what I was looking for! The fit is perfect and the material is super comfortable. Wore it all day without any issues. Would definitely recommend!",
      helpful: 12,
    },
    {
      id: "2",
      author: "Priya Sharma",
      date: "2023-04-28",
      rating: 4,
      content: "Great t-shirt overall. The design is awesome and exactly as pictured. Took one star off because it runs slightly small - I'd recommend sizing up.",
      helpful: 8,
    },
    {
      id: "3",
      author: "Aditya Mehta",
      date: "2023-04-10",
      rating: 5,
      content: "Absolutely love this tee! The fabric is so soft and breathable, perfect for Mumbai weather. The color is exactly as shown online. Fast shipping too!",
      helpful: 5,
    },
  ]);
  
  const [helpfulMarked, setHelpfulMarked] = useState<Record<string, boolean>>({});
  
  const handleNewReview = () => {
    // In a real app, we would refresh the reviews from the server
    console.log("New review submitted");
  };
  
  const markHelpful = (reviewId: string) => {
    if (helpfulMarked[reviewId]) return;
    
    setReviews(reviews.map(review => 
      review.id === reviewId ? { ...review, helpful: review.helpful + 1 } : review
    ));
    
    setHelpfulMarked({
      ...helpfulMarked,
      [reviewId]: true,
    });
  };
  
  // Calculate rating distribution
  const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach(review => {
    ratingCounts[review.rating as keyof typeof ratingCounts]++;
  });
  
  const calculatePercentage = (count: number) => {
    return reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0;
  };
  
  return (
    <div className="mt-16 border-t pt-8">
      <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
      
      <Tabs defaultValue="reviews">
        <TabsList className="mb-8">
          <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
          <TabsTrigger value="write-review">Write a Review</TabsTrigger>
        </TabsList>
        
        <TabsContent value="reviews">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Rating Summary */}
            <div className="md:col-span-1 space-y-6">
              <div className="text-center md:text-left">
                <div className="text-5xl font-bold mb-2">{rating.toFixed(1)}</div>
                <div className="flex justify-center md:justify-start items-center mb-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${
                        star <= rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
                <div className="text-sm text-muted-foreground">
                  Based on {reviews.length} reviews
                </div>
              </div>
              
              {/* Rating Distribution */}
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((starRating) => (
                  <div key={starRating} className="flex items-center">
                    <div className="flex items-center w-14">
                      <span className="text-sm">{starRating}</span>
                      <Star className="h-4 w-4 ml-1 fill-current text-yellow-400" />
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2.5 mx-2">
                      <div
                        className="bg-yellow-400 h-2.5 rounded-full"
                        style={{ width: `${calculatePercentage(ratingCounts[starRating as keyof typeof ratingCounts])}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-muted-foreground w-14 text-right">
                      {ratingCounts[starRating as keyof typeof ratingCounts]} reviews
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Review List */}
            <div className="md:col-span-2 space-y-6">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review.id} className="border-b pb-6">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-medium">{review.author}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(review.date).toLocaleDateString('en-US', {
                            year: 'numeric', month: 'long', day: 'numeric'
                          })}
                        </div>
                      </div>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm mb-3">{review.content}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markHelpful(review.id)}
                      disabled={helpfulMarked[review.id]}
                      className="h-8 text-xs"
                    >
                      <ThumbsUp className="h-3 w-3 mr-1" />
                      {helpfulMarked[review.id] ? 'Marked as helpful' : 'Helpful'} ({review.helpful})
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    This product doesn't have any reviews yet.
                  </p>
                  <Button
                    onClick={() => document.querySelector('[data-value="write-review"]')?.click()}
                  >
                    Be the first to review
                  </Button>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="write-review">
          <div className="max-w-xl mx-auto">
            <h3 className="text-lg font-medium mb-4">Share Your Experience</h3>
            <ReviewForm productId={productId} onReviewSubmitted={handleNewReview} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
