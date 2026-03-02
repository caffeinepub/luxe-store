import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useSaveCallerUserProfile } from '../hooks/useQueries';

interface ProfileSetupModalProps {
  open: boolean;
}

export default function ProfileSetupModal({ open }: ProfileSetupModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const saveProfile = useSaveCallerUserProfile();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    saveProfile.mutate({ name: name.trim(), email: email.trim(), phone: phone.trim() });
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md bg-surface border-border" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-foreground">Welcome to Luxe Store!</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Please set up your profile to get started.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <Label htmlFor="setup-name" className="text-sm font-medium text-foreground mb-1 block">
              Full Name *
            </Label>
            <Input
              id="setup-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="bg-muted border-border"
              required
            />
          </div>
          <div>
            <Label htmlFor="setup-email" className="text-sm font-medium text-foreground mb-1 block">
              Email
            </Label>
            <Input
              id="setup-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="bg-muted border-border"
            />
          </div>
          <div>
            <Label htmlFor="setup-phone" className="text-sm font-medium text-foreground mb-1 block">
              Phone
            </Label>
            <Input
              id="setup-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="bg-muted border-border"
            />
          </div>
          <Button
            type="submit"
            disabled={!name.trim() || saveProfile.isPending}
            className="w-full"
          >
            {saveProfile.isPending ? 'Saving...' : 'Get Started'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
