// Load and display requirements.json
async function loadRequirements(file) {
  const msg = $('requirementsMessage');
  try {
    const data = JSON.parse(await file.text());
    if (!data.tender || !Array.isArray(data.requirements) || !data.requirements.length) {
      throw new Error(t('badJson'));
    }
    State.tender = data.tender;
    State.requirements = data.requirements.slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    State.files.forEach((f) => (f.requirementId = null));
    msg.textContent = file.name + ' ✓';
    msg.className = 'success';
    renderTender();
    ['tenderSection', 'uploadSection', 'requirementsSection', 'summarySection', 'generateSection'].forEach(showEl);
    hideEl('successSection');
    refresh();
  } catch (e) {
    msg.textContent = t('badJson') + ' (' + e.message + ')';
    msg.className = 'error';
  }
}

function renderTender() {
  const td = State.tender;
  $('tenderTitle').textContent = td.title || 'Tender';
  $('tenderId').textContent = td.id || '—';
  $('procuringEntity').textContent = td.procuringEntity || '—';
  $('bidderName').textContent = td.bidder || '—';
  $('submissionDeadline').textContent = td.deadline || '—';
}
