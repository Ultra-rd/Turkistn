
import React from "react";
import { useNavigate } from "react-router-dom";
import { Settings as SettingsIcon, Moon, Sun, LogIn, User } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { getTranslation } from "@/utils/translations";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/hooks/use-theme";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

export const Settings = () => {
  const { language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Language options with their display names
  const languages = [
    { code: "ru", name: "Русский" },
    { code: "kz", name: "Қазақша" },
    { code: "en", name: "English" },
  ];

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    // Check initial authentication state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full">
          <SettingsIcon className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-4" align="end">
        <div className="flex flex-col gap-4">
          {/* Theme Toggle */}
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium">{getTranslation("theme", language)}</h3>
            <Button 
              variant="outline"
              className="justify-between"
              onClick={toggleTheme}
            >
              {theme === "dark" ? (
                <>
                  <Moon className="h-4 w-4 mr-2" />
                  <span>{getTranslation("darkMode", language)}</span>
                </>
              ) : (
                <>
                  <Sun className="h-4 w-4 mr-2" />
                  <span>{getTranslation("lightMode", language)}</span>
                </>
              )}
            </Button>
          </div>

          <Separator />

          {/* Language Selection */}
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium">{getTranslation("language", language)}</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="justify-between">
                  {languages.find(lang => lang.code === language)?.name || language.toUpperCase()}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    className={language === lang.code ? "bg-accent text-accent-foreground" : ""}
                    onClick={() => setLanguage(lang.code as "ru" | "kz" | "en")}
                  >
                    {lang.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Separator />

          {/* Authentication */}
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium">{getTranslation("account", language)}</h3>
            {isAuthenticated ? (
              <Button
                variant="outline"
                className="justify-between"
                onClick={async () => {
                  await supabase.auth.signOut();
                  navigate("/");
                }}
              >
                <User className="h-4 w-4 mr-2" />
                <span>{getTranslation("logout", language)}</span>
              </Button>
            ) : (
              <Button
                variant="outline"
                className="justify-between"
                onClick={() => navigate("/auth")}
              >
                <LogIn className="h-4 w-4 mr-2" />
                <span>{getTranslation("login", language)}</span>
              </Button>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Settings;
