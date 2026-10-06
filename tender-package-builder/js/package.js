// Summary, merging and download
function outputName() {
  const td = State.tender || {};
  return (td.outputFileName || `${td.id || 'Tender'}_Package.pdf`).replace(/[^\w.\- ]+/g, '_');
}

function renderSummary(ev) {
  const included = ev.rows.filter((r) => r.status === 'ok');
  $('outputFileName').textContent = outputName();
  $('includedDocuments').textContent = included.length;
  $('includedPages').textContent = included.reduce((n, r) => n + r.files[0].pages, 0);
  $('packageStatus').textContent = ev.blocking ? t('blocked') : t('ready');
  $('includedDocumentsList').innerHTML = included.map((r, i) => `
    <div class="included-item">
      <i class="fa-solid fa-file-pdf"></i>
      <div class="included-info"><div class="included-name">${i + 1}. ${esc(r.req.name)}</div>
      <div class="included-meta">${esc(r.files[0].name)} · ${r.files[0].pages} ${t('pages')}</div></div>
    </div>`).join('');
  $('generateBtn').disabled = ev.blocking || !included.length;
  $('generateDescription').textContent = ev.blocking ? t('generateBlocked') : t('generateReady');
}

async function generatePackage() {
  const ev = evaluate();
  if (ev.blocking) return;
  const items = ev.rows.filter((r) => r.status === 'ok');
  $('loadingTitle').textContent = t('processing');
  $('progressFill').style.width = '0%';
  showEl('loadingOverlay');
  try {
    const out = await PDFLib.PDFDocument.create();
    for (let i = 0; i < items.length; i++) {
      $('loadingMessage').textContent = items[i].req.name;
      $('progressFill').style.width = Math.round((i / items.length) * 100) + '%';
      const src = await PDFLib.PDFDocument.load(await items[i].files[0].file.arrayBuffer());
      (await out.copyPages(src, src.getPageIndices())).forEach((p) => out.addPage(p));
      await new Promise((r) => setTimeout(r)); // let the UI repaint
    }
    State.result = new Blob([await out.save()], { type: 'application/pdf' });
    $('progressFill').style.width = '100%';
    $('generatedFileName').textContent = outputName();
    showEl('successSection');
    $('successSection').scrollIntoView({ behavior: 'smooth' });
  } catch (e) {
    showUploadError(t('genFailed') + ' ' + e.message);
  } finally {
    hideEl('loadingOverlay');
  }
}

function downloadPackage() {
  if (!State.result) return;
  const url = URL.createObjectURL(State.result);
  const a = Object.assign(document.createElement('a'), { href: url, download: outputName() });
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
