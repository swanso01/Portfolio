/**
 * Document Modal System
 * Handles smooth opening/closing of documents with animations
 */

class DocumentModal {
  constructor() {
    this.modal = document.getElementById('docModal');
    this.overlay = document.getElementById('modalOverlay');
    this.closeBtn = document.getElementById('closeModal');
    this.container = document.getElementById('docContainer');
    this.titleEl = document.getElementById('modalTitle');
    this.infoEl = document.getElementById('docInfo');
    this.downloadLink = document.getElementById('downloadLink');

    this.setupEventListeners();
  }

  setupEventListeners() {
    // Document links
    document.querySelectorAll('.doc-link').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openDocument(
          btn.dataset.file,
          btn.dataset.title || 'Document'
        );
      });
    });

    // Close button
    this.closeBtn.addEventListener('click', () => this.close());

    // Overlay click
    this.overlay.addEventListener('click', () => this.close());

    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.classList.contains('active')) {
        this.close();
      }
    });

    // Prevent dialog from closing on dialog click
    this.modal.querySelector('.modal-content').addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  async openDocument(filePath, title) {
    this.titleEl.textContent = title;
    this.container.innerHTML = '<p style="text-align: center; color: var(--muted);">Loading...</p>';

    try {
      const response = await fetch(filePath);
      if (!response.ok) throw new Error('File not found');

      const content = await response.text();
      this.displayContent(content, filePath, title);
    } catch (error) {
      this.container.innerHTML = `
        <div style="color: var(--muted); padding: 2rem; text-align: center;">
          <p>Unable to load file</p>
          <p style="font-size: 0.9rem; margin-top: 1rem;">${error.message}</p>
        </div>
      `;
    }

    // Setup download link
    this.downloadLink.href = filePath;
    this.downloadLink.download = title.replace(/\s+/g, '_');

    // Show modal
    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  displayContent(content, filePath, title) {
    const ext = filePath.split('.').pop().toLowerCase();

    if (ext === 'py') {
      this.displayCode(content, title);
    } else if (ext === 'txt') {
      this.displayText(content);
    } else if (ext === 'docx' || ext === 'pptx' || ext === 'xlsx') {
      this.displayBinaryFileInfo(title, ext);
    } else {
      this.container.innerHTML = `<pre>${this.escapeHtml(content)}</pre>`;
    }
  }

  displayCode(content, title) {
    const lines = content.split('\n');
    const preview = lines.slice(0, 40).join('\n');
    const hasMore = lines.length > 40;

    let html = '<pre><code>' + this.escapeHtml(preview);
    if (hasMore) html += '\n\n... (' + (lines.length - 40) + ' more lines)';
    html += '</code></pre>';

    this.container.innerHTML = html;
    this.infoEl.textContent = `Python file • ${lines.length} lines`;
  }

  displayText(content) {
    const lines = content.split('\n');
    const preview = lines.slice(0, 30).join('\n');
    const hasMore = lines.length > 30;

    let html = '<pre>' + this.escapeHtml(preview);
    if (hasMore) html += '\n\n... (' + (lines.length - 30) + ' more lines)';
    html += '</pre>';

    this.container.innerHTML = html;
    this.infoEl.textContent = `Text file • ${lines.length} lines`;
  }

  displayBinaryFileInfo(title, ext) {
    const typeMap = {
      docx: 'Microsoft Word Document',
      pptx: 'PowerPoint Presentation',
      xlsx: 'Excel Spreadsheet',
    };

    this.container.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: var(--muted);">
        <div style="font-size: 3rem; margin-bottom: 1rem;">
          ${this.getFileIcon(ext)}
        </div>
        <p style="font-size: 1.1rem; margin-bottom: 0.5rem;">${typeMap[ext] || 'Document'}</p>
        <p style="font-size: 0.9rem;">${title}</p>
        <p style="margin-top: 1.5rem; font-size: 0.9rem;">
          This file must be downloaded to view. Click the download button below.
        </p>
      </div>
    `;

    this.infoEl.textContent = `${typeMap[ext] || 'Document'} • Download to view`;
  }

  getFileIcon(ext) {
    const icons = {
      docx: '📄',
      pptx: '📊',
      xlsx: '📈',
      py: '🐍',
      txt: '📝',
    };
    return icons[ext] || '📎';
  }

  escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  }

  close() {
    this.modal.classList.remove('active');
    document.body.style.overflow = '';
    this.container.innerHTML = '';
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  new DocumentModal();
});
