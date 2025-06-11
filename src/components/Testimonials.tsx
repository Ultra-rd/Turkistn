
import React from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Елена Иванова',
    location: 'Москва, Россия',
    comment: 'Поездка в Туркестан превзошла все наши ожидания! Мавзолей Яссауи был захватывающим, а местные гиды очень знающие.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop'
  },
  {
    id: 2,
    name: 'Александр Петров',
    location: 'Санкт-Петербург, Россия',
    comment: 'Великолепная организация тура. Природные ландшафты потрясающие, а культурный опыт был невероятным.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop'
  },
  {
    id: 3,
    name: 'Мария Сидорова',
    location: 'Екатеринбург, Россия',
    comment: 'Тур по Шелковому пути открыл для меня совершенно новый мир. Настоятельно рекомендую всем, кто интересуется историей.',
    rating: 4,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop'
  }
];

const Testimonials = () => {
  return (
    <section className="py-16 bg-turkestan-blue text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Отзывы наших туристов
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Узнайте, что говорят о своем опыте в Туркестане наши путешественники
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id}
              className="bg-white/10 backdrop-blur-sm p-6 rounded-lg"
            >
              <div className="flex gap-4 items-center mb-4">
                <div className="h-12 w-12 rounded-full overflow-hidden">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-medium">{testimonial.name}</h4>
                  <p className="text-sm text-white/70">{testimonial.location}</p>
                </div>
              </div>
              
              <div className="flex mb-3">
                {Array(5).fill(0).map((_, i) => (
                  <Star 
                    key={i}
                    className={`h-4 w-4 ${i < testimonial.rating ? 'text-turkestan-gold fill-turkestan-gold' : 'text-white/30'}`}
                  />
                ))}
              </div>
              
              <p className="text-white/80 italic">"{testimonial.comment}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
