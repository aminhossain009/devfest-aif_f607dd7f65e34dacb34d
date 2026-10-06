// Shared state + helpers (loaded first; all scripts share the global scope)
const State = { tender: null, requirements: [], files: [], lang: 'en', result: null, seq: 0 };
const LIMITS = { files: 30, bytes: 50 * 1024 * 1024 };

const $ = (id) => document.getElementById(id);
const showEl = (id) => $(id).classList.remove('hidden');
const hideEl = (id) => $(id).classList.add('hidden');
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmtSize = (b) => (b < 1048576 ? Math.round(b / 1024) + ' KB' : (b / 1048576).toFixed(1) + ' MB');
const totalSize = () => State.files.reduce((n, f) => n + f.size, 0);
