import React, { useState } from 'react';
import { Plus, Edit, Trash2, Settings, Save, X, Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { mockClassrooms, mockSensors, Sensor } from '../utils/mockData';

interface Classroom {
  id: string;
  name: string;
  building: string;
}

interface Threshold {
  metric: string;
  good: { min: number; max: number };
  moderate: { min: number; max: number };
  poor: { min: number; max: number };
}

const ConfigPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'classrooms' | 'sensors' | 'thresholds'>('classrooms');
  const [classrooms, setClassrooms] = useState<Classroom[]>(mockClassrooms);
  const [sensors, setSensors] = useState<Sensor[]>(mockSensors);
  const [showSensorModal, setShowSensorModal] = useState(false);
  const [selectedSensor, setSelectedSensor] = useState<Sensor | null>(null);
  const [sensorForm, setSensorForm] = useState({
    ipAddress: '',
    status: 'active' as 'active' | 'inactive' | 'maintenance'
  });

  const [thresholds, setThresholds] = useState<Threshold[]>([
    { 
      metric: 'CO₂', 
      good: { min: 0, max: 600 }, 
      moderate: { min: 600, max: 800 }, 
      poor: { min: 800, max: 1000 } 
    },
    { 
      metric: 'PM2.5', 
      good: { min: 0, max: 12 }, 
      moderate: { min: 12, max: 25 }, 
      poor: { min: 25, max: 35 } 
    },
    { 
      metric: 'Temperatura', 
      good: { min: 20, max: 25 }, 
      moderate: { min: 18, max: 28 }, 
      poor: { min: 15, max: 30 } 
    },
    { 
      metric: 'Humedad', 
      good: { min: 40, max: 60 }, 
      moderate: { min: 30, max: 70 }, 
      poor: { min: 20, max: 80 } 
    },
  ]);

  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});

  const startEdit = (type: string, item: any) => {
    setIsEditing(`${type}-${item.id}`);
    setEditForm({ ...item });
  };

  const cancelEdit = () => {
    setIsEditing(null);
    setEditForm({});
  };

  const saveEdit = (type: string) => {
    if (type === 'classroom') {
      setClassrooms(classrooms.map(c => c.id === editForm.id ? editForm : c));
    }
    setIsEditing(null);
    setEditForm({});
  };

  const deleteClassroom = (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta aula? También se eliminarán todos sus sensores.')) {
      setClassrooms(classrooms.filter(c => c.id !== id));
      setSensors(sensors.filter(s => s.classroomId !== id));
    }
  };

  const addClassroom = () => {
    const newId = (Math.max(...classrooms.map(c => parseInt(c.id))) + 1).toString();
    setClassrooms([...classrooms, { id: newId, name: '', building: '' }]);
    setIsEditing(`classroom-${newId}`);
    setEditForm({ id: newId, name: '', building: '' });
  };

  const openSensorModal = (sensor: Sensor) => {
    setSelectedSensor(sensor);
    setSensorForm({
      ipAddress: sensor.ipAddress,
      status: sensor.status
    });
    setShowSensorModal(true);
  };

  const closeSensorModal = () => {
    setShowSensorModal(false);
    setSelectedSensor(null);
    setSensorForm({ ipAddress: '', status: 'active' });
  };

  const saveSensorChanges = () => {
    if (selectedSensor) {
      setSensors(sensors.map(s => 
        s.id === selectedSensor.id 
          ? { ...s, ipAddress: sensorForm.ipAddress, status: sensorForm.status, lastConnection: new Date() }
          : s
      ));
      closeSensorModal();
    }
  };

  const deleteSensor = (sensorId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este sensor?')) {
      setSensors(sensors.filter(s => s.id !== sensorId));
      closeSensorModal();
    }
  };

  const addSensor = (classroomId: string) => {
    const newId = (Math.max(...sensors.map(s => parseInt(s.id))) + 1).toString();
    const newSensor: Sensor = {
      id: newId,
      type: 'CO₂',
      classroomId,
      status: 'active',
      ipAddress: '192.168.1.100',
      lastConnection: new Date()
    };
    setSensors([...sensors, newSensor]);
  };

  const renderClassrooms = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Gestión de Aulas</h3>
        <button
          onClick={addClassroom}
          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Añadir Aula</span>
        </button>
      </div>

      <div className="bg-white rounded-lg border shadow-sm">
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Edificio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sensores
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {classrooms.map((classroom) => {
                const classroomSensors = sensors.filter(s => s.classroomId === classroom.id);
                const activeSensors = classroomSensors.filter(s => s.status === 'active').length;
                
                return (
                  <tr key={classroom.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing === `classroom-${classroom.id}` ? (
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="border border-gray-300 rounded-md px-3 py-1 text-sm w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Nombre del aula"
                        />
                      ) : (
                        <div className="text-sm font-medium text-gray-900">{classroom.name}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing === `classroom-${classroom.id}` ? (
                        <input
                          type="text"
                          value={editForm.building}
                          onChange={(e) => setEditForm({ ...editForm, building: e.target.value })}
                          className="border border-gray-300 rounded-md px-3 py-1 text-sm w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Edificio"
                        />
                      ) : (
                        <div className="text-sm text-gray-900">{classroom.building}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-900">
                          {activeSensors}/{classroomSensors.length} activos
                        </span>
                        <button
                          onClick={() => addSensor(classroom.id)}
                          className="text-blue-600 hover:text-blue-800 text-xs"
                          title="Añadir sensor"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {isEditing === `classroom-${classroom.id}` ? (
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => saveEdit('classroom')}
                            className="text-green-600 hover:text-green-900 transition-colors"
                            title="Guardar"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="text-gray-600 hover:text-gray-900 transition-colors"
                            title="Cancelar"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => startEdit('classroom', classroom)}
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteClassroom(classroom.id)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSensors = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Gestión de Sensores</h3>
        <div className="text-sm text-gray-500">
          {sensors.filter(s => s.status === 'active').length} de {sensors.length} sensores activos
        </div>
      </div>

      <div className="bg-white rounded-lg border shadow-sm">
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aula
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IP
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Última Conexión
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sensors.map((sensor) => {
                const classroom = classrooms.find(c => c.id === sensor.classroomId);
                const isOnline = sensor.status === 'active' && 
                  (new Date().getTime() - sensor.lastConnection.getTime()) < 5 * 60 * 1000; // 5 minutes
                
                return (
                  <tr key={sensor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <div className="text-sm font-medium text-gray-900">{sensor.type}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{classroom?.name || 'Aula no encontrada'}</div>
                      <div className="text-xs text-gray-500">{classroom?.building}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {isOnline ? (
                          <Wifi className="w-4 h-4 text-green-500" />
                        ) : (
                          <WifiOff className="w-4 h-4 text-red-500" />
                        )}
                        <span className="text-sm font-mono text-gray-900">{sensor.ipAddress}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        sensor.status === 'active' ? 'bg-green-100 text-green-800' :
                        sensor.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {sensor.status === 'active' ? 'Activo' :
                         sensor.status === 'maintenance' ? 'Mantenimiento' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {sensor.lastConnection.toLocaleString('es-ES')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openSensorModal(sensor)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                        title="Configurar sensor"
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderThresholds = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Configuración de Umbrales</h3>
      </div>

      <div className="space-y-6">
        {thresholds.map((threshold) => (
          <div key={threshold.metric} className="bg-white p-6 rounded-lg border shadow-sm">
            <h4 className="text-lg font-medium text-gray-900 mb-4">{threshold.metric}</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h5 className="font-medium text-green-800 mb-2">Buena</h5>
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs text-green-700">Mínimo</label>
                    <input
                      type="number"
                      value={threshold.good.min}
                      onChange={(e) => {
                        const newThresholds = thresholds.map(t => 
                          t.metric === threshold.metric 
                            ? { ...t, good: { ...t.good, min: Number(e.target.value) }}
                            : t
                        );
                        setThresholds(newThresholds);
                      }}
                      className="w-full border border-green-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-green-700">Máximo</label>
                    <input
                      type="number"
                      value={threshold.good.max}
                      onChange={(e) => {
                        const newThresholds = thresholds.map(t => 
                          t.metric === threshold.metric 
                            ? { ...t, good: { ...t.good, max: Number(e.target.value) }}
                            : t
                        );
                        setThresholds(newThresholds);
                      }}
                      className="w-full border border-green-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h5 className="font-medium text-yellow-800 mb-2">Moderada</h5>
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs text-yellow-700">Mínimo</label>
                    <input
                      type="number"
                      value={threshold.moderate.min}
                      onChange={(e) => {
                        const newThresholds = thresholds.map(t => 
                          t.metric === threshold.metric 
                            ? { ...t, moderate: { ...t.moderate, min: Number(e.target.value) }}
                            : t
                        );
                        setThresholds(newThresholds);
                      }}
                      className="w-full border border-yellow-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-yellow-700">Máximo</label>
                    <input
                      type="number"
                      value={threshold.moderate.max}
                      onChange={(e) => {
                        const newThresholds = thresholds.map(t => 
                          t.metric === threshold.metric 
                            ? { ...t, moderate: { ...t.moderate, max: Number(e.target.value) }}
                            : t
                        );
                        setThresholds(newThresholds);
                      }}
                      className="w-full border border-yellow-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <h5 className="font-medium text-orange-800 mb-2">Mala</h5>
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs text-orange-700">Mínimo</label>
                    <input
                      type="number"
                      value={threshold.poor.min}
                      onChange={(e) => {
                        const newThresholds = thresholds.map(t => 
                          t.metric === threshold.metric 
                            ? { ...t, poor: { ...t.poor, min: Number(e.target.value) }}
                            : t
                        );
                        setThresholds(newThresholds);
                      }}
                      className="w-full border border-orange-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-orange-700">Máximo</label>
                    <input
                      type="number"
                      value={threshold.poor.max}
                      onChange={(e) => {
                        const newThresholds = thresholds.map(t => 
                          t.metric === threshold.metric 
                            ? { ...t, poor: { ...t.poor, max: Number(e.target.value) }}
                            : t
                        );
                        setThresholds(newThresholds);
                      }}
                      className="w-full border border-orange-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Configuración del Sistema</h2>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('classrooms')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'classrooms'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Aulas
          </button>
          <button
            onClick={() => setActiveTab('sensors')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'sensors'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Sensores
          </button>
          <button
            onClick={() => setActiveTab('thresholds')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'thresholds'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Umbrales
          </button>
        </nav>
      </div>

      <div className="mt-6">
        {activeTab === 'classrooms' && renderClassrooms()}
        {activeTab === 'sensors' && renderSensors()}
        {activeTab === 'thresholds' && renderThresholds()}
      </div>

      {/* Sensor Configuration Modal */}
      {showSensorModal && selectedSensor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Configurar Sensor {selectedSensor.type}
              </h3>
              <p className="text-sm text-gray-500">
                {classrooms.find(c => c.id === selectedSensor.classroomId)?.name}
              </p>
            </div>
            
            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección IP
                </label>
                <input
                  type="text"
                  value={sensorForm.ipAddress}
                  onChange={(e) => setSensorForm({ ...sensorForm, ipAddress: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="192.168.1.100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado
                </label>
                <select
                  value={sensorForm.status}
                  onChange={(e) => setSensorForm({ ...sensorForm, status: e.target.value as any })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                  <option value="maintenance">Mantenimiento</option>
                </select>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <AlertCircle className="w-4 h-4" />
                  <span>Última conexión: {selectedSensor.lastConnection.toLocaleString('es-ES')}</span>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 flex justify-between">
              <button
                onClick={() => deleteSensor(selectedSensor.id)}
                className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors"
              >
                Eliminar Sensor
              </button>
              <div className="flex space-x-3">
                <button
                  onClick={closeSensorModal}
                  className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={saveSensorChanges}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                >
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfigPanel;