"use server";

import { analyzeResumeFlow } from './flows/analyze-resume';
import { matchResumeToJobDescriptionFlow } from './flows/match-resume-to-job-description';
import { generateCoverLetterFlow } from './flows/generate-cover-letter';
import { generateInterviewQuestionsFlow } from './flows/generate-interview-questions';
import { aiChatAssistantFlow } from './flows/ai-chat-assistant';

export async function analyzeResume(resumeText: string) {
  try {
    const result = await analyzeResumeFlow({ resumeText });
    return { success: true, data: result };
  } catch (error) {
    console.error('Error analyzing resume:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to analyze resume' 
    };
  }
}

export async function matchResumeToJobDescription(resumeText: string, jobDescriptionText: string) {
  try {
    const result = await matchResumeToJobDescriptionFlow({ resumeText, jobDescriptionText });
    return { success: true, data: result };
  } catch (error) {
    console.error('Error matching resume to job description:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to match resume to job description' 
    };
  }
}

export async function generateCoverLetter(resumeText: string, jobDescriptionText: string, applicantName: string) {
  try {
    console.log('[actions] generateCoverLetter called', {
      resumeTextLength: resumeText?.length,
      jobDescriptionTextLength: jobDescriptionText?.length,
      applicantName
    });

    const result = await generateCoverLetterFlow({ resumeText, jobDescriptionText, applicantName });
    return { success: true, data: result };
  } catch (error) {
    console.error('Error generating cover letter:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to generate cover letter' 
    };
  }
}

export async function generateInterviewQuestions(jobDescriptionText: string) {
  try {
    const result = await generateInterviewQuestionsFlow({ jobDescriptionText });
    return { success: true, data: result };
  } catch (error) {
    console.error('Error generating interview questions:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to generate interview questions' 
    };
  }
}

export async function chatWithAssistant(userQuery: string, conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>) {
  try {
    const result = await aiChatAssistantFlow({ userQuery, conversationHistory });
    return { success: true, data: result };
  } catch (error) {
    console.error('Error in chat assistant:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to get response from assistant' 
    };
  }
}