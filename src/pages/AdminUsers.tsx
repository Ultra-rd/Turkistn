
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Users, Shield, UserCheck } from 'lucide-react';
import { useUsers } from '@/hooks/use-users';
import { useTourAgents } from '@/hooks/use-tour-agents';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const AdminUsers = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { users, loading, isAdmin, updateUserRole, assignTourAgent, removeTourAgent } = useUsers();
  const { tourAgents } = useTourAgents();

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      
      if (data?.role !== 'admin') {
        navigate('/');
        toast({
          title: "Доступ запрещен",
          description: "У вас нет прав администратора",
          variant: "destructive",
        });
      }
    } else {
      navigate('/auth');
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'tour_agent':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-3 w-3" />;
      case 'tour_agent':
        return <UserCheck className="h-3 w-3" />;
      default:
        return <Users className="h-3 w-3" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-4">
        <div className="container mx-auto px-4">
          <div className="text-center">Загрузка...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-4">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Управление пользователями</h1>
          <Button 
            variant="outline" 
            onClick={() => navigate('/admin/dashboard')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Назад в админпанель
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Список пользователей</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Имя</TableHead>
                  <TableHead>Телефон</TableHead>
                  <TableHead>Роль</TableHead>
                  <TableHead>Турагентства</TableHead>
                  <TableHead>Назначить турагентом</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.email}</TableCell>
                    <TableCell>{user.full_name || '-'}</TableCell>
                    <TableCell>{user.phone || '-'}</TableCell>
                    <TableCell>
                      <Select
                        value={user.role}
                        onValueChange={(value: 'user' | 'admin' | 'tour_agent') => 
                          updateUserRole(user.id, value)
                        }
                      >
                        <SelectTrigger className="w-36">
                          <SelectValue>
                            <Badge className={`${getRoleBadgeColor(user.role)} flex items-center gap-1`}>
                              {getRoleIcon(user.role)}
                              {user.role === 'admin' ? 'Админ' : 
                               user.role === 'tour_agent' ? 'Турагент' : 'Пользователь'}
                            </Badge>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">Пользователь</SelectItem>
                          <SelectItem value="admin">Админ</SelectItem>
                          <SelectItem value="tour_agent">Турагент</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {user.tour_agents?.map((agent) => (
                          <div key={agent.id} className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {agent.name}
                            </Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeTourAgent(user.id, agent.id)}
                              className="h-6 px-2 text-xs text-red-600 hover:text-red-700"
                            >
                              ×
                            </Button>
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                        onValueChange={(value) => assignTourAgent(user.id, parseInt(value))}
                      >
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Выберите турагентство" />
                        </SelectTrigger>
                        <SelectContent>
                          {tourAgents
                            .filter(agent => !user.tour_agents?.some(ua => ua.id === agent.id))
                            .map((agent) => (
                              <SelectItem key={agent.id} value={agent.id.toString()}>
                                {agent.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminUsers;
