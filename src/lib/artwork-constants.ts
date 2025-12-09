// Artwork Upload Wizard Constants

export const QUALITY_THRESHOLDS = {
  RECOMMENDED_DPI: 300,
  MINIMUM_DPI: 150,
  SEVERE_DPI: 100,
  SCORE_GOOD: 75,
  SCORE_BORDERLINE: 50,
} as const;

export const ACCEPTED_FILE_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/svg+xml': ['.svg'],
  'application/pdf': ['.pdf'],
  'application/postscript': ['.ai', '.eps'],
} as const;

export const ACCEPTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.svg', '.pdf', '.ai', '.eps'];

export const MAX_FILE_SIZE_MB = 50;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export const QUALITY_MESSAGES = {
  good: {
    title: "Looking Great!",
    subtitle: "Your artwork is ready for print",
    icon: 'CheckCircle',
  },
  borderline: {
    title: "Your artwork needs attention",
    subtitle: "We found some issues that may affect print quality",
    icon: 'AlertTriangle',
  },
  severe: {
    title: "Your artwork needs improvement",
    subtitle: "Please enhance or upload a higher quality file",
    icon: 'AlertCircle',
  },
} as const;

export const ISSUE_MESSAGES = {
  resolution: {
    warning: {
      message: "Low Resolution",
      recommendation: "Your image may appear slightly soft when printed. Consider enhancing or uploading a higher resolution file.",
    },
    error: {
      message: "Very Low Resolution",
      recommendation: "Your image will appear pixelated when printed. Please enhance or upload a higher resolution file.",
    },
  },
  dimensions: {
    warning: {
      message: "Incorrect Dimensions",
      recommendation: "Your artwork dimensions don't match the product. It will be scaled to fit.",
    },
    error: {
      message: "Dimensions Too Small",
      recommendation: "Your artwork is too small for this product and will need to be stretched significantly.",
    },
  },
  color: {
    warning: {
      message: "RGB Colour Mode",
      recommendation: "Your file uses RGB colours which may shift slightly when converted for print.",
    },
    error: {
      message: "Unusual Colour Mode",
      recommendation: "Your file uses an unusual colour mode. Colours may not print as expected.",
    },
  },
  format: {
    warning: {
      message: "Raster Format",
      recommendation: "For best results with logos and text, consider uploading a vector file (PDF, SVG, AI, EPS).",
    },
    error: {
      message: "Unsupported Format",
      recommendation: "Please upload a file in one of our supported formats: JPG, PNG, PDF, SVG, AI, or EPS.",
    },
  },
} as const;

export const ENHANCEMENT_MESSAGES = {
  processing: {
    title: "Enhancing your image...",
    subtitle: "This usually takes a few seconds",
  },
  complete: {
    title: "Enhancement Complete",
    subtitle: "Looking much better!",
  },
  failed: {
    title: "Enhancement unavailable",
    subtitle: "We couldn't enhance this image. Please try uploading a different file or contact our team for help.",
  },
} as const;
