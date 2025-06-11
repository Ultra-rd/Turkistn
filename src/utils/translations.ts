
type TranslationKey = {
  [key: string]: {
    ru: string;
    kz: string;
    en: string;
  };
};

export const translations: TranslationKey = {
  destinations: {
    ru: 'Направления',
    kz: 'Бағыттар',
    en: 'Destinations',
  },
  attractions: {
    ru: 'Достопримечательности',
    kz: 'Көрікті жерлер',
    en: 'Attractions',
  },
  tours: {
    ru: 'Туры',
    kz: 'Турлар',
    en: 'Tours',
  },
  planning: {
    ru: 'Планирование',
    kz: 'Жоспарлау',
    en: 'Planning',
  },
  about: {
    ru: 'О регионе',
    kz: 'Аймақ туралы',
    en: 'About',
  },
  contacts: {
    ru: 'Контакты',
    kz: 'Байланыс',
    en: 'Contacts',
  },
  login: {
    ru: 'Войти',
    kz: 'Кіру',
    en: 'Login',
  },
  // Authentication translations
  createAccount: {
    ru: 'Создать аккаунт',
    kz: 'Тіркелгі жасау',
    en: 'Create Account',
  },
  signIn: {
    ru: 'Войти в аккаунт',
    kz: 'Тіркелгіге кіру',
    en: 'Sign In',
  },
  registerToContinue: {
    ru: 'Зарегистрируйтесь, чтобы продолжить',
    kz: 'Жалғастыру үшін тіркеліңіз',
    en: 'Register to continue',
  },
  signInToContinue: {
    ru: 'Войдите, чтобы продолжить',
    kz: 'Жалғастыру үшін кіріңіз',
    en: 'Sign in to continue',
  },
  email: {
    ru: 'Email',
    kz: 'Email',
    en: 'Email',
  },
  enterEmail: {
    ru: 'Введите email',
    kz: 'Email енгізіңіз',
    en: 'Enter email',
  },
  password: {
    ru: 'Пароль',
    kz: 'Құпия сөз',
    en: 'Password',
  },
  enterPassword: {
    ru: 'Введите пароль',
    kz: 'Құпия сөзді енгізіңіз',
    en: 'Enter password',
  },
  register: {
    ru: 'Зарегистрироваться',
    kz: 'Тіркелу',
    en: 'Register',
  },
  loading: {
    ru: 'Загрузка...',
    kz: 'Жүктелуде...',
    en: 'Loading...',
  },
  alreadyHaveAccount: {
    ru: 'Уже есть аккаунт? Войти',
    kz: 'Тіркелгіңіз бар ма? Кіру',
    en: 'Already have an account? Sign in',
  },
  dontHaveAccount: {
    ru: 'Нет аккаунта? Зарегистрироваться',
    kz: 'Тіркелгіңіз жоқ па? Тіркелу',
    en: 'Don\'t have an account? Register',
  },
  success: {
    ru: 'Успешно',
    kz: 'Сәтті',
    en: 'Success',
  },
  error: {
    ru: 'Ошибка',
    kz: 'Қате',
    en: 'Error',
  },
  checkEmail: {
    ru: 'Проверьте вашу электронную почту для подтверждения регистрации',
    kz: 'Тіркелуді растау үшін электрондық поштаңызды тексеріңіз',
    en: 'Check your email to confirm your registration',
  },
  // Settings translations
  settings: {
    ru: 'Настройки',
    kz: 'Параметрлер',
    en: 'Settings',
  },
  theme: {
    ru: 'Тема',
    kz: 'Тема',
    en: 'Theme',
  },
  darkMode: {
    ru: 'Темная тема',
    kz: 'Қараңғы тема',
    en: 'Dark Mode',
  },
  lightMode: {
    ru: 'Светлая тема',
    kz: 'Жарық тема',
    en: 'Light Mode',
  },
  language: {
    ru: 'Язык',
    kz: 'Тіл',
    en: 'Language',
  },
  account: {
    ru: 'Аккаунт',
    kz: 'Тіркелгі',
    en: 'Account',
  },
  logout: {
    ru: 'Выйти',
    kz: 'Шығу',
    en: 'Logout',
  }
};

export const getTranslation = (key: string, language: 'ru' | 'kz' | 'en'): string => {
  // Ensure we're always returning a string by converting any non-string values
  return String(translations[key]?.[language] || translations[key]?.ru || key);
};
