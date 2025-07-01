export function injectTheme(plugin: any, theme: string, customPath?: string) {
    const existing = document.getElementById('asciidoc-theme');
    if (existing) existing.remove();
  
    const style = document.createElement('style');
    style.id = 'asciidoc-theme';
  
    if (theme === 'custom' && customPath) {
      plugin.app.vault.adapter.read(customPath).then(css => {
        style.textContent = css;
        document.head.appendChild(style);
      }).catch(err => {
        console.error("Failed to load custom AsciiDoc theme:", err);
      });
    } else {
      fetch(plugin.app.vault.adapter.getResourcePath(`${plugin.manifest.dir}/styles/${theme}.css`))
        .then(resp => resp.text())
        .then(css => {
          style.textContent = css;
          document.head.appendChild(style);
        });
    }
  }
