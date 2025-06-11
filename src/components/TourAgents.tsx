
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Plus, Globe, Phone, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTourAgents } from '@/hooks/use-tour-agents';

interface TourAgentsProps {
  showAllByDefault?: boolean;
}

const TourAgents: React.FC<TourAgentsProps> = ({ showAllByDefault = false }) => {
  const { tourAgents, loading, isAdmin } = useTourAgents();
  const navigate = useNavigate();
  const [showAll, setShowAll] = useState(showAllByDefault);

  // Show only 8 tour agents initially (2x4 grid), unless showAllByDefault is true
  const visibleTourAgents = showAll ? tourAgents : tourAgents.slice(0, 8);

  const handleViewAgent = (agentId: number) => {
    navigate(`/tour-agent/${agentId}`);
  };

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-96 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="tour-agents" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-turkestan-blue mb-4">
            Список турагентов
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Профессиональные турагентства для организации ваших незабываемых путешествий
          </p>
          {isAdmin && (
            <Button 
              className="bg-turkestan-purple hover:bg-turkestan-blue mt-4 flex items-center gap-2 mx-auto"
              onClick={() => navigate('/admin/tour-agents')}
            >
              <Plus className="h-4 w-4" />
              Управление турагентами
            </Button>
          )}
        </div>

        {tourAgents.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-lg">
            <p className="text-gray-500">Турагенты не найдены</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {visibleTourAgents.map((agent) => (
              <Card key={agent.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="text-center mb-3">
                    <img
                      src={agent.logo}
                      alt={agent.name}
                      className="w-16 h-16 object-cover rounded-full mx-auto mb-3"
                    />
                    <h3 className="text-lg font-semibold text-turkestan-blue mb-2">
                      {agent.name}
                    </h3>
                    {agent.description && (
                      <p className="text-gray-600 text-xs mb-3 line-clamp-2">
                        {agent.description}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    {agent.phone && (
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Phone className="h-3 w-3" />
                        <span className="truncate">{agent.phone}</span>
                      </div>
                    )}
                    {agent.email && (
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Mail className="h-3 w-3" />
                        <span className="truncate">{agent.email}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-3">
                    <Button 
                      variant="outline"
                      size="sm"
                      className="w-full border-turkestan-purple text-turkestan-purple hover:bg-turkestan-purple hover:text-white text-xs"
                      onClick={() => handleViewAgent(agent.id)}
                    >
                      <Globe className="h-3 w-3 mr-1" />
                      Подробнее
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!showAll && tourAgents.length > 8 && (
          <div className="text-center mt-10">
            <Button 
              variant="outline" 
              className="border-turkestan-purple text-turkestan-purple hover:bg-turkestan-purple hover:text-white"
              onClick={toggleShowAll}
            >
              Все турагенты <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default TourAgents;
