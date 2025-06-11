
-- Добавляем таблицу для фотографий турагентов
CREATE TABLE public.tour_agent_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tour_agent_id INTEGER REFERENCES public.tour_agents(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Добавляем таблицу для постов турагентов
CREATE TABLE public.tour_agent_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tour_agent_id INTEGER REFERENCES public.tour_agents(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Добавляем связь туров с турагентами
ALTER TABLE public.tours ADD COLUMN tour_agent_id INTEGER REFERENCES public.tour_agents(id);

-- Добавляем индексы для оптимизации запросов
CREATE INDEX idx_tour_agent_photos_agent_id ON public.tour_agent_photos(tour_agent_id);
CREATE INDEX idx_tour_agent_posts_agent_id ON public.tour_agent_posts(tour_agent_id);
CREATE INDEX idx_tours_agent_id ON public.tours(tour_agent_id);
