'use client';

import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';

const stats = [
    { number: 24, label: 'TOTAL MASALAS' },
    { number: 16, label: 'ON SALE' },
    { number: 8, label: 'COMING SOON' },
    { number: 10, label: 'CITY' },
];

export default function StatsSection() {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });

    return (
        <section ref={ref} className="py-12 md:py-20 bg-[#FAF8F5] border-y border-[#E8E3DD]" id="stats-section">
            <div className="max-w-5xl mx-auto px-4 md:px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0">
                    {stats.map((stat, i) => (
                        <div
                            key={i}
                            className={`relative flex flex-col items-center justify-center py-6 md:py-8 ${
                                i < stats.length - 1 ? 'md:border-r md:border-[#E8E3DD]' : ''
                            }`}
                        >
                            {/* Giant faded number */}
                            <span
                                className="absolute text-[120px] md:text-[160px] font-bold leading-none select-none pointer-events-none"
                                style={{
                                    color: '#E74C3C',
                                    opacity: 0.12,
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    fontFamily: "'Inter', sans-serif",
                                }}
                            >
                                {stat.number}
                            </span>

                            {/* Actual stat */}
                            <div className="relative z-10 text-center">
                                <div className="text-[36px] md:text-[48px] font-bold text-[#2A2626] leading-none mb-2"
                                    style={{ fontFamily: "'Inter', sans-serif" }}>
                                    {inView ? (
                                        <CountUp end={stat.number} duration={2} />
                                    ) : (
                                        '0'
                                    )}
                                </div>
                                <span className="text-[13px] md:text-[16px] font-bold uppercase tracking-wider text-[#2A2626]"
                                    style={{ fontFamily: "'Inter', sans-serif" }}>
                                    {stat.label}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
