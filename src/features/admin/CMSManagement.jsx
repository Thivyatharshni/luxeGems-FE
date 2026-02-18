import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPageContent, updatePageContent, syncHeroVideo } from './adminSlice';
import Button from '../../components/ui/Button';
import { motion } from 'framer-motion';

const CMSManagement = () => {
    const dispatch = useDispatch();
    const { cms } = useSelector((state) => state.admin);
    const [pageTitle, setPageTitle] = useState('');
    const [sections, setSections] = useState([]);

    useEffect(() => {
        dispatch(fetchPageContent('landing-page'));
    }, [dispatch]);

    useEffect(() => {
        if (cms.page) {
            setPageTitle(cms.page.title);
            setSections(cms.page.sections);
        }
    }, [cms.page]);

    const handleSectionChange = (index, field, value) => {
        const updatedSections = [...sections];
        updatedSections[index] = {
            ...updatedSections[index],
            content: {
                ...updatedSections[index].content,
                [field]: value
            }
        };
        setSections(updatedSections);
    };

    const toggleSectionVisibility = (index) => {
        const updatedSections = [...sections];
        updatedSections[index] = {
            ...updatedSections[index],
            isActive: !updatedSections[index].isActive
        };
        setSections(updatedSections);
    };

    const handleSave = async () => {
        await dispatch(updatePageContent({
            slug: 'landing-page',
            content: { title: pageTitle, sections }
        }));
        alert('Landing page content preserved in the vault.');
    };

    const handleSync = async () => {
        const result = await dispatch(syncHeroVideo()).unwrap();
        if (result) {
            alert('Vault synchronized with Cloudinary assets.');
        }
    };

    if (cms.isLoading && !cms.page) {
        return <div className="text-luxury-gold animate-pulse italic">Retrieving page architecture...</div>;
    }

    return (
        <div className="space-y-12 max-w-5xl mx-auto">
            <header className="flex justify-between items-end border-b border-luxury-gold/10 pb-8">
                <div>
                    <h1 className="text-3xl font-playfair text-luxury-charcoal">Landing Page Architect</h1>
                    <p className="text-xs uppercase tracking-widest text-gray-400 mt-2">Sculpting the front-facing experience</p>
                </div>
                <Button onClick={handleSave} className="px-12" isLoading={cms.isLoading}>Preserve Experience</Button>
            </header>

            <div className="space-y-10">
                {/* Hero Section Editor */}
                {sections.map((section, idx) => (
                    <motion.section
                        key={section._id || idx}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`bg-white rounded-[2rem] border ${section.isActive ? 'border-luxury-gold/20 shadow-lg shadow-luxury-gold/5' : 'border-gray-200 opacity-60'} overflow-hidden transition-all`}
                    >
                        <div className="px-8 py-4 bg-luxury-marble/20 border-b border-luxury-gold/5 flex justify-between items-center">
                            <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-luxury-indigo">{section.type} Component</h3>
                            <button
                                onClick={() => toggleSectionVisibility(idx)}
                                className={`text-[9px] uppercase tracking-widest font-bold px-3 py-1 rounded-full border ${section.isActive ? 'border-luxury-gold text-luxury-gold' : 'border-gray-300 text-gray-400'}`}
                            >
                                {section.isActive ? 'Active in Vault' : 'Stored in Archives'}
                            </button>
                        </div>

                        <div className="p-10 space-y-6">
                            {section.type === 'Hero' && (
                                <div className="grid grid-cols-1 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-widest text-gray-400 ml-2">Primary Headline</label>
                                        <input
                                            value={section.content.title || ''}
                                            onChange={(e) => handleSectionChange(idx, 'title', e.target.value)}
                                            className="w-full bg-luxury-marble/30 border-b border-luxury-gold/20 p-3 font-playfair text-2xl text-luxury-charcoal focus:outline-none focus:border-luxury-gold"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-widest text-gray-400 ml-2">Secondary Narrative</label>
                                        <textarea
                                            value={section.content.subtitle || ''}
                                            onChange={(e) => handleSectionChange(idx, 'subtitle', e.target.value)}
                                            className="w-full bg-luxury-marble/30 border-b border-luxury-gold/20 p-3 text-sm text-gray-600 focus:outline-none focus:border-luxury-gold min-h-[80px]"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-widest text-gray-400 ml-2">Media Type</label>
                                            <select
                                                value={section.content.mediaType || 'image'}
                                                onChange={(e) => handleSectionChange(idx, 'mediaType', e.target.value)}
                                                className="w-full bg-luxury-marble/30 border-b border-luxury-gold/20 p-3 text-sm text-luxury-charcoal focus:outline-none focus:border-luxury-gold"
                                            >
                                                <option value="image">Static Image</option>
                                                <option value="video">Cinematic Video</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-widest text-gray-400 ml-2">Cinematic Asset URL (Image/Fallback)</label>
                                            <input
                                                value={section.content.backgroundImage || ''}
                                                onChange={(e) => handleSectionChange(idx, 'backgroundImage', e.target.value)}
                                                className="w-full bg-luxury-marble/30 border-b border-luxury-gold/20 p-3 text-[10px] font-mono focus:outline-none"
                                                placeholder="https://images.unsplash.com/..."
                                            />
                                        </div>
                                    </div>
                                    {section.content.mediaType === 'video' && (
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center ml-2">
                                                    <label className="text-[10px] uppercase tracking-widest text-gray-400">Video Asset URL (MP4)</label>
                                                    <button
                                                        onClick={handleSync}
                                                        className="text-[9px] uppercase tracking-widest font-bold text-luxury-gold hover:text-luxury-gold/80 transition-colors flex items-center gap-1"
                                                    >
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                        </svg>
                                                        Sync from Cloudinary
                                                    </button>
                                                </div>
                                                <input
                                                    value={section.content.videoUrl || ''}
                                                    onChange={(e) => handleSectionChange(idx, 'videoUrl', e.target.value)}
                                                    className="w-full bg-luxury-marble/30 border-b border-luxury-gold/20 p-3 text-[10px] font-mono focus:outline-none"
                                                    placeholder="https://.../video.mp4"
                                                />
                                            </div>

                                            {/* Enhanced Hero Section Preview */}
                                            {(section.content.videoUrl || section.content.backgroundImage) && (
                                                <div className="space-y-4">
                                                    <label className="text-[10px] uppercase tracking-widest text-gray-400 ml-2">Interactive Preview</label>
                                                    <div className="rounded-[2rem] overflow-hidden border border-luxury-gold/20 bg-luxury-indigo aspect-video relative group shadow-2xl">
                                                        {/* Background Media */}
                                                        <div className="absolute inset-0 z-0">
                                                            {section.content.mediaType === 'video' && section.content.videoUrl ? (
                                                                <video
                                                                    key={section.content.videoUrl}
                                                                    src={section.content.videoUrl}
                                                                    className="w-full h-full object-cover opacity-40"
                                                                    autoPlay
                                                                    muted
                                                                    loop
                                                                    playsInline
                                                                />
                                                            ) : (
                                                                <img
                                                                    src={section.content.backgroundImage || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2070&auto=format&fit=crop'}
                                                                    alt="Hero Preview"
                                                                    className="w-full h-full object-cover opacity-40"
                                                                />
                                                            )}
                                                            <div className="absolute inset-0 bg-gradient-to-b from-luxury-indigo/60 via-transparent to-luxury-indigo/80" />
                                                        </div>

                                                        {/* Hero Content Preview Overlay */}
                                                        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4 scale-75 md:scale-90 lg:scale-100">
                                                            <span className="text-luxury-gold uppercase tracking-[0.4em] text-[6px] font-semibold mb-2 block">
                                                                Timeless Elegance
                                                            </span>
                                                            <h2 className="text-xl md:text-2xl font-playfair text-white mb-3 tracking-tight line-clamp-2 px-4">
                                                                {section.content.title || 'Masterpieces in Gold'}
                                                            </h2>
                                                            <p className="text-gray-300 text-[8px] md:text-[10px] font-light mb-4 max-w-sm mx-auto leading-relaxed line-clamp-2 px-6">
                                                                {section.content.subtitle || 'Discover our curated selection of high-value jewellery.'}
                                                            </p>
                                                            <div className="flex gap-4">
                                                                <div className="px-5 py-2 bg-luxury-gold text-luxury-indigo text-[10px] font-bold uppercase tracking-widest rounded-full">
                                                                    Explore
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Scroll Indicator Mock */}
                                                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-60">
                                                            <div className="w-[1px] h-6 bg-gradient-to-b from-luxury-gold to-transparent" />
                                                        </div>

                                                        <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md border border-luxury-gold/30 rounded-full text-[7px] uppercase tracking-widest text-luxury-gold font-bold z-20">
                                                            Live View Reconstruction
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {section.type !== 'Hero' && (
                                <div className="py-20 text-center border-2 border-dashed border-luxury-marble rounded-2xl">
                                    <p className="text-[10px] uppercase tracking-widest text-gray-400 italic">Advanced controls for {section.type} coming to future curatorial iterations.</p>
                                </div>
                            )}
                        </div>
                    </motion.section>
                ))}

                {sections.length === 0 && !cms.isLoading && (
                    <div className="text-center py-20 bg-luxury-marble/10 rounded-[2rem] border border-dashed border-luxury-gold/10">
                        <p className="font-playfair italic text-gray-400">The landing page architecture is currently being drafted.</p>
                        <Button variant="outline" className="mt-6" onClick={() => dispatch(fetchPageContent('landing-page'))}>Initialize Vault Architecture</Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CMSManagement;
