// Client-side artwork analysis utilities

import type { ArtworkAnalysis, AnalysisIssue, PrintDimensions } from './artwork-types';
import { QUALITY_THRESHOLDS, ISSUE_MESSAGES } from './artwork-constants';

/**
 * Analyze an image file client-side
 * This provides instant feedback before server-side analysis
 */
export async function analyzeImageFile(
  file: File,
  printDimensions: PrintDimensions
): Promise<ArtworkAnalysis> {
  return new Promise((resolve, reject) => {
    // Handle non-image files (PDF, AI, EPS)
    const isRasterImage = file.type.startsWith('image/') && !file.type.includes('svg');

    if (!isRasterImage) {
      // For vector/PDF files, we can't analyze client-side
      // Return a pending analysis that needs server verification
      resolve({
        qualityScore: 85, // Assume good for vectors
        qualityTier: 'good',
        dpiAtPrint: 300, // Vectors are resolution-independent
        requiredDpi: QUALITY_THRESHOLDS.RECOMMENDED_DPI,
        width: 0,
        height: 0,
        colorMode: 'unknown',
        fileFormat: getFileFormat(file),
        fileSizeBytes: file.size,
        issues: [],
      });
      return;
    }

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      const { width, height } = img;
      const dpiAtPrint = calculateDpiAtPrint(width, height, printDimensions);
      const issues = detectIssues(width, height, dpiAtPrint, file, printDimensions);
      const qualityScore = calculateQualityScore(dpiAtPrint, issues);
      const qualityTier = determineQualityTier(qualityScore);

      resolve({
        qualityScore,
        qualityTier,
        dpiAtPrint: Math.round(dpiAtPrint),
        requiredDpi: QUALITY_THRESHOLDS.RECOMMENDED_DPI,
        width,
        height,
        colorMode: 'rgb', // Browser images are always RGB
        fileFormat: getFileFormat(file),
        fileSizeBytes: file.size,
        issues,
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to load image for analysis'));
    };

    img.src = objectUrl;
  });
}

/**
 * Calculate what DPI the image will be at the print size
 */
function calculateDpiAtPrint(
  pixelWidth: number,
  pixelHeight: number,
  printDimensions: PrintDimensions
): number {
  // Convert mm to inches (25.4mm = 1 inch)
  const printWidthInches = printDimensions.width / 25.4;
  const printHeightInches = printDimensions.height / 25.4;

  // Calculate DPI for both dimensions and use the lower value
  const dpiWidth = pixelWidth / printWidthInches;
  const dpiHeight = pixelHeight / printHeightInches;

  return Math.min(dpiWidth, dpiHeight);
}

/**
 * Detect issues with the artwork
 */
function detectIssues(
  width: number,
  height: number,
  dpiAtPrint: number,
  file: File,
  printDimensions: PrintDimensions
): AnalysisIssue[] {
  const issues: AnalysisIssue[] = [];

  // Resolution check
  if (dpiAtPrint < QUALITY_THRESHOLDS.SEVERE_DPI) {
    issues.push({
      type: 'resolution',
      severity: 'error',
      message: `${Math.round(dpiAtPrint)} DPI (300 recommended)`,
      recommendation: ISSUE_MESSAGES.resolution.error.recommendation,
    });
  } else if (dpiAtPrint < QUALITY_THRESHOLDS.MINIMUM_DPI) {
    issues.push({
      type: 'resolution',
      severity: 'warning',
      message: `${Math.round(dpiAtPrint)} DPI (300 recommended)`,
      recommendation: ISSUE_MESSAGES.resolution.warning.recommendation,
    });
  }

  // Dimension ratio check
  const imageRatio = width / height;
  const printRatio = printDimensions.width / printDimensions.height;
  const ratioDifference = Math.abs(imageRatio - printRatio) / printRatio;

  if (ratioDifference > 0.2) {
    issues.push({
      type: 'dimensions',
      severity: ratioDifference > 0.5 ? 'error' : 'warning',
      message: 'Aspect ratio mismatch',
      recommendation: ISSUE_MESSAGES.dimensions.warning.recommendation,
    });
  }

  // Color mode (browser images are always RGB)
  if (file.type === 'image/jpeg' || file.type === 'image/png') {
    issues.push({
      type: 'color',
      severity: 'warning',
      message: 'RGB Colour Mode',
      recommendation: ISSUE_MESSAGES.color.warning.recommendation,
    });
  }

  // Format recommendation for raster images
  const isRaster = file.type === 'image/jpeg' || file.type === 'image/png';
  if (isRaster && file.size < 100000) {
    // Small raster file might be a logo that should be vector
    issues.push({
      type: 'format',
      severity: 'warning',
      message: 'Consider using vector format',
      recommendation: ISSUE_MESSAGES.format.warning.recommendation,
    });
  }

  return issues;
}

/**
 * Calculate overall quality score (0-100)
 */
function calculateQualityScore(dpiAtPrint: number, issues: AnalysisIssue[]): number {
  let score = 100;

  // DPI scoring (max 50 points deduction)
  if (dpiAtPrint < QUALITY_THRESHOLDS.RECOMMENDED_DPI) {
    const dpiRatio = dpiAtPrint / QUALITY_THRESHOLDS.RECOMMENDED_DPI;
    score -= Math.round((1 - dpiRatio) * 50);
  }

  // Issue scoring
  issues.forEach((issue) => {
    if (issue.severity === 'error') {
      score -= 15;
    } else if (issue.severity === 'warning') {
      score -= 5;
    }
  });

  return Math.max(0, Math.min(100, score));
}

/**
 * Determine quality tier from score
 */
function determineQualityTier(score: number): 'good' | 'borderline' | 'severe' {
  if (score >= QUALITY_THRESHOLDS.SCORE_GOOD) {
    return 'good';
  } else if (score >= QUALITY_THRESHOLDS.SCORE_BORDERLINE) {
    return 'borderline';
  }
  return 'severe';
}

/**
 * Get file format from File object
 */
function getFileFormat(file: File): string {
  const extension = file.name.split('.').pop()?.toLowerCase() || '';

  const formatMap: Record<string, string> = {
    jpg: 'JPEG',
    jpeg: 'JPEG',
    png: 'PNG',
    svg: 'SVG',
    pdf: 'PDF',
    ai: 'Adobe Illustrator',
    eps: 'EPS',
  };

  return formatMap[extension] || extension.toUpperCase();
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Create a preview URL for a file
 */
export function createPreviewUrl(file: File): string {
  return URL.createObjectURL(file);
}

/**
 * Revoke a preview URL to free memory
 */
export function revokePreviewUrl(url: string): void {
  URL.revokeObjectURL(url);
}
