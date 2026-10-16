
const express = require("express");
const { GoogleGenAI } = require("@google/genai");
const Question = require('../models/questionModel');
const mongoose = require('mongoose')
const router = express.Router();

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

router.post("/generate", async (req, res) => {
    try {
        const { prompt, categoryId } = req.body;

        if (typeof prompt !== "string" || !prompt.trim()) {
            return res.status(400).json({
                message: "Prompt is required"
            });
        }

        const response = await ai.models.generateContent({
            model: "gemini-3.7-flash",
            contents: prompt.trim()
        });

        let rawText = response.text || "";
        rawText = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
        const answer = JSON.parse(rawText);

        const targetCategory = categoryId && mongoose.isValidObjectId(categoryId)
            ? new mongoose.Types.ObjectId(categoryId)
            : new mongoose.Types.ObjectId("6acfdd5335ddc9ba028c0cd6");

        const createdQuestions = [];
        for (let i of (answer.mcqs || [])) {
            const doc = await Question.create({
                ...i, 
                category: targetCategory
            });
            createdQuestions.push(doc);
        }

        return res.status(200).json({
            success: true,
            answer,
            data: createdQuestions
        });
    } catch (error) {
        console.error("Gemini API error:", error.message);

        return res.status(500).json({
            success: false,
            message: "AI generation failed"
        });
    }
});

module.exports = router;
