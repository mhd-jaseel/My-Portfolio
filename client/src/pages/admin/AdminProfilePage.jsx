import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
  User, 
  Save, 
  Upload, 
  Loader2, 
  Video, 
  Trash2, 
  RefreshCw,
  BookOpen
} from 'lucide-react';
import { showConfirm, showSuccess, showError, toastSuccess, toastError } from '../../utils/alertUtils';
import { getMediaUrl } from '../../utils/mediaUtils';

const AdminProfilePage = () => {
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    tagline: '',
    bio: '',
    profileImage: '',
    location: '',
    email: '',
    github: '',
    linkedin: '',
    resume: '',
    availability: '',
    meetMeVideo: {
      videoUrl: '',
      thumbnailUrl: '',
      showOnHome: true,
    },
    aboutSection: {
      label: 'About Me',
      heading: 'EVERYTHING ABOUT\nMOHAMMED',
      paragraph1: 'Hi, Mohammed — a passionate Full Stack Developer who loves crafting modern web applications that are both beautiful on the surface and powerful under the hood.',
      paragraph2: 'With expertise in React, Next.js, Node.js, Express, and MongoDB, I bring together intuitive design and efficient functionality. My experience with authentication systems, payment gateways, and cloud deployment makes me confident in delivering production-ready solutions for real-world clients.',
      paragraph3: "Whether it's a Startup MVP or a scalable enterprise application, I focus on writing clean, maintainable code and creating experiences that users love.",
    },
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/profile');
        if (res.data?.data) {
          const data = res.data.data;
          setFormData({
            ...data,
            meetMeVideo: {
              videoUrl: data.meetMeVideo?.videoUrl || '',
              thumbnailUrl: data.meetMeVideo?.thumbnailUrl || '',
              showOnHome: data.meetMeVideo?.showOnHome !== undefined ? data.meetMeVideo.showOnHome : true,
            },
            aboutSection: {
              label: data.aboutSection?.label || 'About Me',
              heading: data.aboutSection?.heading || 'EVERYTHING ABOUT\nMOHAMMED',
              paragraph1: data.aboutSection?.paragraph1 || 'Hi, Mohammed — a passionate Full Stack Developer who loves crafting modern web applications that are both beautiful on the surface and powerful under the hood.',
              paragraph2: data.aboutSection?.paragraph2 || 'With expertise in React, Next.js, Node.js, Express, and MongoDB, I bring together intuitive design and efficient functionality. My experience with authentication systems, payment gateways, and cloud deployment makes me confident in delivering production-ready solutions for real-world clients.',
              paragraph3: data.aboutSection?.paragraph3 || "Whether it's a Startup MVP or a scalable enterprise application, I focus on writing clean, maintainable code and creating experiences that users love.",
            },
          });
        }
      } catch (err) {
        showError(err, 'Unable to load profile information.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toastError('Please select an image file.');
      return;
    }

    const data = new FormData();
    data.append('file', file);
    data.append('folder', 'jaseel_portfolio/profile');

    setUploadingImage(true);

    try {
      const res = await api.post('/admin/media', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data?.url) {
        setFormData((prev) => ({ ...prev, profileImage: res.data.url }));
        toastSuccess('Profile photo updated.');
      }
    } catch (err) {
      showError(err, 'Profile image upload failed. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      toastError('Please upload a video file (MP4, WebM, or MOV).');
      return;
    }

    if (formData.meetMeVideo?.videoUrl) {
      const replaceConfirmed = await showConfirm({
        title: 'Replace current video?',
        text: 'Uploading a new video will replace your current intro video.',
        confirmText: 'Yes, Replace',
        isDestructive: false,
      });
      if (!replaceConfirmed) return;
    }

    const data = new FormData();
    data.append('file', file);
    data.append('folder', 'jaseel_portfolio/videos');

    setUploadingVideo(true);

    try {
      const res = await api.post('/admin/media', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data?.url) {
        setFormData((prev) => ({
          ...prev,
          meetMeVideo: {
            ...prev.meetMeVideo,
            videoUrl: res.data.url,
          },
        }));
        toastSuccess('Video uploaded successfully. Click "Save Changes" to apply.');
      }
    } catch (err) {
      showError(err, 'Video upload failed. Please check the file and try again.');
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleRemoveVideo = async () => {
    const confirmed = await showConfirm({
      title: 'Remove Video?',
      text: 'Are you sure you want to remove the intro video from the Home page?',
      confirmText: 'Yes, Remove',
    });

    if (!confirmed) return;

    setFormData((prev) => ({
      ...prev,
      meetMeVideo: {
        ...prev.meetMeVideo,
        videoUrl: '',
      },
    }));
    toastSuccess('Video removed. Remember to save changes.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name?.trim()) {
      showError('Name is required.');
      return;
    }
    if (!formData.email?.trim()) {
      showError('Email address is required.');
      return;
    }

    setSaving(true);

    try {
      const res = await api.put('/admin/profile', formData);
      if (res.data.success) {
        await showSuccess('Changes saved successfully.');
      }
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
        <p className="text-xs font-semibold uppercase tracking-wider">Loading Profile Settings...</p>
      </div>
    );
  }

  const meetMeVideo = formData.meetMeVideo || { videoUrl: '', thumbnailUrl: '', showOnHome: true };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1a1a1a] tracking-tight">
          Website Content &amp; Profile
        </h1>
        <p className="text-xs text-[#666666] mt-0.5">
          Manage your personal details, intro video, and About page story content.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* ============================================================ */}
        {/* SECTION 1: INTRO VIDEO (MEET ME IN 2 MINUTES) */}
        {/* ============================================================ */}
        <div className="p-6 sm:p-7 rounded-2xl bg-white border border-[#dce7fa] shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#dce7fa] pb-3">
            <div className="flex items-center gap-2">
              <Video className="w-4 h-4 text-[#1683FF]" />
              <div>
                <h2 className="text-sm font-bold text-[#1a1a1a]">Intro Video ("Meet Me in 2 Minutes")</h2>
                <p className="text-xs text-[#666666]">Manage the video showcased on the Home page.</p>
              </div>
            </div>

            {/* Toggle: Show on Home */}
            <div className="flex items-center gap-2 bg-[#f8fbff] p-1.5 rounded-xl border border-[#dce7fa] shrink-0">
              <span className="text-xs text-[#1a1a1a] font-semibold">Show on Home:</span>
              <button
                type="button"
                onClick={() => setFormData(prev => ({
                  ...prev,
                  meetMeVideo: {
                    ...prev.meetMeVideo,
                    showOnHome: !prev.meetMeVideo?.showOnHome,
                  }
                }))}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  meetMeVideo.showOnHome
                    ? 'bg-[#1683FF] text-white shadow-xs'
                    : 'bg-white text-[#666666] border border-[#dce7fa]'
                }`}
              >
                {meetMeVideo.showOnHome ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            {/* Preview Player */}
            <div className="md:col-span-7">
              <div className="w-full aspect-video rounded-xl overflow-hidden bg-[#f8fbff] border border-[#dce7fa] flex items-center justify-center relative">
                {meetMeVideo.videoUrl ? (
                  <video
                    controls
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-[#8a99ad] p-4 text-center">
                    <Video className="w-8 h-8 mb-1.5 opacity-50" />
                    <span className="text-[11px] font-semibold">No video uploaded</span>
                  </div>
                )}

                {uploadingVideo && (
                  <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center gap-2 text-[#1683FF] z-10">
                    <Loader2 className="w-8 h-8 animate-spin" />
                    <span className="text-xs font-bold text-[#1a1a1a]">Uploading Video...</span>
                  </div>
                )}
              </div>
            </div>

            {/* Video Action Controls */}
            <div className="md:col-span-5 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#1a1a1a] mb-1">Video Link / Path</label>
                <input
                  type="text"
                  readOnly
                  value={meetMeVideo.videoUrl || 'None'}
                  className="w-full px-3 py-2 rounded-xl bg-[#f8fbff] border border-[#dce7fa] text-[#666666] text-xs font-mono truncate"
                />
              </div>

              <div className="space-y-2">
                <label className="w-full py-2.5 px-4 rounded-xl bg-[#1683FF] hover:bg-[#1371dc] text-white font-bold text-xs uppercase tracking-wider cursor-pointer transition-all flex items-center justify-center gap-2 shadow-xs">
                  {meetMeVideo.videoUrl ? <RefreshCw className="w-3.5 h-3.5" /> : <Upload className="w-3.5 h-3.5" />}
                  <span>{uploadingVideo ? 'Uploading...' : meetMeVideo.videoUrl ? 'Replace Video' : 'Upload Video'}</span>
                  <input
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime,video/*"
                    onChange={handleVideoUpload}
                    disabled={uploadingVideo}
                    className="hidden"
                  />
                </label>

                {meetMeVideo.videoUrl && (
                  <button
                    type="button"
                    onClick={handleRemoveVideo}
                    className="w-full py-2 px-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove Video</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* SECTION 2: PERSONAL IDENTITY & CONTACT INFO */}
        {/* ============================================================ */}
        <div className="p-6 sm:p-7 rounded-2xl bg-white border border-[#dce7fa] shadow-xs space-y-5">
          <div className="border-b border-[#dce7fa] pb-3 flex items-center gap-2">
            <User className="w-4 h-4 text-[#1683FF]" />
            <h2 className="text-sm font-bold text-[#1a1a1a]">Personal Details</h2>
          </div>

          {/* Profile Photo */}
          <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl bg-[#f8fbff] border border-[#dce7fa]">
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden border border-[#dce7fa] bg-white shrink-0 shadow-xs">
              <img
                src={getMediaUrl(formData.profileImage, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80')}
                alt="Profile photo"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80';
                }}
              />
              {uploadingImage && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 animate-spin text-[#1683FF]" />
                </div>
              )}
            </div>

            <div className="space-y-1.5 text-center sm:text-left flex-1">
              <h3 className="text-xs font-bold text-[#1a1a1a]">Profile Photo</h3>
              <p className="text-[11px] text-[#666666]">
                Upload your portrait photo. It will be optimized automatically.
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#f0f6ff] text-[#1683FF] border border-[#dce7fa] text-xs font-semibold cursor-pointer transition-all shadow-xs">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploadingImage ? 'Uploading...' : 'Change Photo'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                </label>

                {formData.profileImage && formData.profileImage !== 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80' && (
                  <button
                    type="button"
                    onClick={async () => {
                      const confirmed = await showConfirm({
                        title: 'Reset Profile Photo?',
                        text: 'Resetting will return your profile picture to the default placeholder.',
                        confirmText: 'Reset',
                      });
                      if (confirmed) {
                        setFormData((prev) => ({
                          ...prev,
                          profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
                        }));
                        toastSuccess('Photo reset to default.');
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-semibold transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1a1a1a] mb-1.5">Full Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8fbff] border border-[#dce7fa] text-[#1a1a1a] text-sm focus:outline-none focus:border-[#1683FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1a1a1a] mb-1.5">Job Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8fbff] border border-[#dce7fa] text-[#1a1a1a] text-sm focus:outline-none focus:border-[#1683FF]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1a1a1a] mb-1.5">Hero Tagline</label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8fbff] border border-[#dce7fa] text-[#1a1a1a] text-sm focus:outline-none focus:border-[#1683FF]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1a1a1a] mb-1.5">Short Bio</label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8fbff] border border-[#dce7fa] text-[#1a1a1a] text-sm focus:outline-none focus:border-[#1683FF] resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1a1a1a] mb-1.5">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Kerala, India"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8fbff] border border-[#dce7fa] text-[#1a1a1a] text-sm focus:outline-none focus:border-[#1683FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1a1a1a] mb-1.5">Availability Status</label>
              <input
                type="text"
                value={formData.availability}
                onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                placeholder="e.g. Open for opportunities"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8fbff] border border-[#dce7fa] text-[#1a1a1a] text-sm focus:outline-none focus:border-[#1683FF]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-[#dce7fa]">
            <div>
              <label className="block text-xs font-semibold text-[#1a1a1a] mb-1.5">Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8fbff] border border-[#dce7fa] text-[#1a1a1a] text-sm focus:outline-none focus:border-[#1683FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1a1a1a] mb-1.5">GitHub Link</label>
              <input
                type="url"
                value={formData.github}
                onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                placeholder="https://github.com/..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8fbff] border border-[#dce7fa] text-[#1a1a1a] text-sm focus:outline-none focus:border-[#1683FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1a1a1a] mb-1.5">LinkedIn Link</label>
              <input
                type="url"
                value={formData.linkedin}
                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                placeholder="https://linkedin.com/in/..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8fbff] border border-[#dce7fa] text-[#1a1a1a] text-sm focus:outline-none focus:border-[#1683FF]"
              />
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* SECTION 3: ABOUT ME STORY CONTENT */}
        {/* ============================================================ */}
        <div className="p-6 sm:p-7 rounded-2xl bg-white border border-[#dce7fa] shadow-xs space-y-4">
          <div className="border-b border-[#dce7fa] pb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#1683FF]" />
            <div>
              <h2 className="text-sm font-bold text-[#1a1a1a]">About Page Story</h2>
              <p className="text-xs text-[#666666]">Customize the label, heading, and 3 story paragraphs shown on the About page.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1a1a1a] mb-1.5">Section Label *</label>
              <input
                type="text"
                required
                value={formData.aboutSection?.label || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  aboutSection: {
                    ...(formData.aboutSection || {}),
                    label: e.target.value,
                  }
                })}
                placeholder="e.g. About Me"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8fbff] border border-[#dce7fa] text-[#1a1a1a] text-sm focus:outline-none focus:border-[#1683FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1a1a1a] mb-1.5">
                Main Heading * <span className="text-[#8a99ad] font-normal">(Press Enter for line breaks)</span>
              </label>
              <textarea
                rows={2}
                required
                value={formData.aboutSection?.heading || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  aboutSection: {
                    ...(formData.aboutSection || {}),
                    heading: e.target.value,
                  }
                })}
                placeholder="EVERYTHING ABOUT&#10;MOHAMMED"
                className="w-full px-3.5 py-2 rounded-xl bg-[#f8fbff] border border-[#dce7fa] text-[#1a1a1a] text-sm font-bold focus:outline-none focus:border-[#1683FF]"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-[#1a1a1a] mb-1.5">Paragraph 1 *</label>
              <textarea
                rows={3}
                required
                value={formData.aboutSection?.paragraph1 || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  aboutSection: {
                    ...(formData.aboutSection || {}),
                    paragraph1: e.target.value,
                  }
                })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8fbff] border border-[#dce7fa] text-[#1a1a1a] text-sm focus:outline-none focus:border-[#1683FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1a1a1a] mb-1.5">Paragraph 2 *</label>
              <textarea
                rows={3}
                required
                value={formData.aboutSection?.paragraph2 || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  aboutSection: {
                    ...(formData.aboutSection || {}),
                    paragraph2: e.target.value,
                  }
                })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8fbff] border border-[#dce7fa] text-[#1a1a1a] text-sm focus:outline-none focus:border-[#1683FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1a1a1a] mb-1.5">Paragraph 3 *</label>
              <textarea
                rows={3}
                required
                value={formData.aboutSection?.paragraph3 || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  aboutSection: {
                    ...(formData.aboutSection || {}),
                    paragraph3: e.target.value,
                  }
                })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8fbff] border border-[#dce7fa] text-[#1a1a1a] text-sm focus:outline-none focus:border-[#1683FF]"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 rounded-xl bg-[#1683FF] hover:bg-[#1371dc] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
};

export default AdminProfilePage;

