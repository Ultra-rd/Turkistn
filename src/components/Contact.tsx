
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Phone, Mail, MapPin } from 'lucide-react';

const Contact = () => {
  return (
    <section id="contact" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-turkestan-blue mb-4">
            Связаться с нами
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Есть вопросы о поездке в Туркестан? Наши эксперты по путешествиям готовы помочь вам!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="border border-gray-200">
              <CardContent className="pt-6">
                <form>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Имя
                      </label>
                      <Input
                        id="name"
                        placeholder="Ваше имя"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Эл. почта
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="ваша@почта.com"
                        className="w-full"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                      Тема
                    </label>
                    <Input
                      id="subject"
                      placeholder="Тема вашего сообщения"
                      className="w-full"
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Сообщение
                    </label>
                    <Textarea
                      id="message"
                      placeholder="Ваше сообщение..."
                      className="w-full h-32"
                    />
                  </div>
                  
                  <Button className="bg-turkestan-purple hover:bg-turkestan-blue w-full" size="lg">
                    Отправить сообщение
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <div className="bg-turkestan-blue text-white p-6 rounded-lg mb-6">
              <h3 className="text-xl font-semibold mb-4">Контактная информация</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <Phone className="h-5 w-5 mr-3 mt-1 text-turkestan-gold" />
                  <div>
                    <p className="font-medium">Телефон</p>
                    <p className="text-white/80">+7 (725) 333-44-55</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Mail className="h-5 w-5 mr-3 mt-1 text-turkestan-gold" />
                  <div>
                    <p className="font-medium">Эл. почта</p>
                    <p className="text-white/80">info@turkestan-travel.kz</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-3 mt-1 text-turkestan-gold" />
                  <div>
                    <p className="font-medium">Адрес</p>
                    <p className="text-white/80">
                      ул. Тауке хана 25, <br />
                      г. Туркестан, <br />
                      Туркестанская область, <br />
                      Казахстан
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-turkestan-light p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-turkestan-dark mb-4">Часы работы</h3>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span className="text-gray-600">Понедельник - Пятница:</span>
                  <span className="font-medium">9:00 - 18:00</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Суббота:</span>
                  <span className="font-medium">10:00 - 16:00</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Воскресенье:</span>
                  <span className="font-medium">Закрыто</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
