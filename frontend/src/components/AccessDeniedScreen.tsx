import { ShieldX } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';

export default function AccessDeniedScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4">
      <div className="bg-destructive/10 p-6 rounded-full">
        <ShieldX className="h-16 w-16 text-destructive" />
      </div>
      <div className="text-center">
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">Access Denied</h1>
        <p className="text-muted-foreground max-w-sm">
          You don't have permission to access this page. Admin privileges are required.
        </p>
      </div>
      <Link to="/">
        <Button variant="default">Return to Home</Button>
      </Link>
    </div>
  );
}
