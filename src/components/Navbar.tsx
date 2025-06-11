
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import AuthButton from './AuthButton';
import { useLanguage } from '@/hooks/use-language';
import { getTranslation } from '@/utils/translations';
import Settings from './Settings';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const { language } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      subscription.unsubscribe();
    };
  }, [scrolled]);

  const navItems = [
    { name: getTranslation('destinations', language), href: '/#destinations', isPageLink: false },
    { name: getTranslation('attractions', language), href: '/#attractions', isPageLink: false },
    { name: getTranslation('tours', language), href: '/#tours', isPageLink: false },
    { name: getTranslation('planning', language), href: '/#plan', isPageLink: false },
    { name: getTranslation('about', language), href: '/#about', isPageLink: false },
    { name: getTranslation('contacts', language), href: '/#contact', isPageLink: false },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, item: { href: string, isPageLink: boolean }) => {
    if (!item.isPageLink && item.href.startsWith('#')) {
      e.preventDefault();
      const id = item.href.replace('/#', '').replace('#', '');
      
      // If we're on the homepage, scroll to the section
      if (window.location.pathname === '/') {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        // If we're not on the homepage, navigate to homepage + hash
        navigate(`/${item.href}`);
      }
    }
  };

  return (
    <header
      className={cn(
        'fixed w-full z-50 transition-all duration-300',
        scrolled ? 'bg-white/90 backdrop-blur-md shadow-md py-2' : 'bg-transparent py-4'
      )}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <a href="/" className="flex items-center">
          <span className={cn(
            'text-2xl font-serif font-bold transition-colors',
            scrolled ? 'text-turkestan-blue' : 'text-white'
          )}>
            Туркестан
          </span>
        </a>

        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={(e) => handleNavClick(e, item)}
              className={cn(
                'text-sm font-medium transition-colors hover:text-turkestan-purple',
                scrolled ? 'text-turkestan-dark' : 'text-white'
              )}
            >
              {item.name}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {/* Replace LanguageSwitcher with Settings */}
          <Settings />
          
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={cn(
                'text-2xl',
                scrolled ? 'text-turkestan-dark' : 'text-white'
              )}
            >
              <Menu />
            </Button>
          </div>

          <div>
            {isAuthenticated && <AuthButton />}
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => {
                  handleNavClick(e, item);
                  setMobileMenuOpen(false);
                }}
                className="block px-3 py-2 text-base font-medium text-turkestan-dark hover:bg-turkestan-light"
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
