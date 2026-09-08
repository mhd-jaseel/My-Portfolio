import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SkillIcon from '../components/SkillIcon';
import api from '../services/api';
import { 
  Loader2, 
  ArrowLeft, 
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const SkillCategoryDetailPage = () => {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [catRes, allCatsRes] = await Promise.all([
          api.get(`/skill-categories/${slug}`),
          api.get('/skill-categories'),
        ]);

        if (catRes.data?.data) {
          setCategory(catRes.data.data);
        }
        if (allCatsRes.data?.data) {
          setAllCategories(allCatsRes.data.data);
        }
      } catch (err) {
        console.error('Failed to load category:', err);
        setError(err.response?.data?.message || 'Category not found or inactive.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [slug]);

  if (loading) {
    return (
      <div className="page-continuous-wrapper min-h-screen flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center text-[#5e6573] py-32">
          <Loader2 className="w-8 h-8 animate-spin text-[#1683FF] mb-3" />
          <p className="text-xs font-bold tracking-widest uppercase">Loading Skills...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="page-continuous-wrapper min-h-screen flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-32">
          <div className="p-8 rounded-3xl bg-[#fafcff] border border-[#dce7fa] max-w-md w-full space-y-4">
            <h2 className="font-bold text-xl text-[#1a1a1a]">Category Not Found</h2>
            <p className="text-xs sm:text-sm text-[#5e6573]">
              The skill category "{slug}" could not be found or has been disabled by the admin.
            </p>
            <Link to="/skills" className="btn-blue-pill-sm inline-flex">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to All Skills</span>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const skills = category.skills || [];

  return (
    <div className="page-continuous-wrapper">
      <Navbar />

      <main className="pt-28 pb-20">
        <div className="content-canvas space-y-12">
          
          {/* Breadcrumbs & Navigation */}
          <div className="flex items-center justify-between gap-4">
            <Link 
              to="/skills" 
              className="inline-flex items-center gap-2 text-xs font-bold text-[#1683FF] hover:text-[#0066e0] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to All Skills</span>
            </Link>

            <span className="text-xs font-mono text-[#5e6573]">
              Category: <span className="font-bold text-[#1683FF]">{category.name}</span>
            </span>
          </div>

          {/* Hero Banner for Category */}
          <div className="bg-gradient-to-br from-[#ffffff] via-[#f4f8ff] to-[#eaf2ff] rounded-3xl border border-[#dce7fa] p-8 sm:p-12 text-center space-y-4 relative overflow-hidden shadow-sm">
            <span className="blue-pill-badge">
              Category Deep Dive
            </span>
            <h1 className="font-display text-[48px] sm:text-[64px] md:text-[76px] text-[#1a1a1a] tracking-tight leading-none uppercase">
              {category.name} DEVELOPMENT
            </h1>
            {category.description ? (
              <p className="text-sm sm:text-base text-[#5e6573] max-w-2xl mx-auto leading-relaxed">
                {category.description}
              </p>
            ) : (
              <p className="text-sm sm:text-base text-[#5e6573] max-w-2xl mx-auto leading-relaxed">
                Detailed breakdown of technical proficiencies, frameworks, and tools in {category.name}.
              </p>
            )}

            <div className="pt-2 flex items-center justify-center gap-3">
              <span className="px-4 py-1.5 rounded-full bg-white text-[#1683FF] font-bold text-xs border border-[#dce7fa] shadow-sm">
                {skills.length} Technical Skills
              </span>
            </div>
          </div>

          {/* Skills Detailed Grid with Animated Progress Bars */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-bold text-[#1a1a1a]">
                Skills &amp; Proficiency Breakdown
              </h2>
              <span className="text-xs font-mono text-[#5e6573]">
                Proficiency Scale: 0% – 100%
              </span>
            </div>

            {skills.length === 0 ? (
              <div className="p-8 text-center bg-[#fafcff] rounded-3xl border border-[#dce7fa]">
                <p className="text-sm text-[#5e6573]">No skills have been assigned to this category yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {skills.map((skill, index) => (
                  <motion.div
                    key={skill._id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.4 }}
                    className="bg-white rounded-3xl border border-[#dce7fa] p-6 sm:p-7 hover:shadow-lg hover:shadow-[#1683FF]/8 transition-all space-y-4"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-[#f0f6ff] border border-[#dce7fa] flex items-center justify-center p-2 text-[#1683FF] shadow-sm shrink-0 overflow-hidden">
                          <SkillIcon icon={skill.icon} name={skill.name} className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-base sm:text-lg text-[#1a1a1a]">
                            {skill.name}
                          </h3>
                          {skill.shortDescription && (
                            <p className="text-xs text-[#5e6573] mt-0.5">
                              {skill.shortDescription}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Percentage Badge */}
                      <span className="font-mono text-sm sm:text-base font-bold text-[#1683FF] bg-[#f0f6ff] px-3 py-1 rounded-xl border border-[#dce7fa] shrink-0">
                        {skill.proficiencyPercentage}%
                      </span>
                    </div>

                    {/* Visual Animated Progress Bar */}
                    <div className="space-y-1.5 pt-2">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-[#5e6573]">
                        <span>Mastery &amp; Practical Experience</span>
                        <span className="font-mono text-[#1683FF] font-bold">{skill.proficiencyPercentage}%</span>
                      </div>
                      
                      <div className="w-full bg-[#edf4fe] h-3 rounded-full overflow-hidden p-0.5 border border-[#dce7fa]">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.proficiencyPercentage}%` }}
                          transition={{ duration: 1, ease: "easeOut", delay: index * 0.06 }}
                          className="h-full bg-gradient-to-r from-[#1683FF] via-[#2c92ff] to-[#0066e0] rounded-full shadow-sm"
                        />
                      </div>
                    </div>

                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Other Categories Quick Navigation */}
          {allCategories.length > 1 && (
            <div className="pt-10 border-t border-[#edf3fc] space-y-4">
              <h3 className="text-sm font-bold text-[#1a1a1a] uppercase tracking-wider">
                Explore Other Categories
              </h3>

              <div className="flex flex-wrap gap-3">
                {allCategories.filter(c => c.slug !== category.slug).map((c) => (
                  <Link
                    key={c._id}
                    to={`/skills/${c.slug}`}
                    className="px-4 py-2 rounded-2xl bg-white border border-[#dce7fa] text-xs font-semibold text-[#1a1a1a] hover:border-[#1683FF] hover:text-[#1683FF] hover:shadow-sm transition-all flex items-center gap-2"
                  >
                    <span>{c.name}</span>
                    <ArrowRight className="w-3 h-3 text-[#1683FF]" />
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SkillCategoryDetailPage;
