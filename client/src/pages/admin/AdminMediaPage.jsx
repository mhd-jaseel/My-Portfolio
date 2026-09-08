import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
  Upload, 
  Copy, 
  Check, 
  Loader2, 
  Trash2, 
  Video as VideoIcon, 
  FileText, 
  ExternalLink, 
  AlertTriangle,
  Search,
  RefreshCw,
  HardDrive
} from 'lucide-react';
import { showConfirm, showSuccess, showError, toastSuccess } from '../../utils/alertUtils';

const AdminMediaPage = () => {
  const [file, setFile] = useState(null);
  const [folder, setFolder] = useState('jaseel_portfolio/general');
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState(null);
  const [copiedUrl, setCopiedUrl] = useState(null);

  // Media Library State
  const [mediaList, setMediaList] = useState([]);
  const [loadingMedia, setLoadingMedia] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [filterType, setFilterType] = useState('all'); // 'all' | 'image' | 'video' | 'pdf' | 'unused'
  const [searchQuery, setSearchQuery] = useState('');

  const fetchMediaList = async () => {
    setLoadingMedia(true);
    try {
      const res = await api.get('/admin/media');
      if (res.data?.success) {
        setMediaList(res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load media list:', err);
    } finally {
      setLoadingMedia(false);
    }
  };

  useEffect(() => {
    fetchMediaList();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      showError('Please select a file to upload.');
      return;
    }

    const data = new FormData();
    data.append('file', file);
    data.append('folder', folder);

    setUploading(true);
    setUploadedUrl(null);

    try {
      const res = await api.post('/admin/media', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data?.url) {
        setUploadedUrl(res.data.url);
        toastSuccess('File uploaded successfully.');
        setFile(null);
        fetchMediaList(); // Refresh media library immediately
      }
    } catch (err) {
      showError(err, 'Unable to upload file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteMedia = async (mediaItem) => {
    if (deletingId) return; // Prevent double-clicking

    const isReferenced = mediaItem.isUsed && mediaItem.usedBy && mediaItem.usedBy.length > 0;
    const warningText = isReferenced
      ? `WARNING: This media is currently in use by:\n• ${mediaItem.usedBy.join('\n• ')}\n\nDeleting it will remove the file from storage and reset related sections to default placeholders.`
      : 'Are you sure you want to delete this media? This will permanently delete the file from storage.';

    const confirmed = await showConfirm({
      title: isReferenced ? 'Delete in-use media?' : 'Delete media file?',
      text: warningText,
      confirmText: 'Yes, Delete',
      isDestructive: true,
    });

    if (!confirmed) return;

    setDeletingId(mediaItem.id);

    try {
      const res = await api.delete('/admin/media', {
        data: { url: mediaItem.url },
      });

      if (res.data?.success) {
        showSuccess(res.data.message || 'Media deleted successfully.');
        if (uploadedUrl === mediaItem.url) {
          setUploadedUrl(null);
        }
        // Immediately remove item from list without full refresh
        setMediaList((prev) => prev.filter((item) => item.id !== mediaItem.id));
      }
    } catch (err) {
      showError(err, 'Unable to delete media. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const copyUrlToClipboard = (url) => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    toastSuccess('Link copied to clipboard.');
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return 'Unknown size';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Storage information unavailable';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Filtering media
  const filteredMedia = mediaList.filter((item) => {
    const matchesSearch = item.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.usedBy && item.usedBy.some(u => u.toLowerCase().includes(searchQuery.toLowerCase())));

    if (!matchesSearch) return false;

    if (filterType === 'all') return true;
    if (filterType === 'unused') return !item.isUsed;
    return item.type === filterType;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a1a] tracking-tight">
            Media Library &amp; File Manager
          </h1>
          <p className="text-xs text-[#666666] mt-0.5">
            Upload, manage, and safely delete images, videos, and documents used across your portfolio.
          </p>
        </div>
        <button
          onClick={fetchMediaList}
          disabled={loadingMedia}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#dce7fa] text-[#1683FF] hover:bg-[#f0f6ff] text-xs font-bold transition-all shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loadingMedia ? 'animate-spin' : ''}`} />
          <span>Refresh Library</span>
        </button>
      </div>

      {/* 1. Upload Zone */}
      <div className="p-6 sm:p-7 rounded-2xl bg-white border border-[#dce7fa] shadow-xs space-y-5">
        <h2 className="text-sm font-bold text-[#1a1a1a] flex items-center gap-2">
          <Upload className="w-4 h-4 text-[#1683FF]" />
          <span>Upload New Media</span>
        </h2>

        <form onSubmit={handleUpload} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1a1a1a] mb-1.5">Destination Category</label>
              <select
                value={folder}
                onChange={(e) => setFolder(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8fbff] border border-[#dce7fa] text-[#1a1a1a] text-xs focus:outline-none focus:border-[#1683FF]"
              >
                <option value="jaseel_portfolio/projects">Project Images</option>
                <option value="jaseel_portfolio/gallery">Gallery Images</option>
                <option value="jaseel_portfolio/profile">Profile Photos</option>
                <option value="jaseel_portfolio/videos">Videos (MP4, WebM, MOV)</option>
                <option value="jaseel_portfolio/docs">Documents &amp; Resume (PDF)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1a1a1a] mb-1.5">Select File (Image, Video, PDF)</label>
              <input
                type="file"
                required
                accept="image/*,video/*,application/pdf"
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full text-xs text-[#666666] file:mr-3 file:py-2 file:px-3.5 file:rounded-xl file:border file:border-[#dce7fa] file:text-xs file:font-semibold file:bg-[#f0f6ff] file:text-[#1683FF] hover:file:bg-[#1683FF] hover:file:text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={uploading || !file}
            className="w-full py-3 rounded-xl bg-[#1683FF] hover:bg-[#1371dc] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Uploading to Storage...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Upload Media</span>
              </>
            )}
          </button>
        </form>

        {/* Uploaded Result Preview & Copy Link */}
        {uploadedUrl && (
          <div className="p-4 rounded-xl bg-[#f0f6ff] border border-[#dce7fa] space-y-2">
            <p className="text-xs font-bold text-[#1683FF] uppercase tracking-wider">File Ready</p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={uploadedUrl}
                className="flex-1 px-3 py-2 rounded-xl bg-white border border-[#dce7fa] text-[#1a1a1a] text-xs font-mono"
              />
              <button
                onClick={() => copyUrlToClipboard(uploadedUrl)}
                className="px-4 py-2 rounded-xl bg-[#1683FF] text-white font-bold text-xs flex items-center gap-1.5 hover:bg-[#1371dc] transition-all"
              >
                {copiedUrl === uploadedUrl ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedUrl === uploadedUrl ? 'Copied' : 'Copy Link'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 2. Media Library List & Management */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-[#1a1a1a]">Stored Media &amp; Files</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#e8f2ff] text-[#1683FF] text-xs font-bold">
              {filteredMedia.length}
            </span>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#888888]" />
              <input
                type="text"
                placeholder="Search files or usage..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl bg-white border border-[#dce7fa] text-xs text-[#1a1a1a] focus:outline-none focus:border-[#1683FF]"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center bg-white border border-[#dce7fa] rounded-xl p-0.5">
              {[
                { label: 'All', val: 'all' },
                { label: 'Images', val: 'image' },
                { label: 'Videos', val: 'video' },
                { label: 'PDFs', val: 'pdf' },
                { label: 'Unused Only', val: 'unused' },
              ].map((tab) => (
                <button
                  key={tab.val}
                  onClick={() => setFilterType(tab.val)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                    filterType === tab.val
                      ? 'bg-[#1683FF] text-white shadow-xs'
                      : 'text-[#666666] hover:text-[#1683FF]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Media Grid */}
        {loadingMedia ? (
          <div className="py-16 text-center bg-white rounded-2xl border border-[#dce7fa]">
            <Loader2 className="w-7 h-7 animate-spin text-[#1683FF] mx-auto mb-2" />
            <p className="text-xs text-[#666666]">Scanning storage and references...</p>
          </div>
        ) : filteredMedia.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-2xl border border-[#dce7fa] space-y-2">
            <HardDrive className="w-8 h-8 text-[#888888] mx-auto opacity-50" />
            <p className="text-sm font-semibold text-[#1a1a1a]">No media files found</p>
            <p className="text-xs text-[#666666]">
              {searchQuery || filterType !== 'all' ? 'No files match your filter.' : 'Upload your first file above.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMedia.map((item) => {
              const isDeleting = deletingId === item.id;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-[#dce7fa] p-4 flex flex-col justify-between space-y-3.5 hover:shadow-xs transition-all"
                >
                  {/* Top Preview Canvas */}
                  <div className="w-full h-40 rounded-xl bg-[#f8fbff] border border-[#e8f2ff] overflow-hidden flex items-center justify-center relative group">
                    {item.type === 'image' || item.type === 'svg' ? (
                      <img
                        src={item.url}
                        alt={item.filename}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=80';
                        }}
                      />
                    ) : item.type === 'video' ? (
                      <div className="w-full h-full bg-black relative flex items-center justify-center">
                        <video
                          src={item.url}
                          preload="metadata"
                          className="w-full h-full object-cover opacity-80"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center backdrop-blur-xs">
                            <VideoIcon className="w-5 h-5" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-[#1683FF] space-y-1">
                        <FileText className="w-10 h-10" />
                        <span className="text-[11px] font-bold uppercase font-mono">PDF Document</span>
                      </div>
                    )}

                    {/* Status Badge */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      {item.isUsed ? (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500 text-white text-[10px] font-bold shadow-xs flex items-center gap-1">
                          In Use
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-amber-500 text-white text-[10px] font-bold shadow-xs flex items-center gap-1">
                          Unused
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-md bg-black/70 text-white text-[10px] font-mono uppercase backdrop-blur-xs">
                        {item.type}
                      </span>
                    </div>

                    {/* External Link */}
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-black/50 hover:bg-black/80 text-white transition-all opacity-0 group-hover:opacity-100"
                      title="Open full media"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {/* File Metadata */}
                  <div className="space-y-2 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-bold text-[#1a1a1a] truncate" title={item.filename}>
                        {item.filename}
                      </p>
                      <span className="text-[10px] font-mono text-[#888888] shrink-0">
                        {formatFileSize(item.size)}
                      </span>
                    </div>

                    {/* Usage references */}
                    {item.isUsed && item.usedBy && item.usedBy.length > 0 ? (
                      <div className="space-y-1 bg-[#f0f6ff] p-2 rounded-xl border border-[#dce7fa]">
                        <p className="text-[10px] font-bold text-[#1683FF] uppercase tracking-wider">Used In:</p>
                        <ul className="text-[11px] text-[#333333] space-y-0.5 list-disc list-inside truncate">
                          {item.usedBy.slice(0, 2).map((ref, idx) => (
                            <li key={idx} className="truncate">{ref}</li>
                          ))}
                          {item.usedBy.length > 2 && (
                            <li className="text-[10px] text-[#666666] list-none">+{item.usedBy.length - 2} more sections</li>
                          )}
                        </ul>
                      </div>
                    ) : (
                      <div className="bg-amber-50/70 p-2 rounded-xl border border-amber-200/60 flex items-center gap-1.5 text-[11px] text-amber-800">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                        <span>Unused media — safe to delete</span>
                      </div>
                    )}

                    <p className="text-[10px] text-[#888888] font-mono">
                      Uploaded: {formatDate(item.uploadedAt)}
                    </p>
                  </div>

                  {/* Actions (Copy Link & Delete) */}
                  <div className="pt-2 border-t border-[#edf2f7] flex items-center justify-between gap-2">
                    <button
                      onClick={() => copyUrlToClipboard(item.url)}
                      className="flex-1 py-1.5 px-3 rounded-xl bg-[#f0f6ff] hover:bg-[#e0efff] text-[#1683FF] text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                    >
                      {copiedUrl === item.url ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedUrl === item.url ? 'Copied' : 'Copy Link'}</span>
                    </button>

                    <button
                      onClick={() => handleDeleteMedia(item)}
                      disabled={isDeleting}
                      className="py-1.5 px-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                      title="Delete media file"
                    >
                      {isDeleting ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Deleting...</span>
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};

export default AdminMediaPage;


