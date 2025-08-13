import React from 'react';
import { Thermometer, Droplets, Wind, Gauge } from 'lucide-react';
import { ClassroomData, getQualityLevel, getQualityColor } from '../utils/mockData';
import MiniChart from './MiniChart';

interface ClassroomCardProps {
  classroom: ClassroomData;
}

const ClassroomCard: React.FC<ClassroomCardProps> = ({ classroom }) => {
  const co2Level = getQualityLevel('co2', classroom.co2);
  const pm25Level = getQualityLevel('pm25', classroom.pm25);
  const tempLevel = getQualityLevel('temperature', classroom.temperature);
  const humidityLevel = getQualityLevel('humidity', classroom.humidity);

  const getOverallLevel = () => {
    const levels = [co2Level, pm25Level, tempLevel, humidityLevel];
    if (levels.includes('critical')) return 'critical';
    if (levels.includes('poor')) return 'poor';
    if (levels.includes('moderate')) return 'moderate';
    return 'good';
  };

  const overallLevel = getOverallLevel();
  const cardColorClass = getQualityColor(overallLevel);

  return (
    <div className={`bg-white rounded-lg shadow-sm border hover:shadow-md transition-all duration-200 p-6 ${cardColorClass.split(' ')[2]}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{classroom.name}</h3>
          <p className="text-sm text-gray-600">{classroom.building}</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${cardColorClass}`}>
          {overallLevel === 'good' && 'Buena'}
          {overallLevel === 'moderate' && 'Moderada'}
          {overallLevel === 'poor' && 'Mala'}
          {overallLevel === 'critical' && 'Crítica'}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <Wind className="w-4 h-4 text-gray-500" />
          <div>
            <p className="text-xs text-gray-500">CO₂</p>
            <p className={`text-sm font-medium ${getQualityColor(co2Level).split(' ')[0]}`}>
              {classroom.co2} ppm
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Gauge className="w-4 h-4 text-gray-500" />
          <div>
            <p className="text-xs text-gray-500">PM2.5</p>
            <p className={`text-sm font-medium ${getQualityColor(pm25Level).split(' ')[0]}`}>
              {classroom.pm25} μg/m³
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Thermometer className="w-4 h-4 text-gray-500" />
          <div>
            <p className="text-xs text-gray-500">Temperatura</p>
            <p className={`text-sm font-medium ${getQualityColor(tempLevel).split(' ')[0]}`}>
              {classroom.temperature}°C
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Droplets className="w-4 h-4 text-gray-500" />
          <div>
            <p className="text-xs text-gray-500">Humedad</p>
            <p className={`text-sm font-medium ${getQualityColor(humidityLevel).split(' ')[0]}`}>
              {classroom.humidity}%
            </p>
          </div>
        </div>
      </div>

      <div className="border-t pt-4">
        <p className="text-xs text-gray-500 mb-2">Tendencia 24h - CO₂</p>
        <MiniChart
          data={classroom.trend24h.map(point => ({ time: point.time, value: point.co2 }))}
          color="#2563eb"
          label="CO₂"
        />
      </div>

      <div className="mt-3 text-xs text-gray-500">
        Última actualización: {classroom.lastUpdated.toLocaleTimeString('es-ES')}
      </div>
    </div>
  );
};

export default ClassroomCard;