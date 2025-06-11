
import { format } from 'date-fns';
import { ArrowUpDown, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from '@/components/ui/table';
import type { Booking } from '@/hooks/use-bookings';

interface BookingsTableProps {
  bookings: Booking[];
  onDelete: (id: string) => void;
  onSort: (key: string) => void;
  sortConfig: {
    key: string | null;
    direction: 'ascending' | 'descending';
  };
}

export const BookingsTable = ({ 
  bookings, 
  onDelete, 
  onSort,
  sortConfig 
}: BookingsTableProps) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return '—';
    try {
      return format(new Date(dateString), 'dd.MM.yyyy HH:mm');
    } catch (e) {
      return dateString;
    }
  };

  const getSortIcon = (key: string) => {
    if (sortConfig.key === key) {
      return (
        <ArrowUpDown 
          className={`ml-2 h-4 w-4 inline transition-transform ${
            sortConfig.direction === 'ascending' ? 'rotate-0' : 'rotate-180'
          }`} 
        />
      );
    }
    return <ArrowUpDown className="ml-2 h-4 w-4 inline opacity-50" />;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="cursor-pointer"
              onClick={() => onSort('full_name')}
            >
              Имя
              {getSortIcon('full_name')}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => onSort('phone')}
            >
              Телефон
              {getSortIcon('phone')}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => onSort('tours')}
            >
              Название тура
              {getSortIcon('tours')}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => onSort('created_at')}
            >
              Дата бронирования
              {getSortIcon('created_at')}
            </TableHead>
            <TableHead>Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                Нет данных для отображения
              </TableCell>
            </TableRow>
          ) : (
            bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="font-medium">{booking.full_name}</TableCell>
                <TableCell>{booking.phone}</TableCell>
                <TableCell>{booking.tours?.title || 'Тур не найден'}</TableCell>
                <TableCell>{formatDate(booking.created_at)}</TableCell>
                <TableCell>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => onDelete(booking.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
