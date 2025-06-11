
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Plus, Edit, Trash2 } from 'lucide-react';
import { useTourAgents, TourAgent } from '@/hooks/use-tour-agents';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const AdminTourAgents = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { tourAgents, isAdmin, deleteTourAgent, refetch } = useTourAgents();
  const [showForm, setShowForm] = useState(false);
  const [editingAgent, setEditingAgent] = useState<TourAgent | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    logo: '',
    description: '',
    phone: '',
    email: '',
    website: ''
  });

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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      logo: '',
      description: '',
      phone: '',
      email: '',
      website: ''
    });
    setEditingAgent(null);
    setShowForm(false);
  };

  const handleEdit = (agent: TourAgent) => {
    setEditingAgent(agent);
    setFormData({
      name: agent.name,
      logo: agent.logo,
      description: agent.description || '',
      phone: agent.phone || '',
      email: agent.email || '',
      website: agent.website || ''
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.logo) {
      toast({
        title: "Ошибка",
        description: "Название и логотип обязательны для заполнения",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingAgent) {
        const { error } = await supabase
          .from('tour_agents')
          .update({
            name: formData.name,
            logo: formData.logo,
            description: formData.description || null,
            phone: formData.phone || null,
            email: formData.email || null,
            website: formData.website || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingAgent.id);

        if (error) throw error;

        toast({
          title: "Успешно",
          description: "Турагент обновлен",
        });
      } else {
        const { error } = await supabase
          .from('tour_agents')
          .insert([{
            name: formData.name,
            logo: formData.logo,
            description: formData.description || null,
            phone: formData.phone || null,
            email: formData.email || null,
            website: formData.website || null
          }]);

        if (error) throw error;

        toast({
          title: "Успешно",
          description: "Турагент добавлен",
        });
      }

      resetForm();
      refetch();
    } catch (error) {
      console.error('Error saving tour agent:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить турагента",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (window.confirm(`Вы уверены, что хотите удалить турагента "${name}"?`)) {
      await deleteTourAgent(id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-4">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Управление турагентами</h1>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => navigate('/admin/dashboard')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Назад в админпанель
            </Button>
            <Button 
              onClick={() => setShowForm(true)}
              className="bg-turkestan-purple hover:bg-turkestan-blue flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Добавить турагента
            </Button>
          </div>
        </div>

        {showForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>
                {editingAgent ? 'Редактировать турагента' : 'Добавить нового турагента'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Название *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Название турагентства"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="logo">URL логотипа *</Label>
                    <Input
                      id="logo"
                      value={formData.logo}
                      onChange={(e) => handleInputChange('logo', e.target.value)}
                      placeholder="https://example.com/logo.jpg"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Телефон</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+7 (727) 123-45-67"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="info@company.kz"
                    />
                  </div>
                  <div>
                    <Label htmlFor="website">Веб-сайт</Label>
                    <Input
                      id="website"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      placeholder="https://company.kz"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Описание</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Краткое описание турагентства..."
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="bg-turkestan-purple hover:bg-turkestan-blue">
                    {editingAgent ? 'Обновить' : 'Создать'}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Отмена
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Список турагентов</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Логотип</TableHead>
                  <TableHead>Название</TableHead>
                  <TableHead>Контакты</TableHead>
                  <TableHead>Описание</TableHead>
                  <TableHead>Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tourAgents.map((agent) => (
                  <TableRow key={agent.id}>
                    <TableCell>
                      <img 
                        src={agent.logo} 
                        alt={agent.name} 
                        className="w-12 h-12 object-cover rounded"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{agent.name}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {agent.phone && <div>📞 {agent.phone}</div>}
                        {agent.email && <div>✉️ {agent.email}</div>}
                        {agent.website && <div>🌐 {agent.website}</div>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate">
                        {agent.description || '-'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(agent)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(agent.id, agent.name)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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

export default AdminTourAgents;
