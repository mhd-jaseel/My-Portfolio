import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { 
  Save, 
  ArrowLeft, 
  Upload, 
  Plus, 
  Trash2, 
  Loader2,
  Image as ImageIcon,
  Layers,
  Code2
} from 'lucide-react';
import { showSuccess, showError, toastSuccess, toastError } from '../../utils/alertUtils';
import { getMediaUrl } from '../../utils/mediaUtils';

const AdminProjectFormPage = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: '',
    description: '',
    detailedDescription: '',
    thumbnail: '',
    gallery: [],
    technologies: '',
    features: '',
    challenges: '',
    solutions: '',
    githubUrl: '',
    liveUrl: '',
    featured: true,
    showOnHome: false,
    homeDisplayOrder: 1,
    isActive: true,
    order: 0,
  });

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  useEffect(() => {
    if (isEditing) {
      const fetchProject = async () => {
        try {
          const res = await api.get(`/admin/projects/${id}`);
          if (res.data?.data) {
            const p = res.data.data;
            setFormData({
              ...p,
              showOnHome: Boolean(p.showOnHome),
              homeDisplayOrder: p.homeDisplayOrder !== undefined ? p.homeDisplayOrder : 1,
              isActive: p.isActive !== undefined ? Boolean(p.isActive) : true,
              technologies: Array.isArray(p.technologies) ? p.technologies.join(', ') : (p.technologies || ''),
              features: Array.isArray(p.features) ? p.features.join('\n') : (p.features || ''),
              challenges: Array.isArray(p.challenges) ? p.challenges.join('\n') : (p.challenges || ''),
              solutions: Array.isArray(p.solutions) ? p.solutions.join('\n') : (p.solutions || ''),
            });
          }
        } catch (err) {
          showError(err, 'Unable to load project details.');
        } finally {
          setLoading(false);
        }
      };
      fetchProject();
    }
  }, [id, isEditing]);

  const handleTitleChange = (e) => {
    const title = e.target.value;
    if (!isEditing) {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setFormData((prev) => ({ ...prev, title, slug }));
    } else {
      setFormData((prev) => ({ ...prev, title }));
    }
  };

  const handleThumbnailUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toastError('Please upload an image file.');
      return;
    }

    const data = new FormData();
    data.append('file', file);
    data.append('folder', 'jaseel_portfolio/projects');

    setUploadingThumbnail(true);

    try {
      const res = await api.post('/admin/media', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data?.url) {
        setFormData((prev) => ({ ...prev, thumbnail: res.data.url }));
        toastSuccess('Thumbnail uploaded successfully.');
      }
    } catch (err) {
      showError(err, 'Thumbnail upload failed. Please try again.');
    } finally {
      setUploadingThumbnail(false);
    }
  };

  const handleGalleryUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toastError('Please upload an image file.');
      return;
    }

    const data = new FormData();
    data.append('file', file);
    data.append('folder', 'jaseel_portfolio/gallery');

    setUploadingGallery(true);

    try {
      const res = await api.post('/admin/media', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data?.url) {
        setFormData((prev) => ({
          ...prev,
          gallery: [...(prev.gallery || []), res.data.url],
        }));
        toastSuccess('Gallery image added successfully.');
      }
    } catch (err) {
      showError(err, 'Image upload failed. Please try again.');
    } finally {
      setUploadingGallery(false);
    }
  };

  const removeGalleryImage = (idx) => {
    setFormData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== idx),
    }));
    toastSuccess('Image removed from gallery.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      showError('Project name is required.');
      return;
    }
    if (!formData.slug.trim()) {
      showError('URL address slug is required.');
      return;
    }
    if (!formData.category.trim()) {
      showError('Category is required.');
      return;
    }
    if (!formData.thumbnail.trim()) {
      showError('Please upload a project image.');
      return;
    }
    if (!formData.description.trim()) {
      showError('Description is required.');
      return;
    }

    setSaving(true);

    try {
      if (isEditing) {
        await api.put(`/admin/projects/${id}`, formData);
        await showSuccess('Updated successfully.');
      } else {
        await api.post('/admin/projects', formData);
        await showSuccess('Added successfully.');
      }
      navigate('/admin/projects');
    } catch (err) {
      showError(err, 'Unable to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-[#666666]">
        <Loader2 className="w-8 h-8 animate-spin text-[#1683FF] mb-3" />
        <p className="text-xs font-semibold uppercase tracking-wider">Loading Project Details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            to="/admin/projects"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1683FF] hover:underline mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Projects</span>
          </Link>
          <h1 className="text-2xl font-bold text-[#1a1a1a] tracking-tight">
            {isEditing ? `Edit "${formData.title}"` : 'Add New Project'}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Card 1: Project Details */}
        <div className="p-6 sm:p-7 rounded-2xl bg-white border border-[#dce7fa] shadow-xs space-y-4">
          <div className="border-b border-[#dce7fa] pb-3 flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#1683FF]" />
            <h2 className="text-sm font-bold text-[#1a1a1a]">Project Details</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1a1a1a] mb-1.5">Project Name *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="e.g. Vault E-Commerce"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8fbff] border border-[#dce7fa] text-[#1a1a1a] text-sm focus:outline-none focus:border-[#1683FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1a1a1a] mb-1.5">URL Slug *</label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase() })}
                placeholder="e.g. vault-ecommerce"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8fbff] border border-[#dce7fa] text-[#1a1a1a] text-sm focus:outline-none focus:border-[#1683FF]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1a1a1a] mb-1.5">Category *</label>
              <input
                type="text"
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g. Full Stack Web App"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8fbff] border border-[#dce7fa] text-[#1a1a1a] text-sm focus:outline-none focus:border-[#1683FF]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#1a1a1a] mb-1.5">Display Order</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8fbff] border border-[#dce7fa] text-[#1a1a1a] text-sm focus:outline-none focus:border-[#1683FF]"
                />
              </div>

              <div className="flex items-center pt-6 gap-3">
                <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-[#1a1a1a]">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded text-[#1683FF] focus:ring-0"
                  />
                  <span>Active</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-[#1a1a1a]">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded text-[#1683FF] focus:ring-0"
                  />
                  <span>Featured</span>
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1a1a1a] mb-1.5">Short Description *</label>
            <textarea
              required
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Short summary shown on the project card..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8fbff] border border-[#dce7fa] text-[#1a1a1a] text-sm focus:outline-none focus:border-[#1683FF] resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1a1a1a] mb-1.5">Detailed Overview</label>
            <textarea
              rows={4}
              value={formData.detailedDescription}
              onChange={(e) => setFormData({ ...formData, detailedDescription: e.target.value })}
              placeholder="Detailed explanation of the project features, architecture, and workflow..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8fbff] border border-[#dce7fa] text-[#1a1a1a] text-sm focus:outline-none focus:border-[#1683FF] resize-none"
            />
          </div>
        </div>

        {/* Card 2: Show on Home Page Control */}
        <div className="p-6 rounded-2xl bg-[#f8fbff] border border-[#dce7fa] shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-[#1a1a1a]">
                Show on Home Page
              </h3>
              <p className="text-xs text-[#666666] mt-0.5">
                Enable this to show this project on the Home page (maximum 4 projects).
              </p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer px-3.5 py-2 rounded-xl bg-white border border-[#dce7fa] text-[#1683FF] text-xs font-bold w-fit shadow-xs">
              <input
                type="checkbox"
                checked={formData.showOnHome}
                onChange={(e) => setFormData({ ...formData, showOnHome: e.target.checked })}
                className="rounded text-[#1683FF] focus:ring-0"
              />
              <span>Show on Home</span>
            </label>
          </div>

          {formData.showOnHome && (
            <div className="pt-3 border-t border-[#dce7fa] flex items-center gap-3">
              <label className="text-xs font-semibold text-[#1a1a1a]">Home Display Order (1 to 4):</label>
              <input
                type="number"
                min="1"
                max="4"
                value={formData.homeDisplayOrder}
                onChange={(e) => setFormData({ ...formData, homeDisplayOrder: Number(e.target.value) })}
                className="w-20 px-3 py-1.5 rounded-xl bg-white border border-[#dce7fa] text-[#1a1a1a] text-xs font-bold text-center focus:outline-none focus:border-[#1683FF]"
              />
            </div>
          )}
        </div>

        {/* Card 3: Images & Media */}
        <div className="p-6 sm:p-7 rounded-2xl bg-white border border-[#dce7fa] shadow-xs space-y-5">
          <div className="border-b border-[#dce7fa] pb-3 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-[#1683FF]" />
            <h2 className="text-sm font-bold text-[#1a1a1a]">Images</h2>
          </div>

          {/* Main Thumbnail */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-[#1a1a1a]">Main Image / Thumbnail *</label>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="w-28 h-20 rounded-xl overflow-hidden bg-[#f8fbff] border border-[#dce7fa] shrink-0">
                {formData.thumbnail ? (
                  <img src={getMediaUrl(formData.thumbnail)} alt="Thumbnail preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[10px] text-[#8a99ad]">No Image</div>
                )}
              </div>

              <div className="flex-1 w-full space-y-2">
                <input
                  type="text"
                  required
                  value={formData.thumbnail}
                  onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                  placeholder="Image URL or upload below"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#f8fbff] border border-[#dce7fa] text-[#1a1a1a] text-xs focus:outline-none focus:border-[#1683FF]"
                />
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#f0f6ff] hover:bg-[#1683FF] text-[#1683FF] hover:text-white border border-[#dce7fa] text-xs font-semibold cursor-pointer transition-all">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploadingThumbnail ? 'Uploading Image...' : 'Upload Image'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailUpload}
                    disabled={uploadingThumbnail}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Gallery Images */}
          <div className="space-y-3 pt-3 border-t border-[#dce7fa]">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-[#1a1a1a]">Extra Gallery Images</label>
              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#f0f6ff] hover:bg-[#1683FF] text-[#1683FF] hover:text-white border border-[#dce7fa] text-xs font-semibold cursor-pointer transition-all">
                <Plus className="w-3.5 h-3.5" />
                <span>{uploadingGallery ? 'Uploading...' : 'Add Image'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleGalleryUpload}
                  disabled={uploadingGallery}
                  className="hidden"
                />
              </label>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {formData.gallery?.map((imgUrl, idx) => (
                <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-[#dce7fa] group bg-[#f8fbff]">
                  <img src={getMediaUrl(imgUrl)} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(idx)}
                    className="absolute top-1 right-1 p-1 rounded-md bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-xs"
                    title="Remove"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card 4: Technical & Links */}
        <div className="p-6 sm:p-7 rounded-2xl bg-white border border-[#dce7fa] shadow-xs space-y-4">
          <div className="border-b border-[#dce7fa] pb-3 flex items-center gap-2">
            <Code2 className="w-4 h-4 text-[#1683FF]" />
            <h2 className="text-sm font-bold text-[#1a1a1a]">Technologies &amp; Links</h2>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1a1a1a] mb-1.5">
              Technologies (comma separated)
            </label>
            <input
              type="text"
              value={formData.technologies}
              onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
              placeholder="e.g. React, Node.js, Express, MongoDB, Tailwind CSS"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8fbff] border border-[#dce7fa] text-[#1a1a1a] text-sm focus:outline-none focus:border-[#1683FF]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1a1a1a] mb-1.5">
              Key Features (one per line)
            </label>
            <textarea
              rows={3}
              value={formData.features}
              onChange={(e) => setFormData({ ...formData, features: e.target.value })}
              placeholder="User authentication with JWT&#10;Razorpay online payments&#10;Admin dashboard management"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8fbff] border border-[#dce7fa] text-[#1a1a1a] text-xs focus:outline-none focus:border-[#1683FF] resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1a1a1a] mb-1.5">
                Challenges Faced (one per line)
              </label>
              <textarea
                rows={3}
                value={formData.challenges}
                onChange={(e) => setFormData({ ...formData, challenges: e.target.value })}
                placeholder="Handling real-time state synchronization..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8fbff] border border-[#dce7fa] text-[#1a1a1a] text-xs focus:outline-none focus:border-[#1683FF] resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1a1a1a] mb-1.5">
                Solutions Implemented (one per line)
              </label>
              <textarea
                rows={3}
                value={formData.solutions}
                onChange={(e) => setFormData({ ...formData, solutions: e.target.value })}
                placeholder="Implemented WebSockets and MongoDB transactions..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8fbff] border border-[#dce7fa] text-[#1a1a1a] text-xs focus:outline-none focus:border-[#1683FF] resize-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#dce7fa]">
            <div>
              <label className="block text-xs font-semibold text-[#1a1a1a] mb-1.5">Live Demo Link</label>
              <input
                type="url"
                value={formData.liveUrl}
                onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                placeholder="https://example.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8fbff] border border-[#dce7fa] text-[#1a1a1a] text-sm focus:outline-none focus:border-[#1683FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1a1a1a] mb-1.5">GitHub Repository Link</label>
              <input
                type="url"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                placeholder="https://github.com/username/project"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8fbff] border border-[#dce7fa] text-[#1a1a1a] text-sm focus:outline-none focus:border-[#1683FF]"
              />
            </div>
          </div>
        </div>

        {/* Submit & Cancel Buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <Link
            to="/admin/projects"
            className="px-5 py-2.5 rounded-xl bg-white border border-[#dce7fa] text-[#666666] text-xs font-semibold hover:bg-[#f8fbff] transition-all"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-[#1683FF] hover:bg-[#1371dc] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{isEditing ? 'Save Changes' : 'Add Project'}</span>
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
};

export default AdminProjectFormPage;

