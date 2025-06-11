
import { Globe } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  // Language options with their display names
  const languages = [
    { code: 'ru', name: 'Русский' },
    { code: 'kz', name: 'Қазақша' },
    { code: 'en', name: 'English' },
  ];

  // Find the current language's display name
  const currentLanguageName = languages.find(lang => lang.code === language)?.name || 'RU';
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-1 px-2"
        >
          <Globe className="h-4 w-4" />
          <span>{language.toUpperCase()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-32">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            className={language === lang.code ? "bg-accent text-accent-foreground" : ""}
            onClick={() => setLanguage(lang.code as 'ru' | 'kz' | 'en')}
          >
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
