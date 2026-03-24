import { Request, Response, NextFunction } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { AppError } from "../../utils/AppError";

export const postMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("BODY:", req.body); // 👈 ADD THIS
    const { message, history } = req.body;

    if (!message) {
      throw new AppError("Message is required", 400);
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new AppError("Backend not configured: GEMINI_API_KEY is missing from environment variables.", 500);
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: "You are BroKod, a helpful coding and learning assistant for a Learning Management System."
    });

    const formattedHistory = Array.isArray(history)
      ? history.map((msg: any) => ({
        role: msg.role === 'ai' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }))
      : [];

    const chat = model.startChat({
      history: formattedHistory,
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    });

    const result = await chat.sendMessage(message);
    const responseText = result.response.text();

    res.status(200).json({
      success: true,
      data: { content: responseText }
    });
  } catch (error) {
    next(error);
  }
};
