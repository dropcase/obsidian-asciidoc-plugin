import { Plugin } from 'obsidian';
import { DEFAULT_SETTINGS, AsciiDocSettings } from './src/types';
import { AsciiDocSettingTab } from './src/settings';
import { injectTheme } from './src/theme';
import { registerProcessors } from './src/render';

export default class AsciiDocPlugin extends Plugin {
  settings!: AsciiDocSettings;

  async onload() {
    console.log('AsciiDoc plugin loaded');
    await this.loadSettings();
    injectTheme(this, this.settings.selectedTheme, this.settings.customCssPath);
    this.addSettingTab(new AsciiDocSettingTab(this.app, this));
    this.registerExtensions(['adoc'], 'markdown');
    registerProcessors(this);
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
