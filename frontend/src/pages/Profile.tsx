import { useState, useEffect } from 'react';
import { User, Loader2, Save } from 'lucide-react';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

export default function Profile() {
  const { identity, login } = useInternetIdentity();
  const { data: profile, isLoading } = useGetCallerUserProfile();
  const saveProfile = useSaveCallerUserProfile();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setEmail(profile.email);
      setPhone(profile.phone);
    }
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Name is required');
      return;
    }
    try {
      await saveProfile.mutateAsync({ name: name.trim(), email: email.trim(), phone: phone.trim() });
      toast.success('Profile updated successfully!');
    } catch {
      toast.error('Failed to update profile');
    }
  };

  if (!identity) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="font-serif text-2xl text-foreground mb-3">My Profile</h2>
        <p className="text-muted-foreground font-sans mb-6">Please login to view your profile</p>
        <Button onClick={login} className="bg-gold text-charcoal hover:bg-gold-light font-semibold">
          Login to Continue
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-8 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  const inputClass = "bg-card border-border text-foreground placeholder:text-muted-foreground focus:border-gold/60 h-11";

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <div className="mb-8">
        <p className="text-gold text-xs font-sans uppercase tracking-[0.2em] mb-1">Account</p>
        <h1 className="font-serif text-2xl md:text-3xl text-foreground">My Profile</h1>
      </div>

      {/* Principal ID */}
      <div className="bg-muted rounded-lg p-4 mb-6">
        <p className="text-xs text-muted-foreground font-sans uppercase tracking-wider mb-1">Principal ID</p>
        <p className="text-xs text-foreground/60 font-mono break-all">{identity.getPrincipal().toString()}</p>
      </div>

      <form onSubmit={handleSave} className="bg-card border border-border rounded-lg p-6 space-y-5">
        <div className="space-y-1.5">
          <Label className="text-foreground/80 text-sm">Full Name *</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            className={inputClass}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-foreground/80 text-sm">Email Address</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className={inputClass}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-foreground/80 text-sm">Phone Number</Label>
          <Input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 98765 43210"
            className={inputClass}
          />
        </div>
        <Button
          type="submit"
          disabled={saveProfile.isPending}
          className="w-full bg-gold text-charcoal hover:bg-gold-light font-semibold h-11"
        >
          {saveProfile.isPending ? (
            <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...</>
          ) : (
            <><Save className="h-4 w-4 mr-2" /> Save Changes</>
          )}
        </Button>
      </form>
    </div>
  );
}
