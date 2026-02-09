
import { useTranslation, UseTranslationOptions } from 'react-i18next';

export const useSafeTranslation = (ns?: string, options?: UseTranslationOptions<any>) => {
  const { t: originalT, i18n, ready } = useTranslation(ns, options);

  // Robust t function that accepts optional default value string
  const t = <T = string>(key: string, defaultValueOrOpts?: string | any, opts?: any): T => {
    let defaultValue: string | undefined;
    let optionsObj = opts || {};

    // Handle t('key', 'default value') signature
    if (typeof defaultValueOrOpts === 'string') {
      defaultValue = defaultValueOrOpts;
      optionsObj = opts || {};
    } 
    // Handle t('key', { defaultValue: '...' }) signature
    else if (typeof defaultValueOrOpts === 'object') {
      optionsObj = defaultValueOrOpts;
      defaultValue = optionsObj.defaultValue;
    }

    // 1. Try original translation with fallback to defaultValue
    const result = originalT(key, { ...optionsObj, defaultValue });
    
    // 2. Handle Object/Array returns safely
    if (optionsObj?.returnObjects) {
      if (typeof result === 'string' && result === key) {
        if (Array.isArray(defaultValue)) return defaultValue as unknown as T;
        if (typeof defaultValue === 'object') return defaultValue as unknown as T;
        return (Array.isArray(optionsObj.defaultValue) ? [] : {}) as unknown as T;
      }
      return result as unknown as T;
    }

    // 3. String handling with Safety Checks
    const resultStr = typeof result === 'string' ? result : String(result ?? '');
    
    // Detect missing keys: 
    // - matches key exactly
    // - looks like a key path (contains dots, no spaces)
    // - is empty/undefined
    const isMissing = resultStr === key || (resultStr.includes('.') && !resultStr.includes(' ')) || !resultStr;

    if (isMissing) {
      // Strategy A: Use explicit defaultValue if provided
      if (defaultValue) return defaultValue as unknown as T;

      // Strategy B: Humanize the key path
      // e.g. "instructors.experienceOptions.junior" -> "Junior"
      const parts = key.split('.');
      let lastPart = parts[parts.length - 1];
      
      // Handle common structural suffixes
      if (['label', 'desc', 'title', 'name', 'value', 'text', 'placeholder', 'action'].includes(lastPart) && parts.length > 1) {
        lastPart = parts[parts.length - 2]; 
      }

      const fallback = lastPart
        .replace(/_/g, ' ')
        .replace(/([A-Z])/g, ' $1') // Space before capitals
        .replace(/^./, (str) => str.toUpperCase())
        .trim();
        
      return fallback as unknown as T;
    }

    return resultStr as unknown as T;
  };

  // Enforced Safe Translation Helper
  const tsafe = (key: string, fallbackOrOptions?: string | any) => t(key, fallbackOrOptions);

  return { t, tsafe, i18n, ready };
};