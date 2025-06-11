
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

const About = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  return (
    <section id="about" className="py-16 bg-turkestan-light">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-turkestan-blue mb-6">
              О Туркестанской области
            </h2>
            <p className="text-lg text-gray-600 mb-4">
              Туркестанская область – один из древнейших регионов Казахстана с богатой историей и культурным наследием. Это земля, где пересекались древние караванные пути и встречались различные цивилизации.
            </p>
            <p className="text-lg text-gray-600 mb-6">
              С 2018 года Туркестан является областным центром и активно развивается как туристический и культурный центр страны. Его историческое значение и духовное наследие привлекают посетителей со всего мира.
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                <div className="text-3xl font-bold text-turkestan-purple mb-2">2 000+</div>
                <p className="text-gray-600">лет истории</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                <div className="text-3xl font-bold text-turkestan-purple mb-2">500+</div>
                <p className="text-gray-600">культурных объектов</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                <div className="text-3xl font-bold text-turkestan-purple mb-2">3</div>
                <p className="text-gray-600">объекта ЮНЕСКО</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                <div className="text-3xl font-bold text-turkestan-purple mb-2">4</div>
                <p className="text-gray-600">природных заповедника</p>
              </div>
            </div>
            
            <Button 
              className="bg-turkestan-purple hover:bg-turkestan-blue"
              onClick={() => setIsDialogOpen(true)}
            >
              Узнать больше о регионе
            </Button>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-center text-turkestan-blue">
                    Туркестанская область — ворота в историческое сердце Казахстана
                  </DialogTitle>
                  <DialogDescription className="text-base text-gray-600 mt-2">
                    Уникальный регион на юге Казахстана, где оживает дух Великого Шёлкового пути
                  </DialogDescription>
                </DialogHeader>
                
                <div className="mt-4 space-y-6 text-gray-700">
                  <p>
                    Туркестанская область — это уникальный регион на юге Казахстана, где оживает дух Великого Шёлкового пути. Она известна не только своим богатым историческим наследием, но и современными инфраструктурными проектами, которые делают путешествие комфортным и незабываемым.
                  </p>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-turkestan-purple mb-2">Историческое наследие</h3>
                    <p>
                      Старинный город Туркестан был основан более 1500 лет назад и на протяжении веков служил духовным и торговым центром Центральной Азии. Главной жемчужиной региона является мавзолей Ходжи Ахмеда Ясави — великого суфийского поэта и философа. Этот архитектурный шедевр XIV века, построенный по приказу Тамерлана, включён в список объектов Всемирного наследия ЮНЕСКО.
                    </p>
                    <p className="mt-2">
                      Кроме Туркестана, регион богат на древние города — Отрар, Сауран, Сыгнак. Здесь можно буквально прикоснуться к страницам истории, прогуливаясь по древним крепостным стенам и археологическим памятникам.
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-xl font-semibold text-turkestan-purple mb-2">Природа и отдых</h3>
                    <p>
                      Туркестанская область предлагает путешественникам не только историю, но и разнообразные природные ландшафты. В регионе находятся горы Каратау, пустыни, степи, реки и оазисы. Национальные парки и заказники охраняют уникальную флору и фауну, а также открыты для экологического и активного туризма.
                    </p>
                    <p className="mt-2">
                      Любителям оздоровительного отдыха понравятся термальные источники и лечебные грязи, а также современные СПА- и wellness-курорты.
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-xl font-semibold text-turkestan-purple mb-2">Культура и традиции</h3>
                    <p>
                      Туркестанская область — это центр казахской духовности. Здесь чтят обычаи, национальные традиции, искусство и ремёсла. В регионе часто проходят фольклорные фестивали, выставки, этноярмарки и обряды, которые можно увидеть в этноауле или в музее под открытым небом.
                    </p>
                    <p className="mt-2">
                      Здесь вы познакомитесь с гостеприимством местных жителей, попробуете плов, баурсаки, казы и другие блюда казахской кухни.
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-xl font-semibold text-turkestan-purple mb-2">Современный Туркестан</h3>
                    <p>
                      В последние годы город Туркестан переживает бурное развитие. Построены современные отели, рестораны, туристические комплексы, культурные и развлекательные объекты. Среди новых достопримечательностей — амфитеатр, культурно-исторический центр «Караван-Сарай» с шоу фонтанов, верблюжьими турами и ремесленными мастерскими.
                    </p>
                    <p className="mt-2">
                      Развитая транспортная сеть (аэропорт, автобаны, железная дорога) делает регион доступным для туристов из Казахстана и зарубежья.
                    </p>
                  </div>
                  
                  <div className="text-center italic text-lg mt-8 pt-4 border-t">
                    Добро пожаловать в Туркестанскую область —
                    место, где прошлое встречается с настоящим, и где каждый найдёт для себя что-то особенное.
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <img 
              src="https://images.unsplash.com/photo-1466442929976-97f336a657be"
              alt="Мавзолей Ходжа Ахмеда Яссауи" 
              className="rounded-lg h-full w-full object-cover"
            />
            <div className="grid gap-4">
              <img 
                src="https://images.unsplash.com/photo-1469041797191-50ace28483c3"
                alt="Верблюды" 
                className="rounded-lg h-full w-full object-cover"
              />
              <img 
                src="https://images.unsplash.com/photo-1482938289607-e9573fc25ebb"
                alt="Природа Туркестана" 
                className="rounded-lg h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
