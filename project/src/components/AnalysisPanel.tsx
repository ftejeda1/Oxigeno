import React, { useState } from 'react';
import { Download, Calendar, Filter, TrendingUp } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import { ClassroomData, Alert } from '../utils/mockData';
import { exportToPDF, exportToExcel } from '../utils/export';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

interface AnalysisPanelProps {
  classrooms: ClassroomData[];
  alerts: Alert[];
}

const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ classrooms, alerts }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('24h');
  const [selectedMetric, setSelectedMetric] = useState('co2');
  const [showExportMenu, setShowExportMenu] = useState(false);

  const generateChartData = () => {
    const colors = [
      '#2563eb', '#dc2626', '#16a34a', '#ca8a04', '#7c3aed', '#db2777'
    ];

    return {
      datasets: classrooms.map((classroom, index) => ({
        label: classroom.name,
        data: classroom.trend24h.map(point => ({
          x: point.time,
          y: point[selectedMetric as keyof typeof point] as number,
        })),
        borderColor: colors[index % colors.length],
        backgroundColor: colors[index % colors.length] + '20',
        borderWidth: 2,
        fill: false,
        tension: 0.4,
      })),
    };
  };

  const chartOptions = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      title: {
        display: true,
        text: `Tendencia de ${
          selectedMetric === 'co2' ? 'CO₂ (ppm)' :
          selectedMetric === 'pm25' ? 'PM2.5 (μg/m³)' :
          selectedMetric === 'temperature' ? 'Temperatura (°C)' :
          'Humedad (%)'
        } - Últimas 24 horas`,
        font: {
          size: 16,
        },
      },
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      x: {
        type: 'time' as const,
        time: {
          unit: 'hour' as const,
          displayFormats: {
            hour: 'HH:mm',
          },
        },
        title: {
          display: true,
          text: 'Hora',
        },
      },
      y: {
        title: {
          display: true,
          text: selectedMetric === 'co2' ? 'CO₂ (ppm)' :
                selectedMetric === 'pm25' ? 'PM2.5 (μg/m³)' :
                selectedMetric === 'temperature' ? 'Temperatura (°C)' :
                'Humedad (%)',
        },
      },
    },
  };

  const handleExport = (format: 'pdf' | 'excel') => {
    if (format === 'pdf') {
      exportToPDF(classrooms, alerts);
    } else {
      exportToExcel(classrooms, alerts);
    }
    setShowExportMenu(false);
  };

  const getAverageValue = () => {
    const total = classrooms.reduce((sum, classroom) => {
      return sum + classroom[selectedMetric as keyof ClassroomData] as number;
    }, 0);
    return (total / classrooms.length).toFixed(1);
  };

  const getMaxValue = () => {
    return Math.max(...classrooms.map(c => c[selectedMetric as keyof ClassroomData] as number));
  };

  const getMinValue = () => {
    return Math.min(...classrooms.map(c => c[selectedMetric as keyof ClassroomData] as number));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Análisis y Tendencias</h2>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="co2">CO₂</option>
              <option value="pm25">PM2.5</option>
              <option value="temperature">Temperatura</option>
              <option value="humidity">Humedad</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="24h">Últimas 24h</option>
              <option value="7d">Últimos 7 días</option>
              <option value="30d">Últimos 30 días</option>
            </select>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Descargar Reporte</span>
            </button>

            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                <div className="py-1">
                  <button
                    onClick={() => handleExport('pdf')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Descargar PDF
                  </button>
                  <button
                    onClick={() => handleExport('excel')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Descargar Excel (.xlsx)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Promedio</p>
              <p className="text-2xl font-bold text-blue-600">
                {getAverageValue()}
                {selectedMetric === 'co2' ? ' ppm' :
                 selectedMetric === 'pm25' ? ' μg/m³' :
                 selectedMetric === 'temperature' ? '°C' : '%'}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Máximo</p>
              <p className="text-2xl font-bold text-red-600">
                {getMaxValue()}
                {selectedMetric === 'co2' ? ' ppm' :
                 selectedMetric === 'pm25' ? ' μg/m³' :
                 selectedMetric === 'temperature' ? '°C' : '%'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Mínimo</p>
              <p className="text-2xl font-bold text-green-600">
                {getMinValue()}
                {selectedMetric === 'co2' ? ' ppm' :
                 selectedMetric === 'pm25' ? ' μg/m³' :
                 selectedMetric === 'temperature' ? '°C' : '%'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="h-96">
          <Line data={generateChartData()} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default AnalysisPanel;