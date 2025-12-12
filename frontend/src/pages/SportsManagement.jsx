// pages/SportsManagement.jsx
import React, { useState } from 'react';
import { Activity, Plus, X, Check, Edit, Trash2, Search } from 'lucide-react';

function SportsManagement({ showSuccess, showError }) {
  const [sports, setSports] = useState([
    { id: 1, name: 'Football', players: 1250, status: 'active', category: 'Team' },
    { id: 2, name: 'Basketball', players: 980, status: 'active', category: 'Team' },
    { id: 3, name: 'Tennis', players: 756, status: 'active', category: 'Individual' },
    { id: 4, name: 'Cricket', players: 634, status: 'active', category: 'Team' },
    { id: 5, name: 'Swimming', players: 523, status: 'active', category: 'Water' },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newSport, setNewSport] = useState({ name: '', category: 'Team', description: '' });
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddSport = () => {
    if (!newSport.name.trim()) {
      showError?.('Please enter a sport name');
      return;
    }

    const sport = {
      id: sports.length + 1,
      name: newSport.name,
      players: 0,
      status: 'active',
      category: newSport.category
    };

    setSports([...sports, sport]);
    setNewSport({ name: '', category: 'Team', description: '' });
    setShowAddModal(false);
    showSuccess?.(`${sport.name} added successfully!`);
  };

  const handleDeleteSport = (id) => {
    const sport = sports.find(s => s.id === id);
    if (window.confirm(`Are you sure you want to delete ${sport.name}?`)) {
      setSports(sports.filter(s => s.id !== id));
      showSuccess?.(`${sport.name} deleted successfully!`);
    }
  };

  const filteredSports = sports.filter(sport =>
    sport.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold" style={{ color: '#e5e7eb' }}>Sports Management</h2>
          <p className="text-sm mt-1" style={{ color: '#9aa4b2' }}>Manage all sports and activities</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all hover:opacity-90"
          style={{ background: '#ef4444', color: '#fff', cursor: 'pointer' }}
        >
          <Plus size={20} />
          Add New Sport
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: '#9aa4b2' }} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search sports..."
          className="w-full pl-12 pr-4 py-3 rounded-lg outline-none transition-all"
          style={{ 
            background: '#0c1220',
            border: '1px solid #1f2937',
            color: '#e5e7eb'
          }}
        />
      </div>

      {/* Sports Grid */}
      <div className="grid gap-4">
        {filteredSports.length === 0 ? (
          <div className="p-12 rounded-lg text-center" style={{ background: '#0c1220', border: '1px solid #1f2937' }}>
            <Activity size={48} style={{ color: '#9aa4b2', margin: '0 auto 16px' }} />
            <p className="text-lg font-medium" style={{ color: '#e5e7eb' }}>No sports found</p>
            <p className="text-sm" style={{ color: '#9aa4b2' }}>Try adjusting your search</p>
          </div>
        ) : (
          filteredSports.map(sport => (
            <div key={sport.id} className="p-6 rounded-lg flex items-center justify-between hover:scale-[1.02] transition-transform" style={{ background: '#0c1220', border: '1px solid #1f2937' }}>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-lg flex items-center justify-center" style={{ background: 'rgba(239, 68, 68, 0.12)' }}>
                  <Activity size={28} style={{ color: '#ef4444' }} />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-1" style={{ color: '#e5e7eb' }}>{sport.name}</h3>
                  <p className="text-sm" style={{ color: '#9aa4b2' }}>
                    {sport.players} players • {sport.category}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-4 py-2 rounded-full text-sm font-medium" style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#10b981' }}>
                  {sport.status}
                </span>
                <button
                  onClick={() => showSuccess?.(`Editing ${sport.name}...`)}
                  className="p-2 rounded-lg transition-all hover:scale-110"
                  style={{ background: '#0e1424', color: '#e5e7eb', cursor: 'pointer' }}
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDeleteSport(sport.id)}
                  className="p-2 rounded-lg transition-all hover:scale-110"
                  style={{ background: 'rgba(239, 68, 68, 0.12)', color: '#ef4444', cursor: 'pointer' }}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Sport Modal */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="w-full max-w-md p-6 rounded-lg" style={{ background: '#0c1220', border: '1px solid #1f2937' }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold" style={{ color: '#e5e7eb' }}>Add New Sport</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-2 rounded-lg transition-all hover:scale-110"
                style={{ background: '#0e1424', color: '#9aa4b2', cursor: 'pointer' }}
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#e5e7eb' }}>Sport Name</label>
                <input
                  type="text"
                  value={newSport.name}
                  onChange={(e) => setNewSport({...newSport, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg outline-none transition-all"
                  style={{ background: '#0e1424', border: '1px solid #1f2937', color: '#e5e7eb' }}
                  placeholder="e.g., Volleyball"
                  autoFocus
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#e5e7eb' }}>Category</label>
                <select
                  value={newSport.category}
                  onChange={(e) => setNewSport({...newSport, category: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg outline-none"
                  style={{ background: '#0e1424', border: '1px solid #1f2937', color: '#e5e7eb', cursor: 'pointer' }}
                >
                  <option value="Team">Team Sport</option>
                  <option value="Individual">Individual Sport</option>
                  <option value="Water">Water Sport</option>
                  <option value="Combat">Combat Sport</option>
                  <option value="Racquet">Racquet Sport</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#e5e7eb' }}>Description (Optional)</label>
                <textarea
                  value={newSport.description}
                  onChange={(e) => setNewSport({...newSport, description: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg outline-none resize-none"
                  style={{ background: '#0e1424', border: '1px solid #1f2937', color: '#e5e7eb' }}
                  placeholder="Brief description..."
                  rows="3"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleAddSport}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition-all hover:opacity-90"
                  style={{ background: '#ef4444', color: '#fff', cursor: 'pointer' }}
                >
                  <Check size={20} />
                  Add Sport
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-3 rounded-lg font-semibold transition-all hover:opacity-90"
                  style={{ background: '#0e1424', color: '#9aa4b2', cursor: 'pointer' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SportsManagement;