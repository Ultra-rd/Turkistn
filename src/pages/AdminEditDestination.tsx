
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Pencil, Upload } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface Destination {
  id: number;
  name: string;
  description: string;
  image: string;
  google_maps_url: string;
  district?: string;
  detailed_info?: string;
  audio_file?: string;
}

const formSchema = z.object({
  name: z.string().min(2, "Название должно содержать минимум 2 символа"),
  description: z.string().min(10, "Описание должно содержать минимум 10 символов"),
  image: z.string().url("Должен быть действительный URL"),
  google_maps_url: z.string().url("Должен быть действительный URL"),
  district: z.string().optional(),
  detailed_info: z.string().optional(),
  audio_file: z.string().url("Должен быть действительный URL").optional().or(z.literal('')),
});

const AdminEditDestination = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      image: "",
      google_maps_url: "",
      district: "",
      detailed_info: "",
      audio_file: "",
    },
  });

  useEffect(() => {
    const fetchDestination = async () => {
      if (!id) return;
      
      setIsLoading(true);
      const { data, error } = await supabase
        .from('destinations')
        .select('*')
        .eq('id', parseInt(id))
        .single();

      if (error) {
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить информацию о направлении",
          variant: "destructive",
        });
        navigate('/admin/destinations');
        return;
      }

      if (data) {
        form.reset({
          name: data.name,
          description: data.description,
          image: data.image,
          google_maps_url: data.google_maps_url,
          district: data.district || "",
          detailed_info: data.detailed_info || "",
          audio_file: data.audio_file || "",
        });
      }
      
      setIsLoading(false);
    };

    const checkAdminStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        
        const isUserAdmin = data?.role === 'admin';
        setIsAdmin(isUserAdmin);
        
        if (!isUserAdmin) {
          toast({
            title: "Доступ запрещен",
            description: "У вас нет прав администратора для редактирования информации",
            variant: "destructive",
          });
          navigate('/');
        }
      } else {
        toast({
          title: "Доступ запрещен",
          description: "Пожалуйста, войдите в систему, чтобы получить доступ",
          variant: "destructive",
        });
        navigate('/auth');
      }
    };

    checkAdminStatus();
    fetchDestination();
  }, [id, navigate, toast, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!id) return;
    
    try {
      const { error } = await supabase
        .from('destinations')
        .update({
          name: values.name,
          description: values.description,
          image: values.image,
          google_maps_url: values.google_maps_url,
          district: values.district || null,
          detailed_info: values.detailed_info || null,
          audio_file: values.audio_file || null,
        })
        .eq('id', parseInt(id));

      if (error) throw error;

      toast({
        title: "Успех",
        description: "Информация о направлении успешно обновлена",
      });
      
      navigate(`/destination/${id}`);
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось обновить информацию",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-10 mt-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <Button 
              variant="outline" 
              onClick={() => navigate(`/destination/${id}`)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Назад
            </Button>
            <h1 className="text-2xl font-bold">Редактирование направления</h1>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Название</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Краткое описание</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL изображения</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="google_maps_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL Google Maps</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="district"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Район (необязательно)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="audio_file"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Аудио файл (MP3 URL)</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <Input 
                          {...field} 
                          placeholder="https://example.com/audio.mp3"
                          className="flex-1"
                        />
                        {field.value && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => window.open(field.value, '_blank')}
                            className="flex items-center gap-1"
                          >
                            <Upload className="h-4 w-4" /> Проверить
                          </Button>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="detailed_info"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Подробная информация</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        className="min-h-[200px]"
                        placeholder="Введите подробную информацию о направлении..." 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  className="bg-turkestan-blue hover:bg-turkestan-blue/90 text-white flex items-center gap-2"
                >
                  <Save className="h-4 w-4" /> Сохранить изменения
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminEditDestination;
