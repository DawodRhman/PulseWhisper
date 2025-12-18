
import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import { pipeline } from '@xenova/transformers';
import path from 'path';

// --------------------
// Config
// --------------------
const DATASET_PATH = 'data/kwsc_chatbot_dataset_final.json';
const SIM_THRESHOLD = 0.55;
const PORT = 8000;

// --------------------
// Helpers
// --------------------
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

// --------------------
// App State
// --------------------
let model = null;
let dataset = [];
let exampleEmbeddings = [];
let examples = [];
let exampleToIntent = [];

// --------------------
// Initialization
// --------------------
async function initialize() {
    console.log('Loading dataset...');
    try {
        const data = await fs.readFile(DATASET_PATH, 'utf-8');
        dataset = JSON.parse(data);
    } catch (err) {
        console.error(`Failed to load dataset at ${DATASET_PATH}:`, err);
        process.exit(1);
    }

    console.log('Loading model...');
    // Using the quantized version by default which is much faster/smaller
    model = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');

    console.log('Encoding examples...');
    for (const item of dataset) {
        if (item.examples && Array.isArray(item.examples)) {
            for (const ex of item.examples) {
                examples.push(ex);
                exampleToIntent.push(item);
            }
        }
    }

    if (examples.length > 0) {
        // Compute embeddings in one go (or batches if large)
        // normalize: true ensures we can use dot product for cosine similarity
        const output = await model(examples, { pooling: 'mean', normalize: true });
        
        // Output is a Tensor. shape is [batch_size, embedding_dim]
        // data is a flat Float32Array
        const embeddingDim = output.dims[1];
        
        for(let i = 0; i < examples.length; i++) {
            const start = i * embeddingDim;
            const end = start + embeddingDim;
            // Subarray creates a view, which is efficient
            exampleEmbeddings.push(output.data.subarray(start, end));
        }
    }
    
    console.log(`Initialization complete. Loaded ${examples.length} examples.`);
}

// --------------------
// Express App
// --------------------
const app = express();

app.use(cors({
    origin: ['http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// --------------------
// Routes
// --------------------
app.get('/', (req, res) => {
    res.json({ status: 'KWSC Chatbot API is running' });
});

app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(422).json({
                detail: [{ loc: ["body", "message"], msg: "field required", type: "value_error.missing" }]
            });
        }

        const userMsg = message.trim();
        const lang = detectLanguage(userMsg);

        // Encode query
        // IMPORTANT: Must normalize query as well
        const queryOutput = await model(userMsg, { pooling: 'mean', normalize: true });
        const queryEmb = queryOutput.data;

        // Calculate scores
        let bestIdx = -1;
        let maxScore = -1;

        for (let i = 0; i < exampleEmbeddings.length; i++) {
            const score = dotProduct(exampleEmbeddings[i], queryEmb);
            if (score > maxScore) {
                maxScore = score;
                bestIdx = i;
            }
        }

        const confidence = maxScore;

        if (confidence < SIM_THRESHOLD) {
            return res.json({
                intent: 'fallback',
                confidence: confidence,
                response: 'Please visit Contact Us for further assistance.',
                page_route: '/contactus',
                cta_label: 'Contact Support',
                faq_answers: []
            });
        }

        const intentItem = exampleToIntent[bestIdx];

        let responseText = intentItem.response_en;
        if (lang === 'ur') {
            responseText = intentItem.response_ur;
        } else if (lang === 'roman') {
            responseText = intentItem.response_roman;
        }

        return res.json({
            intent: intentItem.intent,
            confidence: confidence,
            response: responseText,
            page_route: intentItem.page_route,
            cta_label: intentItem.cta_label,
            faq_answers: intentItem.faq_answers || []
        });

    } catch (error) {
        console.error('Error processing chat request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start server
initialize().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
});
