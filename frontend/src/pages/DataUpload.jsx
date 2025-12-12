// pages/DataUpload.jsx
import React, { useState, useRef } from 'react';
import { Upload, Database, FileText, Image, X, Check, Download, Trash2 } from 'lucide-react';

function DataUpload({ showSuccess, showError }) {
  const [uploadedFiles, setUploadedFiles] = useState([
    { id: 1, name: 'football_stats.csv', size: '245 KB', date: '2024-01-15', status: 'completed', type: 'csv' },
    { id: 2, name: 'player_roster.xlsx', size: '512 KB', date: '2024-01-14', status: 'completed', type: 'excel' },
  ]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = (files) => {
    const fileList = Array.from(files);
    
    if (fileList.length === 0) return;

    const newUploads = fileList.map((file, idx) => ({
      id: uploadedFiles.length + idx + 1,
      name: file.name,
      size: formatFileSize(file.size),
      date: new Date().toISOString().split('T')[0],
      status: 'completed',
      type: getFileType(file.name)
    }));

    setUploadedFiles([...newUploads, ...uploadedFiles]);
    showSuccess?.(`${fileList.length} file(s) uploaded successfully!`);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileType = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    if (['csv'].includes(ext)) return 'csv';
    if (['xlsx', 'xls'].includes(ext)) return 'excel';
    if (['pdf'].includes(ext)) return 'pdf';
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return 'image';
    return 'file';
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'csv':
      case 'excel':
        return <Database size={20} style={{ color: '#ef4444' }} />;
      case 'pdf':
      case 'file':
        return <FileText size={20} style={{ color: '#ef4444' }} />;
      case 'image':
        return <Image size={20} style={{ color: '#ef4444' }} />;
      default:
        return <Database size={20} style={{ color: '#ef4444' }} />;
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleDeleteFile = (id) => {
    const file = uploadedFiles.find(f => f.id === id);
    if (window.confirm(`Are you sure you want to delete ${file.name}?`)) {
      setUploadedFiles(uploadedFiles.filter(f => f.id !== id));
      showSuccess?.(`${file.name} deleted successfully!`);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold" style={{ color: '#e5e7eb' }}>Upload Data</h2>
        <p className="text-sm mt-1" style={{ color: '#9aa4b2' }}>Upload CSV, Excel, PDF, and image files</p>
      </div>

      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className="p-12 rounded-lg border-2 border-dashed text-center transition-all"
        style={{ 
          borderColor: isDragging ? '#ef4444' : '#1f2937',
          background: isDragging ? 'rgba(239, 68, 68, 0.05)' : '#0c1220'
        }}
      >
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: 'rgba(239, 68, 68, 0.12)' }}>
            <Upload size={32} style={{ color: '#ef4444' }} />
          </div>
          <h3 className="text-xl font-bold mb-2" style={{ color: '#e5e7eb' }}>
            {isDragging ? 'Drop files here' : 'Upload Files'}
          </h3>
          <p className="text-sm mb-6" style={{ color: '#9aa4b2' }}>
            Drag and drop files here, or click to select
          </p>
          
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={(e) => handleFileUpload(e.target.files)}
            className="hidden"
            id="file-upload"
            accept=".csv,.xlsx,.xls,.pdf,.jpg,.jpeg,.png,.gif"
          />
          <label
            htmlFor="file-upload"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all hover:opacity-90"
            style={{ background: '#ef4444', color: '#fff', cursor: 'pointer' }}
          >
            <Upload size={20} />
            Select Files
          </label>
          
          <p className="text-xs mt-4" style={{ color: '#9aa4b2' }}>
            Supported: CSV, Excel, PDF, JPG, PNG (Max 10MB per file)
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg" style={{ background: '#0c1220', border: '1px solid #1f2937' }}>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg" style={{ background: 'rgba(239, 68, 68, 0.12)' }}>
              <Database size={24} style={{ color: '#ef4444' }} />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: '#e5e7eb' }}>{uploadedFiles.length}</p>
              <p className="text-sm" style={{ color: '#9aa4b2' }}>Total Files</p>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-lg" style={{ background: '#0c1220', border: '1px solid #1f2937' }}>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg" style={{ background: 'rgba(239, 68, 68, 0.12)' }}>
              <Check size={24} style={{ color: '#ef4444' }} />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: '#e5e7eb' }}>
                {uploadedFiles.filter(f => f.status === 'completed').length}
              </p>
              <p className="text-sm" style={{ color: '#9aa4b2' }}>Completed</p>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-lg" style={{ background: '#0c1220', border: '1px solid #1f2937' }}>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg" style={{ background: 'rgba(239, 68, 68, 0.12)' }}>
              <FileText size={24} style={{ color: '#ef4444' }} />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: '#e5e7eb' }}>
                {uploadedFiles.reduce((acc, f) => acc + parseFloat(f.size), 0).toFixed(0)} KB
              </p>
              <p className="text-sm" style={{ color: '#9aa4b2' }}>Total Size</p>
            </div>
          </div>
        </div>
      </div>

      {/* Uploaded Files List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold" style={{ color: '#e5e7eb' }}>
            Uploaded Files ({uploadedFiles.length})
          </h3>
        </div>

        {uploadedFiles.length === 0 ? (
          <div className="p-12 rounded-lg text-center" style={{ background: '#0c1220', border: '1px solid #1f2937' }}>
            <Database size={48} style={{ color: '#9aa4b2', margin: '0 auto 16px' }} />
            <p className="text-lg font-medium" style={{ color: '#e5e7eb' }}>No files uploaded yet</p>
            <p className="text-sm" style={{ color: '#9aa4b2' }}>Upload your first file to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {uploadedFiles.map(file => (
              <div key={file.id} className="p-4 rounded-lg flex items-center justify-between hover:scale-[1.01] transition-transform" style={{ background: '#0c1220', border: '1px solid #1f2937' }}>
                <div className="flex items-center gap-4 flex-1">
                  <div className="p-3 rounded-lg" style={{ background: 'rgba(239, 68, 68, 0.12)' }}>
                    {getFileIcon(file.type)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium" style={{ color: '#e5e7eb' }}>{file.name}</p>
                    <p className="text-sm" style={{ color: '#9aa4b2' }}>
                      {file.size} • Uploaded on {file.date}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#10b981' }}>
                    {file.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => showSuccess?.(`Downloading ${file.name}...`)}
                    className="p-2 rounded-lg transition-all hover:scale-110"
                    style={{ background: '#0e1424', color: '#e5e7eb', cursor: 'pointer' }}
                    title="Download"
                  >
                    <Download size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteFile(file.id)}
                    className="p-2 rounded-lg transition-all hover:scale-110"
                    style={{ background: 'rgba(239, 68, 68, 0.12)', color: '#ef4444', cursor: 'pointer' }}
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Tips */}
      <div className="p-6 rounded-lg" style={{ background: '#0c1220', border: '1px solid #1f2937' }}>
        <h3 className="text-lg font-bold mb-3" style={{ color: '#e5e7eb' }}>📋 Upload Tips</h3>
        <ul className="space-y-2 text-sm" style={{ color: '#9aa4b2' }}>
          <li>• CSV files should have headers in the first row</li>
          <li>• Excel files can contain multiple sheets</li>
          <li>• Maximum file size is 10MB per file</li>
          <li>• Supported formats: CSV, XLSX, XLS, PDF, JPG, PNG</li>
          <li>• You can upload multiple files at once</li>
        </ul>
      </div>
    </div>
  );
}

export default DataUpload;