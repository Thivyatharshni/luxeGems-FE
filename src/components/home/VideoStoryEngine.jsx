import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchStoryVideos } from '../../features/storyVideos/storyVideoSlice';

// ─── AI-Curated Rotation ───────────────────────────────────────────────────────
// Lightweight localStorage-based relevance scorer
const applyAICuration = (videos) => {
    if (!videos || videos.length === 0) return videos;
    try {
        const lastCategory = localStorage.getItem('luxegems_last_category') || '';
        if (!lastCategory) return videos;

        const scored = videos.map((v) => ({
            ...v,
            _score: v.tags?.some((t) => lastCategory.toLowerCase().includes(t)) ? 1 : 0,
        }));
        scored.sort((a, b) => b._score - a._score);
        return scored;
    } catch {
        return videos;
    }
};

// ─── Cloudinary Fallback ───────────────────────────────────────────────────────
const FALLBACK_VIDEO = `https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dnpk9egyk'}/video/upload/q_auto,f_auto/10835737-hd_1920_1080_25fps_nqukip.mp4`;

// ─── VideoCard ─────────────────────────────────────────────────────────────────
const VideoCard = ({
    video,
    position,    // 'active' | 'prev1' | 'prev2' | 'next1' | 'next2' | 'hidden'
    onEnded,
    isActive,
    darkMode,
}) => {
    const videoRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);
    const [progress, setProgress] = useState(0);

    // Autoplay / pause based on active state
    useEffect(() => {
        const el = videoRef.current;
        if (!el) return;
        if (isActive) {
            el.play().catch(() => { });
        } else {
            el.pause();
            if (!isActive) el.currentTime = 0;
        }
    }, [isActive]);

    // Progress tracking
    const handleTimeUpdate = useCallback(() => {
        const el = videoRef.current;
        if (!el || !el.duration) return;
        setProgress((el.currentTime / el.duration) * 100);
    }, []);

    const positionStyles = {
        active: {
            zIndex: 10,
            scale: 1,
            x: 0,
            opacity: 1,
            filter: 'blur(0px)',
            rotateY: 0,
        },
        prev1: {
            zIndex: 8,
            scale: 0.92,
            x: '-120px',
            opacity: 0.95,
            filter: 'blur(0.5px)',
            rotateY: 5,
        },
        next1: {
            zIndex: 8,
            scale: 0.92,
            x: '120px',
            opacity: 0.95,
            filter: 'blur(0.5px)',
            rotateY: -5,
        },
        prev2: {
            zIndex: 6,
            scale: 0.85,
            x: '-240px',
            opacity: 0.82,
            filter: 'blur(1.5px)',
            rotateY: 10,
        },
        next2: {
            zIndex: 6,
            scale: 0.85,
            x: '240px',
            opacity: 0.82,
            filter: 'blur(1.5px)',
            rotateY: -10,
        },
        hidden: {
            zIndex: 1,
            scale: 0.75,
            x: 0,
            opacity: 0,
            filter: 'blur(4px)',
            rotateY: 0,
        },
    };

    const style = positionStyles[position] || positionStyles.hidden;

    return (
        <motion.div
            animate={style}
            transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute top-0 left-1/2 -translate-x-1/2"
            style={{ width: '100%', maxWidth: '300px', perspective: '1000px' }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Card Shell */}
            <div
                className="relative overflow-hidden"
                style={{
                    borderRadius: '24px',
                    aspectRatio: '9/16',
                    height: '480px',
                    boxShadow: isActive
                        ? darkMode
                            ? '0 0 0 2px #c9a84c, 0 32px 80px rgba(0,0,0,0.8)'
                            : '0 0 0 2px #c9a84c, 0 24px 60px rgba(0,0,0,0.35)'
                        : '0 12px 40px rgba(0,0,0,0.25)',
                    transition: 'box-shadow 0.3s ease',
                }}
            >
                {/* Video */}
                <video
                    ref={videoRef}
                    src={video.cloudinaryUrl || FALLBACK_VIDEO}
                    muted
                    playsInline
                    preload="metadata"
                    onEnded={onEnded}
                    onTimeUpdate={handleTimeUpdate}
                    onError={(e) => {
                        if (e.target.src !== FALLBACK_VIDEO) {
                            e.target.src = FALLBACK_VIDEO;
                        }
                    }}
                    className="w-full h-full object-cover"
                    style={{ display: 'block' }}
                />

                {/* Dark overlay for side cards */}
                {position !== 'active' && (
                    <div className="absolute inset-0 bg-black/40" />
                )}

                {/* Progress bar */}
                {isActive && (
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/20">
                        <motion.div
                            className="h-full bg-luxury-gold"
                            style={{ width: `${progress}%` }}
                            transition={{ duration: 0.1 }}
                        />
                    </div>
                )}

                {/* Bottom overlay — product info */}
                <AnimatePresence>
                    {isActive && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: isHovered ? 1 : 0.85, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.3 }}
                            className="absolute bottom-0 left-0 right-0 p-5"
                            style={{
                                background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)',
                                backdropFilter: 'blur(2px)',
                            }}
                        >
                            {/* Video title */}
                            <p className="text-white/60 text-xs tracking-[0.2em] uppercase mb-1 font-inter">
                                {video.description}
                            </p>

                            {/* Product row */}
                            {video.productName && (
                                <Link
                                    to={video.productLink || '/products'}
                                    className="flex items-center gap-3 group mt-2"
                                >
                                    {video.productThumbnail && (
                                        <img
                                            src={video.productThumbnail}
                                            alt={video.productName}
                                            className="w-10 h-10 rounded-full object-cover border border-white/30"
                                        />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white font-playfair text-sm leading-tight truncate">
                                            {video.productName}
                                        </p>
                                        <p className="text-white/50 text-xs mt-0.5 font-inter">
                                            Shop now
                                        </p>
                                    </div>
                                    <motion.div
                                        whileHover={{ x: 4 }}
                                        className="text-luxury-gold flex-shrink-0"
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M5 12h14M12 5l7 7-7 7" />
                                        </svg>
                                    </motion.div>
                                </Link>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

// ─── VideoStoryEngine ──────────────────────────────────────────────────────────
const VideoStoryEngine = () => {
    const dispatch = useDispatch();
    const { videos, isLoading } = useSelector((state) => state.storyVideos);

    const [activeIndex, setActiveIndex] = useState(0);
    const [curatedVideos, setCuratedVideos] = useState([]);
    const sectionRef = useRef(null);

    // Fetch videos on mount
    useEffect(() => {
        dispatch(fetchStoryVideos());
    }, [dispatch]);

    // Apply AI curation once videos load
    useEffect(() => {
        if (videos.length > 0) {
            setCuratedVideos(applyAICuration(videos));
        }
    }, [videos]);



    const goToNext = useCallback(() => {
        setActiveIndex((prev) => (prev + 1) % curatedVideos.length);
    }, [curatedVideos.length]);

    const goToPrev = useCallback(() => {
        setActiveIndex((prev) => (prev - 1 + curatedVideos.length) % curatedVideos.length);
    }, [curatedVideos.length]);

    // Touch/swipe support
    const touchStartX = useRef(null);
    const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
    const handleTouchEnd = (e) => {
        if (touchStartX.current === null) return;
        const diff = touchStartX.current - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
            diff > 0 ? goToNext() : goToPrev();
        }
        touchStartX.current = null;
    };

    // Story mode: handle index change on end
    const handleVideoEnded = useCallback(() => {
        const nextIdx = (activeIndex + 1) % curatedVideos.length;
        setActiveIndex(nextIdx);
    }, [activeIndex, curatedVideos]);

    // Dark mode: check if active video has darkMode
    const sectionDark = curatedVideos[activeIndex]?.darkMode || false;

    const [screenWidth, setScreenWidth] = useState(window.innerWidth);

    // Track window resize for responsive counts
    useEffect(() => {
        const handleResize = () => setScreenWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const getPosition = (index) => {
        const total = curatedVideos.length;
        const isDesktop = screenWidth >= 1024;
        const isTablet = screenWidth >= 640 && screenWidth < 1024;

        if (index === activeIndex) return 'active';

        // Circular math for neighbors
        const prev1Idx = (activeIndex - 1 + total) % total;
        const next1Idx = (activeIndex + 1) % total;
        const prev2Idx = (activeIndex - 2 + total) % total;
        const next2Idx = (activeIndex + 2) % total;

        if (index === prev1Idx) return (isDesktop || isTablet) ? 'prev1' : 'hidden';
        if (index === next1Idx) return (isDesktop || isTablet) ? 'next1' : 'hidden';

        if (isDesktop) {
            if (index === prev2Idx && total >= 5) return 'prev2';
            if (index === next2Idx && total >= 5) return 'next2';
        }

        return 'hidden';
    };

    if (isLoading && curatedVideos.length === 0) {
        return (
            <section className="h-screen flex items-center justify-center bg-luxury-ivory">
                <div className="w-8 h-8 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin" />
            </section>
        );
    }

    if (!isLoading && curatedVideos.length === 0) {
        return (
            <section className="py-20 bg-luxury-ivory text-center">
                <p className="text-gray-400 font-playfair italic">Our story archives are being updated...</p>
            </section>
        );
    }

    return (
        <section
            ref={sectionRef}
            className="relative overflow-hidden transition-colors duration-700 flex flex-col justify-center items-center"
            style={{
                background: 'var(--color-luxury-ivory, #faf9f7)',
                height: '100vh',
                minHeight: '100vh',
                padding: '40px 0',
            }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            {/* Section Header */}
            <div className="text-center mb-8 px-4 flex-shrink-0">
                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-[10px] tracking-[0.4em] uppercase mb-3 font-inter"
                    style={{ color: '#c9a84c' }}
                >
                    Luxury Stories
                </motion.p>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="font-playfair text-3xl md:text-4xl lg:text-5xl mb-3"
                    style={{ color: '#1a1a1a' }}
                >
                    Styling 101 With Diamonds
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="font-inter text-sm max-w-md mx-auto"
                    style={{ color: '#6b6b6b' }}
                >
                    Trendsetting jewellery moments for every occasion.
                </motion.p>
            </div>

            {/* Card Stack */}
            <div className="relative mx-auto flex-shrink-0" style={{ height: '520px', width: '100%', maxWidth: '900px' }}>
                {curatedVideos.map((video, index) => (
                    <VideoCard
                        key={video._id || video.cloudinaryPublicId}
                        video={video}
                        position={getPosition(index)}
                        isActive={index === activeIndex}
                        onEnded={handleVideoEnded}
                        darkMode={false}
                    />
                ))}
            </div>

            {/* Navigation Controls — Dots Only */}
            <div className="flex items-center justify-center gap-3 mt-12 flex-shrink-0">
                {curatedVideos.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setActiveIndex(i)}
                        className="relative"
                        aria-label={`Go to video ${i + 1}`}
                    >
                        <motion.div
                            initial={false}
                            animate={{
                                scale: i === activeIndex ? 1.3 : 1,
                                backgroundColor: i === activeIndex ? '#C6A14A' : 'rgba(198, 161, 74, 0.25)',
                            }}
                            transition={{ duration: 0.3 }}
                            style={{
                                width: '7px',
                                height: '7px',
                                borderRadius: '50%',
                            }}
                        />
                    </button>
                ))}
            </div>
        </section>
    );
};

export default VideoStoryEngine;
