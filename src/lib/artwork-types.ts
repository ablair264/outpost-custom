// Artwork Upload Wizard Type Definitions

export interface ArtworkAnalysis {
  qualityScore: number;
  qualityTier: 'good' | 'borderline' | 'severe';
  dpiAtPrint: number;
  requiredDpi: number;
  width: number;
  height: number;
  colorMode: 'rgb' | 'cmyk' | 'grayscale' | 'unknown';
  fileFormat: string;
  fileSizeBytes: number;
  issues: AnalysisIssue[];
}

export interface AnalysisIssue {
  type: 'resolution' | 'dimensions' | 'color' | 'format';
  severity: 'warning' | 'error';
  message: string;
  recommendation: string;
}

export interface ApprovedArtwork {
  fileUrl: string;
  fileName: string;
  version: 'original' | 'enhanced';
  qualityScore: number;
  analysis: ArtworkAnalysis;
}

export interface PrintDimensions {
  width: number;  // mm
  height: number; // mm
}

export type WizardStep =
  | 'upload'
  | 'analyzing'
  | 'results'
  | 'enhancing'
  | 'enhanced-preview'
  | 'success';

export type ImportSource = 'upload' | 'canva' | 'google_drive' | 'dropbox';

export interface WizardState {
  step: WizardStep;
  originalFile: File | null;
  originalPreviewUrl: string | null;
  analysis: ArtworkAnalysis | null;
  enhancedUrl: string | null;
  enhancedAnalysis: ArtworkAnalysis | null;
  selectedVersion: 'original' | 'enhanced';
  importSource: ImportSource;
  error: string | null;
}

export interface ArtworkSubmission {
  id: string;
  productSlug: string;
  printWidthMm: number;
  printHeightMm: number;
  originalUrl: string;
  originalFilename: string;
  originalWidth: number;
  originalHeight: number;
  originalDpiAtPrint: number;
  originalQualityScore: number;
  originalColorMode: string;
  originalFileFormat: string;
  originalFileSizeBytes: number;
  qualityTier: 'good' | 'borderline' | 'severe';
  issues: AnalysisIssue[];
  enhancedUrl?: string;
  enhancedQualityScore?: number;
  finalVersion: 'original' | 'enhanced';
  userAcceptedWarning: boolean;
  helpRequested: boolean;
  helpRequestNote?: string;
  helpRequestMethod?: string;
  source: ImportSource;
  createdAt: string;
  updatedAt: string;
}
