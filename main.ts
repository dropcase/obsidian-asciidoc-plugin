import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, MarkdownPostProcessorContext, TFile } from 'obsidian';
import asciidoctor from 'asciidoctor';

// Remember to rename these classes and interfaces!

interface AsciiDocPluginSettings {
	mySetting: string;
}

// const DEFAULT_SETTINGS: AsciiDocPluginSettings = {
// 	mySetting: 'default'
// }

const adoc = asciidoctor();

export default class AsciiDocPlugin extends Plugin {
	async onload() {
		console.log('AsciiDoc plugin loaded');
		this.registerExtensions(['adoc'], 'markdown');

		// 1. Full-file .adoc support (only in reading/preview mode)
		this.registerMarkdownPostProcessor(async (el, ctx) => {
			const file = this.app.workspace.getActiveFile();

			if (file && file.extension === 'adoc') {
				const raw = await this.app.vault.read(file);
				const html = adoc.convert(raw, { safe: 'safe', doctype: 'article' }) as string;

				el.empty();
				const container = createDiv({ cls: 'asciidoc-rendered' });
				container.innerHTML = html;
				el.appendChild(container);
			}
		});

		// 2. Fenced code block rendering: ```asciidoc
		this.registerMarkdownCodeBlockProcessor('asciidoc', (source, el, ctx) => {
			try {
				const html = adoc.convert(source, { safe: 'safe', doctype: 'article' }) as string;
				const container = createDiv({ cls: 'asciidoc-rendered' });
				container.innerHTML = html;
				el.replaceWith(container);
			} catch (e) {
				console.error("AsciiDoc render error:", e);
				el.createEl('pre', { text: source });
			}
		});
	}

	onunload() {
		console.log('AsciiDoc plugin unloaded');
	}
}
