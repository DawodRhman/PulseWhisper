import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { pipeline } from '@xenova/transformers';

// Config
const DATASET_PATH = path.join(process.cwd(), 'data', 'kwsc_chatbot_dataset_final.json');
const SIM_THRESHOLD = 0.55;

// Singleton for model and data
// We attach to global to prevent reloading in development (HMR)
let globalModel = global.chatbotModel;
let globalDataset = global.chatbotDataset;
let globalExamples = global.chatbotExamples;
let globalEmbeddings = global.chatbotEmbeddings;
let globalExampleToIntent = global.chatbotExampleToIntent;

if (!globalModel) {
    globalModel = null;
    globalDataset = [];
    globalExamples = [];
    globalEmbeddings = [];
    globalExampleToIntent = [];
}

// Helpers
function detectLanguage(text) {
    if (/[\u0600-\u06FF]/.test(text)) {
        return 'ur';
    }
    if (/\b(ka|ki|ke|hai|nahi|pani|bill|complaint|tanker)\b/i.test(text)) {
        return 'roman';
    }
    return 'en';
}

function dotProduct(a, b) {
    let sum = 0;
    for (let i = 0; i < a.length; i++) {
        sum += a[i] * b[i];
    }
    return sum;
}

// Initialization function
async function initialize() {
    if (globalModel) return;

    try {
        console.log('Loading chatbot dataset...');
        // Ensure dataset exists
        try {
            await fs.access(DATASET_PATH);
        } catch {
            console.error(`Dataset not found at ${DATASET_PATH}`);
            return;
        }

        const data = await fs.readFile(DATASET_PATH, 'utf-8');
        globalDataset = JSON.parse(data);

        console.log('Loading chatbot model...');
        // Using the quantized version by default which is much faster/smaller
        // We use 'feature-extraction' pipeline
        globalModel = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');

        console.log('Encoding examples...');
        globalExamples = [];
        globalExampleToIntent = [];

        for (const item of globalDataset) {
            if (item.examples && Array.isArray(item.examples)) {
                for (const ex of item.examples) {
                    globalExamples.push(ex);
                    globalExampleToIntent.push(item);
                }
            }
        }

        if (globalExamples.length > 0) {
            const output = await globalModel(globalExamples, { pooling: 'mean', normalize: true });
            const embeddingDim = output.dims[1];

            globalEmbeddings = [];
            for (let i = 0; i < globalExamples.length; i++) {
                const start = i * embeddingDim;
                const end = start + embeddingDim;
                globalEmbeddings.push(output.data.subarray(start, end));
            }
        }

        // Save to global for HMR
        global.chatbotModel = globalModel;
        global.chatbotDataset = globalDataset;
        global.chatbotExamples = globalExamples;
        global.chatbotEmbeddings = globalEmbeddings;
        global.chatbotExampleToIntent = globalExampleToIntent;

        console.log(`Initialization complete. Loaded ${globalExamples.length} examples.`);
    } catch (error) {
        console.error("Initialization failed:", error);
        throw error;
    }
}

export async function POST(request) {
    try {
        await initialize();

        if (!globalModel) {
            return NextResponse.json(
                { error: 'Chatbot model not initialized' },
                { status: 503 }
            );
        }

        const body = await request.json();
        const { message } = body;

        if (!message) {
            return NextResponse.json(
                { detail: "Message field is required" },
                { status: 422 }
            );
        }

        const userMsg = message.trim();
        const lang = detectLanguage(userMsg);

        // Encode query
        const queryOutput = await globalModel(userMsg, { pooling: 'mean', normalize: true });
        const queryEmb = queryOutput.data;

        // Calculate scores
        let bestIdx = -1;
        let maxScore = -1;

        for (let i = 0; i < globalEmbeddings.length; i++) {
            const score = dotProduct(globalEmbeddings[i], queryEmb);
            if (score > maxScore) {
                maxScore = score;
                bestIdx = i;
            }
        }

        const confidence = maxScore;
        console.log(`Query: "${userMsg}" -> Confidence: ${confidence}`);

        if (confidence < SIM_THRESHOLD) {
            return NextResponse.json({
                intent: 'fallback',
                confidence: confidence,
                response: 'Please visit Contact Us for further assistance.',
                page_route: '/contactus',
                cta_label: 'Contact Support',
                faq_answers: []
            });
        }

        const intentItem = globalExampleToIntent[bestIdx];

        let responseText = intentItem.response_en;
        if (lang === 'ur') {
            responseText = intentItem.response_ur;
        } else if (lang === 'roman') {
            responseText = intentItem.response_roman;
        }

        return NextResponse.json({
            intent: intentItem.intent,
            confidence: confidence,
            response: responseText,
            page_route: intentItem.page_route,
            cta_label: intentItem.cta_label,
            faq_answers: intentItem.faq_answers || []
        });

    } catch (error) {
        console.error('Error processing chat request:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

export async function GET() {
    // Warm up the model
    try {
        if (!globalModel) {
            console.log('Warming up chatbot model...');
            initialize().catch(err => console.error('Warmup failed:', err));
        }
    } catch (e) {
        // Ignore errors during warmup trigger
    }
    return NextResponse.json({ status: 'KWSC Chatbot API is running' });
}
