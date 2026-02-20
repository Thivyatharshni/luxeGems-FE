import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { fetchCategories, fetchProducts } from './productSlice';
import { fetchPageContent } from '../admin/adminSlice';
import CategoryCard from '../../components/products/CategoryCard';
import ProductCard from '../../components/products/ProductCard';
import VideoStoryEngine from '../../components/home/VideoStoryEngine';
import Button from '../../components/ui/Button';

// ─── Animation Variants ────────────────────────────────────────────────────────
const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (delay = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94], delay }
    })
};

const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } }
};

const staggerItem = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } }
};

// ─── Reusable Section Header ───────────────────────────────────────────────────
const SectionHeader = ({ eyebrow, title, subtitle, light = false, center = true }) => (
    <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className={`${center ? 'text-center' : ''} mb-12 lg:mb-16`}
    >
        <motion.span variants={staggerItem} className={`text-[11px] uppercase tracking-[0.4em] font-bold block mb-4 ${light ? 'text-luxury-gold' : 'text-luxury-gold-brand'}`}>
            {eyebrow}
        </motion.span>
        <motion.h2 variants={staggerItem} className={`text-4xl lg:text-5xl font-playfair leading-tight ${light ? 'text-white' : 'text-luxury-charcoal'}`}>
            {title}
        </motion.h2>
        {subtitle && (
            <motion.p variants={staggerItem} className={`mt-5 text-base lg:text-lg font-light max-w-2xl ${center ? 'mx-auto' : ''} leading-relaxed ${light ? 'text-gray-300' : 'text-gray-500'}`}>
                {subtitle}
            </motion.p>
        )}
        <motion.div variants={staggerItem} className={`w-12 h-[1px] bg-luxury-gold mt-8 ${center ? 'mx-auto' : ''}`} />
    </motion.div>
);

// ─── Testimonials Data ─────────────────────────────────────────────────────────
const testimonials = [
    {
        name: 'Priya Mehta',
        location: 'Mumbai',
        review: 'The craftsmanship is extraordinary. Every detail of my bridal set was perfected with such care. LuxeGems has redefined what jewellery means to me.',
        initials: 'PM'
    },
    {
        name: 'Arjun Kapoor',
        location: 'Delhi',
        review: 'I gifted my wife a diamond pendant from LuxeGems and she was moved to tears. The quality and elegance are unmatched. Truly a luxury experience.',
        initials: 'AK'
    },
    {
        name: 'Sunita Rao',
        location: 'Bangalore',
        review: 'From the moment I opened the packaging to wearing the necklace, everything felt premium. LuxeGems is not just jewellery — it is an heirloom.',
        initials: 'SR'
    },
    {
        name: 'Vikram Nair',
        location: 'Chennai',
        review: 'The hallmarked gold ring I purchased exceeded every expectation. The attention to detail and the ethical sourcing story made me proud to wear it.',
        initials: 'VN'
    }
];

// ─── Cloudinary Base URL helper ───────────────────────────────────────────────
// All homepage images are hosted under luxegems/homepage/ in Cloudinary
// Using q_auto,f_auto for automatic quality & format optimization
const CLD_BASE = 'https://res.cloudinary.com/dnpk9egyk/image/upload/q_auto,f_auto';
const cld = (publicId) => `${CLD_BASE}/${publicId}`;

// ─── Social Proof Images ───────────────────────────────────────────────────────
const socialImages = [
    { id: 1, url: cld('luxegems/homepage/social-1'), alt: 'Diamond Ring' },
    { id: 2, url: cld('luxegems/homepage/social-2'), alt: 'Gold Necklace' },
    { id: 3, url: cld('luxegems/homepage/social-3'), alt: 'Luxury Bracelet' },
    { id: 4, url: cld('luxegems/homepage/social-4'), alt: 'Pearl Earrings' },
    { id: 5, url: cld('luxegems/homepage/social-5'), alt: 'Sapphire Ring' },
    { id: 6, url: cld('luxegems/homepage/social-6'), alt: 'Gold Bangle' },
];

// ─── Featured Collections Data ─────────────────────────────────────────────────
const featuredCollections = [
    {
        title: 'Bridal Heritage',
        subtitle: 'Timeless Unions',
        description: 'Crafted for the most sacred moments',
        image: cld('luxegems/homepage/collection-bridal-heritage'),
        filter: '?category=bridal'
    },
    {
        title: 'Modern Minimal',
        subtitle: 'Contemporary Elegance',
        description: 'Clean lines, enduring beauty',
        image: cld('luxegems/homepage/collection-modern-minimal'),
        filter: '?category=rings'
    },
    {
        title: 'Timeless Classics',
        subtitle: 'Heritage Pieces',
        description: 'Pieces that transcend generations',
        image: cld('luxegems/homepage/collection-timeless-classics'),
        filter: '?category=necklaces'
    }
];

// ─── Trust Pillars ─────────────────────────────────────────────────────────────
const trustPillars = [
    {
        icon: (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
        ),
        title: 'Certified Diamonds',
        description: 'Every stone certified by GIA & IGI with full provenance documentation.'
    },
    {
        icon: (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
        ),
        title: 'Lifetime Maintenance',
        description: 'Complimentary cleaning, polishing and repair for the life of your piece.'
    },
    {
        icon: (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04L3 5.67l.618 7.034a11.996 11.996 0 0021.232 0L21 5.67l-.382-.016z" />
            </svg>
        ),
        title: 'Secure Insured Shipping',
        description: 'Every order fully insured and delivered in our signature luxury packaging.'
    },
    {
        icon: (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
        ),
        title: 'Hallmarked Gold',
        description: 'BIS hallmarked gold ensuring purity and authenticity in every creation.'
    }
];

// ─── Luxe Promise Data ────────────────────────────────────────────────────────
const luxePromiseDocs = [
    {
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04L3 5.67l.618 7.034a11.996 11.996 0 0021.232 0L21 5.67l-.382-.016z" />
            </svg>
        ),
        title: 'Certified Authenticity',
        description: 'Every stone GIA & IGI certified.'
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
        ),
        title: 'Hallmarked Gold',
        description: 'BIS hallmarked ensuring purity.'
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
        ),
        title: 'Insured Shipping',
        description: 'Secure, global insured delivery.'
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
        ),
        title: 'Lifetime Care',
        description: 'Complimentary maintenance for life.'
    }
];

// ─── Heritage Data ────────────────────────────────────────────────────────────
const heritageMilestones = [
    { year: '2010', title: 'The Foundation', description: 'Born from a vision to redefine Indian luxury jewellery.' },
    { year: '2013', title: 'Signature Collection', description: 'Launched our first globally acclaimed bridal series.' },
    { year: '2018', title: 'International Stage', description: 'Recognition at world design forums for craftsmanship.' },
    { year: '2025', title: 'The Vault', description: 'Unveiling our most exclusive limited-edition experience.' }
];

// ─── Main Component ────────────────────────────────────────────────────────────
const Home = () => {
    const dispatch = useDispatch();
    const { categories, items: products } = useSelector((state) => state.products);
    const { cms } = useSelector((state) => state.admin);

    // Testimonial carousel state
    const [activeTestimonial, setActiveTestimonial] = useState(0);

    // Back to top visibility
    const [showBackToTop, setShowBackToTop] = useState(false);

    // Newsletter state
    const [email, setEmail] = useState('');
    const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

    // Parallax refs
    const parallaxRef = useRef(null);
    const vaultRef = useRef(null);
    const { scrollYProgress: parallaxProgress } = useScroll({ target: parallaxRef, offset: ['start end', 'end start'] });
    const { scrollYProgress: vaultProgress } = useScroll({ target: vaultRef, offset: ['start end', 'end start'] });
    const parallaxY = useTransform(parallaxProgress, [0, 1], ['0%', '20%']);
    const vaultY = useTransform(vaultProgress, [0, 1], ['0%', '15%']);

    useEffect(() => {
        dispatch(fetchCategories());
        dispatch(fetchProducts({ isFeatured: true, limit: 4 }));
        dispatch(fetchPageContent('landing-page'));
    }, [dispatch]);

    // Testimonial auto-slide
    useEffect(() => {
        const timer = setInterval(() => {
            setActiveTestimonial(prev => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    // Back to top scroll listener
    useEffect(() => {
        const handleScroll = () => setShowBackToTop(window.scrollY > 600);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    // Default / Fallback Hero Content
    const defaultHero = {
        title: 'LuxeGems',
        subtitle: 'Experience Pure Elegance & Timeless Mastery',
        mediaType: 'video',
        videoUrl: 'https://res.cloudinary.com/dnpk9egyk/video/upload/q_auto,f_auto/v1708416000/luxegems/homepage/hero-cinematic-main.mp4',
        backgroundImage: cld('luxegems/homepage/hero-fallback-luxury'),
        isActive: true
    };

    const heroSection = cms.page?.sections?.find(s => s.type === 'Hero' && s.isActive);
    const heroContent = heroSection?.content || defaultHero;

    // Loading State - only show if we have absolutely nothing
    if (cms.isLoading && !cms.page) {
        return (
            <div className="h-screen flex items-center justify-center bg-luxury-indigo text-luxury-gold">
                <div className="text-center">
                    <div className="w-[1px] h-16 bg-gradient-to-b from-luxury-gold to-transparent mx-auto mb-8 animate-pulse" />
                    <span className="font-playfair text-lg tracking-[0.4em] uppercase">Loading Experience</span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col overflow-x-hidden">

            {/* ═══════════════════════════════════════════════════════════════
                SECTION 1 — HERO (CMS-Driven, Cinematic)
            ═══════════════════════════════════════════════════════════════ */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden bg-luxury-indigo">
                {/* Background Media */}
                <div className="absolute inset-0 z-0">
                    {heroContent.mediaType === 'video' ? (
                        <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-50">
                            <source src={heroContent.videoUrl} type="video/mp4" />
                            {heroContent.backgroundImage && (
                                <img src={heroContent.backgroundImage} alt="Hero" className="w-full h-full object-cover" />
                            )}
                        </video>
                    ) : (
                        <img src={heroContent.backgroundImage} alt="Hero" className="w-full h-full object-cover opacity-50" loading="eager" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-b from-luxury-indigo/70 via-luxury-indigo/30 to-luxury-indigo/80" />
                </div>

                {/* Hero Content */}
                <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
                    <motion.span
                        initial={{ opacity: 0, letterSpacing: '0.2em' }}
                        animate={{ opacity: 1, letterSpacing: '0.5em' }}
                        transition={{ duration: 1.2, ease: 'easeOut' }}
                        className="text-luxury-gold text-[11px] uppercase font-semibold mb-8 block"
                    >
                        Timeless Elegance
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-playfair text-white mb-8 leading-[1.1] tracking-tight"
                    >
                        {heroContent.title}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="text-gray-300 text-base md:text-lg font-light mb-14 max-w-xl mx-auto leading-relaxed"
                    >
                        {heroContent.subtitle}
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.9 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <Link to="/products">
                            <Button size="lg" className="px-12 py-4 text-sm tracking-[0.15em]">Explore Collection</Button>
                        </Link>
                        <Link to="/products" className="inline-flex items-center gap-3 px-8 py-4 border border-white/20 text-white text-sm uppercase tracking-[0.15em] rounded-full hover:border-luxury-gold hover:text-luxury-gold transition-all duration-500">
                            Our Story
                        </Link>
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    animate={{ y: [0, 12, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                >
                    <span className="text-[9px] uppercase tracking-[0.4em] text-white/40">Scroll</span>
                    <div className="w-[1px] h-10 bg-gradient-to-b from-luxury-gold/60 to-transparent" />
                </motion.div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════
                SECTION 2 — CRAFTSMANSHIP STORY (50/50 Brand Block)
            ═══════════════════════════════════════════════════════════════ */}
            <section className="bg-luxury-ivory py-16 lg:py-24 overflow-hidden">
                <div className="container-luxury">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                        {/* Left: Text */}
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-80px' }}
                            className="order-2 lg:order-1"
                        >
                            <motion.span variants={staggerItem} className="text-[11px] uppercase tracking-[0.4em] text-luxury-gold-brand font-bold block mb-6">
                                Our Craftsmanship
                            </motion.span>
                            <motion.h2 variants={staggerItem} className="text-4xl lg:text-5xl font-playfair text-luxury-charcoal leading-tight mb-8">
                                Where Tradition<br />Meets Mastery
                            </motion.h2>
                            <motion.div variants={staggerItem} className="w-10 h-[1px] bg-luxury-gold mb-8" />
                            <motion.div variants={staggerContainer} className="space-y-6 text-gray-600 font-light leading-relaxed">
                                <motion.p variants={staggerItem}>
                                    Every LuxeGems creation begins with a singular vision — to honour the ancient art of jewellery making while embracing the precision of modern craftsmanship. Our master artisans bring decades of expertise to each piece.
                                </motion.p>
                                <motion.p variants={staggerItem}>
                                    We source only ethically mined gemstones and conflict-free diamonds, partnering with suppliers who share our commitment to responsible luxury. Each stone is hand-selected for its exceptional character.
                                </motion.p>
                                <motion.p variants={staggerItem}>
                                    From the initial sketch to the final polish, every detail is refined with obsessive care — because we believe that true luxury lies in the details that most will never see, but always feel.
                                </motion.p>
                            </motion.div>
                            <motion.div variants={staggerItem} className="mt-12">
                                <Link to="/products" className="group inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-luxury-charcoal font-bold hover:text-luxury-gold transition-colors duration-300">
                                    Discover Our Collections
                                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-2 duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </Link>
                            </motion.div>
                        </motion.div>

                        {/* Right: Image */}
                        <motion.div
                            initial={{ opacity: 0, x: 60 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: '-80px' }}
                            transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
                            className="order-1 lg:order-2 relative"
                        >
                            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden">
                                <img
                                    src={cld('luxegems/homepage/craftsmanship-story')}
                                    alt="Luxury Jewellery Craftsmanship"
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-luxury-indigo/20 to-transparent" />
                            </div>
                            {/* Floating accent card */}
                            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.1)] border border-luxury-gold/10">
                                <p className="text-[9px] uppercase tracking-[0.3em] text-luxury-gold font-bold mb-1">Est. Heritage</p>
                                <p className="font-playfair text-2xl text-luxury-charcoal">Since 1987</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════
                SECTION 3 — PARALLAX SHOWCASE ("Eternal Brilliance")
            ═══════════════════════════════════════════════════════════════ */}
            <section ref={parallaxRef} className="relative h-[70vh] lg:h-[85vh] flex items-center justify-center overflow-hidden">
                <motion.div
                    style={{ y: parallaxY }}
                    className="absolute inset-0 scale-110"
                >
                    <img
                        src={cld('luxegems/homepage/parallax-showcase')}
                        alt="Eternal Brilliance"
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-luxury-indigo/65" />
                </motion.div>

                <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="text-luxury-gold text-[11px] uppercase tracking-[0.5em] font-bold block mb-6"
                    >
                        The Pinnacle of Luxury
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, delay: 0.2 }}
                        className="text-5xl lg:text-7xl font-playfair text-white mb-8 leading-tight"
                    >
                        Eternal Brilliance
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-gray-300 text-base lg:text-lg font-light mb-12 leading-relaxed"
                    >
                        Each gemstone carries within it the light of a thousand years. We simply give it a home worthy of its brilliance.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                    >
                        <Link to="/products">
                            <Button size="lg" className="px-12 py-4 text-sm tracking-[0.15em]">Discover the Collection</Button>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════
                SECTION 4 — SHOP BY CATEGORY (Enhanced)
            ═══════════════════════════════════════════════════════════════ */}
            <section className="bg-white py-16 lg:py-24">
                <div className="container-luxury">
                    <SectionHeader
                        eyebrow="Collections"
                        title="Shop by Category"
                        subtitle="Explore our curated world of fine jewellery, each category a universe of its own."
                    />
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-60px' }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
                    >
                        {categories.slice(0, 3).map((category) => (
                            <motion.div key={category._id} variants={staggerItem}>
                                <CategoryCard category={category} />
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════
                SECTION 5 — FEATURED COLLECTIONS (Editorial 3-Col Grid)
            ═══════════════════════════════════════════════════════════════ */}
            <section className="bg-luxury-marble py-16 lg:py-24">
                <div className="container-luxury">
                    <SectionHeader
                        eyebrow="Editorial"
                        title="Featured Collections"
                        subtitle="Handpicked narratives in gold and gemstone, each collection a chapter in our story."
                    />
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-60px' }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
                    >
                        {featuredCollections.map((col, idx) => (
                            <motion.div key={idx} variants={staggerItem}>
                                <Link to={`/products${col.filter}`} className="group block relative aspect-[3/4] rounded-3xl overflow-hidden">
                                    <img
                                        src={col.image}
                                        alt={col.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-luxury-indigo/80 via-luxury-indigo/20 to-transparent" />
                                    <div className="absolute bottom-0 left-0 right-0 p-8">
                                        <span className="text-luxury-gold text-[10px] uppercase tracking-[0.4em] font-bold block mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                            {col.subtitle}
                                        </span>
                                        <h3 className="font-playfair text-2xl lg:text-3xl text-white mb-2">{col.title}</h3>
                                        <p className="text-gray-300 text-sm font-light opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-2 group-hover:translate-y-0">{col.description}</p>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════
                SECTION 6 — EXQUISITE ARRIVALS (Featured Products)
            ═══════════════════════════════════════════════════════════════ */}
            <section className="bg-white py-16 lg:py-24 border-t border-luxury-gold/5">
                <div className="container-luxury">
                    <SectionHeader
                        eyebrow="New Arrivals"
                        title="Exquisite Arrivals"
                        subtitle="Discover our latest masterworks, freshly emerged from the vault."
                    />

                    {products && products.length > 0 ? (
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-60px' }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
                        >
                            {products.map((product) => (
                                <motion.div key={product._id} variants={staggerItem}>
                                    <ProductCard product={product} />
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <div className="py-20 text-center">
                            <p className="text-gray-400 font-playfair italic">New treasures are being curated...</p>
                        </div>
                    )}
                </div>
            </section>


            {/* ═══════════════════════════════════════════════════════════════
                SECTION 7 — VIDEO STORY ENGINE (Cinematic)
            ═══════════════════════════════════════════════════════════════ */}
            <VideoStoryEngine />


            {/* ═══════════════════════════════════════════════════════════════
                SECTION 8 — TESTIMONIALS (Luxury Carousel)
            ═══════════════════════════════════════════════════════════════ */}
            <section className="bg-luxury-ivory py-16 lg:py-24 overflow-hidden">
                <div className="container-luxury">
                    <SectionHeader
                        eyebrow="Client Stories"
                        title="Words of Adoration"
                        subtitle="The most meaningful measure of our craft is the joy it brings."
                    />

                    <div className="relative max-w-3xl mx-auto">
                        {/* Gold Quote Mark */}
                        <div className="text-luxury-gold text-8xl font-playfair leading-none text-center mb-6 opacity-20 select-none">"</div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTestimonial}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5, ease: 'easeInOut' }}
                                className="text-center"
                            >
                                {/* Stars */}
                                <div className="flex justify-center gap-1 mb-8">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} className="w-4 h-4 text-luxury-gold fill-luxury-gold" viewBox="0 0 24 24">
                                            <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                        </svg>
                                    ))}
                                </div>

                                <p className="text-xl lg:text-2xl font-playfair text-luxury-charcoal leading-relaxed mb-10 italic">
                                    "{testimonials[activeTestimonial].review}"
                                </p>

                                <div className="flex items-center justify-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-luxury-gold/10 border border-luxury-gold/20 flex items-center justify-center">
                                        <span className="text-[11px] font-bold text-luxury-gold">{testimonials[activeTestimonial].initials}</span>
                                    </div>
                                    <div className="text-left">
                                        <p className="font-semibold text-luxury-charcoal text-sm">{testimonials[activeTestimonial].name}</p>
                                        <p className="text-[11px] text-gray-400 uppercase tracking-widest">{testimonials[activeTestimonial].location}</p>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Dot Navigation */}
                        <div className="flex justify-center gap-2 mt-12">
                            {testimonials.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveTestimonial(idx)}
                                    className={`transition-all duration-300 rounded-full ${idx === activeTestimonial ? 'w-8 h-2 bg-luxury-gold' : 'w-2 h-2 bg-luxury-gold/20 hover:bg-luxury-gold/50'}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════
                SECTION 9 — LIMITED EDITION VAULT (Dark Exclusivity Block)
            ═══════════════════════════════════════════════════════════════ */}
            <section ref={vaultRef} className="relative h-screen flex items-center justify-center overflow-hidden">
                <motion.div style={{ y: vaultY }} className="absolute inset-0 scale-110">
                    <img
                        src={cld('luxegems/homepage/vault-background')}
                        alt="Limited Edition Vault"
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-luxury-indigo/90 via-luxury-indigo/80 to-black/90" />
                </motion.div>

                <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        <motion.span variants={staggerItem} className="text-luxury-gold text-[11px] uppercase tracking-[0.5em] font-bold block mb-6">
                            Exclusive Access
                        </motion.span>
                        <motion.h2 variants={staggerItem} className="text-4xl lg:text-6xl font-playfair text-white mb-6 leading-tight">
                            Limited Edition Vault
                        </motion.h2>
                        <motion.div variants={staggerItem} className="w-12 h-[1px] bg-luxury-gold mx-auto mb-8" />
                        <motion.p variants={staggerItem} className="text-gray-300 text-base lg:text-lg font-light mb-12 leading-relaxed">
                            Curated pieces available for a limited time only. Each creation is numbered, certified, and destined for a singular collector.
                        </motion.p>
                        <motion.div variants={staggerItem}>
                            <Link to="/products">
                                <Button size="lg" className="px-12 py-4 text-sm tracking-[0.15em]">Explore the Vault</Button>
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════
                 1️⃣ THE LUXE PROMISE (Trust Foundation Block)
            ═══════════════════════════════════════════════════════════════ */}
            <section className="bg-luxury-ivory py-16 lg:py-24 border-b border-luxury-gold/5">
                <div className="container-luxury text-center">
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="max-w-3xl mx-auto mb-12"
                    >
                        <motion.span variants={staggerItem} className="text-luxury-gold text-[11px] uppercase tracking-[0.4em] font-bold block mb-6">
                            The Luxe Promise
                        </motion.span>
                        <motion.h2 variants={staggerItem} className="text-4xl lg:text-5xl font-playfair text-luxury-charcoal mb-6 leading-tight">
                            Crafted With Integrity.<br />Delivered With Trust.
                        </motion.h2>
                        <motion.p variants={staggerItem} className="text-gray-500 text-base lg:text-lg font-light max-w-2xl mx-auto leading-relaxed">
                            Every LuxeGems creation is hallmarked, ethically sourced, and crafted to endure generations.
                        </motion.p>
                        <motion.div variants={staggerItem} className="w-12 h-[1px] bg-luxury-gold mx-auto mt-8" />
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {luxePromiseDocs.map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: idx * 0.1 }}
                                className="p-8 rounded-2xl bg-white border border-luxury-gold/5 hover:border-luxury-gold/20 hover:shadow-[0_15px_40px_rgba(198,161,74,0.05)] transition-all duration-500 group"
                            >
                                <div className="w-12 h-12 rounded-full bg-luxury-gold/5 flex items-center justify-center mx-auto mb-6 text-luxury-gold group-hover:bg-luxury-gold/10 transition-colors duration-500">
                                    {item.icon}
                                </div>
                                <h3 className="font-playfair text-lg text-luxury-charcoal mb-2">{item.title}</h3>
                                <p className="text-gray-400 text-xs uppercase tracking-widest">{item.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════
                 2️⃣ HERITAGE TIMELINE (Luxury Brand Depth)
            ═══════════════════════════════════════════════════════════════ */}
            <section className="bg-white py-16 lg:py-24 overflow-hidden">
                <div className="container-luxury text-center">
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="mb-12"
                    >
                        <motion.span variants={staggerItem} className="text-luxury-gold text-[11px] uppercase tracking-[0.4em] font-bold block mb-4">
                            Our Heritage
                        </motion.span>
                        <motion.h2 variants={staggerItem} className="text-4xl lg:text-5xl font-playfair text-luxury-charcoal mb-4">
                            A Legacy Carved In Gold
                        </motion.h2>
                    </motion.div>

                    {/* Desktop Timeline */}
                    <div className="hidden lg:block relative mt-32">
                        <div className="absolute top-0 left-0 right-0 h-[1px] bg-luxury-gold/20" />
                        <div className="grid grid-cols-4 gap-12">
                            {heritageMilestones.map((milestone, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, delay: idx * 0.2 }}
                                    className="relative pt-12 text-left"
                                >
                                    <div className="absolute -top-[5px] left-0 w-2.5 h-2.5 rounded-full bg-luxury-gold shadow-[0_0_10px_rgba(212,175,55,0.4)]" />
                                    <span className="font-playfair text-3xl text-luxury-gold mb-4 block">{milestone.year}</span>
                                    <h3 className="font-bold text-luxury-charcoal text-base mb-2 uppercase tracking-wider">{milestone.title}</h3>
                                    <p className="text-gray-500 text-sm font-light leading-relaxed">{milestone.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Mobile Timeline */}
                    <div className="lg:hidden relative space-y-16 pl-8 text-left border-l border-luxury-gold/20 ml-4 mt-12">
                        {heritageMilestones.map((milestone, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="relative"
                            >
                                <div className="absolute top-2 -left-[37px] w-4 h-4 rounded-full bg-luxury-gold border-4 border-white" />
                                <span className="font-playfair text-3xl text-luxury-gold mb-2 block">{milestone.year}</span>
                                <h3 className="font-bold text-luxury-charcoal text-base mb-1 uppercase tracking-wider">{milestone.title}</h3>
                                <p className="text-gray-500 text-sm font-light leading-relaxed">{milestone.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
            {/* ═══════════════════════════════════════════════════════════════
                 3️⃣ BEHIND THE CRAFT (Editorial Split Section)
            ═══════════════════════════════════════════════════════════════ */}
            <section className="bg-luxury-marble py-16 lg:py-32 overflow-hidden">
                <div className="container-luxury">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.9, ease: 'easeOut' }}
                            className="max-w-xl"
                        >
                            <span className="text-luxury-gold text-[11px] uppercase tracking-[0.4em] font-bold block mb-6">Mastery</span>
                            <h2 className="text-4xl lg:text-6xl font-playfair text-luxury-charcoal mb-8 leading-tight">
                                Where Artistry<br />Meets Precision
                            </h2>
                            <div className="w-10 h-[1px] bg-luxury-gold mb-10" />
                            <div className="space-y-6 text-gray-600 font-light leading-relaxed text-lg">
                                <p>
                                    Every LuxeGems creation begins with a single sketch and a soul. Our master artisans, keepers of ancient secrets, bring decades of expertise to the bench.
                                </p>
                                <p>
                                    From the meticulous hand-selection of ethically sourced stones to the final rhythmic polish, we embrace the slow art of perfection.
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className="relative aspect-[4/5] rounded-[40px] overflow-hidden group shadow-2xl"
                        >
                            <img
                                src={cld('luxegems/homepage/craftsmanship-cinematic')}
                                alt="Master Artisan at Work"
                                className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-luxury-indigo/30 to-transparent" />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════
                 4️⃣ PRIVATE VAULT + NEWSLETTER (Unified Section)
            ═══════════════════════════════════════════════════════════════ */}
            <section className="relative py-16 lg:py-24 overflow-hidden bg-luxury-indigo text-white mt-[-1px]">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.1)_0%,transparent_70%)]" />
                </div>

                <div className="relative z-10 container-luxury text-center">
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="max-w-2xl mx-auto"
                    >
                        <motion.span variants={staggerItem} className="text-luxury-gold text-[11px] uppercase tracking-[0.5em] font-bold block mb-4">
                            Exclusive Access
                        </motion.span>
                        <motion.h2 variants={staggerItem} className="text-5xl lg:text-7xl font-playfair text-white mb-4 leading-tight">
                            The Private Vault
                        </motion.h2>
                        <motion.p variants={staggerItem} className="text-gray-400 text-lg font-light mb-8 leading-relaxed">
                            By invitation only. Rare masterpieces reserved for discerning collectors who seek the truly singular.
                        </motion.p>

                        <motion.div variants={staggerItem} className="w-12 h-[1px] bg-luxury-gold mx-auto mb-8" />

                        <motion.h3 variants={staggerItem} className="text-3xl lg:text-4xl font-playfair text-white mb-3 leading-tight">
                            Join the Luxe Circle
                        </motion.h3>
                        <motion.p variants={staggerItem} className="text-gray-400 text-base font-light mb-8 leading-relaxed">
                            Be the first to discover rare masterpieces, exclusive previews, and private events curated for our most discerning collectors.
                        </motion.p>

                        <motion.div variants={staggerItem}>
                            {newsletterSubmitted ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="py-6"
                                >
                                    <div className="w-12 h-12 rounded-full bg-luxury-gold/10 border border-luxury-gold/30 flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-5 h-5 text-luxury-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <p className="text-luxury-gold font-playfair text-xl">Welcome to the Circle</p>
                                    <p className="text-gray-500 text-sm mt-2">You will be among the first to know.</p>
                                </motion.div>
                            ) : (
                                <form
                                    onSubmit={(e) => { e.preventDefault(); if (email) setNewsletterSubmitted(true); }}
                                    className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
                                >
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Your email address"
                                        required
                                        className="flex-1 px-6 py-4 rounded-full bg-white/5 border border-luxury-gold/20 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold/30 transition-all duration-300"
                                    />
                                    <button
                                        type="submit"
                                        className="px-8 py-4 bg-luxury-gold text-white text-[11px] uppercase tracking-[0.2em] font-bold rounded-full hover:bg-luxury-gold-dark transition-all duration-300 whitespace-nowrap"
                                    >
                                        Join
                                    </button>
                                </form>
                            )}
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════
                 5️⃣ CLIENT SHOWCASE GALLERY (Premium Social Proof)
            ═══════════════════════════════════════════════════════════════ */}
            <section className="bg-luxury-ivory py-16 lg:py-24">
                <div className="container-luxury">
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <motion.span variants={staggerItem} className="text-luxury-gold text-[11px] uppercase tracking-[0.4em] font-bold block mb-6">
                            In Their Moments
                        </motion.span>
                        <motion.h2 variants={staggerItem} className="text-4xl lg:text-5xl font-playfair text-luxury-charcoal mb-6 leading-tight">
                            Adorned By Those Who Inspire
                        </motion.h2>
                        <div className="w-12 h-[1px] bg-luxury-gold mx-auto" />
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6"
                    >
                        {[1, 2, 3, 4, 5, 6].map((idx) => (
                            <motion.div key={idx} variants={staggerItem}>
                                <div className="group relative aspect-[4/5] rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-700">
                                    <img
                                        src={cld(`luxegems/homepage/lifestyle-${idx}`)}
                                        alt={`Lifestyle Moment ${idx}`}
                                        className="w-full h-full object-cover transition-transform duration-[1500ms] group-hover:scale-110"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-luxury-indigo/0 group-hover:bg-luxury-indigo/60 transition-all duration-700 flex items-center justify-center">
                                        <div className="text-white text-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                                            <svg className="w-8 h-8 mx-auto mb-3 text-luxury-gold" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                            </svg>
                                            <span className="text-luxury-gold text-[10px] uppercase tracking-[0.3em] font-bold">View In Store</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════
                FLOATING BACK TO TOP BUTTON
            ═══════════════════════════════════════════════════════════════ */}
            <AnimatePresence>
                {showBackToTop && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                        onClick={scrollToTop}
                        className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-luxury-gold text-white flex items-center justify-center shadow-[0_8px_30px_rgba(212,175,55,0.4)] hover:bg-luxury-gold-dark hover:shadow-[0_12px_40px_rgba(212,175,55,0.5)] transition-all duration-300"
                        aria-label="Back to top"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                        </svg>
                    </motion.button>
                )}
            </AnimatePresence>

        </div >
    );
};

export default Home;
