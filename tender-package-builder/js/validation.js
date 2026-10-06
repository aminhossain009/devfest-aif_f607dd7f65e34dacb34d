// Check every requirement and render the checklist
function evaluate() {
  const rows = State.requirements.map((req) => {
    const files = State.files.filter((f) => f.requirementId === req.id);
    let status, msg;
    if (!files.length) { status = req.required === false ? 'optional' : 'missing'; msg = t(status === 'optional' ? 'optionalMsg' : 'missingMsg'); }
    else if (files.length > 1) { status = 'problem'; msg = t('duplicate'); }
    else if (files[0].error) { status = 'problem'; msg = t(files[0].error); }
    else { status = 'ok'; msg = `${files[0].name} · ${files[0].pages} ${t('pages')}`; }
    return { req, files, status, msg };
  });
  const looseBad = State.files.filter((f) => f.error && !f.requirementId).length;
  const counts = {
    ok: rows.filter((r) => r.status === 'ok').length,
    missing: rows.filter((r) => r.status === 'missing').length,
    problem: rows.filter((r) => r.status === 'problem').length + looseBad,
  };
  return { rows, counts, blocking: counts.missing + counts.problem > 0 };
}

function renderRequirements(ev) {
  $('okCount').textContent = ev.counts.ok;
  $('missingCount').textContent = ev.counts.missing;
  $('problemCount').textContent = ev.counts.problem;
  $('blockingAlert').classList.toggle('hidden', !ev.blocking);
  $('blockingMessage').textContent = t('blockingMsg');

  $('requirementsList').innerHTML = ev.rows.map((r) => `
    <div class="requirement-item ${r.status}">
      <div class="requirement-info">
        <div class="requirement-title">${esc(r.req.name)}</div>
        <div class="requirement-message">${esc(r.msg)}</div>
      </div>
      <span class="status-badge status-${r.status}">${esc(t('st_' + r.status))}</span>
    </div>`).join('');
}
