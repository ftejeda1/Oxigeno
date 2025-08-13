import React from 'react';
import { ClassroomData } from '../utils/mockData';
import ClassroomCard from './ClassroomCard';

interface MonitoringPanelProps {
  classrooms: ClassroomData[];
}

const MonitoringPanel: React.FC<MonitoringPanelProps> = ({ classrooms }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Monitoreo en Tiempo Real</h2>
        <div className="text-sm text-gray-500">
          {classrooms.length} aulas monitoreadas
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classrooms.map((classroom) => (
          <ClassroomCard key={classroom.id} classroom={classroom} />
        ))}
      </div>
    </div>
  );
};

export default MonitoringPanel;