import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Alert } from '../utils/mockData';

interface AlertsPanelProps {
  alerts: Alert[];
  onResolveAlert: (alertId: string) => void;
}

const AlertsPanel: React.FC<AlertsPanelProps> = ({ alerts, onResolveAlert }) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'resolved'>('active');

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'active') return !alert.resolved;
    if (filter === 'resolved') return alert.resolved;
    return true;
  });

  const getAlertIcon = (level: string) => {
    switch (level) {
      case 'critical':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'high':
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'medium':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Clock className="w-5 h-5 text-blue-500" />;
    }
  };

  const getAlertColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'border-l-red-500 bg-red-50';
      case 'high':
        return 'border-l-orange-500 bg-orange-50';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50';
      default:
        return 'border-l-blue-500 bg-blue-50';
    }
  };

  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  const sortedAlerts = filteredAlerts.sort((a, b) => {
    if (a.resolved !== b.resolved) {
      return a.resolved ? 1 : -1;
    }
    return priorityOrder[a.level] - priorityOrder[b.level];
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Centro de Alertas</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'active'
                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Activas ({alerts.filter(a => !a.resolved).length})
          </button>
          <button
            onClick={() => setFilter('resolved')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'resolved'
                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Resueltas ({alerts.filter(a => a.resolved).length})
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Todas ({alerts.length})
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {sortedAlerts.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === 'active' ? 'Sin alertas activas' : 'No hay alertas'}
            </h3>
            <p className="text-gray-500">
              {filter === 'active' 
                ? 'Todos los sistemas funcionan correctamente'
                : 'No se encontraron alertas para el filtro seleccionado'
              }
            </p>
          </div>
        ) : (
          sortedAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`bg-white border-l-4 rounded-lg shadow-sm p-6 ${getAlertColor(alert.level)} ${
                alert.resolved ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  {alert.resolved ? (
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                  ) : (
                    <div className="mt-1">{getAlertIcon(alert.level)}</div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-lg font-medium text-gray-900">
                        {alert.classroomName}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        alert.level === 'critical' ? 'bg-red-100 text-red-800' :
                        alert.level === 'high' ? 'bg-orange-100 text-orange-800' :
                        alert.level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {alert.level === 'critical' ? 'Crítico' :
                         alert.level === 'high' ? 'Alto' :
                         alert.level === 'medium' ? 'Medio' : 'Bajo'}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-2">{alert.message}</p>
                    <p className="text-sm text-gray-500">
                      {alert.timestamp.toLocaleString('es-ES')}
                    </p>
                  </div>
                </div>
                {!alert.resolved && (
                  <button
                    onClick={() => onResolveAlert(alert.id)}
                    className="ml-4 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
                  >
                    Marcar como resuelto
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AlertsPanel;