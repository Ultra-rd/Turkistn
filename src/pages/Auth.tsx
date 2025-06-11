
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, LogIn, UserPlus, Mail, Lock } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { getTranslation } from '@/utils/translations';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { language } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        toast({
          title: getTranslation('success', language),
          description: getTranslation('checkEmail', language),
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate('/');
      }
    } catch (error: any) {
      toast({
        title: getTranslation('error', language),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-100 py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Language switcher positioned at the top right */}
      <div className="absolute top-4 right-4 z-20">
        <LanguageSwitcher />
      </div>
      
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-lg overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-turkestan-purple/10 to-turkestan-blue/5 z-0 opacity-50 rounded-lg"></div>
          
          <CardHeader className="relative z-10 text-center pb-6">
            <CardTitle className="text-3xl font-bold text-turkestan-blue">
              {isSignUp 
                ? getTranslation('createAccount', language) || 'Создать аккаунт'
                : getTranslation('signIn', language) || 'Войти в аккаунт'
              }
            </CardTitle>
            <CardDescription className="text-gray-600 mt-2">
              {isSignUp 
                ? getTranslation('registerToContinue', language) || 'Зарегистрируйтесь, чтобы продолжить'
                : getTranslation('signInToContinue', language) || 'Войдите, чтобы продолжить'
              }
            </CardDescription>
          </CardHeader>

          <CardContent className="relative z-10 px-6 pt-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  {getTranslation('email', language) || 'Email'}
                </Label>
                <div className="relative">
                  <div className="absolute left-3 top-3 text-gray-400">
                    <Mail size={16} />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    required
                    placeholder={getTranslation('enterEmail', language) || 'Введите email'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  {getTranslation('password', language) || 'Пароль'}
                </Label>
                <div className="relative">
                  <div className="absolute left-3 top-3 text-gray-400">
                    <Lock size={16} />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder={getTranslation('enterPassword', language) || 'Введите пароль'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-turkestan-purple hover:bg-turkestan-blue transition-colors duration-300 flex items-center justify-center gap-2 h-11"
                disabled={isLoading}
              >
                {isLoading ? (
                  getTranslation('loading', language) || 'Загрузка...'
                ) : isSignUp ? (
                  <>
                    <UserPlus size={18} />
                    {getTranslation('register', language) || 'Зарегистрироваться'}
                  </>
                ) : (
                  <>
                    <LogIn size={18} />
                    {getTranslation('login', language) || 'Войти'}
                  </>
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="relative z-10 px-6 py-4 flex flex-col items-center">
            <Button
              variant="link"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-turkestan-purple hover:text-turkestan-blue transition-colors"
            >
              {isSignUp 
                ? getTranslation('alreadyHaveAccount', language) || 'Уже есть аккаунт? Войти'
                : getTranslation('dontHaveAccount', language) || 'Нет аккаунта? Зарегистрироваться'
              }
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
