
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface BookingsSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export const BookingsSearch = ({ value, onChange }: BookingsSearchProps) => {
  return (
    <div className="relative mb-6">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Поиск по имени, телефону или названию тура"
        className="pl-8"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};
