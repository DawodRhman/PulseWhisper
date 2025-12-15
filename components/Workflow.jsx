'use client';

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
    DollarSign,
    Droplets,
    Pipette,
    MapPin
} from "lucide-react";

// --- Process Data using Lucide Icons ---
const ICON_SET = [Droplets, Pipette, MapPin, DollarSign];
const THEME_CLASSES = {
    cyan: { text: "text-cyan-700", bg: "bg-cyan-700", border: "border-cyan-700", shadow: "shadow-cyan-700" },
    indigo: { text: "text-indigo-700", bg: "bg-indigo-700", border: "border-indigo-700", shadow: "shadow-indigo-700" },
    emerald: { text: "text-emerald-700", bg: "bg-emerald-700", border: "border-emerald-700", shadow: "shadow-emerald-700" },
    red: { text: "text-red-700", bg: "bg-red-700", border: "border-red-700", shadow: "shadow-red-700" },
    blue: { text: "text-blue-700", bg: "bg-blue-700", border: "border-blue-700", shadow: "shadow-blue-700" },
};

const FALLBACK_STEPS = [
    {
        id: "01",
        title: "Bulk Water Supply & Treatment",
        subTitle:
            "Managing the abstraction of raw water from primary sources (Indus River, Hub Dam), operating massive pumping systems, and treating water to potable standards for the entire metropolitan area.",
        color: "cyan",
    },
    {
        id: "02",
        title: "Sewerage Infrastructure Management",
        subTitle:
            "Planning, operating, and maintaining the vast network of sewerage collectors, trunk mains, lifting/pumping stations, and ensuring proper disposal and treatment of wastewater and industrial effluent.",
        color: "indigo",
    },
    {
        id: "03",
        title: "Distribution & Network Integrity",
        subTitle:
            "Managing the final distribution network, pipelines, and bulk transfer mains; focusing on reducing Non-Revenue Water (NRW) through leak detection, asset rehabilitation, and minimizing illegal connections.",
        color: "emerald",
    },
    {
        id: "04",
        title: "Revenue, Customer & Governance",
        subTitle:
            "Ensuring financial sustainability through accurate metering, billing, and revenue collection. This role also includes effective customer grievance redressal and upholding institutional governance standards.",
        color: "red",
    },
];

// ... existing backend normalization function ...
function normalizeSteps(steps) {
    const base = Array.isArray(steps) && steps.length ? steps : FALLBACK_STEPS;
    return base.map((step, index) => {
        const Icon = ICON_SET[index % ICON_SET.length];
        const colorKey = step.color && THEME_CLASSES[step.color] ? step.color : FALLBACK_STEPS[index % FALLBACK_STEPS.length]?.color || "blue";
        const theme = THEME_CLASSES[colorKey] || THEME_CLASSES.blue;
        return {
            id: String(index + 1).padStart(2, "0"),
            originalId: step.id,
            title: step.title,
            subTitle: step.subTitle || step.summary || step.description || "",
            icon: Icon,
            color: theme.text,
            theme: theme,
        };
    });
}

const WorkFlow = ({ steps }) => {
    const processSteps = useMemo(() => normalizeSteps(steps), [steps]);
    const [activeStep, setActiveStep] = useState(processSteps[0].id);
    const stepRefs = useRef([]);
    const observerRef = useRef(null);

    // ... existing state reset effect ...
    useEffect(() => {
        if (processSteps.length) {
            setActiveStep(processSteps[0].id);
        }
    }, [processSteps]);

    // Find the currently active step's data
    const activeStepData = processSteps.find(step => step.id === activeStep) || processSteps[0];
    const activeTheme = activeStepData.theme || THEME_CLASSES.blue;

    // ... existing color mapping logic ...
    const activeBgClass = activeTheme.bg;
    const activeBorderClass = activeTheme.border;
    const activeShadowClass = activeTheme.shadow;

    useEffect(() => {
        // Options for the Intersection Observer
        const options = {
            root: null,
            rootMargin: '0px 0px -50% 0px',
            threshold: 0,
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveStep(entry.target.dataset.stepId);
                }
            });
        }, options);

        observerRef.current = observer;

        stepRefs.current.forEach(ref => {
            if (ref) {
                observer.observe(ref);
            }
        });

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, []);

    return (
        <section className="py-8 sm:py-12 md:py-16 lg:py-24 xl:py-32 bg-gray-50 relative overflow-hidden font-sans text-gray-800">

            {/* Background Grid and Glow (Light Theme) */}
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none bg-grid-pattern-light">
                <style jsx global>{`
                    /* Light theme grid pattern using very light gray lines */
                    .bg-grid-pattern-light {
                        background-image: 
                            linear-gradient(to right, rgba(203, 213, 225, 0.4) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(203, 213, 225, 0.4) 1px, transparent 1px);
                        background-size: 60px 60px;
                    }
                `}</style>
            </div>
            {/* Subtle Corporate Blue Glow */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-300/20 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">

                {/* Header */}
                <div className="text-center mb-8 sm:mb-12 md:mb-16 lg:mb-20 xl:mb-24">
                    {/* Darker, high-contrast header text */}
                    <h2 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-gray-900 to-blue-700 drop-shadow-sm">
                        Our <span className="text-blue-700">Commitment</span>
                    </h2>
                    <p className="max-w-2xl sm:max-w-3xl mx-auto mt-3 sm:mt-4 md:mt-5 text-sm sm:text-base md:text-lg text-gray-600">
                        The Karachi Water and Sewerage Corporation (KW&SC) is dedicated to managing the complete water cycle, from source abstraction to wastewater disposal, ensuring a sustainable and healthy urban environment.
                    </p>
                </div>

                {/* Single Column for Process Steps (Max width for readability) */}
                <div className="max-w-4xl mx-auto">
                    <div className="relative">

                        {/* Vertical Connection Line */}
                        <div className="absolute left-6 sm:left-6.5 md:left-7 lg:left-8 top-0 bottom-0 w-0.5 sm:w-1 md:w-1 lg:w-1.5 bg-gray-300 rounded-full">
                            {/* Dynamic Active Line Highlight */}
                            <div
                                className={`absolute top-0 left-0 w-full rounded-full transition-all duration-1000 ${activeBgClass}`}
                                style={{
                                    height: `${(processSteps.findIndex(step => step.id === activeStep) + 1) / processSteps.length * 100}%`
                                }}
                            ></div>
                        </div>

                        {/* Process Step List */}
                        <div className="space-y-8 sm:space-y-10 md:space-y-12 lg:space-y-14 xl:space-y-16">
                            {processSteps.map((process, index) => {
                                const isActive = process.id === activeStep;

                                return (
                                    <div
                                        key={process.id}
                                        ref={el => stepRefs.current[index] = el}
                                        data-step-id={process.id}
                                        className="relative pt-8 sm:pt-10 md:pt-12 pb-8 sm:pb-10 md:pb-12 group min-h-[160px] sm:min-h-[180px] md:min-h-[200px]"
                                    >
                                        {/* Step Marker/Dot */}
                                        <div className={`absolute -left-0.5 sm:-left-0.5 md:-left-1 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all duration-500 transform ${isActive
                                            ? activeBgClass + ' border-4 border-white/50 scale-110 shadow-xl ' + activeShadowClass
                                            : 'bg-gray-300 border border-gray-400 group-hover:bg-gray-400'}`}
                                        >
                                            <process.icon className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 transition-colors duration-500 ${isActive ? 'text-white' : 'text-gray-600 group-hover:text-gray-900'}`} />
                                        </div>

                                        {/* Content Card */}
                                        <div
                                            className={`ml-12 sm:ml-14 md:ml-16 lg:ml-20 p-3 sm:p-4 md:p-6 lg:p-8 rounded-lg sm:rounded-xl transition-all duration-500 cursor-pointer shadow-lg 
                                                ${isActive
                                                    ? `bg-white border-2 ${activeBorderClass}/50 shadow-xl ${activeShadowClass}/20 scale-[1.01] opacity-100`
                                                    : 'bg-white border border-gray-200 hover:bg-gray-100 opacity-90 hover:opacity-100'
                                                }`}
                                            onClick={() => {
                                                stepRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                            }}
                                        >
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4 mb-2 sm:mb-3">
                                                {/* Title Text */}
                                                <h4 className={`text-xl font-bold transition-colors duration-500 ${isActive ? process.color : 'text-gray-900'}`}>{process.title}</h4>
                                                {/* Number */}
                                                <span className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold transition-colors duration-500 flex-shrink-0 ${isActive ? process.color : 'text-gray-400'}`}>{process.id}</span>
                                            </div>
                                            {/* Subtitle Text */}
                                            <p className={`mt-1.5 sm:mt-2 md:mt-3 text-xs sm:text-sm md:text-base lg:text-lg transition-colors duration-500 leading-relaxed ${isActive ? 'text-gray-600' : 'text-gray-700'}`}>{process.subTitle}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WorkFlow;

