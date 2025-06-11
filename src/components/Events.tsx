
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, MapPin, Plus } from 'lucide-react';
import { useEvents } from '@/hooks/use-events';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Events = () => {
  const { events, isLoading, isAdmin } = useEvents();
  const navigate = useNavigate();

  return (
    <section className="py-16 bg-turkestan-blue text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Мероприятия
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Узнайте о предстоящих мероприятиях и присоединяйтесь к нам
          </p>
        </div>

        {isAdmin && (
          <div className="text-center mb-8">
            <Button 
              onClick={() => navigate('/admin/dashboard')}
              className="bg-turkestan-purple hover:bg-purple-700 flex items-center gap-2 mx-auto"
            >
              <Plus className="h-4 w-4" />
              Управление мероприятиями
            </Button>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-8">Загрузка...</div>
        ) : events.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-white/80">Нет предстоящих мероприятий</p>
            {isAdmin && (
              <Button 
                onClick={() => navigate('/admin/dashboard')}
                className="bg-turkestan-purple hover:bg-purple-700 mt-4 flex items-center gap-2 mx-auto"
              >
                <Plus className="h-4 w-4" />
                Добавить первое мероприятие
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {events.map((event) => (
              <Card 
                key={event.id}
                className="bg-white/10 backdrop-blur-sm border-none text-white overflow-hidden hover:transform hover:scale-105 transition-all duration-300"
              >
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">{event.name}</h3>
                  <p className="text-white/80 mb-4 line-clamp-3">{event.description}</p>
                  
                  <div className="flex items-center gap-2 text-turkestan-gold mb-2">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">{event.date}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-turkestan-gold mb-2">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">{event.time}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-turkestan-gold">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{event.location}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Events;
