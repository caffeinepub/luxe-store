import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ShippingAddress } from "../backend";

interface ShippingAddressFormProps {
  value: ShippingAddress;
  onChange: (address: ShippingAddress) => void;
}

export default function ShippingAddressForm({
  value,
  onChange,
}: ShippingAddressFormProps) {
  const update = (field: keyof ShippingAddress, val: string) => {
    onChange({ ...value, [field]: val });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="sm:col-span-2">
        <Label
          htmlFor="name"
          className="text-sm font-medium text-foreground mb-1 block"
        >
          Full Name
        </Label>
        <Input
          id="name"
          value={value.name}
          onChange={(e) => update("name", e.target.value)}
          placeholder="John Doe"
          className="bg-muted border-border"
        />
      </div>
      <div className="sm:col-span-2">
        <Label
          htmlFor="address"
          className="text-sm font-medium text-foreground mb-1 block"
        >
          Address
        </Label>
        <Input
          id="address"
          value={value.address}
          onChange={(e) => update("address", e.target.value)}
          placeholder="123 Main Street, Apt 4B"
          className="bg-muted border-border"
        />
      </div>
      <div>
        <Label
          htmlFor="city"
          className="text-sm font-medium text-foreground mb-1 block"
        >
          City
        </Label>
        <Input
          id="city"
          value={value.city}
          onChange={(e) => update("city", e.target.value)}
          placeholder="New York"
          className="bg-muted border-border"
        />
      </div>
      <div>
        <Label
          htmlFor="state"
          className="text-sm font-medium text-foreground mb-1 block"
        >
          State
        </Label>
        <Input
          id="state"
          value={value.state}
          onChange={(e) => update("state", e.target.value)}
          placeholder="NY"
          className="bg-muted border-border"
        />
      </div>
      <div>
        <Label
          htmlFor="zipCode"
          className="text-sm font-medium text-foreground mb-1 block"
        >
          ZIP Code
        </Label>
        <Input
          id="zipCode"
          value={value.zipCode}
          onChange={(e) => update("zipCode", e.target.value)}
          placeholder="10001"
          className="bg-muted border-border"
        />
      </div>
      <div>
        <Label
          htmlFor="country"
          className="text-sm font-medium text-foreground mb-1 block"
        >
          Country
        </Label>
        <Input
          id="country"
          value={value.country}
          onChange={(e) => update("country", e.target.value)}
          placeholder="United States"
          className="bg-muted border-border"
        />
      </div>
      <div className="sm:col-span-2">
        <Label
          htmlFor="phone"
          className="text-sm font-medium text-foreground mb-1 block"
        >
          Phone Number
        </Label>
        <Input
          id="phone"
          value={value.phone}
          onChange={(e) => update("phone", e.target.value)}
          placeholder="+1 (555) 000-0000"
          className="bg-muted border-border"
        />
      </div>
    </div>
  );
}
