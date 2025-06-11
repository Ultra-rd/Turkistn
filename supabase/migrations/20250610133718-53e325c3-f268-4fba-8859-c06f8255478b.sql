
-- Добавляем новое значение в существующий enum user_role
ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'tour_agent';

-- Добавляем связь пользователей с турагентами
CREATE TABLE IF NOT EXISTS public.user_tour_agents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tour_agent_id INTEGER REFERENCES public.tour_agents(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, tour_agent_id)
);

-- Создаем индексы для оптимизации запросов
CREATE INDEX IF NOT EXISTS idx_user_tour_agents_user_id ON public.user_tour_agents(user_id);
CREATE INDEX IF NOT EXISTS idx_user_tour_agents_agent_id ON public.user_tour_agents(tour_agent_id);

-- Обновляем функцию handle_new_user для установки роли по умолчанию
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, role)
  VALUES (new.id, 'user'::user_role);
  RETURN new;
END;
$$;

-- Добавляем RLS политики для новых таблиц
ALTER TABLE public.user_tour_agents ENABLE ROW LEVEL SECURITY;

-- Политики для user_tour_agents
CREATE POLICY "Users can view their own tour agent associations" 
  ON public.user_tour_agents 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all tour agent associations" 
  ON public.user_tour_agents 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can manage tour agent associations" 
  ON public.user_tour_agents 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Обновляем политики для tours чтобы турагенты могли управлять своими турами
CREATE POLICY "Tour agents can manage their tours" 
  ON public.tours 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_tour_agents uta
      WHERE uta.user_id = auth.uid() AND uta.tour_agent_id = tours.tour_agent_id
    )
  );

-- Обновляем политики для tour_agent_posts чтобы турагенты могли управлять своими постами
ALTER TABLE public.tour_agent_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view tour agent posts" 
  ON public.tour_agent_posts 
  FOR SELECT 
  TO public 
  USING (true);

CREATE POLICY "Tour agents can manage their posts" 
  ON public.tour_agent_posts 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_tour_agents uta
      WHERE uta.user_id = auth.uid() AND uta.tour_agent_id = tour_agent_posts.tour_agent_id
    )
  );

-- Обновляем политики для tour_agent_photos чтобы турагенты могли управлять своими фото
ALTER TABLE public.tour_agent_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view tour agent photos" 
  ON public.tour_agent_photos 
  FOR SELECT 
  TO public 
  USING (true);

CREATE POLICY "Tour agents can manage their photos" 
  ON public.tour_agent_photos 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_tour_agents uta
      WHERE uta.user_id = auth.uid() AND uta.tour_agent_id = tour_agent_photos.tour_agent_id
    )
  );
