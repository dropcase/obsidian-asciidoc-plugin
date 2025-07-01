import { App, PluginSettingTab, Setting } from 'obsidian';
import AsciiDocPlugin from '../main';

export class AsciiDocSettingTab extends PluginSettingTab {
  plugin: AsciiDocPlugin;

  constructor(app: App, plugin: AsciiDocPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "AsciiDoc Plugin Settings" });

    new Setting(containerEl)
      .setName("Show document title")
      .setDesc("Render the top-level AsciiDoc title as an H1")
      .addToggle(toggle =>
        toggle
          .setValue(this.plugin.settings.showTitle)
          .onChange(async (value) => {
            this.plugin.settings.showTitle = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("AsciiDoc Theme")
      .setDesc("Choose a built-in or custom theme for rendered content")
      .addDropdown(dropdown =>
        dropdown
          .addOption("default", "Default")
          .addOption("github", "GitHub")
          .addOption("tufte", "Tufte")
          .addOption("custom", "Custom")
          .setValue(this.plugin.settings.selectedTheme)
          .onChange(async (value) => {
            this.plugin.settings.selectedTheme = value as any;
            await this.plugin.saveSettings();
            this.plugin.injectTheme(value, this.plugin.settings.customCssPath);
          })
      );

    new Setting(containerEl)
      .setName("Custom CSS Path")
      .setDesc("Path inside your vault to a .css file (for custom themes)")
      .addText(text =>
        text
          .setPlaceholder("e.g. /themes/asciidoc.css")
          .setValue(this.plugin.settings.customCssPath)
          .onChange(async (value) => {
            this.plugin.settings.customCssPath = value;
            await this.plugin.saveSettings();
          })
      );
  }
}
