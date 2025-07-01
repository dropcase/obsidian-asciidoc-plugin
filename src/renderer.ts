import { MarkdownView } from 'obsidian';
import asciidoctor from 'asciidoctor';
import type AsciiDocPlugin from '../main';

const processor = asciidoctor();

export function registerProcessors(plugin: AsciiDocPlugin) {
  plugin.registerMarkdownCodeBlockProcessor('asciidoc', (source, el, ctx) => {
    try {
      const html = processor.convert(source, {
        safe: 'safe',
        doctype: 'article',
        attributes: { showtitle: plugin.settings.showTitle },
      }) as string;

      const wrapper = createDiv({ cls: 'asciidoc-rendered' });
      wrapper.innerHTML = html;
      el.insertAdjacentElement('afterend', wrapper);
    } catch (e) {
      console.error('AsciiDoc render error:', e);
    }
  });

  plugin.app.workspace.onLayoutReady(() => {
    plugin.registerEvent(
      plugin.app.workspace.on('file-open', async (file) => {
        if (!file || file.extension !== 'adoc') return;

        const view = plugin.app.workspace.getActiveViewOfType(MarkdownView);
        if (!view) return;

        const container = view.containerEl.querySelector('.markdown-preview-view');
        if (!container || container.querySelector('.asciidoc-rendered')) return;

        const raw = await plugin.app.vault.read(file);
        const html = processor.convert(raw, {
          safe: 'safe',
          doctype: 'article',
          attributes: { showtitle: plugin.settings.showTitle },
        }) as string;

        container.empty();
        const el = createDiv({ cls: 'asciidoc-rendered' });
        el.innerHTML = html;
        container.appendChild(el);
      })
    );
  });
}
