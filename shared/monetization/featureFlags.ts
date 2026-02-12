export const V3_FEATURE_FLAGS = {
  proFinanceEnhancements: true,
  localAiSuggestions: false,
  i18nEnglish: false,
} as const;

export type V3FeatureFlag = keyof typeof V3_FEATURE_FLAGS;
