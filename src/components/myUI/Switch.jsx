import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function SwitchDemo({ value, onChange, label }) {
  return (
    <div className="flex items-center space-x-2  " dir="ltr">
      <Switch id="airplane-mode" checked={value} onCheckedChange={onChange} />
      <Label htmlFor="airplane-mode">{label}</Label>
    </div>
  );
}
