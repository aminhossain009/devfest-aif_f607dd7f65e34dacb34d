// Wiring: events + one refresh() that redraws everything
function refresh() {
  if (!State.tender) return;
  const ev = evaluate();
  renderFiles();
  renderRequirements(ev);
  renderSummary(ev);
  hideEl('successSection'); // any change invalidates a previously generated package
  State.result = null;
}

function startOver() {
  State.files = [];
  State.result = null;
  hideEl('successSection');
  refresh();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

$('requirementsFile').addEventListener('change', (e) => {
  if (e.target.files[0]) loadRequirements(e.target.files[0]);
  e.target.value = '';
});

$('pdfInput').addEventListener('change', (e) => { addFiles([...e.target.files]); e.target.value = ''; });

const zone = $('dropZone');
['dragenter', 'dragover'].forEach((ev) => zone.addEventListener(ev, (e) => { e.preventDefault(); zone.classList.add('dragover'); }));
['dragleave', 'drop'].forEach((ev) => zone.addEventListener(ev, (e) => { e.preventDefault(); zone.classList.remove('dragover'); }));
zone.addEventListener('drop', (e) => addFiles([...e.dataTransfer.files]));

$('uploadedFilesList').addEventListener('change', (e) => {
  const sel = e.target.closest('select[data-id]');
  if (!sel) return;
  const f = State.files.find((x) => x.id === Number(sel.dataset.id));
  if (f) { f.requirementId = sel.value || null; refresh(); }
});

$('uploadedFilesList').addEventListener('click', (e) => {
  const btn = e.target.closest('[data-remove]');
  if (btn) removeFile(Number(btn.dataset.remove));
});

$('clearFilesBtn').addEventListener('click', clearFiles);
$('closeUploadError').addEventListener('click', () => hideEl('uploadError'));
$('generateBtn').addEventListener('click', generatePackage);
$('downloadBtn').addEventListener('click', downloadPackage);
$('startOverBtn').addEventListener('click', startOver);
$('languageToggle').addEventListener('click', toggleLanguage);

// Help modal
const closeHelp = () => hideEl('helpModal');
$('helpBtn').addEventListener('click', () => showEl('helpModal'));
$('closeHelpBtn').addEventListener('click', closeHelp);
$('helpModal').addEventListener('click', (e) => { if (e.target === $('helpModal')) closeHelp(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeHelp(); });
