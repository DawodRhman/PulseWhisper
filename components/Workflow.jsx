'use client';

import React, { useState, useEffect, useRef, useMemo } from "react";
import { CheckCircle, DollarSign, Droplets, Pipette, MapPin } from "lucide-react";

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
        summary:
            "Managing the abstraction of raw water from primary sources (Indus River, Hub Dam), operating massive pumping systems, and treating water to potable standards for the entire metropolitan area.",
        theme: "cyan",
    },
    {
        id: "02",
        title: "Sewerage Infrastructure Management",
        summary:
            "Planning, operating, and maintaining the vast network of sewerage collectors, trunk mains, lifting/pumping stations, and ensuring proper disposal and treatment of wastewater and industrial effluent.",
        theme: "indigo",
    },
    {
        id: "03",
        title: "Distribution & Network Integrity",
        summary:
            "Managing the final distribution network, pipelines, and bulk transfer mains; focusing on reducing Non-Revenue Water (NRW) through leak detection, asset rehabilitation, and minimizing illegal connections.",
        theme: "emerald",
    },
    {
        id: "04",
        title: "Revenue, Customer & Governance",
        summary:
            "Ensuring financial sustainability through accurate metering, billing, and revenue collection along with strong grievance redressal and governance standards.",
        theme: "red",
    },
];

function normalizeSteps(steps) {
    const base = Array.isArray(steps) && steps.length ? steps : FALLBACK_STEPS;
    return base.map((step, index) => {
        const Icon = ICON_SET[index % ICON_SET.length];
        const themeKey = step.theme && THEME_CLASSES[step.theme] ? step.theme : FALLBACK_STEPS[index % FALLBACK_STEPS.length]?.theme || "blue";
        return {
            id: step.id || String(index + 1).padStart(2, "0"),
            title: step.title,
            subTitle: step.summary || step.description || "",
            Icon,
            theme: THEME_CLASSES[themeKey] || THEME_CLASSES.blue,
        };
    });
}

const WorkFlow = ({ steps }) => {
    const processSteps = useMemo(() => normalizeSteps(steps), [steps]);
    const [activeStep, setActiveStep] = useState(processSteps[0].id);
    const stepRefs = useRef([]);
    const observerRef = useRef(null);

    useEffect(() => {
        if (processSteps.length) {
            setActiveStep(processSteps[0].id);
        }
    }, [processSteps]);

        const activeStepData = processSteps.find(step => step.id === activeStep) || processSteps[0];
        const activeTheme = activeStepData.theme || THEME_CLASSES.blue;


    useEffect(() => {
        // Options for the Intersection Observer
        const options = {
            root: null, // viewport
            rootMargin: '0px 0px -50% 0px', // When the step passes the middle of the screen
            threshold: 0,
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // If a step is intersecting (passing the middle), set it as active
                if (entry.isIntersecting) {
                    setActiveStep(entry.target.dataset.stepId);
                }
            });
        }, options);

        observerRef.current = observer;

        // Attach observer to each step's reference element
            stepRefs.current.forEach(ref => {
            if (ref) {
                observer.observe(ref);
            }
        });

        // Cleanup observer on component unmount
        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, []);

    return (
        <section className="py-20 lg:py-32 bg-gray-50 relative overflow-hidden font-sans text-gray-800">
            
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

            <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
                
                {/* Header */}
                <div className="text-center mb-16 lg:mb-24">
                    {/* Light/Corporate Header Chip */}
                    <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-blue-100 border border-blue-300 text-blue-700 text-sm font-mono tracking-widest uppercase mb-4 shadow-sm">
                        <CheckCircle className="w-4 h-4" />
                        <span>KW&SC Core Mandate</span>
                    </div>
                    {/* Darker, high-contrast header text */}
                    <h2 className="text-4xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-gray-900 to-blue-700 drop-shadow-sm tracking-tight">
                        Our <span className="text-blue-700">Commitment</span>
                    </h2>
                    <p className="max-w-3xl mx-auto mt-4 text-lg text-gray-600">
                        The Karachi Water and Sewerage Corporation (KW&SC) is dedicated to managing the complete water cycle, from source abstraction to wastewater disposal, ensuring a sustainable and healthy urban environment.
                    </p>
                </div>
                
                {/* Single Column for Process Steps (Max width for readability) */}
                <div className="max-w-4xl mx-auto">
                    <div className="relative">
                        
                        {/* Vertical Connection Line */}
                        <div className="absolute left-7 top-0 bottom-0 w-1 bg-gray-300 rounded-full">
                            {/* Dynamic Active Line Highlight */}
                            <div 
                                className={`absolute top-0 left-0 w-full rounded-full transition-all duration-1000 ${activeTheme.bg}`}
                                style={{ 
                                    height: `${(processSteps.findIndex(step => step.id === activeStep) + 1) / processSteps.length * 100}%` 
                                }}
                            ></div>
                        </div>

                        {/* Process Step List */}
                        <div className="space-y-12">
                            {processSteps.map((process, index) => {
                                const isActive = process.id === activeStep;
                                
                                return (
                                    <div 
                                        key={process.id} 
                                        ref={el => stepRefs.current[index] = el}
                                        data-step-id={process.id}
                                        className="relative pt-10 pb-10 group min-h-[200px]" 
                                    >
                                        {/* Step Marker/Dot */}
                                        <div className={`absolute -left-1 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 transform ${isActive 
                                            ? `${activeTheme.bg} border-4 border-white/50 scale-110 shadow-xl ${activeTheme.shadow}` 
                                            : 'bg-gray-300 border border-gray-400 group-hover:bg-gray-400'}`}
                                        >
                                            <process.Icon className={`w-8 h-8 transition-colors duration-500 ${isActive ? 'text-white' : 'text-gray-600 group-hover:text-gray-900'}`} /> 
                                        </div>

                                        {/* Content Card */}
                                        <div 
                                            className={`ml-16 p-8 rounded-xl transition-all duration-500 cursor-pointer shadow-lg 
                                                ${isActive 
                                                    ? `bg-white border-2 ${activeTheme.border}/50 shadow-xl ${activeTheme.shadow}/20 scale-[1.01] opacity-100` 
                                                    : 'bg-white border border-gray-200 hover:bg-gray-100 opacity-90 hover:opacity-100'
                                                }`}
                                            onClick={() => {
                                                // Smooth scroll to this item on click
                                                stepRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                            }}
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                {/* Title Text */}
                                                <h4 className={`text-2xl font-bold transition-colors duration-500 ${isActive ? process.theme.text : 'text-gray-900'}`}>{process.title}</h4> 
                                                {/* Number */}
                                                <span className={`text-4xl font-extrabold transition-colors duration-500 ${isActive ? process.theme.text : 'text-gray-400'}`}>{process.id}</span> 
                                            </div>
                                            {/* Subtitle Text */}
                                            <p className={`mt-2 text-base transition-colors duration-500 ${isActive ? 'text-gray-600' : 'text-gray-700'}`}>{process.subTitle}</p> 
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

