
-- Включаем Row Level Security для таблицы profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Создаем функцию для проверки роли пользователя (избегаем рекурсии в RLS)
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Политика: пользователи могут видеть свой собственный профиль
CREATE POLICY "Users can view own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

-- Политика: администраторы могут видеть все профили
CREATE POLICY "Admins can view all profiles" 
  ON public.profiles 
  FOR SELECT 
  USING (public.get_current_user_role() = 'admin');

-- Политика: пользователи могут обновлять свой собственный профиль
CREATE POLICY "Users can update own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Политика: администраторы могут обновлять все профили
CREATE POLICY "Admins can update all profiles" 
  ON public.profiles 
  FOR UPDATE 
  USING (public.get_current_user_role() = 'admin');

-- Включаем RLS для таблицы user_tour_agents
ALTER TABLE public.user_tour_agents ENABLE ROW LEVEL SECURITY;

-- Политика: администраторы могут видеть все связи пользователей с турагентами
CREATE POLICY "Admins can view all user_tour_agents" 
  ON public.user_tour_agents 
  FOR SELECT 
  USING (public.get_current_user_role() = 'admin');

-- Политика: администраторы могут вставлять связи пользователей с турагентами
CREATE POLICY "Admins can insert user_tour_agents" 
  ON public.user_tour_agents 
  FOR INSERT 
  WITH CHECK (public.get_current_user_role() = 'admin');

-- Политика: администраторы могут удалять связи пользователей с турагентами
CREATE POLICY "Admins can delete user_tour_agents" 
  ON public.user_tour_agents 
  FOR DELETE 
  USING (public.get_current_user_role() = 'admin');
