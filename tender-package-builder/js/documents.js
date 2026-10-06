// Uploading, inspecting and listing PDF files
function showUploadError(m) {
  $('uploadErrorMessage').textContent = m;
  showEl('uploadError');
}

async function addFiles(list) {
  hideEl('uploadError');
  const errors = [];
  for (const file of list) {
    if (!/\.pdf$/i.test(file.name) && file.type !== 'application/pdf') { errors.push(t('notPdf', { name: file.name })); continue; }
    if (State.files.some((f) => f.name === file.name && f.size === file.size)) { errors.push(t('dupFile', { name: file.name })); continue; }
    if (State.files.length >= LIMITS.files) { errors.push(t('tooMany')); break; }
    if (totalSize() + file.size > LIMITS.bytes) { errors.push(t('tooBig', { name: file.name })); continue; }
    const rec = { id: ++State.seq, file, name: file.name, size: file.size, pages: 0, error: null, requirementId: null };
    await inspectPdf(rec);
    rec.requirementId = autoMatch(rec);
    State.files.push(rec);
  }
  if (errors.length) showUploadError([...new Set(errors)].join(' '));
  refresh();
}

async function inspectPdf(rec) {
  try {
    const doc = await PDFLib.PDFDocument.load(await rec.file.arrayBuffer());
    rec.pages = doc.getPageCount();
    if (!rec.pages) rec.error = 'unreadable';
  } catch (e) {
    rec.error = /encrypt/i.test(e.message + e.constructor.name) ? 'encrypted' : 'unreadable';
  }
}

// Guess the requirement from filename keywords (only if not already taken)
function autoMatch(rec) {
  const name = rec.name.toLowerCase();
  const hit = State.requirements.find((r) =>
    (r.keywords || []).some((k) => name.includes(k.toLowerCase())) &&
    !State.files.some((f) => f.requirementId === r.id));
  return hit ? hit.id : null;
}

function removeFile(id) { State.files = State.files.filter((f) => f.id !== id); refresh(); }
function clearFiles() { State.files = []; hideEl('uploadError'); refresh(); }

function renderFiles() {
  $('fileCount').textContent = State.files.length;
  $('totalSize').textContent = (totalSize() / 1048576).toFixed(1) + ' MB';
  $('uploadedCount').textContent = State.files.length;
  $('emptyFilesState').classList.toggle('hidden', State.files.length > 0);
  $('clearFilesBtn').classList.toggle('hidden', State.files.length === 0);

  $('uploadedFilesList').innerHTML = State.files.map((f) => {
    const opts = State.requirements.map((r) =>
      `<option value="${esc(r.id)}" ${r.id === f.requirementId ? 'selected' : ''}>${esc(r.name)}</option>`).join('');
    const meta = f.error ? `<span style="color:var(--danger)">${esc(t(f.error))}</span>` : `${f.pages} ${t('pages')} · ${fmtSize(f.size)}`;
    return `<div class="file-item">
      <i class="fa-solid fa-file-pdf"></i>
      <div class="file-info"><div class="file-name">${esc(f.name)}</div><div class="file-meta">${meta}</div></div>
      <div class="file-actions">
        <select data-id="${f.id}" aria-label="${esc(t('matchTo'))}"><option value="">${esc(t('unassigned'))}</option>${opts}</select>
        <button type="button" class="file-remove" data-remove="${f.id}" title="${esc(t('remove'))}"><i class="fa-solid fa-xmark"></i></button>
      </div></div>`;
  }).join('');
}
