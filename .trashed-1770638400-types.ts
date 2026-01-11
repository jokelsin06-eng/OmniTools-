
import React from 'react';

export enum ToolCategory {
  TEXT = 'Text Tools',
  CALCULATOR = 'Calculators',
  DEVELOPER = 'Dev Tools',
  IMAGE = 'Image Tools',
  SEO = 'Web & SEO',
  FILE = 'File Tools',
  AI = 'AI & Productivity',
  SOCIAL = 'Social & Media',
  PDF = 'PDF Tools',
  AUDIO = 'Audio Tools',
  VIDEO = 'Video Tools',
  EDUCATION = 'Educational Tools',
  DATA = 'Data & Analytics',
  GAMING = 'Gaming & Fun',
  REAL_ESTATE = 'Real Estate',
  HEALTH = 'Health & Fitness',
  ECOMMERCE = 'E-commerce',
  TRAVEL = 'Travel & Transport',
  SECURITY = 'Security & Privacy'
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  subCategory?: string;
  icon: string;
  component: React.FC;
}

export interface CategoryGroup {
  category: ToolCategory;
  tools: Tool[];
}
