
import { GoogleGenAI, Type } from "@google/genai";
import { PromoSegment } from '../types';

const FRAME_SAMPLE_COUNT = 40; // Max number of frames to send to Gemini

const extractFrames = (videoElement: HTMLVideoElement, frameCount: number): Promise<string[]> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const frames: string[] = [];
    const duration = videoElement.duration;

    if (!context || duration === 0) {
      resolve([]);
      return;
    }

    const interval = duration / (frameCount + 1);
    let currentTime = interval;
    let framesCaptured = 0;

    const captureFrame = () => {
      if (framesCaptured >= frameCount) {
        videoElement.removeEventListener('seeked', onSeeked);
        resolve(frames);
        return;
      }
      
      videoElement.currentTime = currentTime;
    };

    const onSeeked = () => {
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
      
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      const base64Data = dataUrl.split(',')[1];
      frames.push(base64Data);

      framesCaptured++;
      currentTime += interval;
      captureFrame();
    };

    videoElement.addEventListener('seeked', onSeeked);
    captureFrame();
  });
};


export const generatePromoScript = async (
  videoElement: HTMLVideoElement,
  targetDuration: number,
  addEffects: boolean,
  sceneSnap: boolean
): Promise<PromoSegment[]> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set.");
  }
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const frames = await extractFrames(videoElement, FRAME_SAMPLE_COUNT);
  if (frames.length === 0) {
    throw new Error("Could not extract frames from the video. Please check the video file.");
  }

  const imageParts = frames.map(frame => ({
    inlineData: {
      mimeType: 'image/jpeg',
      data: frame,
    },
  }));

  let effectsInstruction = addEffects
    ? "For each clip, also suggest simple effects like 'slight speed ramp (1.1x)', 'crossfade transition in/out', or 'dramatic zoom in'."
    : "Do not suggest any visual effects.";

  let sceneSnapInstruction = sceneSnap
    ? "The clips should align with natural scene changes in the video. The start and end times should correspond to cuts or significant changes in the visual narrative."
    : "";
  
  const prompt = `
    You are an expert video editor tasked with creating a short promotional video.
    Analyze the following sequence of frames, which are sampled evenly from a video with a total duration of ${Math.round(videoElement.duration)} seconds.
    Your goal is to create a promo video that is approximately ${targetDuration} seconds long.
    
    Instructions:
    1. Identify the most visually engaging, high-action, or emotionally significant moments.
    2. Select a series of clips that, when combined, create a compelling narrative for the promo.
    3. The total duration of all selected clips should be close to the target of ${targetDuration} seconds.
    4. ${sceneSnapInstruction}
    5. ${effectsInstruction}
    
    Provide your output as a JSON array of objects. Each object must represent a recommended clip and have the specified structure. Do not include any text outside of the JSON array.
  `;

  const contents = [
    { text: prompt },
    ...imageParts
  ];

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: { parts: contents },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            start_time: {
              type: Type.NUMBER,
              description: 'The start time of the clip in seconds.',
            },
            end_time: {
              type: Type.NUMBER,
              description: 'The end time of the clip in seconds.',
            },
            description: {
              type: Type.STRING,
              description: 'A brief, exciting description of the action in this clip.',
            },
            suggested_effects: {
              type: Type.STRING,
              description: 'Suggested visual effects for the clip (e.g., "crossfade in, speed up 1.1x"). Can be "none".',
            },
          },
          required: ["start_time", "end_time", "description", "suggested_effects"],
        },
      },
    }
  });

  try {
    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText) as PromoSegment[];
    return result;
  } catch (e) {
    console.error("Failed to parse Gemini response as JSON:", response.text);
    throw new Error("The AI returned an invalid response. Please try again.");
  }
};
