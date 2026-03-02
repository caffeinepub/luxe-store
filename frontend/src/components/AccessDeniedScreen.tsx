/**
 * AccessDeniedScreen.tsx — Access denied screen with clear messaging
 * and navigation back to home.
 */
import { Link } from '@tanstack/react-router';
import { ShieldX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AccessDeniedScreenProps {
  message?: string;
}

export default function AccessDeniedScreen({
  message = 'You do not have permission to access this page.',
}: AccessDeniedScreenProps) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center">
        <ShieldX className="h-10 w-10 text-destructive" />
      </div>
      <div>
        <h1 className="font-serif text-3xl font-semibold mb-2">Access Denied</h1>
        <p className="text-muted-foreground max-w-sm">{message}</p>
      </div>
      <Button asChild className="bg-accent text-accent-foreground hover:bg-gold-600">
        <Link to="/">Return to Home</Link>
      </Button>
    </div>
  );
}
