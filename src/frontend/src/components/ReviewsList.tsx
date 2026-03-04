import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { useState } from "react";
import type { ProductId } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useAddReview, useGetProductReviews } from "../hooks/useQueries";

interface ReviewsListProps {
  productId: ProductId;
}

function StarRating({
  rating,
  onRate,
}: { rating: number; onRate?: (r: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRate?.(star)}
          className={`transition-colors ${onRate ? "cursor-pointer hover:scale-110" : "cursor-default"}`}
        >
          <Star
            className={`h-5 w-5 ${
              star <= rating
                ? "fill-primary text-primary"
                : "text-muted-foreground"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export default function ReviewsList({ productId }: ReviewsListProps) {
  const { identity } = useInternetIdentity();
  const { data: reviews = [], isLoading } = useGetProductReviews(productId);
  const addReview = useAddReview();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + Number(r.rating), 0) / reviews.length
      : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    addReview.mutate(
      { productId, rating: BigInt(rating), comment },
      {
        onSuccess: () => {
          setComment("");
          setRating(5);
        },
      },
    );
  };

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="flex items-center gap-4">
        <div className="text-4xl font-display font-bold text-primary">
          {avgRating.toFixed(1)}
        </div>
        <div>
          <StarRating rating={Math.round(avgRating)} />
          <p className="text-sm text-muted-foreground mt-1">
            {reviews.length} reviews
          </p>
        </div>
      </div>

      {/* Add Review */}
      {identity && (
        <form
          onSubmit={handleSubmit}
          className="bg-muted rounded-xl p-4 space-y-3"
        >
          <h4 className="font-semibold text-foreground">Write a Review</h4>
          <StarRating rating={rating} onRate={setRating} />
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience..."
            className="bg-surface border-border resize-none"
            rows={3}
          />
          <Button
            type="submit"
            disabled={addReview.isPending || !comment.trim()}
            size="sm"
          >
            {addReview.isPending ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      )}

      {/* Reviews List */}
      {isLoading ? (
        <p className="text-muted-foreground text-sm">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          No reviews yet. Be the first to review!
        </p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id.toString()}
              className="bg-surface rounded-xl p-4 shadow-luxury"
            >
              <div className="flex items-center justify-between mb-2">
                <StarRating rating={Number(review.rating)} />
                <span className="text-xs text-muted-foreground">
                  {new Date(
                    Number(review.date) / 1_000_000,
                  ).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-foreground">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
