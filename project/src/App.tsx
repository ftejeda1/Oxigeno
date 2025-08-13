import React, { useState, useEffect } from 'react';
import { Monitor, AlertTriangle, BarChart3, Settings, LogOut, User } from 'lucide-react';
import LoginForm from './components/LoginForm';
import MonitoringPanel from './components/MonitoringPanel';
import AlertsPanel from './components/AlertsPanel';
import AnalysisPanel from './components/AnalysisPanel';
import ConfigPanel from './components/ConfigPanel';
import { mockClassrooms, mockAlerts, Alert } from './utils/mockData';

type ActivePanel = 'monitoring' | 'alerts' | 'analysis' | 'config';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');
  const [activePanel, setActivePanel] = useState<ActivePanel>('monitoring');
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const handleLogin = (username: string, password: string) => {
    // Simple authentication - in production, this would be handled by a backend
    if (username === 'Admin' && password === 'Admin') {
      setIsAuthenticated(true);
      setCurrentUser(username);
      setLoginError('');
    } else {
      setLoginError('Usuario o contraseña incorrectos');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser('');
    setActivePanel('monitoring');
  };

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleResolveAlert = (alertId: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, resolved: true } : alert
    ));
  };

  const navigationButtons = [
    { id: 'monitoring', label: 'Monitoreo', icon: Monitor },
    { id: 'alerts', label: 'Alertas', icon: AlertTriangle },
    { id: 'analysis', label: 'Análisis', icon: BarChart3 },
    { id: 'config', label: 'Configuración', icon: Settings },
  ];

  const activeAlerts = alerts.filter(alert => !alert.resolved);

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} error={loginError} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Monitor className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AirWatch</h1>
                <p className="text-sm text-gray-500">Monitoreo de Calidad del Aire</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>Bienvenido, {currentUser}</span>
              </div>
              <div className="text-sm text-gray-500">
                Última actualización: {lastUpdate.toLocaleTimeString('es-ES')}
              </div>
              {activeAlerts.length > 0 && (
                <div className="flex items-center space-x-2 bg-red-50 text-red-700 px-3 py-1 rounded-full">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm font-medium">{activeAlerts.length} alertas</span>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                title="Cerrar sesión"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 py-4">
            {navigationButtons.map((button) => {
              const Icon = button.icon;
              const isActive = activePanel === button.id;
              return (
                <button
                  key={button.id}
                  onClick={() => setActivePanel(button.id as ActivePanel)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{button.label}</span>
                  {button.id === 'alerts' && activeAlerts.length > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {activeAlerts.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activePanel === 'monitoring' && (
          <MonitoringPanel classrooms={mockClassrooms} />
        )}
        {activePanel === 'alerts' && (
          <AlertsPanel alerts={alerts} onResolveAlert={handleResolveAlert} />
        )}
        {activePanel === 'analysis' && (
          <AnalysisPanel classrooms={mockClassrooms} alerts={alerts} />
        )}
        {activePanel === 'config' && (
          <ConfigPanel />
        )}
      </main>
    </div>
  );
}

export default App;