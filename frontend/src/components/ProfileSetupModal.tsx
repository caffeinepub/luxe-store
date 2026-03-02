/**
 * ProfileSetupModal.tsx — Modal that prompts newly authenticated users
 * to complete their profile. Prevents flash during loading.
 */
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from '@/hooks/useQueries';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ProfileSetupModal() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading, isFetched } = useGetCallerUserProfile();
  const saveProfile = useSaveCallerUserProfile();

  const [name, setName]   = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const isAuthenticated = !!identity;
  // Only show modal when: authenticated, not loading, fetched, and no profile exists
  const showModal = isAuthenticated && !isLoading && isFetched && userProfile === null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }
    try {
      await saveProfile.mutateAsync({ name: name.trim(), email: email.trim(), phone: phone.trim() });
      toast.success('Profile saved! Welcome to Luxe Store.');
    } catch {
      toast.error('Failed to save profile. Please try again.');
    }
  };

  return (
    <Dialog open={showModal}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">Welcome to Luxe Store</DialogTitle>
          <DialogDescription>
            Please complete your profile to get started.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <Label htmlFor="setup-name" className="text-sm font-medium mb-1.5 block">
              Full Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="setup-name"
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div>
            <Label htmlFor="setup-email" className="text-sm font-medium mb-1.5 block">
              Email Address
            </Label>
            <Input
              id="setup-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="setup-phone" className="text-sm font-medium mb-1.5 block">
              Phone Number
            </Label>
            <Input
              id="setup-phone"
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            disabled={saveProfile.isPending}
            className="w-full bg-accent text-accent-foreground hover:bg-gold-600 font-semibold"
          >
            {saveProfile.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Profile
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
