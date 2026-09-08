import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  Star, 
  Loader2, 
  Layers,
  Home,
  Check,
  X,
  Search
} from 'lucide-react';
import { showConfirm, showSuccess, showError, toastSuccess, toastError } from '../../utils/alertUtils';

const AdminProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState('all'); // 'all' | 'home' | 'active'

  const fetchProjects = async () => {
    try {
      const res = await api.get('/admin/projects');
      if (res.data?.data) {
        setProjects(res.data.data);
      }
    } catch (err) {
      showError(err, 'Unable to load projects.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const homeCount = projects.filter((p) => p.showOnHome).length;

  const handleToggleHome = async (project) => {
    const willEnable = !project.showOnHome;
    if (willEnable && homeCount >= 4) {
      toastError('Only 4 projects can be shown on the Home page. Please turn off one first.');
      return;
    }

    setUpdatingId(project._id);

    try {
      const newHomeOrder = willEnable 
        ? (project.homeDisplayOrder || homeCount + 1)
        : project.homeDisplayOrder;

      const res = await api.put(`/admin/projects/${project._id}`, {
        showOnHome: willEnable,
        homeDisplayOrder: newHomeOrder,
      });

      if (res.data?.data) {
        setProjects((prev) =>
          prev.map((p) => (p._id === project._id ? { ...p, showOnHome: willEnable, homeDisplayOrder: newHomeOrder } : p))
        );
        toastSuccess(`"${project.title}" set to ${willEnable ? 'Show on Home' : 'Hidden from Home'}.`);
      }
    } catch (err) {
      showError(err, 'Unable to update Home status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleUpdateHomeOrder = async (project, orderVal) => {
    const num = Number(orderVal);
    if (isNaN(num)) return;

    setUpdatingId(project._id);
    try {
      await api.put(`/admin/projects/${project._id}`, {
        homeDisplayOrder: num,
      });
      setProjects((prev) =>
        prev.map((p) => (p._id === project._id ? { ...p, homeDisplayOrder: num } : p))
      );
      toastSuccess(`Home order updated to #${num} for "${project.title}".`);
    } catch (err) {
      showError(err, 'Unable to update project order.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id, title) => {
    const confirmed = await showConfirm({
      title: `Delete "${title}"?`,
      text: 'Are you sure you want to delete this project? This cannot be undone.',
      confirmText: 'Yes, Delete',
    });

    if (!confirmed) return;

    try {
      await api.delete(`/admin/projects/${id}`);
      showSuccess('Project deleted successfully.');
      fetchProjects();
    } catch (err) {
      showError(err, 'Unable to delete this item.');
    }
  };

  // Filter and search
  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.category?.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (filterTab === 'home') return p.showOnHome;
    if (filterTab === 'active') return p.isActive !== false;
    return true;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-[#666666]">
        <Loader2 className="w-8 h-8 animate-spin text-[#1683FF] mb-3" />
        <p className="text-xs font-semibold uppercase tracking-wider">Loading Projects...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header & Quick Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a1a] tracking-tight">
            Projects
          </h1>
          <p className="text-xs text-[#666666] mt-0.5">
            Add, edit, or remove your portfolio projects. Choose up to 4 to show on the Home page.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Home Showcase Counter */}
          <div className="px-3.5 py-2 rounded-xl bg-[#f0f6ff] border border-[#dce7fa] text-[#1683FF] text-xs font-semibold flex items-center gap-2">
            <Home className="w-3.5 h-3.5" />
            <span>Show on Home: <strong>{homeCount}/4</strong></span>
          </div>

          <Link
            to="/admin/projects/new"
            className="px-4 py-2 rounded-xl bg-[#1683FF] hover:bg-[#1371dc] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Project</span>
          </Link>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-white border border-[#dce7fa] rounded-2xl shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#8a99ad] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects..."
            className="w-full pl-9 pr-3 py-2 bg-[#f8fbff] border border-[#dce7fa] rounded-xl text-xs text-[#1a1a1a] placeholder:text-[#8a99ad] focus:outline-none focus:border-[#1683FF]"
          />
        </div>

        <div className="flex items-center gap-1 w-full sm:w-auto">
          <button
            onClick={() => setFilterTab('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filterTab === 'all'
                ? 'bg-[#1683FF] text-white shadow-xs'
                : 'text-[#666666] hover:bg-[#f0f6ff]'
            }`}
          >
            All ({projects.length})
          </button>
          <button
            onClick={() => setFilterTab('home')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filterTab === 'home'
                ? 'bg-[#1683FF] text-white shadow-xs'
                : 'text-[#666666] hover:bg-[#f0f6ff]'
            }`}
          >
            Show on Home ({homeCount})
          </button>
          <button
            onClick={() => setFilterTab('active')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filterTab === 'active'
                ? 'bg-[#1683FF] text-white shadow-xs'
                : 'text-[#666666] hover:bg-[#f0f6ff]'
            }`}
          >
            Active ({projects.filter(p => p.isActive !== false).length})
          </button>
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-3">
        {filteredProjects.map((project, index) => {
          const isUpdating = updatingId === project._id;

          return (
            <div
              key={project._id}
              className={`p-4 sm:p-5 rounded-2xl bg-white border transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 shadow-xs ${
                project.showOnHome ? 'border-[#1683FF]/40 bg-[#fbfdff]' : 'border-[#dce7fa] hover:border-[#1683FF]/30'
              }`}
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                {/* Thumbnail */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-[#f0f6ff] border border-[#dce7fa] shrink-0 relative">
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                  {project.showOnHome && (
                    <div className="absolute top-1 left-1 bg-[#1683FF] text-white p-1 rounded-md shadow-xs" title="Featured on Home">
                      <Home className="w-2.5 h-2.5" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono text-[#8a99ad] font-bold">#{index + 1}</span>
                    <h3 className="text-sm sm:text-base font-bold text-[#1a1a1a] truncate">
                      {project.title}
                    </h3>
                    {project.showOnHome && (
                      <span className="px-2 py-0.5 rounded-md bg-[#f0f6ff] text-[#1683FF] border border-[#dce7fa] text-[10px] font-bold flex items-center gap-1">
                        <Home className="w-2.5 h-2.5" />
                        <span>Home Order: {project.homeDisplayOrder || 1}</span>
                      </span>
                    )}
                    {project.featured && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-600 border border-amber-200 text-[10px] font-semibold flex items-center gap-1">
                        <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                        <span>Featured</span>
                      </span>
                    )}
                  </div>

                  <p className="text-xs font-semibold text-[#1683FF]">{project.category}</p>
                  <p className="text-xs text-[#666666] line-clamp-1 max-w-xl">{project.description}</p>
                </div>
              </div>

              {/* Action Controls */}
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full lg:w-auto justify-between lg:justify-end pt-3 lg:pt-0 border-t lg:border-t-0 border-[#dce7fa]">
                
                {/* Home Toggle */}
                <div className="flex items-center gap-2 bg-[#f8fbff] border border-[#dce7fa] p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => handleToggleHome(project)}
                    disabled={isUpdating}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                      project.showOnHome
                        ? 'bg-[#1683FF] text-white shadow-xs'
                        : 'bg-white text-[#666666] hover:text-[#1a1a1a] border border-[#dce7fa]'
                    }`}
                    title={project.showOnHome ? 'Click to hide from Home' : 'Click to show on Home'}
                  >
                    {project.showOnHome ? (
                      <>
                        <Check className="w-3 h-3 stroke-[3]" />
                        <span>Home: ON</span>
                      </>
                    ) : (
                      <>
                        <X className="w-3 h-3" />
                        <span>Home: OFF</span>
                      </>
                    )}
                  </button>

                  {project.showOnHome && (
                    <div className="flex items-center gap-1 pr-1">
                      <span className="text-[10px] text-[#666666] font-medium">Order:</span>
                      <input
                        type="number"
                        min="1"
                        max="4"
                        value={project.homeDisplayOrder || 1}
                        onChange={(e) => handleUpdateHomeOrder(project, e.target.value)}
                        className="w-10 px-1.5 py-0.5 rounded bg-white border border-[#dce7fa] text-[#1a1a1a] text-xs font-bold text-center focus:outline-none focus:border-[#1683FF]"
                        title="Home display order"
                      />
                    </div>
                  )}
                </div>

                {/* Edit, Preview & Delete */}
                <div className="flex items-center gap-1.5">
                  <Link
                    to={`/projects/${project.slug}`}
                    target="_blank"
                    className="p-2 rounded-xl bg-white border border-[#dce7fa] text-[#666666] hover:text-[#1683FF] hover:border-[#1683FF] transition-all"
                    title="Preview Live Page"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    to={`/admin/projects/${project._id}/edit`}
                    className="px-3 py-2 rounded-xl bg-[#f0f6ff] hover:bg-[#1683FF] text-[#1683FF] hover:text-white border border-[#dce7fa] text-xs font-bold flex items-center gap-1.5 transition-all"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </Link>

                  <button
                    onClick={() => handleDelete(project._id, project.title)}
                    className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-all"
                    title="Delete Project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredProjects.length === 0 && (
          <div className="p-12 text-center rounded-2xl bg-white border border-[#dce7fa] text-[#666666] space-y-2">
            <Layers className="w-8 h-8 mx-auto text-[#8a99ad]" />
            <p className="text-sm font-semibold">No projects found.</p>
            <p className="text-xs text-[#8a99ad]">Try changing your search or filter options.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default AdminProjectsPage;

