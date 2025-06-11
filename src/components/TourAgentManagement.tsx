
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';

interface TourAgentManagementProps {
  tourAgentId: number;
}

interface Post {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  created_at: string;
}

interface Photo {
  id: string;
  photo_url: string;
  caption?: string;
  created_at: string;
}

const TourAgentManagement: React.FC<TourAgentManagementProps> = ({ tourAgentId }) => {
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [canManage, setCanManage] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);
  const [showPhotoForm, setShowPhotoForm] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  
  const [postForm, setPostForm] = useState({
    title: '',
    content: '',
    image_url: ''
  });

  const [photoForm, setPhotoForm] = useState({
    photo_url: '',
    caption: ''
  });

  useEffect(() => {
    checkManagePermissions();
    fetchPosts();
    fetchPhotos();
  }, [tourAgentId]);

  const checkManagePermissions = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Проверяем, может ли пользователь управлять этим турагентством
    const { data } = await supabase
      .from('user_tour_agents')
      .select('*')
      .eq('user_id', user.id)
      .eq('tour_agent_id', tourAgentId)
      .single();

    setCanManage(!!data);
  };

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('tour_agent_posts')
      .select('*')
      .eq('tour_agent_id', tourAgentId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts:', error);
    } else {
      setPosts(data || []);
    }
  };

  const fetchPhotos = async () => {
    const { data, error } = await supabase
      .from('tour_agent_photos')
      .select('*')
      .eq('tour_agent_id', tourAgentId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching photos:', error);
    } else {
      setPhotos(data || []);
    }
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!postForm.title || !postForm.content) {
      toast({
        title: "Ошибка",
        description: "Заголовок и содержание обязательны",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingPost) {
        const { error } = await supabase
          .from('tour_agent_posts')
          .update({
            title: postForm.title,
            content: postForm.content,
            image_url: postForm.image_url || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingPost.id);

        if (error) throw error;
        toast({ title: "Успешно", description: "Пост обновлен" });
      } else {
        const { error } = await supabase
          .from('tour_agent_posts')
          .insert([{
            tour_agent_id: tourAgentId,
            title: postForm.title,
            content: postForm.content,
            image_url: postForm.image_url || null
          }]);

        if (error) throw error;
        toast({ title: "Успешно", description: "Пост создан" });
      }

      setPostForm({ title: '', content: '', image_url: '' });
      setShowPostForm(false);
      setEditingPost(null);
      fetchPosts();
    } catch (error) {
      console.error('Error saving post:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить пост",
        variant: "destructive",
      });
    }
  };

  const handlePhotoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!photoForm.photo_url) {
      toast({
        title: "Ошибка",
        description: "URL фотографии обязателен",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('tour_agent_photos')
        .insert([{
          tour_agent_id: tourAgentId,
          photo_url: photoForm.photo_url,
          caption: photoForm.caption || null
        }]);

      if (error) throw error;

      setPhotoForm({ photo_url: '', caption: '' });
      setShowPhotoForm(false);
      fetchPhotos();
      toast({ title: "Успешно", description: "Фотография добавлена" });
    } catch (error) {
      console.error('Error saving photo:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось добавить фотографию",
        variant: "destructive",
      });
    }
  };

  const deletePost = async (postId: string) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот пост?')) return;

    try {
      const { error } = await supabase
        .from('tour_agent_posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;
      
      fetchPosts();
      toast({ title: "Успешно", description: "Пост удален" });
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить пост",
        variant: "destructive",
      });
    }
  };

  const deletePhoto = async (photoId: string) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту фотографию?')) return;

    try {
      const { error } = await supabase
        .from('tour_agent_photos')
        .delete()
        .eq('id', photoId);

      if (error) throw error;
      
      fetchPhotos();
      toast({ title: "Успешно", description: "Фотография удалена" });
    } catch (error) {
      console.error('Error deleting photo:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить фотографию",
        variant: "destructive",
      });
    }
  };

  if (!canManage) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Управление постами */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Управление постами</CardTitle>
            <Button 
              onClick={() => {
                setShowPostForm(true);
                setEditingPost(null);
                setPostForm({ title: '', content: '', image_url: '' });
              }}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Добавить пост
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showPostForm && (
            <form onSubmit={handlePostSubmit} className="space-y-4 mb-6 p-4 border rounded">
              <div>
                <Label htmlFor="title">Заголовок *</Label>
                <Input
                  id="title"
                  value={postForm.title}
                  onChange={(e) => setPostForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Заголовок поста"
                  required
                />
              </div>
              <div>
                <Label htmlFor="content">Содержание *</Label>
                <Textarea
                  id="content"
                  value={postForm.content}
                  onChange={(e) => setPostForm(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Содержание поста..."
                  rows={4}
                  required
                />
              </div>
              <div>
                <Label htmlFor="image_url">URL изображения</Label>
                <Input
                  id="image_url"
                  value={postForm.image_url}
                  onChange={(e) => setPostForm(prev => ({ ...prev, image_url: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  {editingPost ? 'Обновить' : 'Создать'}
                </Button>
                <Button type="button" variant="outline" onClick={() => {
                  setShowPostForm(false);
                  setEditingPost(null);
                }}>
                  <X className="h-4 w-4" />
                  Отмена
                </Button>
              </div>
            </form>
          )}

          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="border rounded p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{post.title}</h3>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingPost(post);
                        setPostForm({
                          title: post.title,
                          content: post.content,
                          image_url: post.image_url || ''
                        });
                        setShowPostForm(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deletePost(post.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">{post.content}</p>
                {post.image_url && (
                  <img src={post.image_url} alt={post.title} className="mt-2 max-w-xs h-20 object-cover rounded" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Управление фотографиями */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Управление фотографиями</CardTitle>
            <Button 
              onClick={() => setShowPhotoForm(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Добавить фото
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showPhotoForm && (
            <form onSubmit={handlePhotoSubmit} className="space-y-4 mb-6 p-4 border rounded">
              <div>
                <Label htmlFor="photo_url">URL фотографии *</Label>
                <Input
                  id="photo_url"
                  value={photoForm.photo_url}
                  onChange={(e) => setPhotoForm(prev => ({ ...prev, photo_url: e.target.value }))}
                  placeholder="https://example.com/photo.jpg"
                  required
                />
              </div>
              <div>
                <Label htmlFor="caption">Подпись</Label>
                <Input
                  id="caption"
                  value={photoForm.caption}
                  onChange={(e) => setPhotoForm(prev => ({ ...prev, caption: e.target.value }))}
                  placeholder="Подпись к фотографии"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Добавить
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowPhotoForm(false)}>
                  <X className="h-4 w-4" />
                  Отмена
                </Button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <div key={photo.id} className="relative group">
                <img 
                  src={photo.photo_url} 
                  alt={photo.caption || 'Фото'} 
                  className="w-full h-24 object-cover rounded"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deletePhoto(photo.id)}
                  className="absolute top-1 right-1 text-red-600 hover:text-red-700 bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
                {photo.caption && (
                  <p className="text-xs text-gray-600 mt-1 truncate">{photo.caption}</p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TourAgentManagement;
