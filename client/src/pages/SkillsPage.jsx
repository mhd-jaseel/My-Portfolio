import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SkillIcon from '../components/SkillIcon';
import api from '../services/api';
import { 
  Loader2, 
  ArrowRight, 
  Search
} from 'lucide-react';
import { motion } from 'framer-motion';

const SkillsPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategorySlug, setSelectedCategorySlug] = useState('all');

  useEffect(() => {
    const fetchSkillsData = async () => {
      try {
        setLoading(true);
        const res = await api.get('/skill-categories');
        if (res.data?.data) {
          setCategories(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load skills:', err);
        setError('Unable to load skills right now. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSkillsData();
  }, []);

  // Filter categories and skills based on search & category pill
  const filteredCategories = categories.map(cat => {
    const matchingSkills = (cat.skills || []).filter(skill => {
      const matchesSearch = searchQuery === '' || 
        skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (skill.shortDescription && skill.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesSearch;
    });

    return {
      ...cat,
      filteredSkills: matchingSkills,
    };
  }).filter(cat => {
    if (selectedCategorySlug !== 'all' && cat.slug !== selectedCategorySlug) {
      return false;
    }
    if (searchQuery.trim() !== '') {
      return cat.filteredSkills.length > 0;
    }
    return true;
  });

  return (
    <div className="page-continuous-wrapper">
      <Navbar />

      <main className="pt-28 pb-20">
        <div className="content-canvas space-y-12">
          
          {/* Header Section */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="blue-pill-badge">
              Full Spectrum Expertise
            </span>
            <h1 className="font-display text-[52px] sm:text-[68px] md:text-[80px] text-[#1a1a1a] tracking-tight leading-none uppercase">
              TECHNICAL PROFICIENCY &amp; SKILLS
            </h1>
            <p className="text-sm sm:text-base text-[#5e6573] leading-relaxed">
              Explore my technical proficiencies, development frameworks, databases, and architectural toolkits with live proficiency assessments and category breakdowns.
            </p>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-3xl border border-[#dce7fa] shadow-sm">
            
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-[#1683FF] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search skills (e.g. React, Node, MongoDB)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-[#f8fbff] border border-[#dce7fa] text-xs sm:text-sm text-[#1a1a1a] focus:outline-none focus:border-[#1683FF] transition-all"
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
              <button
                onClick={() => setSelectedCategorySlug('all')}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategorySlug === 'all'
                    ? 'bg-[#1683FF] text-white shadow-md shadow-[#1683FF]/25'
                    : 'bg-[#f8fbff] text-[#5e6573] border border-[#dce7fa] hover:border-[#1683FF] hover:text-[#1683FF]'
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => setSelectedCategorySlug(cat.slug)}
                  className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                    selectedCategorySlug === cat.slug
                      ? 'bg-[#1683FF] text-white shadow-md shadow-[#1683FF]/25'
                      : 'bg-[#f8fbff] text-[#5e6573] border border-[#dce7fa] hover:border-[#1683FF] hover:text-[#1683FF]'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

          </div>

          {/* Loading State */}
          {loading && (
            <div className="py-20 flex flex-col items-center justify-center text-[#5e6573]">
              <Loader2 className="w-8 h-8 animate-spin text-[#1683FF] mb-3" />
              <p className="text-xs font-bold tracking-widest uppercase">Loading Skills Directory...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="p-6 rounded-3xl bg-red-50 border border-red-200 text-center max-w-lg mx-auto">
              <p className="text-sm text-red-600 font-semibold mb-3">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="btn-blue-pill-sm"
              >
                Retry
              </button>
            </div>
          )}

          {/* Category Sections */}
          {!loading && !error && (
            <div className="space-y-12">
              {filteredCategories.length === 0 ? (
                <div className="text-center py-16 bg-[#f8fbff] rounded-3xl border border-[#dce7fa] p-8">
                  <p className="text-base font-semibold text-[#1a1a1a]">No skills found matching your query.</p>
                  <p className="text-xs text-[#5e6573] mt-1">Try clearing search terms or changing the category filter.</p>
                  <button 
                    onClick={() => { setSearchQuery(''); setSelectedCategorySlug('all'); }}
                    className="mt-4 btn-blue-pill-sm"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                filteredCategories.map((category) => {
                  const skillsToDisplay = category.filteredSkills || category.skills || [];

                  return (
                    <div 
                      key={category._id} 
                      className="bg-white rounded-3xl border border-[#dce7fa] p-6 sm:p-8 md:p-10 shadow-sm hover:shadow-md transition-shadow space-y-6"
                    >
                      {/* Category Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#edf3fc] pb-5">
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <h2 className="font-bold text-2xl sm:text-3xl text-[#1683FF]">
                              {category.name}
                            </h2>
                            <span className="px-3 py-0.5 rounded-full bg-[#f0f6ff] text-[#1683FF] text-xs font-bold border border-[#dce7fa]">
                              {skillsToDisplay.length} {skillsToDisplay.length === 1 ? 'skill' : 'skills'}
                            </span>
                          </div>
                          {category.description && (
                            <p className="text-xs sm:text-sm text-[#5e6573] max-w-2xl">
                              {category.description}
                            </p>
                          )}
                        </div>

                        {/* Direct link to single Category Detail page */}
                        <Link
                          to={`/skills/${category.slug}`}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1683FF] hover:text-[#0066e0] transition-colors group whitespace-nowrap self-start sm:self-auto"
                        >
                          <span>Explore {category.name} Skills</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>

                      {/* Skills Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {skillsToDisplay.map((skill) => (
                          <div
                            key={skill._id}
                            className="bg-[#fafcff] rounded-2xl border border-[#e4edfa] p-5 hover:border-[#1683FF]/40 hover:bg-white hover:shadow-lg hover:shadow-[#1683FF]/5 transition-all flex flex-col justify-between gap-4"
                          >
                            <div className="space-y-2.5">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-8 h-8 rounded-xl bg-[#edf5ff] border border-[#dce7fa] flex items-center justify-center p-1.5 text-[#1683FF] shrink-0 overflow-hidden shadow-xs">
                                    <SkillIcon icon={skill.icon} name={skill.name} className="w-4 h-4" />
                                  </div>
                                  <h3 className="font-bold text-sm sm:text-base text-[#1a1a1a]">
                                    {skill.name}
                                  </h3>
                                </div>
                                <span className="font-mono text-xs sm:text-sm font-bold text-[#1683FF] bg-[#edf5ff] px-2.5 py-0.5 rounded-lg border border-[#dce7fa] shrink-0">
                                  {skill.proficiencyPercentage}%
                                </span>
                              </div>

                              {skill.shortDescription && (
                                <p className="text-xs text-[#5e6573] line-clamp-2 leading-relaxed">
                                  {skill.shortDescription}
                                </p>
                              )}
                            </div>

                            {/* Animated Visual Progress Indicator */}
                            <div className="space-y-1.5 pt-2 border-t border-[#edf3fc]">
                              <div className="flex items-center justify-between text-[11px] font-semibold text-[#5e6573]">
                                <span>Proficiency</span>
                                <span className="font-mono text-[#1683FF]">{skill.proficiencyPercentage}%</span>
                              </div>
                              <div className="w-full bg-[#e8f0fe] h-2 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  whileInView={{ width: `${skill.proficiencyPercentage}%` }}
                                  viewport={{ once: true }}
                                  transition={{ duration: 0.8, ease: "easeOut" }}
                                  className="h-full bg-gradient-to-r from-[#1683FF] to-[#0066e0] rounded-full"
                                />
                              </div>
                            </div>

                          </div>
                        ))}
                      </div>

                    </div>
                  );
                })
              )}
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SkillsPage;
