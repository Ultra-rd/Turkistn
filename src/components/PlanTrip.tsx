
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Hotel, Bus, Plane, Ticket } from 'lucide-react';

const PlanTrip = () => {
  return (
    <section id="plan" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-turkestan-blue mb-4">
            Спланируйте свою поездку
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Вся необходимая информация для планирования идеального путешествия в Туркестан
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Hotel className="h-6 w-6 mr-2 text-turkestan-purple" />
                Проживание
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Туркестан предлагает различные варианты проживания – от роскошных отелей до домашних гостевых домов:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>
                  <span className="font-medium">Отели в центре города:</span> Современные удобства рядом с главными достопримечательностями
                </li>
                <li>
                  <span className="font-medium">Гостевые дома:</span> Аутентичный опыт с домашней кухней и местным гостеприимством
                </li>
                <li>
                  <span className="font-medium">Юрточные лагеря:</span> Уникальная возможность испытать традиционный образ жизни кочевников
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plane className="h-6 w-6 mr-2 text-turkestan-purple" />
                Как добраться
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Несколько способов добраться до Туркестана:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>
                  <span className="font-medium">Самолетом:</span> Международный аэропорт Туркестан принимает рейсы из крупных городов Казахстана и некоторых международных направлений
                </li>
                <li>
                  <span className="font-medium">Поездом:</span> Регулярные рейсы из Нур-Султана, Алматы и других крупных городов до железнодорожного вокзала Туркестана
                </li>
                <li>
                  <span className="font-medium">Автобусом:</span> Автобусные маршруты связывают Туркестан с соседними городами и регионами
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bus className="h-6 w-6 mr-2 text-turkestan-purple" />
                Транспорт на месте
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Варианты передвижения по Туркестану и окрестностям:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>
                  <span className="font-medium">Такси:</span> Доступный способ передвижения по городу
                </li>
                <li>
                  <span className="font-medium">Аренда автомобиля:</span> Для большей свободы передвижения по региону
                </li>
                <li>
                  <span className="font-medium">Экскурсионные автобусы:</span> Организованные туры с транспортом до основных достопримечательностей
                </li>
                <li>
                  <span className="font-medium">Общественный транспорт:</span> Автобусы и маршрутки связывают основные районы города
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Ticket className="h-6 w-6 mr-2 text-turkestan-purple" />
                Визовая информация
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Важная информация о визах для посетителей Туркестана:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>
                  <span className="font-medium">Безвизовый режим:</span> Граждане многих стран СНГ могут посещать Казахстан без визы на срок до 30 дней
                </li>
                <li>
                  <span className="font-medium">Электронная виза:</span> Граждане некоторых стран могут оформить электронную визу через портал <a href="#" className="text-turkestan-purple hover:underline">migration.gov.kz</a>
                </li>
                <li>
                  <span className="font-medium">Туристическая виза:</span> Для граждан других стран требуется туристическая виза, которую нужно оформить в посольстве Казахстана
                </li>
                <li>
                  <span className="font-medium">Регистрация:</span> Иностранные граждане должны зарегистрироваться в местной миграционной службе в течение 5 рабочих дней после прибытия
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default PlanTrip;
