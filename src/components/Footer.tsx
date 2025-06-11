
import React from 'react';
import { cn } from '@/lib/utils';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-turkestan-blue text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-serif font-bold mb-4">Туркестан</h3>
            <p className="text-white/80 mb-4">
              Ваш надежный гид по удивительному и историческому региону Казахстана. Мы помогаем путешественникам открыть для себя все чудеса и красоту Туркестана.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Быстрые ссылки</h3>
            <ul className="space-y-2">
              {[
                { name: 'Направления', href: '#destinations' },
                { name: 'Туры', href: '#tours' },
                { name: 'Планирование', href: '#plan' },
                { name: 'О регионе', href: '#about' },
                { name: 'Контакты', href: '#contact' },
              ].map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href} 
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Популярные туры</h3>
            <ul className="space-y-2">
              {[
                'Исторический Туркестан',
                'Природа Аксу-Жабаглы',
                'По следам Шелкового пути',
                'Древние городища',
                'Природные парки'
              ].map((tour) => (
                <li key={tour}>
                  <a 
                    href="#" 
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    {tour}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Информационный бюллетень</h3>
            <p className="text-white/80 mb-3">
              Подпишитесь на нашу рассылку, чтобы получать последние новости и специальные предложения.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Ваш e-mail"
                className={cn(
                  "flex h-10 w-full rounded-l-md border border-input bg-white/10 px-3 py-2",
                  "text-sm ring-offset-background file:border-0 file:bg-transparent",
                  "file:text-sm file:font-medium placeholder:text-white/50",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                )}
              />
              <button
                type="submit"
                className="bg-turkestan-gold hover:bg-turkestan-gold/90 text-white py-2 px-4 rounded-r-md"
              >
                Подписаться
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-12 pt-8 text-center text-white/60 text-sm">
          <p>&copy; {new Date().getFullYear()} Туркестан. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
