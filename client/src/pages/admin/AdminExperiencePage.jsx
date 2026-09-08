import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Save, 
  Loader2 
} from 'lucide-react';
import { showConfirm, showSuccess, showError, toastSuccess } from '../../utils/alertUtils';

const AdminExperiencePage = () => {
  const [experience, setExperience] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    company: '',
    position: '',
    duration: '2025 – PRESENT',
    startDate: '',
    endDate: '',
    order: 1,
    isActive: true,
  });

  const fetchExperience = async () => {
    try {
      const res = await api.get('/admin/experience');
      if (res.data?.data) {
        setExperience(res.data.data);
      }
    } catch (err) {
      showError(err, 'Unable to load experience records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperience();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();

    if (!form.company.trim()) {
      showError('Company name is required.');
      return;
    }
    if (!form.position.trim()) {
      showError('Role is required.');
      return;
    }
    if (!form.duration.trim()) {
      showError('Duration is required (e.g. 2025 – PRESENT).');
      return;
    }

    const orderNum = Number(form.order);
    if (isNaN(orderNum) || orderNum < 0) {
      showError('Display order must be a valid number.');
      return;
    }

    setSaving(true);

    try {
      const payload = {
        ...form,
        company: form.company.trim(),
        position: form.position.trim(),
        duration: form.duration.trim(),
        order: orderNum,
      };

      if (editingId) {
        await api.put(`/admin/experience/${editingId}`, payload);
        toastSuccess(`Experience at "${form.company}" updated successfully.`);
        setEditingId(null);
      } else {
        await api.post('/admin/experience', payload);
        toastSuccess(`Experience at "${form.company}" added successfully.`);
      }

      setForm({
        company: '',
        position: '',
        duration: '2025 – PRESENT',
        startDate: '',
        endDate: '',
        order: experience.length + 1,
        isActive: true,
      });
      fetchExperience();
    } catch (err) {
      showError(err, 'Unable to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (exp) => {
    setEditingId(exp._id);
    setForm({
      company: exp.company || '',
      position: exp.position || '',
      duration: exp.duration || (exp.startDate ? `${exp.startDate}${exp.endDate ? ` – ${exp.endDate}` : ''}` : ''),
      startDate: exp.startDate || '',
      endDate: exp.endDate || '',
      order: exp.order || 1,
      isActive: exp.isActive !== undefined ? exp.isActive : true,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id, company) => {
    const confirmed = await showConfirm({
      title: `Delete "${company}"?`,
      text: 'Are you sure you want to delete this experience entry?',
      confirmText: 'Yes, Delete',
    });

    if (!confirmed) return;

    try {
      await api.delete(`/admin/experience/${id}`);
      showSuccess('Deleted successfully.');
      fetchExperience();
    } catch (err) {
      showError(err, 'Unable to delete this item.');
    }
  };

  const handleToggleActive = async (exp) => {
    try {
      await api.put(`/admin/experience/${exp._id}`, { isActive: !exp.isActive });
      toastSuccess(`"${exp.company}" status updated.`);
      fetchExperience();
    } catch (err) {
      showError(err, 'Unable to update status.');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-[#666666]">
        <Loader2 className="w-8 h-8 animate-spin text-[#1683FF] mb-3" />
        <p className="text-xs font-semibold uppercase tracking-wider">Loading Experience...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1a1a1a] tracking-tight">
          Work Experience
        </h1>
        <p className="text-xs text-[#666666] mt-0.5">
          Manage your job roles, company names, timeline durations, and display order for the About page.
        </p>
      </div>

      {/* Experience Form */}
      <form onSubmit={handleSave} className="p-6 sm:p-7 rounded-2xl bg-white border border-[#dce7fa] shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#dce7fa] pb-3">
          <h2 className="text-sm font-bold text-[#1a1a1a] flex items-center gap-2">
            {editingId ? <Edit2 className="w-4 h-4 text-[#1683FF]" /> : <Plus className="w-4 h-4 text-[#1683FF]" />}
            <span>{editingId ? 'Edit Experience' : 'Add Experience'}</span>
          </h2>
          {editingId && (
            <span className="px-2.5 py-0.5 rounded-md bg-[#f0f6ff] text-[#1683FF] border border-[#dce7fa] text-[10px] font-bold">
              Editing
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#1a1a1a] mb-1.5">Company / Project Name *</label>
            <input
              type="text"
              required
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              placeholder="e.g. Future Catalyst"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8fbff] border border-[#dce7fa] text-[#1a1a1a] text-sm focus:outline-none focus:border-[#1683FF]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1a1a1a] mb-1.5">Role / Designation *</label>
            <input
              type="text"
              required
              value={form.position}
              onChange={(e) => setForm({ ...form, position: e.target.value })}
              placeholder="e.g. Full Stack Developer (MERN)"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8fbff] border border-[#dce7fa] text-[#1a1a1a] text-sm focus:outline-none focus:border-[#1683FF]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-[#1a1a1a] mb-1.5">Duration / Timeline *</label>
            <input
              type="text"
              required
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
              placeholder="e.g. 2025 – PRESENT or 2024 – 2025"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8fbff] border border-[#dce7fa] text-[#1a1a1a] text-sm focus:outline-none focus:border-[#1683FF]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1a1a1a] mb-1.5">Display Order *</label>
            <input
              type="number"
              min="0"
              required
              value={form.order}
              onChange={(e) => setForm({ ...form, order: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8fbff] border border-[#dce7fa] text-[#1a1a1a] text-sm focus:outline-none focus:border-[#1683FF]"
            />
          </div>
        </div>

        <div className="flex items-center gap-6 pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-[#1a1a1a]">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              className="w-4 h-4 rounded text-[#1683FF] focus:ring-0"
            />
            <span>Show on About Page (Active)</span>
          </label>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-[#dce7fa]">
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm({ company: '', position: '', duration: '2025 – PRESENT', startDate: '', endDate: '', order: experience.length + 1, isActive: true });
              }}
              className="px-4 py-2 rounded-xl bg-white border border-[#dce7fa] text-[#666666] text-xs font-semibold hover:bg-[#f8fbff]"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-[#1683FF] hover:bg-[#1371dc] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>{editingId ? 'Save Changes' : 'Add Experience'}</span>
          </button>
        </div>
      </form>

      {/* Experience List */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-[#1a1a1a] uppercase tracking-wider">
          Experience Items ({experience.length})
        </h3>

        {experience.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-[#dce7fa] text-[#666666]">
            <p className="text-xs">No experience records found. Use the form above to add one.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {experience.map((exp) => (
              <div
                key={exp._id}
                className="p-4 sm:p-5 rounded-2xl bg-white border border-[#dce7fa] hover:border-[#1683FF]/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-[#f0f6ff] text-[#1683FF] text-[10px] font-bold border border-[#dce7fa]">
                      Order: #{exp.order}
                    </span>
                    <h4 className="text-sm font-bold text-[#1a1a1a]">{exp.company}</h4>
                  </div>
                  <p className="text-xs text-[#666666] font-medium">{exp.position}</p>
                  <p className="text-[11px] text-[#8a99ad]">
                    Duration: <span className="text-[#1a1a1a] font-semibold">{exp.duration || (exp.startDate ? `${exp.startDate}${exp.endDate ? ` – ${exp.endDate}` : ''}` : '2025 – PRESENT')}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => handleToggleActive(exp)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                      exp.isActive !== false
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100'
                        : 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
                    }`}
                  >
                    {exp.isActive !== false ? 'Active: ON' : 'Active: OFF'}
                  </button>

                  <button
                    onClick={() => handleEdit(exp)}
                    className="p-2 rounded-xl bg-white border border-[#dce7fa] hover:bg-[#f0f6ff] text-[#666666] hover:text-[#1683FF] transition-colors"
                    title="Edit Record"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(exp._id, exp.company)}
                    className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors"
                    title="Delete Record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default AdminExperiencePage;

