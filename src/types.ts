export interface AsciiDocSettings {
    showTitle: boolean;
    useCustomTheme: boolean;
    selectedTheme: 'default' | 'github' | 'tufte' | 'custom';
    customCssPath: string;
  }
  
  export const DEFAULT_SETTINGS: AsciiDocSettings = {
    showTitle: true,
    useCustomTheme: false,
    selectedTheme: 'default',
    customCssPath: ''
  };
  