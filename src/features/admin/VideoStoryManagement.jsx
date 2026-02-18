import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
    fetchAllAdminStoryVideos,
    createStoryVideo,
    updateStoryVideo,
    deleteStoryVideo,
    reorderStoryVideos,
} from '../storyVideos/storyVideoSlice';

// ─── Helpers ───────────────────────────────────────────────────────────────────
const CLD_BASE = 'https://res.cloudinary.com/dnpk9egyk/video/upload/q_auto,f_auto';
const cldVideo = (publicId) => `${CLD_BASE}/${publicId}`;

const EMPTY_FORM = {
    title: '',
    description: '',
    cloudinaryPublicId: '',
    cloudinaryUrl: '',
    thumbnailUrl: '',
    productName: '',
    productLink: '',
    productThumbnail: '',
    tags: '',
    isHomepageFeatured: true,
    storyMode: false,
    darkMode: false,
    orderIndex: 0,
};

// ─── Toggle Switch ─────────────────────────────────────────────────────────────
const Toggle = ({ checked, onChange, label }) => (
    <label className="flex items-center gap-2 cursor-pointer select-none">
        <div
            onClick={() => onChange(!checked)}
            className="relative w-10 h-5 rounded-full transition-colors duration-200"
            style={{ background: checked ? '#c9a84c' : '#d1d5db' }}
        >
            <div
                className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200"
                style={{ transform: checked ? 'translateX(22px)' : 'translateX(2px)' }}
            />
        </div>
        <span className="text-sm text-gray-600">{label}</span>
    </label>
);

// ─── VideoStoryManagement ──────────────────────────────────────────────────────
const VideoStoryManagement = () => {
    const dispatch = useDispatch();
    const { adminVideos, isLoading, error } = useSelector((state) => state.storyVideos);

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [dragIndex, setDragIndex] = useState(null);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        dispatch(fetchAllAdminStoryVideos());
    }, [dispatch]);

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleFormChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    // Auto-generate Cloudinary URL from public ID
    const handlePublicIdChange = (val) => {
        setForm((prev) => ({
            ...prev,
            cloudinaryPublicId: val,
            cloudinaryUrl: val ? cldVideo(val) : '',
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...form,
            tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        };

        if (editingId) {
            await dispatch(updateStoryVideo({ id: editingId, updates: payload }));
            showToast('Story video updated');
        } else {
            await dispatch(createStoryVideo(payload));
            showToast('Story video created');
        }
        setShowForm(false);
        setEditingId(null);
        setForm(EMPTY_FORM);
        dispatch(fetchAllAdminStoryVideos());
    };

    const handleEdit = (video) => {
        setForm({
            ...video,
            tags: (video.tags || []).join(', '),
        });
        setEditingId(video._id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this story video?')) return;
        await dispatch(deleteStoryVideo(id));
        showToast('Story video deleted', 'error');
    };

    const handleToggle = async (video, field) => {
        await dispatch(updateStoryVideo({ id: video._id, updates: { [field]: !video[field] } }));
        dispatch(fetchAllAdminStoryVideos());
    };

    // ─── Drag & Drop Reorder ────────────────────────────────────────────────────
    const handleDragStart = (index) => setDragIndex(index);
    const handleDragOver = (e, index) => {
        e.preventDefault();
        if (dragIndex === null || dragIndex === index) return;
        const reordered = [...adminVideos];
        const [moved] = reordered.splice(dragIndex, 1);
        reordered.splice(index, 0, moved);
        setDragIndex(index);
        const order = reordered.map((v, i) => ({ id: v._id, orderIndex: i }));
        dispatch(reorderStoryVideos(order));
    };
    const handleDragEnd = () => setDragIndex(null);

    return (
        <div className="p-6 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-playfair text-gray-900">Story Videos</h1>
                    <p className="text-sm text-gray-500 mt-1 font-inter">
                        Manage the cinematic video story section on the homepage
                    </p>
                </div>
                <button
                    onClick={() => { setShowForm(true); setEditingId(null); setForm(EMPTY_FORM); }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-inter font-medium transition-all"
                    style={{ background: '#c9a84c', color: '#fff' }}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M12 5v14M5 12h14" />
                    </svg>
                    Add Video
                </button>
            </div>

            {/* Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: -12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        className="fixed top-6 right-6 z-50 px-5 py-3 rounded-xl text-sm font-inter shadow-lg"
                        style={{ background: toast.type === 'error' ? '#ef4444' : '#22c55e', color: '#fff' }}
                    >
                        {toast.msg}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Add/Edit Form */}
            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden mb-8"
                    >
                        <form
                            onSubmit={handleSubmit}
                            className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm"
                        >
                            <h3 className="font-playfair text-lg text-gray-900 mb-5">
                                {editingId ? 'Edit Story Video' : 'Add Story Video'}
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Title */}
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1 font-inter uppercase tracking-wider">Title *</label>
                                    <input
                                        required
                                        value={form.title}
                                        onChange={(e) => handleFormChange('title', e.target.value)}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-inter focus:outline-none focus:border-yellow-400"
                                        placeholder="The Bridal Edit"
                                    />
                                </div>

                                {/* Cloudinary Public ID */}
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1 font-inter uppercase tracking-wider">
                                        Cloudinary Public ID *
                                    </label>
                                    <input
                                        required
                                        value={form.cloudinaryPublicId}
                                        onChange={(e) => handlePublicIdChange(e.target.value)}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-inter focus:outline-none focus:border-yellow-400"
                                        placeholder="luxegems/videos/bridal-reel"
                                    />
                                </div>

                                {/* Description */}
                                <div className="md:col-span-2">
                                    <label className="block text-xs text-gray-500 mb-1 font-inter uppercase tracking-wider">Description</label>
                                    <input
                                        value={form.description}
                                        onChange={(e) => handleFormChange('description', e.target.value)}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-inter focus:outline-none focus:border-yellow-400"
                                        placeholder="Timeless pieces for your most sacred moments"
                                    />
                                </div>

                                {/* Product Name */}
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1 font-inter uppercase tracking-wider">Product Name</label>
                                    <input
                                        value={form.productName}
                                        onChange={(e) => handleFormChange('productName', e.target.value)}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-inter focus:outline-none focus:border-yellow-400"
                                        placeholder="Eternal Flame Solitaire Ring"
                                    />
                                </div>

                                {/* Product Link */}
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1 font-inter uppercase tracking-wider">Product Link</label>
                                    <input
                                        value={form.productLink}
                                        onChange={(e) => handleFormChange('productLink', e.target.value)}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-inter focus:outline-none focus:border-yellow-400"
                                        placeholder="/products/eternal-flame-ring"
                                    />
                                </div>

                                {/* Product Thumbnail (Cloudinary URL) */}
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1 font-inter uppercase tracking-wider">Product Thumbnail (Cloudinary URL)</label>
                                    <input
                                        value={form.productThumbnail}
                                        onChange={(e) => handleFormChange('productThumbnail', e.target.value)}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-inter focus:outline-none focus:border-yellow-400"
                                        placeholder="https://res.cloudinary.com/..."
                                    />
                                </div>

                                {/* Tags */}
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1 font-inter uppercase tracking-wider">Tags (comma-separated)</label>
                                    <input
                                        value={form.tags}
                                        onChange={(e) => handleFormChange('tags', e.target.value)}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-inter focus:outline-none focus:border-yellow-400"
                                        placeholder="bridal, diamond, rings"
                                    />
                                </div>

                                {/* Order Index */}
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1 font-inter uppercase tracking-wider">Order Index</label>
                                    <input
                                        type="number"
                                        value={form.orderIndex}
                                        onChange={(e) => handleFormChange('orderIndex', parseInt(e.target.value))}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-inter focus:outline-none focus:border-yellow-400"
                                    />
                                </div>

                                {/* Toggles */}
                                <div className="md:col-span-2 flex flex-wrap gap-6 pt-2">
                                    <Toggle checked={form.isHomepageFeatured} onChange={(v) => handleFormChange('isHomepageFeatured', v)} label="Homepage Featured" />
                                    <Toggle checked={form.storyMode} onChange={(v) => handleFormChange('storyMode', v)} label="Story Mode (auto-scroll)" />
                                    <Toggle checked={form.darkMode} onChange={(v) => handleFormChange('darkMode', v)} label="Cinematic Dark Mode" />
                                </div>
                            </div>

                            {/* Preview URL */}
                            {form.cloudinaryUrl && (
                                <p className="mt-3 text-xs text-gray-400 font-inter break-all">
                                    📹 {form.cloudinaryUrl}
                                </p>
                            )}

                            <div className="flex gap-3 mt-6">
                                <button
                                    type="submit"
                                    className="px-6 py-2.5 rounded-xl text-sm font-inter font-medium text-white"
                                    style={{ background: '#c9a84c' }}
                                >
                                    {editingId ? 'Save Changes' : 'Create Video'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setShowForm(false); setEditingId(null); }}
                                    className="px-6 py-2.5 rounded-xl text-sm font-inter border border-gray-200 text-gray-600"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Video List */}
            {isLoading ? (
                <div className="flex justify-center py-16">
                    <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : adminVideos.length === 0 ? (
                <div className="text-center py-16 text-gray-400 font-inter">
                    No story videos yet. Add your first one above.
                </div>
            ) : (
                <div className="space-y-3">
                    {adminVideos.map((video, index) => (
                        <div
                            key={video._id}
                            draggable
                            onDragStart={() => handleDragStart(index)}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDragEnd={handleDragEnd}
                            className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-4 shadow-sm cursor-grab active:cursor-grabbing transition-shadow hover:shadow-md"
                        >
                            {/* Drag handle */}
                            <div className="text-gray-300 flex-shrink-0">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M8 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm8 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM8 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm8 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM8 22a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm8 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
                                </svg>
                            </div>

                            {/* Thumbnail */}
                            <div className="w-12 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                {video.thumbnailUrl ? (
                                    <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <p className="font-playfair text-gray-900 text-sm truncate">{video.title}</p>
                                <p className="text-xs text-gray-400 font-inter truncate mt-0.5">{video.description}</p>
                                <div className="flex gap-1 mt-1 flex-wrap">
                                    {(video.tags || []).map((tag) => (
                                        <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-inter">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Toggles */}
                            <div className="flex flex-col gap-2 flex-shrink-0">
                                <Toggle
                                    checked={video.isHomepageFeatured}
                                    onChange={() => handleToggle(video, 'isHomepageFeatured')}
                                    label="Featured"
                                />
                                <Toggle
                                    checked={video.darkMode}
                                    onChange={() => handleToggle(video, 'darkMode')}
                                    label="Dark"
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 flex-shrink-0">
                                <button
                                    onClick={() => handleEdit(video)}
                                    className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors"
                                    title="Edit"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => handleDelete(video._id)}
                                    className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                    title="Delete"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="3 6 5 6 21 6" />
                                        <path d="M19 6l-1 14H6L5 6" />
                                        <path d="M10 11v6M14 11v6" />
                                        <path d="M9 6V4h6v2" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {error && (
                <p className="mt-4 text-sm text-red-500 font-inter">{error}</p>
            )}
        </div>
    );
};

export default VideoStoryManagement;
