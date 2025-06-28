import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, MarkdownPostProcessorContext, TFile } from 'obsidian';
import asciidoctor from 'asciidoctor';

// Remember to rename these classes and interfaces!

interface AsciiDocSettings {
	showTitle: boolean;
	renderInline: boolean;
	useCustomTheme: boolean;
	selectedTheme: 'default' | 'github' | 'tufte' | 'custom';
	customCssPath: string;
}

const DEFAULT_SETTINGS: AsciiDocSettings = {
	showTitle: true,
	renderInline: false,
	useCustomTheme: false,
};

const adoc = asciidoctor();

export default class AsciiDocPlugin extends Plugin {
	settings: AsciiDocSettings;

	async onload() {
		console.log('AsciiDoc plugin loaded');
		this.registerExtensions(['adoc'], 'markdown');

		// 1. Full-file .adoc support (only in reading/preview mode)
		this.registerMarkdownPostProcessor(async (el, ctx) => {
			const file = this.app.workspace.getActiveFile();
		
			if (file?.extension === 'adoc') {
				// Only process if not already rendered
				if (el.querySelector('.asciidoc-rendered')) return;
		
				const raw = await this.app.vault.read(file);
				const html = adoc.convert(raw, {
					safe: 'safe',
					doctype: 'article',
					attributes: { showtitle: this.settings.showTitle }
				}) as string;
		
				el.empty();
				const container = createDiv({ cls: 'asciidoc-rendered' });
				container.innerHTML = html;
				el.appendChild(container);
			}
		});

		// 2. Fenced code block rendering: ```asciidoc
		this.registerMarkdownCodeBlockProcessor('asciidoc', (source, el, ctx) => {
			try {
				const html = adoc.convert(source, {
					safe: 'safe',
					doctype: 'article',
					attributes: { showtitle: true }
				}) as string;
		
				const wrapper = createDiv({ cls: 'asciidoc-rendered' });
				wrapper.innerHTML = html;
		
				// Leave the original el (Dataview-safe), just append below
				el.insertAdjacentElement('afterend', wrapper);
			} catch (e) {
				console.error("AsciiDoc render error:", e);
			}
		});
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	onunload() {
		console.log('AsciiDoc plugin unloaded');
	}
}

class AsciiDocSettingTab extends PluginSettingTab {
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
			.setName("Use custom AsciiDoc theme")
			.setDesc("Apply AsciiDoc CSS theme to rendered content")
			.addToggle(toggle =>
				toggle
					.setValue(this.plugin.settings.useCustomTheme)
					.onChange(async (value) => {
						this.plugin.settings.useCustomTheme = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
