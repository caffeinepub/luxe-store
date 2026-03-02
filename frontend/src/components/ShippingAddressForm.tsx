/**
 * ShippingAddressForm.tsx — Controlled form for collecting shipping address
 * with all required fields and validation.
 */
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { ShippingAddress } from '@/backend';

interface ShippingAddressFormProps {
  value: ShippingAddress;
  onChange: (address: ShippingAddress) => void;
}

const FIELDS: Array<{
  key: keyof ShippingAddress;
  label: string;
  placeholder: string;
  type?: string;
  colSpan?: boolean;
}> = [
  { key: 'name',    label: 'Full Name',    placeholder: 'John Doe',          colSpan: true },
  { key: 'address', label: 'Address',      placeholder: '123 Main Street',   colSpan: true },
  { key: 'city',    label: 'City',         placeholder: 'New York' },
  { key: 'state',   label: 'State',        placeholder: 'NY' },
  { key: 'zipCode', label: 'ZIP Code',     placeholder: '10001' },
  { key: 'country', label: 'Country',      placeholder: 'United States' },
  { key: 'phone',   label: 'Phone Number', placeholder: '+1 (555) 000-0000', type: 'tel', colSpan: true },
];

export default function ShippingAddressForm({ value, onChange }: ShippingAddressFormProps) {
  const handleChange = (key: keyof ShippingAddress, val: string) => {
    onChange({ ...value, [key]: val });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {FIELDS.map(({ key, label, placeholder, type = 'text', colSpan }) => (
        <div key={key} className={colSpan ? 'sm:col-span-2' : ''}>
          <Label htmlFor={key} className="text-sm font-medium mb-1.5 block">
            {label} <span className="text-destructive">*</span>
          </Label>
          <Input
            id={key}
            type={type}
            placeholder={placeholder}
            value={value[key]}
            onChange={(e) => handleChange(key, e.target.value)}
            required
            className="h-10"
          />
        </div>
      ))}
    </div>
  );
}
