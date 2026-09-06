export enum ProcessingStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export interface Competency {
  id: string; // e.g., "1.1"
  name: string; // e.g., "Duyệt, tìm kiếm và lọc dữ liệu"
  domain: string; // e.g., "Khai thác dữ liệu và thông tin"
}

export interface Enhancement {
  section: string; // e.g., "Hoạt động 1"
  originalText: string;
  enhancedActivity: string; // The new suggested activity
  competencyCodes: string[]; // e.g., ["1.1", "3.2"]
  explanation: string; // Why this enhances the lesson
  tools: string[]; // Suggested tools, e.g., "Google Forms", "PhET"
}

export interface LessonPlanResponse {
  overview: string; // General comment on the lesson plan
  fullPlanContent: string; // The complete lesson plan text with integrations, preserving original format
  enhancements?: Enhancement[];
  lessonTitle: string;
  lessonDuration: string;
}

export interface DomainColor {
  bg: string;
  text: string;
  border: string;
}

export interface MediaInput {
  name: string; // Added for UI display
  mimeType: string;
  data: string; // Base64 encoded string
}