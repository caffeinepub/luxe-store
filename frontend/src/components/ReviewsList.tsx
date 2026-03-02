/**
 * ReviewsList.tsx — Product reviews list with average rating display
 * and inline review submission form for authenticated users.
 */
import { useState } from 'react';
import { Star, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useGetProductReviews, useAddReview } from '@/hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { formatTimestampShort } from '@/utils/urlParams';

interface ReviewsListProps {
  productId: bigint;
}

function StarRating({
  value,
  onChange,
  readonly = false,
}: {
  value: number;
  onChange?: (v: number) => void;
  readonly?: boolean;
}) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          className={readonly ? 'cursor-default' : 'cursor-pointer'}
        >
          <Star
            className={`h-4 w-4 transition-colors ${
              star <= (hovered || value)
                ? 'fill-accent text-accent'
                : 'text-muted-foreground'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export default function ReviewsList({ productId }: ReviewsListProps) {
  const { identity } = useInternetIdentity();
  const { data: reviews, isLoading } = useGetProductReviews(productId);
  const addReview = useAddReview();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const avgRating =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, r) => sum + Number(r.rating), 0) / reviews.length
      : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error('Please write a comment');
      return;
    }
    setSubmitting(true);
    try {
      await addReview.mutateAsync({ productId, rating: BigInt(rating), comment });
      toast.success('Review submitted!');
      setComment('');
      setRating(5);
    } catch {
      toast.error('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl font-semibold">Customer Reviews</h2>
        {reviews && reviews.length > 0 && (
          <div className="flex items-center gap-2">
            <StarRating value={Math.round(avgRating)} readonly />
            <span className="text-sm text-muted-foreground">
              {avgRating.toFixed(1)} ({reviews.length} reviews)
            </span>
          </div>
        )}
      </div>

      {/* Review Form */}
      {identity ? (
        <form onSubmit={handleSubmit} className="bg-secondary rounded-lg p-4 space-y-3">
          <h3 className="font-medium text-sm">Write a Review</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Your rating:</span>
            <StarRating value={rating} onChange={setRating} />
          </div>
          <Textarea
            placeholder="Share your experience with this product…"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            className="resize-none"
          />
          <Button
            type="submit"
            disabled={submitting}
            size="sm"
            className="bg-accent text-accent-foreground hover:bg-gold-600"
          >
            {submitting && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
            Submit Review
          </Button>
        </form>
      ) : (
        <p className="text-sm text-muted-foreground bg-secondary rounded-lg p-4">
          Please <strong>login</strong> to write a review.
        </p>
      )}

      {/* Reviews List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          ))}
        </div>
      ) : reviews && reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id.toString()} className="border-b border-border pb-4 last:border-0">
              <div className="flex items-center justify-between mb-1">
                <StarRating value={Number(review.rating)} readonly />
                <span className="text-xs text-muted-foreground">
                  {formatTimestampShort(review.date)}
                </span>
              </div>
              <p className="text-sm text-foreground leading-relaxed">{review.comment}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {review.userId.toString().slice(0, 12)}…
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground text-center py-8">
          No reviews yet. Be the first to review this product!
        </p>
      )}
    </section>
  );
}
