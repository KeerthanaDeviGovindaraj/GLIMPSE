// pages/Reports.jsx
import React from 'react';
import { FileText, Download, Calendar, BarChart3 } from 'lucide-react';

function Reports() {
  const reports = [
    { id: 1, name: 'Monthly Sports Report', date: '2025-12-01', size: '2.4 MB', type: 'PDF' },
    { id: 2, name: 'Player Statistics Q4', date: '2025-11-28', size: '1.8 MB', type: 'Excel' },
    { id: 3, name: 'Annual Performance Review', date: '2025-11-15', size: '3.2 MB', type: 'PDF' },
    { id: 4, name: 'Weekly Activity Summary', date: '2025-12-08', size: '890 KB', type: 'PDF' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold" style={{ color: '#e5e7eb' }}>Reports</h2>
          <p className="text-sm mt-1" style={{ color: '#9aa4b2' }}>Generate and download reports</p>
        </div>
        <button
          className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all hover:opacity-90"
          style={{ background: '#ef4444', color: '#fff', cursor: 'pointer' }}
        >
          <FileText size={20} />
          Generate Report
        </button>
      </div>

      {/* Report Types */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button className="p-6 rounded-lg text-left transition-all hover:scale-105" style={{ background: '#0c1220', border: '1px solid #1f2937', cursor: 'pointer' }}>
          <FileText size={32} style={{ color: '#ef4444', marginBottom: '12px' }} />
          <h3 className="font-bold mb-2" style={{ color: '#e5e7eb' }}>Activity Report</h3>
          <p className="text-sm" style={{ color: '#9aa4b2' }}>Generate comprehensive sports activity report</p>
        </button>

        <button className="p-6 rounded-lg text-left transition-all hover:scale-105" style={{ background: '#0c1220', border: '1px solid #1f2937', cursor: 'pointer' }}>
          <BarChart3 size={32} style={{ color: '#ef4444', marginBottom: '12px' }} />
          <h3 className="font-bold mb-2" style={{ color: '#e5e7eb' }}>Statistics Report</h3>
          <p className="text-sm" style={{ color: '#9aa4b2' }}>Generate detailed player statistics</p>
        </button>

        <button className="p-6 rounded-lg text-left transition-all hover:scale-105" style={{ background: '#0c1220', border: '1px solid #1f2937', cursor: 'pointer' }}>
          <Calendar size={32} style={{ color: '#ef4444', marginBottom: '12px' }} />
          <h3 className="font-bold mb-2" style={{ color: '#e5e7eb' }}>Monthly Summary</h3>
          <p className="text-sm" style={{ color: '#9aa4b2' }}>Generate monthly performance summary</p>
        </button>
      </div>

      {/* Generated Reports */}
      <div>
        <h3 className="text-xl font-bold mb-4" style={{ color: '#e5e7eb' }}>Generated Reports ({reports.length})</h3>
        <div className="space-y-3">
          {reports.map(report => (
            <div key={report.id} className="p-4 rounded-lg flex items-center justify-between hover:scale-[1.01] transition-transform" style={{ background: '#0c1220', border: '1px solid #1f2937' }}>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg" style={{ background: 'rgba(239, 68, 68, 0.12)' }}>
                  <FileText size={24} style={{ color: '#ef4444' }} />
                </div>
                <div>
                  <p className="font-medium" style={{ color: '#e5e7eb' }}>{report.name}</p>
                  <p className="text-sm" style={{ color: '#9aa4b2' }}>
                    {report.type} • {report.size} • {report.date}
                  </p>
                </div>
              </div>
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:opacity-90"
                style={{ background: '#0e1424', color: '#ef4444', cursor: 'pointer' }}
              >
                <Download size={16} />
                Download
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Reports;