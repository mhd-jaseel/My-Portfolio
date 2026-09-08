import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import SkillIcon from '../../components/SkillIcon';
import {
  Code2,
  Plus,
  Trash2,
  Edit2,
  Save,
  Loader2,
  X,
  Layers,
  Percent,
  Play,
  Upload
} from 'lucide-react';
import { showConfirm, showSuccess, showError, toastSuccess, toastError } from '../../utils/alertUtils';

const AdminSkillsPage = () => {
  const [activeTab, setActiveTab] = useState('skills'); // 'skills' | 'scrolling-tools' | 'categories'
  const [categories, setCategories] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingCategory, setSavingCategory] = useState(false);
  const [savingSkill, setSavingSkill] = useState(false);
  const [uploadingSkillIcon, setUploadingSkillIcon] = useState(false);
  const [uploadingIcon, setUploadingIcon] = useState(false);
  const [editingMarqueeTool, setEditingMarqueeTool] = useState(null);
  const [showMarqueeModal, setShowMarqueeModal] = useState(false);

  const [marqueeForm, setMarqueeForm] = useState({
    name: '',
    icon: 'Figma',
    displayOrder: 1,
    isActive: true,
    showInMarquee: true,
    category: '',
  });

  // Skill Form State
  const [editingSkillId, setEditingSkillId] = useState(null);
  const [skillForm, setSkillForm] = useState({
    name: '',
    slug: '',
    category: '',
    icon: 'Code',
    shortDescription: '',
    proficiencyPercentage: 85,
    displayOrder: 0,
    isActive: true,
    showOnHome: true,
    showInMarquee: false,
  });

  // Category Form State
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    slug: '',
    description: '',
    icon: 'Layers',
    displayOrder: 0,
    isActive: true,
    showOnHome: true,
  });

  const fetchData = async () => {
    try {
      const [catsRes, skillsRes] = await Promise.all([
        api.get('/admin/skill-categories'),
        api.get('/admin/skills'),
      ]);

      if (catsRes.data?.data) {
        setCategories(catsRes.data.data);
        if (!skillForm.category && catsRes.data.data.length > 0) {
          setSkillForm(prev => ({ ...prev, category: catsRes.data.data[0]._id }));
        }
      }
      if (skillsRes.data?.data) {
        setSkills(skillsRes.data.data);
      }
    } catch (err) {
      showError(err, 'Unable to load skills and categories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Category Form Handlers
  const handleCategorySave = async (e) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) {
      showError('Category name is required.');
      return;
    }

    setSavingCategory(true);
    try {
      if (editingCategoryId) {
        await api.put(`/admin/skill-categories/${editingCategoryId}`, categoryForm);
        toastSuccess(`Category "${categoryForm.name}" updated successfully.`);
        setEditingCategoryId(null);
      } else {
        await api.post('/admin/skill-categories', categoryForm);
        toastSuccess(`Category "${categoryForm.name}" added successfully.`);
      }
      setCategoryForm({
        name: '',
        slug: '',
        description: '',
        icon: 'Layers',
        displayOrder: 0,
        isActive: true,
        showOnHome: true,
      });
      fetchData();
    } catch (err) {
      showError(err, 'Unable to save category. Please try again.');
    } finally {
      setSavingCategory(false);
    }
  };

  const handleEditCategory = (cat) => {
    setEditingCategoryId(cat._id);
    setCategoryForm({
      name: cat.name,
      slug: cat.slug || '',
      description: cat.description || '',
      icon: cat.icon || 'Layers',
      displayOrder: cat.displayOrder ?? 0,
      isActive: cat.isActive !== undefined ? cat.isActive : true,
      showOnHome: cat.showOnHome !== undefined ? cat.showOnHome : true,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteCategory = async (id, name) => {
    const confirmed = await showConfirm({
      title: `Delete category "${name}"?`,
      text: 'All skills inside this category will also be deleted.',
      confirmText: 'Yes, Delete',
    });

    if (!confirmed) return;

    try {
      await api.delete(`/admin/skill-categories/${id}`);
      showSuccess('Category deleted successfully.');
      fetchData();
    } catch (err) {
      showError(err, 'Unable to delete category.');
    }
  };

  const handleToggleCategoryHome = async (cat) => {
    try {
      await api.put(`/admin/skill-categories/${cat._id}`, { showOnHome: !cat.showOnHome });
      toastSuccess(`Category "${cat.name}" Home visibility updated.`);
      fetchData();
    } catch (err) {
      showError(err, 'Unable to update Home status.');
    }
  };

  const handleToggleCategoryActive = async (cat) => {
    try {
      await api.put(`/admin/skill-categories/${cat._id}`, { isActive: !cat.isActive });
      toastSuccess(`Category "${cat.name}" status updated.`);
      fetchData();
    } catch (err) {
      showError(err, 'Unable to update active status.');
    }
  };

  // Skill Form Handlers
  const handleSkillSave = async (e) => {
    e.preventDefault();
    if (!skillForm.name.trim()) {
      showError('Skill name is required.');
      return;
    }
    if (!skillForm.category) {
      showError('Please select a category.');
      return;
    }

    const pct = Number(skillForm.proficiencyPercentage);
    if (isNaN(pct) || pct < 0 || pct > 100) {
      showError('Skill level must be between 0 and 100.');
      return;
    }

    setSavingSkill(true);
    try {
      if (editingSkillId) {
        await api.put(`/admin/skills/${editingSkillId}`, skillForm);
        toastSuccess(`Skill "${skillForm.name}" updated successfully.`);
        setEditingSkillId(null);
      } else {
        await api.post('/admin/skills', skillForm);
        toastSuccess(`Skill "${skillForm.name}" added successfully.`);
      }
      setSkillForm(prev => ({
        name: '',
        slug: '',
        category: prev.category || (categories[0]?._id || ''),
        icon: 'Code',
        shortDescription: '',
        proficiencyPercentage: 85,
        displayOrder: 0,
        isActive: true,
        showOnHome: true,
        showInMarquee: false,
      }));
      fetchData();
    } catch (err) {
      showError(err, 'Unable to save skill. Please try again.');
    } finally {
      setSavingSkill(false);
    }
  };

  const handleEditSkill = (skill, switchTabTo = null) => {
    setEditingSkillId(skill._id);
    setSkillForm({
      name: skill.name,
      slug: skill.slug || '',
      category: skill.category?._id || skill.category || '',
      icon: skill.icon || 'Code',
      shortDescription: skill.shortDescription || '',
      proficiencyPercentage: skill.proficiencyPercentage ?? 80,
      displayOrder: skill.displayOrder ?? 0,
      isActive: skill.isActive !== undefined ? skill.isActive : true,
      showOnHome: skill.showOnHome !== undefined ? skill.showOnHome : true,
      showInMarquee: skill.showInMarquee !== undefined ? skill.showInMarquee : false,
    });
    if (switchTabTo) {
      setActiveTab(switchTabTo);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteSkill = async (id, name) => {
    const confirmed = await showConfirm({
      title: `Delete "${name}"?`,
      text: 'Are you sure you want to delete this item?',
      confirmText: 'Yes, Delete',
    });

    if (!confirmed) return;

    try {
      await api.delete(`/admin/skills/${id}`);
      showSuccess('Deleted successfully.');
      fetchData();
    } catch (err) {
      showError(err, 'Unable to delete this item.');
    }
  };

  const handleToggleSkillHome = async (skill) => {
    try {
      await api.put(`/admin/skills/${skill._id}`, { showOnHome: !skill.showOnHome });
      toastSuccess(`"${skill.name}" Home visibility updated.`);
      fetchData();
    } catch (err) {
      showError(err, 'Unable to update status.');
    }
  };

  const handleToggleSkillMarquee = async (skill) => {
    try {
      await api.put(`/admin/skills/${skill._id}`, { showInMarquee: !skill.showInMarquee });
      toastSuccess(`"${skill.name}" Scrolling Tools visibility updated.`);
      fetchData();
    } catch (err) {
      showError(err, 'Unable to update status.');
    }
  };

  // Dedicated Scrolling Tools (Marquee) Handlers
  const handleOpenAddMarquee = () => {
    const defaultCat = categories.find(c => c.slug?.includes('tool') || c.slug?.includes('devops'))?._id || categories[0]?._id || '';
    setEditingMarqueeTool(null);
    setMarqueeForm({
      name: '',
      icon: 'Figma',
      displayOrder: marqueeTools.length + 1,
      isActive: true,
      showInMarquee: true,
      category: defaultCat,
    });
    setShowMarqueeModal(true);
  };

  const handleOpenEditMarquee = (tool) => {
    setEditingMarqueeTool(tool);
    setMarqueeForm({
      name: tool.name || '',
      icon: tool.icon || 'Code',
      displayOrder: tool.displayOrder ?? 1,
      isActive: tool.isActive !== undefined ? tool.isActive : true,
      showInMarquee: tool.showInMarquee !== undefined ? tool.showInMarquee : true,
      category: tool.category?._id || tool.category || categories[0]?._id || '',
    });
    setShowMarqueeModal(true);
  };

  const handleSkillIconUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate allowed file formats
    const isImage = file.type.startsWith('image/') || file.name.toLowerCase().endsWith('.svg');
    if (!isImage) {
      toastError('Please upload a valid image (PNG, JPG, JPEG, WEBP, or SVG).');
      return;
    }

    // Validate size (max 5MB for icons)
    if (file.size > 5 * 1024 * 1024) {
      toastError('Image size is too large. Maximum size is 5MB.');
      return;
    }

    const data = new FormData();
    data.append('file', file);
    data.append('folder', 'jaseel_portfolio/skills_icons');

    setUploadingSkillIcon(true);
    try {
      const res = await api.post('/admin/media', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data?.url) {
        setSkillForm(prev => ({ ...prev, icon: res.data.url }));
        toastSuccess('Skill icon updated successfully.');
      }
    } catch (err) {
      showError(err, 'Unable to upload skill icon. Please try again.');
    } finally {
      setUploadingSkillIcon(false);
      // Reset input value so same file can be chosen again if needed
      e.target.value = '';
    }
  };

  const handleMarqueeIconUpload = async (e, isSkillForm = false) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/') && !file.name.toLowerCase().endsWith('.svg')) {
      toastError('Please select an SVG or image file (PNG, WebP, JPG).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toastError('Image size is too large. Maximum size is 5MB.');
      return;
    }

    const data = new FormData();
    data.append('file', file);
    data.append('folder', 'jaseel_portfolio/marquee_icons');

    setUploadingIcon(true);
    try {
      const res = await api.post('/admin/media', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data?.url) {
        if (isSkillForm) {
          setSkillForm(prev => ({ ...prev, icon: res.data.url }));
        } else {
          setMarqueeForm(prev => ({ ...prev, icon: res.data.url }));
        }
        toastSuccess('Tool icon uploaded successfully.');
      }
    } catch (err) {
      showError(err, 'Unable to upload icon. Please try again.');
    } finally {
      setUploadingIcon(false);
      e.target.value = '';
    }
  };

  const handleMarqueeSave = async (e) => {
    e.preventDefault();
    if (!marqueeForm.name.trim()) {
      showError('Tool name is required.');
      return;
    }
    if (!marqueeForm.category) {
      showError('Please select a category for this tool.');
      return;
    }

    const orderNum = Number(marqueeForm.displayOrder);
    if (isNaN(orderNum) || orderNum < 0) {
      showError('Display order must be a valid number.');
      return;
    }

    setSavingSkill(true);
    try {
      const payload = {
        ...marqueeForm,
        name: marqueeForm.name.trim(),
        displayOrder: orderNum,
        proficiencyPercentage: 90,
      };

      if (editingMarqueeTool) {
        await api.put(`/admin/skills/${editingMarqueeTool._id}`, payload);
        toastSuccess(`Tool "${marqueeForm.name}" updated successfully.`);
      } else {
        await api.post('/admin/skills', payload);
        toastSuccess(`Tool "${marqueeForm.name}" added successfully.`);
      }
      setShowMarqueeModal(false);
      fetchData();
    } catch (err) {
      showError(err, 'Unable to save tool. Please try again.');
    } finally {
      setSavingSkill(false);
    }
  };

  const renderToolPreviewIcon = (iconStr, name = '') => {
    const icon = (iconStr || '').trim();
    const nameLower = (name || '').toLowerCase();

    if (icon.startsWith('http://') || icon.startsWith('https://') || icon.startsWith('/')) {
      return (
        <img
          src={icon}
          alt={name}
          className="w-5 h-5 object-contain inline-block shrink-0 rounded-xs"
        />
      );
    }

    if (nameLower.includes('figma') || icon.toLowerCase() === 'figma') {
      return <span className="w-3.5 h-3.5 rounded-full bg-gradient-to-r from-red-400 to-purple-400 inline-block shrink-0" />;
    }
    if (nameLower.includes('vercel') || icon.toLowerCase() === 'triangle' || icon.toLowerCase() === 'vercel') {
      return <span className="text-[#1a1a1a] font-bold text-xs">▲</span>;
    }
    if (nameLower.includes('github') || icon.toLowerCase() === 'github' || icon.toLowerCase() === 'gitpullrequest') {
      return <span className="text-[10px] font-bold text-[#1a1a1a]">GH</span>;
    }
    if (nameLower.includes('postman') || icon.toLowerCase() === 'send') {
      return <span className="text-xs">🚀</span>;
    }
    if (nameLower.includes('vscode') || nameLower.includes('vs code') || icon.toLowerCase() === 'code') {
      return <span className="font-mono text-xs font-bold text-[#1683FF]">&lt;/&gt;</span>;
    }
    if (nameLower.includes('render') || icon.toLowerCase() === 'uploadcloud' || icon.toLowerCase() === 'cloud') {
      return <span className="text-xs">☁️</span>;
    }
    if (nameLower.includes('firebase') || icon.toLowerCase() === 'flame') {
      return <span className="text-xs">🔥</span>;
    }

    return <span className="w-3 h-3 rounded-full bg-[#1683FF] inline-block shrink-0" />;
  };

  const marqueeTools = skills.filter(s => s.showInMarquee).sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-[#666666]">
        <Loader2 className="w-8 h-8 animate-spin text-[#1683FF] mb-3" />
        <p className="text-xs font-semibold uppercase tracking-wider">Loading Skills...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a1a] tracking-tight">
            Skills &amp; Scrolling Tools
          </h1>
          <p className="text-xs text-[#666666] mt-0.5">
            Manage your technical skills, skill levels, categories, and moving tools banner.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 bg-white border border-[#dce7fa] rounded-2xl gap-1 shadow-xs">
          <button
            onClick={() => { setActiveTab('skills'); setEditingSkillId(null); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${activeTab === 'skills'
                ? 'bg-[#1683FF] text-white shadow-xs'
                : 'text-[#666666] hover:bg-[#f0f6ff]'
              }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Skills ({skills.length})</span>
          </button>

          <button
            onClick={() => { setActiveTab('scrolling-tools'); setEditingSkillId(null); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${activeTab === 'scrolling-tools'
                ? 'bg-[#1683FF] text-white shadow-xs'
                : 'text-[#666666] hover:bg-[#f0f6ff]'
              }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Scrolling Tools ({marqueeTools.length})</span>
          </button>

          <button
            onClick={() => { setActiveTab('categories'); setEditingCategoryId(null); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${activeTab === 'categories'
                ? 'bg-[#1683FF] text-white shadow-xs'
                : 'text-[#666666] hover:bg-[#f0f6ff]'
              }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Categories ({categories.length})</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* TAB 1: ALL INDIVIDUAL SKILLS */}
      {/* ============================================================ */}
      {activeTab === 'skills' && (
        <div className="space-y-6">

          {/* Skill Form */}
          <form onSubmit={handleSkillSave} className="p-6 sm:p-7 rounded-2xl bg-white border border-[#dce7fa] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#dce7fa] pb-3">
              <h2 className="text-sm font-bold text-[#1a1a1a] flex items-center gap-2">
                {editingSkillId ? <Edit2 className="w-4 h-4 text-[#1683FF]" /> : <Plus className="w-4 h-4 text-[#1683FF]" />}
                <span>{editingSkillId ? 'Edit Skill' : 'Add New Skill'}</span>
              </h2>
              {editingSkillId && (
                <span className="px-2.5 py-0.5 rounded-md bg-[#f0f6ff] text-[#1683FF] border border-[#dce7fa] text-[10px] font-bold">
                  Editing
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Skill Name */}
              <div className="lg:col-span-2">
                <label className="block text-xs font-semibold text-[#1a1a1a] mb-1.5">Skill Name *</label>
                <input
                  type="text"
                  required
                  value={skillForm.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                    setSkillForm({ ...skillForm, name, slug: editingSkillId ? skillForm.slug : slug });
                  }}
                  placeholder="e.g. React.js, Node.js, Figma"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8fbff] border border-[#dce7fa] text-[#1a1a1a] text-xs focus:outline-none focus:border-[#1683FF]"
                />
              </div>

              {/* Category Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-[#1a1a1a] mb-1.5">Category *</label>
                <select
                  required
                  value={skillForm.category}
                  onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8fbff] border border-[#dce7fa] text-[#1a1a1a] text-xs focus:outline-none focus:border-[#1683FF]"
                >
                  {categories.length === 0 ? (
                    <option value="">Create a category first</option>
                  ) : (
                    categories.map((c) => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))
                  )}
                </select>
              </div>

              {/* Display Order */}
              <div>
                <label className="block text-xs font-semibold text-[#1a1a1a] mb-1.5">Display Order</label>
                <input
                  type="number"
                  value={skillForm.displayOrder}
                  onChange={(e) => setSkillForm({ ...skillForm, displayOrder: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8fbff] border border-[#dce7fa] text-[#1a1a1a] text-xs focus:outline-none focus:border-[#1683FF]"
                />
              </div>

              {/* Skill Icon Upload & Preview */}
              <div className="lg:col-span-2 p-3.5 rounded-xl bg-[#f8fbff] border border-[#dce7fa] space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#1a1a1a]">Skill Icon</label>
                  {skillForm.icon && (
                    <span className="text-[10px] text-[#666666] font-mono truncate max-w-[140px]">
                      {skillForm.icon.startsWith('http') || skillForm.icon.startsWith('/') ? 'Custom Upload' : skillForm.icon}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {/* Icon Preview */}
                  <div className="w-12 h-12 rounded-xl bg-white border border-[#dce7fa] flex items-center justify-center p-2 text-[#1683FF] shrink-0 shadow-xs overflow-hidden">
                    <SkillIcon icon={skillForm.icon} name={skillForm.name} className="w-6 h-6" />
                  </div>

                  {/* Upload Button and URL input */}
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#f0f6ff] text-[#1683FF] border border-[#dce7fa] text-xs font-bold cursor-pointer transition-all shadow-xs">
                        {uploadingSkillIcon ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                        <span>{uploadingSkillIcon ? 'Uploading...' : 'Upload Icon'}</span>
                        <input
                          type="file"
                          accept="image/*,.svg"
                          onChange={handleSkillIconUpload}
                          disabled={uploadingSkillIcon}
                          className="hidden"
                        />
                      </label>
                      {skillForm.icon && skillForm.icon !== 'Code' && (
                        <button
                          type="button"
                          onClick={() => setSkillForm({ ...skillForm, icon: 'Code' })}
                          className="text-[11px] text-[#666666] hover:text-red-500 font-semibold transition-colors"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      value={skillForm.icon}
                      onChange={(e) => setSkillForm({ ...skillForm, icon: e.target.value })}
                      placeholder="Icon name (e.g. Code, Atom) or custom URL"
                      className="w-full px-2.5 py-1 rounded-lg bg-white border border-[#dce7fa] text-[#1a1a1a] text-xs focus:outline-none focus:border-[#1683FF]"
                    />
                  </div>
                </div>
              </div>

              {/* Skill Level % Slider */}
              <div className="sm:col-span-2 lg:col-span-2 p-3.5 rounded-xl bg-[#f8fbff] border border-[#dce7fa] space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#1a1a1a] flex items-center gap-1.5">
                    <Percent className="w-3.5 h-3.5 text-[#1683FF]" />
                    <span>Skill Level ({skillForm.proficiencyPercentage}%)</span>
                  </label>
                  <span className="font-bold text-xs text-[#1683FF] px-2 py-0.5 bg-white border border-[#dce7fa] rounded-lg">
                    {skillForm.proficiencyPercentage}%
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={skillForm.proficiencyPercentage}
                    onChange={(e) => setSkillForm({ ...skillForm, proficiencyPercentage: Number(e.target.value) })}
                    className="w-full accent-[#1683FF] h-2 bg-[#dce7fa] rounded-lg cursor-pointer"
                  />
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={skillForm.proficiencyPercentage}
                    onChange={(e) => {
                      let val = Number(e.target.value);
                      if (val > 100) val = 100;
                      if (val < 0) val = 0;
                      setSkillForm({ ...skillForm, proficiencyPercentage: val });
                    }}
                    className="w-14 px-2 py-1 rounded-lg bg-white border border-[#dce7fa] text-[#1a1a1a] text-center font-bold text-xs focus:outline-none focus:border-[#1683FF]"
                  />
                </div>
              </div>

              {/* Short Description */}
              <div className="sm:col-span-2 lg:col-span-4">
                <label className="block text-xs font-semibold text-[#1a1a1a] mb-1.5">Short Description</label>
                <input
                  type="text"
                  value={skillForm.shortDescription}
                  onChange={(e) => setSkillForm({ ...skillForm, shortDescription: e.target.value })}
                  placeholder="e.g. Modern UI components, responsive layout, hooks..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8fbff] border border-[#dce7fa] text-[#1a1a1a] text-xs focus:outline-none focus:border-[#1683FF]"
                />
              </div>

              {/* Toggles */}
              <div className="sm:col-span-2 lg:col-span-4 flex flex-wrap items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-[#1a1a1a]">
                  <input
                    type="checkbox"
                    checked={skillForm.showOnHome}
                    onChange={(e) => setSkillForm({ ...skillForm, showOnHome: e.target.checked })}
                    className="w-4 h-4 rounded text-[#1683FF] focus:ring-0"
                  />
                  <span>Show on Home</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-[#1683FF]">
                  <input
                    type="checkbox"
                    checked={skillForm.showInMarquee}
                    onChange={(e) => setSkillForm({ ...skillForm, showInMarquee: e.target.checked })}
                    className="w-4 h-4 rounded text-[#1683FF] focus:ring-0"
                  />
                  <span>Show in Scrolling Tools</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-[#1a1a1a]">
                  <input
                    type="checkbox"
                    checked={skillForm.isActive}
                    onChange={(e) => setSkillForm({ ...skillForm, isActive: e.target.checked })}
                    className="w-4 h-4 rounded text-[#1683FF] focus:ring-0"
                  />
                  <span>Active</span>
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-3 border-t border-[#dce7fa]">
              {editingSkillId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingSkillId(null);
                    setSkillForm({
                      name: '',
                      slug: '',
                      category: categories[0]?._id || '',
                      icon: 'Code',
                      shortDescription: '',
                      proficiencyPercentage: 85,
                      displayOrder: 0,
                      isActive: true,
                      showOnHome: true,
                      showInMarquee: false,
                    });
                  }}
                  className="px-4 py-2 rounded-xl bg-white border border-[#dce7fa] text-[#666666] text-xs font-semibold hover:bg-[#f8fbff]"
                >
                  Cancel
                </button>
              )}

              <button
                type="submit"
                className="px-6 py-2 rounded-xl bg-[#1683FF] hover:bg-[#1371dc] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{editingSkillId ? 'Save Changes' : 'Add Skill'}</span>
              </button>
            </div>
          </form>

          {/* Grouped Skills List */}
          <div className="space-y-4">
            {categories.map((category) => {
              const categorySkills = skills.filter((s) => {
                const catId = s.category?._id || s.category;
                return catId?.toString() === category._id?.toString();
              });

              return (
                <div key={category._id} className="p-5 rounded-2xl bg-white border border-[#dce7fa] shadow-xs space-y-3">

                  {/* Category Header */}
                  <div className="flex items-center justify-between border-b border-[#dce7fa] pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#1683FF]" />
                      <h3 className="text-sm font-bold text-[#1a1a1a]">
                        {category.name}
                      </h3>
                      <span className="px-2 py-0.5 rounded-md bg-[#f0f6ff] text-[#1683FF] text-[11px] font-bold">
                        {categorySkills.length} skills
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${category.showOnHome ? 'bg-[#f0f6ff] text-[#1683FF]' : 'bg-slate-100 text-slate-500'
                        }`}>
                        Home: {category.showOnHome ? 'ON' : 'OFF'}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${category.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'
                        }`}>
                        {category.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </div>
                  </div>

                  {/* Skills Grid */}
                  {categorySkills.length === 0 ? (
                    <p className="text-xs text-[#8a99ad] italic py-2">No skills in this category yet.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {categorySkills.map((skill) => (
                        <div
                          key={skill._id}
                          className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between gap-3 ${editingSkillId === skill._id
                              ? 'bg-[#f0f6ff] border-[#1683FF]'
                              : 'bg-[#f8fbff] border-[#dce7fa] hover:border-[#1683FF]/40'
                            }`}
                        >
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2 min-w-0">
                                <div className="w-7 h-7 rounded-lg bg-white border border-[#dce7fa] flex items-center justify-center p-1 text-[#1683FF] shrink-0 overflow-hidden shadow-xs">
                                  <SkillIcon icon={skill.icon} name={skill.name} className="w-3.5 h-3.5" />
                                </div>
                                <div className="min-w-0">
                                  <h4 className="text-xs font-bold text-[#1a1a1a] truncate">
                                    {skill.name}
                                  </h4>
                                  <span className="text-[10px] text-[#8a99ad] font-mono">
                                    Order: #{skill.displayOrder ?? 0}
                                  </span>
                                </div>
                              </div>
                              <span className="text-xs font-bold text-[#1683FF] bg-white border border-[#dce7fa] px-1.5 py-0.5 rounded-md shrink-0">
                                {skill.proficiencyPercentage}%
                              </span>
                            </div>

                            {skill.shortDescription && (
                              <p className="text-[11px] text-[#666666] line-clamp-1 mt-1.5">
                                {skill.shortDescription}
                              </p>
                            )}

                            {/* Progress Bar */}
                            <div className="w-full bg-[#dce7fa] h-1.5 rounded-full overflow-hidden mt-2">
                              <div
                                className="h-full bg-[#1683FF] rounded-full transition-all duration-300"
                                style={{ width: `${skill.proficiencyPercentage}%` }}
                              />
                            </div>
                          </div>

                          {/* Quick Controls */}
                          <div className="flex items-center justify-between pt-2 border-t border-[#dce7fa] text-[10px]">
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleToggleSkillMarquee(skill)}
                                className={`px-2 py-0.5 rounded-md font-semibold transition-colors ${skill.showInMarquee
                                    ? 'bg-[#1683FF] text-white'
                                    : 'bg-white text-[#666666] border border-[#dce7fa]'
                                  }`}
                                title="Toggle Scrolling Tools"
                              >
                                Scrolling: {skill.showInMarquee ? 'ON' : 'OFF'}
                              </button>

                              <button
                                onClick={() => handleToggleSkillHome(skill)}
                                className={`px-2 py-0.5 rounded-md font-semibold transition-colors ${skill.showOnHome
                                    ? 'bg-[#f0f6ff] text-[#1683FF] border border-[#dce7fa]'
                                    : 'bg-white text-[#666666] border border-[#dce7fa]'
                                  }`}
                                title="Toggle Home visibility"
                              >
                                Home: {skill.showOnHome ? 'ON' : 'OFF'}
                              </button>
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleEditSkill(skill)}
                                className="p-1.5 rounded-lg bg-white border border-[#dce7fa] hover:bg-[#f0f6ff] text-[#666666] hover:text-[#1683FF] transition-colors"
                                title="Edit"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleDeleteSkill(skill._id, skill.name)}
                                className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 2: SCROLLING TOOLS (HOME MARQUEE BANNER) */}
      {/* ============================================================ */}
      {activeTab === 'scrolling-tools' && (
        <div className="space-y-6">

          {/* Header Card */}
          <div className="p-6 rounded-2xl bg-[#f8fbff] border border-[#dce7fa] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-[#1a1a1a] flex items-center gap-2">
                <Play className="w-4 h-4 text-[#1683FF] fill-current" />
                <span>Home Page Scrolling Tools</span>
              </h3>
              <p className="text-xs text-[#666666] max-w-2xl">
                Add, edit, or upload custom tool icons for the moving blue banner on the Home page.
              </p>
            </div>

            <button
              onClick={handleOpenAddMarquee}
              className="px-4 py-2 rounded-xl bg-[#1683FF] hover:bg-[#1371dc] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm shrink-0 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Tool</span>
            </button>
          </div>

          {/* Tools Grid */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#1a1a1a] uppercase tracking-wider">
              Active Scrolling Tools ({marqueeTools.length})
            </h3>

            {marqueeTools.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-[#dce7fa] text-[#666666]">
                <p className="text-xs">No tools currently in the scrolling strip. Click "Add Tool" above.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {marqueeTools.map((tool) => (
                  <div
                    key={tool._id}
                    className="p-4 rounded-2xl bg-white border border-[#dce7fa] hover:border-[#1683FF]/40 transition-all flex flex-col justify-between gap-3 shadow-xs"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#f0f6ff] border border-[#dce7fa] flex items-center justify-center p-2 text-[#1683FF] shrink-0">
                          {renderToolPreviewIcon(tool.icon, tool.name)}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-[#1a1a1a]">{tool.name}</h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="px-2 py-0.5 rounded-md bg-[#f0f6ff] text-[#1683FF] text-[10px] font-bold border border-[#dce7fa]">
                              Order: #{tool.displayOrder}
                            </span>
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${tool.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                              {tool.isActive ? 'Active' : 'Disabled'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <span className="px-2 py-0.5 rounded-md bg-[#1683FF] text-white text-[10px] font-bold shrink-0">
                        ON
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2.5 border-t border-[#dce7fa] text-xs">
                      <button
                        onClick={() => handleToggleSkillMarquee(tool)}
                        className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-[#f8fbff] text-[#666666] hover:text-red-600 border border-[#dce7fa] transition-colors"
                      >
                        Hide from Banner
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEditMarquee(tool)}
                          className="p-1.5 rounded-lg bg-white border border-[#dce7fa] hover:bg-[#f0f6ff] text-[#666666] hover:text-[#1683FF] transition-colors"
                          title="Edit Tool"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteSkill(tool._id, tool.name)}
                          className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Other Skills Available to Add */}
          <div className="space-y-3 pt-4 border-t border-[#dce7fa]">
            <h3 className="text-xs font-bold text-[#666666] uppercase tracking-wider">
              Other Available Skills (Click to add to banner)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {skills.filter(s => !s.showInMarquee).map((s) => (
                <div
                  key={s._id}
                  className="p-3 rounded-xl bg-white border border-[#dce7fa] flex items-center justify-between gap-3 shadow-xs"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-[#f0f6ff] border border-[#dce7fa] flex items-center justify-center p-1 text-[#1683FF] shrink-0">
                      {renderToolPreviewIcon(s.icon, s.name)}
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-[#1a1a1a]">{s.name}</h5>
                      <p className="text-[10px] text-[#8a99ad]">Order: #{s.displayOrder}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleSkillMarquee(s)}
                    className="px-2.5 py-1 rounded-lg bg-[#f0f6ff] hover:bg-[#1683FF] text-[#1683FF] hover:text-white text-[10px] font-bold border border-[#dce7fa] transition-colors"
                  >
                    + Add
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Modal for Scrolling Tool Add/Edit */}
          {showMarqueeModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
              <div className="w-full max-w-md p-6 rounded-2xl bg-white border border-[#dce7fa] shadow-2xl space-y-4 relative">
                <div className="flex items-center justify-between border-b border-[#dce7fa] pb-3">
                  <h3 className="text-sm font-bold text-[#1a1a1a]">
                    {editingMarqueeTool ? `Edit "${editingMarqueeTool.name}"` : 'Add Scrolling Tool'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowMarqueeModal(false)}
                    className="p-1 rounded-lg hover:bg-[#f0f6ff] text-[#666666]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleMarqueeSave} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1a1a1a] mb-1">Tool Name *</label>
                    <input
                      type="text"
                      required
                      value={marqueeForm.name}
                      onChange={(e) => setMarqueeForm({ ...marqueeForm, name: e.target.value })}
                      placeholder="e.g. Figma, Vercel"
                      className="w-full px-3 py-2 rounded-xl bg-[#f8fbff] border border-[#dce7fa] text-[#1a1a1a] text-xs focus:outline-none focus:border-[#1683FF]"
                    />
                  </div>

                  {/* Icon Selection & Upload */}
                  <div className="p-3.5 rounded-xl bg-[#f8fbff] border border-[#dce7fa] space-y-2.5">
                    <label className="block text-xs font-semibold text-[#1a1a1a]">Tool Icon / Logo</label>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[#1683FF] text-white flex items-center justify-center p-2 shrink-0 shadow-xs">
                        {renderToolPreviewIcon(marqueeForm.icon, marqueeForm.name)}
                      </div>

                      <div className="flex-1 space-y-1.5">
                        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#f0f6ff] text-[#1683FF] border border-[#dce7fa] text-xs font-bold cursor-pointer transition-all shadow-xs">
                          {uploadingIcon ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                          <span>{uploadingIcon ? 'Uploading...' : 'Upload Icon'}</span>
                          <input
                            type="file"
                            accept="image/*,.svg"
                            onChange={(e) => handleMarqueeIconUpload(e, false)}
                            disabled={uploadingIcon}
                            className="hidden"
                          />
                        </label>
                        <input
                          type="text"
                          value={marqueeForm.icon}
                          onChange={(e) => setMarqueeForm({ ...marqueeForm, icon: e.target.value })}
                          placeholder="Or enter icon name (Figma) or URL"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#dce7fa] text-[#1a1a1a] text-xs focus:outline-none focus:border-[#1683FF]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#1a1a1a] mb-1">Display Order *</label>
                      <input
                        type="number"
                        min="0"
                        required
                        value={marqueeForm.displayOrder}
                        onChange={(e) => setMarqueeForm({ ...marqueeForm, displayOrder: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-[#f8fbff] border border-[#dce7fa] text-[#1a1a1a] text-xs focus:outline-none focus:border-[#1683FF]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#1a1a1a] mb-1">Category</label>
                      <select
                        required
                        value={marqueeForm.category}
                        onChange={(e) => setMarqueeForm({ ...marqueeForm, category: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-[#f8fbff] border border-[#dce7fa] text-[#1a1a1a] text-xs focus:outline-none focus:border-[#1683FF]"
                      >
                        {categories.map((c) => (
                          <option key={c._id} value={c._id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-[#1a1a1a]">
                      <input
                        type="checkbox"
                        checked={marqueeForm.showInMarquee}
                        onChange={(e) => setMarqueeForm({ ...marqueeForm, showInMarquee: e.target.checked })}
                        className="rounded text-[#1683FF] focus:ring-0"
                      />
                      <span>Show in Banner</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-[#1a1a1a]">
                      <input
                        type="checkbox"
                        checked={marqueeForm.isActive}
                        onChange={(e) => setMarqueeForm({ ...marqueeForm, isActive: e.target.checked })}
                        className="rounded text-[#1683FF] focus:ring-0"
                      />
                      <span>Active</span>
                    </label>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#dce7fa]">
                    <button
                      type="button"
                      onClick={() => setShowMarqueeModal(false)}
                      className="px-4 py-2 rounded-xl bg-white border border-[#dce7fa] text-[#666666] text-xs font-semibold hover:bg-[#f8fbff]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={savingSkill || uploadingIcon}
                      className="px-5 py-2 rounded-xl bg-[#1683FF] hover:bg-[#1371dc] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                    >
                      {savingSkill ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                      <span>Save</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 3: SKILL CATEGORIES */}
      {/* ============================================================ */}
      {activeTab === 'categories' && (
        <div className="space-y-6">

          {/* Category Form */}
          <form onSubmit={handleCategorySave} className="p-6 sm:p-7 rounded-2xl bg-white border border-[#dce7fa] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#dce7fa] pb-3">
              <h2 className="text-sm font-bold text-[#1a1a1a] flex items-center gap-2">
                {editingCategoryId ? <Edit2 className="w-4 h-4 text-[#1683FF]" /> : <Plus className="w-4 h-4 text-[#1683FF]" />}
                <span>{editingCategoryId ? 'Edit Category' : 'Create Category'}</span>
              </h2>
              {editingCategoryId && (
                <span className="px-2.5 py-0.5 rounded-md bg-[#f0f6ff] text-[#1683FF] border border-[#dce7fa] text-[10px] font-bold">
                  Editing
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-2">
                <label className="block text-xs font-semibold text-[#1a1a1a] mb-1.5">Category Name *</label>
                <input
                  type="text"
                  required
                  value={categoryForm.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                    setCategoryForm({ ...categoryForm, name, slug: editingCategoryId ? categoryForm.slug : slug });
                  }}
                  placeholder="e.g. Frontend, Backend, Tools"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8fbff] border border-[#dce7fa] text-[#1a1a1a] text-xs focus:outline-none focus:border-[#1683FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1a1a1a] mb-1.5">URL Slug</label>
                <input
                  type="text"
                  value={categoryForm.slug}
                  onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                  placeholder="e.g. frontend"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8fbff] border border-[#dce7fa] text-[#1a1a1a] text-xs focus:outline-none focus:border-[#1683FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1a1a1a] mb-1.5">Display Order</label>
                <input
                  type="number"
                  value={categoryForm.displayOrder}
                  onChange={(e) => setCategoryForm({ ...categoryForm, displayOrder: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8fbff] border border-[#dce7fa] text-[#1a1a1a] text-xs focus:outline-none focus:border-[#1683FF]"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-4">
                <label className="block text-xs font-semibold text-[#1a1a1a] mb-1.5">Description</label>
                <textarea
                  rows="2"
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  placeholder="Short description of this skill group..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8fbff] border border-[#dce7fa] text-[#1a1a1a] text-xs focus:outline-none focus:border-[#1683FF] resize-none"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-4 flex flex-wrap items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-[#1a1a1a]">
                  <input
                    type="checkbox"
                    checked={categoryForm.showOnHome}
                    onChange={(e) => setCategoryForm({ ...categoryForm, showOnHome: e.target.checked })}
                    className="w-4 h-4 rounded text-[#1683FF] focus:ring-0"
                  />
                  <span>Show on Home</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-[#1a1a1a]">
                  <input
                    type="checkbox"
                    checked={categoryForm.isActive}
                    onChange={(e) => setCategoryForm({ ...categoryForm, isActive: e.target.checked })}
                    className="w-4 h-4 rounded text-[#1683FF] focus:ring-0"
                  />
                  <span>Active</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#dce7fa]">
              {editingCategoryId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingCategoryId(null);
                    setCategoryForm({
                      name: '',
                      slug: '',
                      description: '',
                      icon: 'Layers',
                      displayOrder: 0,
                      isActive: true,
                      showOnHome: true,
                    });
                  }}
                  className="px-4 py-2 rounded-xl bg-white border border-[#dce7fa] text-[#666666] text-xs font-semibold hover:bg-[#f8fbff]"
                >
                  Cancel
                </button>
              )}

              <button
                type="submit"
                disabled={savingCategory}
                className="px-6 py-2 rounded-xl bg-[#1683FF] hover:bg-[#1371dc] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-50"
              >
                {savingCategory ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                <span>{editingCategoryId ? 'Save Changes' : 'Create Category'}</span>
              </button>
            </div>
          </form>

          {/* Categories Grid */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#1a1a1a] uppercase tracking-wider">
              All Categories ({categories.length})
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {categories.map((cat) => (
                <div
                  key={cat._id}
                  className="p-4 rounded-2xl bg-white border border-[#dce7fa] hover:border-[#1683FF]/40 transition-all flex flex-col justify-between gap-3 shadow-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-bold text-[#1a1a1a] flex items-center gap-2">
                          <span>{cat.name}</span>
                          <span className="text-[#8a99ad] text-xs font-mono font-normal">({cat.slug})</span>
                        </h4>
                        <p className="text-xs text-[#666666] mt-0.5">
                          {cat.description || 'No description provided.'}
                        </p>
                      </div>

                      <span className="px-2.5 py-1 rounded-xl bg-[#f0f6ff] text-[#1683FF] text-xs font-bold border border-[#dce7fa] shrink-0">
                        {cat.skillCount ?? cat.skills?.length ?? 0} skills
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2.5 border-t border-[#dce7fa] text-xs">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleToggleCategoryHome(cat)}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition-colors ${cat.showOnHome
                            ? 'bg-[#f0f6ff] text-[#1683FF] border border-[#dce7fa]'
                            : 'bg-[#f8fbff] text-[#666666] border border-[#dce7fa]'
                          }`}
                      >
                        Home: {cat.showOnHome ? 'ON' : 'OFF'}
                      </button>

                      <button
                        onClick={() => handleToggleCategoryActive(cat)}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition-colors ${cat.isActive
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-red-50 text-red-500'
                          }`}
                      >
                        {cat.isActive ? 'Active' : 'Disabled'}
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEditCategory(cat)}
                        className="p-1.5 rounded-lg bg-white border border-[#dce7fa] hover:bg-[#f0f6ff] text-[#666666] hover:text-[#1683FF] transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat._id, cat.name)}
                        className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default AdminSkillsPage;

