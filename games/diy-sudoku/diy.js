// DIY 自定义数独 - 核心逻辑（继承自 DIY_数独.html，去个人化 + 存储隔离 + 玻璃大厅接入）
// 注意：皮肤/主题/弹窗/音效/撒花由 ../../js/common.js 提供，此处不再重复定义。

const dict = {
    cn: {
        title: "DIY 自定义数独", diff_easy: "难度: 简单", diff_med: "难度: 中等", diff_hard: "难度: 困难",
        btn_restart: "重新开始", btn_undo: "撤回", btn_note: "笔记", btn_hint: "提示", btn_check: "检查",
        btn_stats: "战绩", btn_rules: "规则", btn_custom: "定制", btn_rechar: "换字符", btn_dark: "护眼", btn_confirm: "确认", btn_continue: "继续加油", btn_cancel: "取消",
        setup_title: "设置自定义字符", setup_sub: "输入 9 个<b>互不相同</b>的字符（支持字母或符号），生成新的盘面。", setup_btn: "生成盘面", setup_label: "当前字符", setup_clear: "一键清空",
        set_title: "定制选项", skin_default: "星空青 (Cyan)", skin_purple: "罗兰紫 (Purple)", skin_emerald: "翡冷翠雾绿 (Emerald)", set_edit_char: "修改专属字符",
        stat_title: "战绩看板", stat_note: "* 数据安全储存在本机", stat_col1: "难度", stat_col2: "最佳记录", stat_col3: "平均耗时", stat_col4: "通关数", stat_col5: "题库进度",
        rule_title: "游戏规则", rule_h1: "基础规则", rule_1: "<b>9x9 棋盘</b>：填入你设定的 9 个字符。", rule_2: "<b>不重复原则</b>：每行、每列、每个 3x3 宫格内，每个字符只能出现一次。",
        rule_h2: "操作技巧", rule_3: "<b>选中高亮</b>：点击格子会自动高亮关联区域和相同字符。", rule_4: "<b>笔记模式</b>：单格最多填4个猜想；确认答案后自动清理冲突笔记！", rule_5: "<b>提示求助</b>：每局提供 5 次揭晓答案的机会。", rule_offline: "用浏览器打开后选择“添加到主屏幕”，即可离线玩。",
        msg_hint_empty: "每局只能使用 5 次提示哦！", msg_hint_sel: "请先选中一个你想要求助的空白格子！", msg_hint_done: "这里你已经填对啦！",
        msg_win_p1: "还有空格或者笔记未确认哦，请先填完所有的单元格！", msg_win_p2: "有些地方似乎填错了，仔细检查一下逻辑线索。", msg_win_title: "恭喜通关", msg_win_body: "太棒了！你已成功解开自定义数独！\n\n本局用时: "
    },
    en: {
        title: "DIY Custom Sudoku", diff_easy: "Mode: Easy", diff_med: "Mode: Med", diff_hard: "Mode: Hard",
        btn_restart: "Restart", btn_undo: "Undo", btn_note: "Notes", btn_hint: "Hint", btn_check: "Check",
        btn_stats: "Stats", btn_rules: "Rules", btn_custom: "Theme", btn_rechar: "Chars", btn_dark: "Dark", btn_confirm: "OK", btn_continue: "Continue", btn_cancel: "Cancel",
        setup_title: "Custom Characters", setup_sub: "Enter 9 <b>UNIQUE</b> characters (letters or symbols) to generate a new board.", setup_btn: "Generate", setup_label: "Your Chars", setup_clear: "Clear All",
        set_title: "Customization", skin_default: "Cyan Sky", skin_purple: "Violet Purple", skin_emerald: "Emerald Mist", set_edit_char: "Edit Characters",
        stat_title: "Statistics", stat_note: "* Data is safely stored locally on this device.", stat_col1: "Mode", stat_col2: "Best Time", stat_col3: "Avg Time", stat_col4: "Played", stat_col5: "Progress",
        rule_title: "How to Play", rule_h1: "Basic Rules", rule_1: "<b>9x9 Grid</b>: Fill with your 9 custom characters.", rule_2: "<b>No Duplicates</b>: A char can only appear once per row, column, and 3x3 block.",
        rule_h2: "Pro Tips", rule_3: "<b>Highlighting</b>: Tap a cell to see related areas and identical chars.", rule_4: "<b>Notes</b>: Up to 4 guesses per cell. Auto-cleans on correct entry!", rule_5: "<b>Hints</b>: 5 reveals per game to help you out.", rule_offline: "Open in a browser, Add to Home Screen, then play offline.",
        msg_hint_empty: "No hints left for this game!", msg_hint_sel: "Select an empty cell to use a hint first!", msg_hint_done: "You've already solved this cell correctly!",
        msg_win_p1: "Incomplete board or unconfirmed notes remain. Fill all cells!", msg_win_p2: "Oops, there are some errors. Check your logic and try again.", msg_win_title: "Puzzle Solved", msg_win_body: "Amazing! You have solved your custom Sudoku!\n\nTime: "
    }
};

let lang = storageGet('public_lang', storageGet('public_diy_lang', 'cn'));
if (lang !== 'cn' && lang !== 'en') lang = 'cn';
window.DIY_DICT = dict;
function toggleLang() { toggleGlobalLang(); }
function applyLanguage() {
    lang = (typeof globalLang !== 'undefined') ? globalLang : lang;
    applyGlobalLang();
    let hintBase = lang === 'cn' ? "提示" : "Hint"; const hintEl = document.getElementById('hint-text'); if (hintEl) hintEl.innerText = `${hintBase}(${hintsLeft})`;
    if (document.getElementById('statsTable').innerHTML !== '') openStats(true);
    let undoTextEl = document.querySelector('.btn-undo span'); if(undoTextEl) undoTextEl.innerText = t('btn_undo');
}
window.onGlobalLangApplied = function() {
    lang = globalLang;
    let hintBase = lang === 'cn' ? "提示" : "Hint"; const hintEl = document.getElementById('hint-text'); if (hintEl) hintEl.innerText = `${hintBase}(${typeof hintsLeft !== 'undefined' ? hintsLeft : 5})`;
    const table = document.getElementById('statsTable');
    if (table && table.innerHTML !== '' && typeof openStats === 'function') openStats(true);
    const undoTextEl = document.querySelector('.btn-undo span');
    if (undoTextEl && typeof t === 'function') undoTextEl.innerText = t('btn_undo');
};
function t(key) { return dict[lang][key]; }

function normalizeChars(raw) {
    let str = '';
    if (Array.isArray(raw)) str = raw.join('');
    else if (typeof raw === 'string') { try { const parsed = JSON.parse(raw); str = (typeof parsed === 'string') ? parsed : raw; } catch (e) { str = raw; } }
    else if (typeof raw === 'number') str = String(raw);
    else if (raw == null) return [];
    else str = String(raw);
    const chars = [...str].filter(c => c.trim() !== '');
    if (chars.length !== 9) return [];
    if (new Set(chars).size !== 9) return [];
    return chars;
}

let charMap = []; let boardFixed = Array(9).fill().map(() => Array(9).fill(false)); let boardSolution = Array(9).fill().map(() => Array(9).fill(-1)); let boardPlay = Array(9).fill().map(() => Array(9).fill(-1)); let boardNotes = Array(9).fill().map(() => Array(9).fill().map(()=>[]));
let selectedRow = -1; let selectedCol = -1; let noteMode = false; let gameActive = false; let historyStack = []; const MAX_HISTORY = 15; let timerInterval = null; let timeElapsed = 0; let hintsLeft = 5;
let defaultStats = { '35': { best: null, avg: 0, count: 0 }, '45': { best: null, avg: 0, count: 0 }, '55': { best: null, avg: 0, count: 0 } };
let localStats = storageGet('public_diy_stats', null);
if (!localStats || !localStats['35'] || !localStats['45'] || !localStats['55']) { localStats = defaultStats; }
function openSettings() {
    document.getElementById('check-default').style.display = currentSkin === 'default' ? 'inline' : 'none'; document.getElementById('check-purple').style.display = currentSkin === 'purple' ? 'inline' : 'none';
    const emeraldCheck = document.getElementById('check-emerald'); if (emeraldCheck) emeraldCheck.style.display = currentSkin === 'emerald' ? 'inline' : 'none';
    openModal('settingsModal');
}
function generateSolution() { for (let i=0; i<9; i++) boardSolution[i].fill(-1); solveSudoku(boardSolution); }
function solveSudoku(grid) { for (let r = 0; r < 9; r++) { for (let c = 0; c < 9; c++) { if (grid[r][c] === -1) { let nums = [0,1,2,3,4,5,6,7,8].sort(() => Math.random() - 0.5); for (let num of nums) { if (isValid(grid, r, c, num)) { grid[r][c] = num; if (solveSudoku(grid)) return true; grid[r][c] = -1; } } return false; } } } return true; }
function isValid(grid, r, c, num) { for (let i = 0; i < 9; i++) if (grid[r][i] === num || grid[i][c] === num) return false; let sr = Math.floor(r/3)*3, sc = Math.floor(c/3)*3; for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) if (grid[sr+i][sc+j] === num) return false; return true; }
function countSolutions(grid, limit = 2) { for (let r=0; r<9; r++) { for (let c=0; c<9; c++) { if (grid[r][c] === -1) { let count = 0; for (let num=0; num<9; num++) { if (isValid(grid, r, c, num)) { grid[r][c] = num; count += countSolutions(grid, limit); grid[r][c] = -1; if (count >= limit) return count; } } return count; } } } return 1; }
function startNewGame() {
    let blanks = parseInt(document.getElementById('diff-select').value) || 45; hintsLeft = 5; applyLanguage(); generateSolution();
    for(let r=0; r<9; r++) for(let c=0; c<9; c++) { boardPlay[r][c] = -1; boardNotes[r][c] = []; boardFixed[r][c] = true; }
    let tempGrid = boardSolution.map(r => [...r]); let positions = []; for(let i=0; i<81; i++) positions.push([Math.floor(i/9), i%9]); positions.sort(() => Math.random() - 0.5);
    let removed = 0; for (let pos of positions) { if (removed >= blanks) break; let r = pos[0], c = pos[1]; let backup = tempGrid[r][c]; tempGrid[r][c] = -1; if (countSolutions(tempGrid) !== 1) tempGrid[r][c] = backup; else { boardFixed[r][c] = false; removed++; } }
    for(let r=0; r<9; r++) for(let c=0; c<9; c++) if(boardFixed[r][c]) boardPlay[r][c] = tempGrid[r][c];
    selectedRow = -1; selectedCol = -1; historyStack = []; noteMode = false; document.getElementById('note-btn').classList.remove('active-note');
    renderBoard(); gameActive = true; clearInterval(timerInterval); timeElapsed = 0; updateTimerDisplay(); timerInterval = setInterval(() => { timeElapsed++; updateTimerDisplay(); }, 1000);
}
function updateTimerDisplay() { let m = Math.floor(timeElapsed / 60).toString().padStart(2, '0'); let s = (timeElapsed % 60).toString().padStart(2, '0'); document.querySelector('#timer span').innerText = `${m}:${s}`; }
function buildKeyboard() {
    const kbContainer = document.getElementById('keyboard-container'); kbContainer.innerHTML = '';
    if (charMap.length !== 9) return;
    for (let i = 0; i < 9; i++) { const btn = document.createElement('div'); btn.className = 'key'; btn.innerText = charMap[i]; btn.onclick = (() => { const idx = i; return () => inputNumber(idx); })(); kbContainer.appendChild(btn); }
    const undoBtn = document.createElement('div'); undoBtn.className = 'key btn-undo';
    undoBtn.innerHTML = '<svg class="icon" viewBox="0 0 24 24"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg><span style="font-size:10px">' + t('btn_undo') + '</span>';
    undoBtn.onclick = undo; kbContainer.appendChild(undoBtn);
}
function renderBoard() {
    const boardDiv = document.getElementById('board'); boardDiv.innerHTML = '';
    if (charMap.length !== 9) return;
    let currentNum = (selectedRow !== -1 && selectedCol !== -1) ? boardPlay[selectedRow][selectedCol] : -1;
    for (let r = 0; r < 9; r++) { for (let c = 0; c < 9; c++) {
            let cellDiv = document.createElement('div'); cellDiv.className = 'cell'; cellDiv.id = `cell-${r}-${c}`; cellDiv.onclick = () => { if(gameActive) selectCell(r, c); }; let valNum = boardPlay[r][c];
            if (boardFixed[r][c]) { cellDiv.classList.add('fixed'); cellDiv.innerText = charMap[valNum]; } else if (valNum !== -1) { cellDiv.classList.add('user'); cellDiv.innerText = charMap[valNum]; } else if (boardNotes[r][c].length > 0) { let html = `<div class="notes-grid">`; for(let k=0; k<4; k++) html += `<div class="note-item">${boardNotes[r][c][k] !== undefined ? charMap[boardNotes[r][c][k]] : ''}</div>`; cellDiv.innerHTML = html + `</div>`; }
            if (r === selectedRow && c === selectedCol) cellDiv.classList.add('selected'); else if (selectedRow !== -1 && (r === selectedRow || c === selectedCol || (Math.floor(r/3) === Math.floor(selectedRow/3) && Math.floor(c/3) === Math.floor(selectedCol/3)))) cellDiv.classList.add('related');
            if (currentNum !== -1 && valNum === currentNum) cellDiv.classList.add('same'); boardDiv.appendChild(cellDiv);
        } }
}
function selectCell(r, c) { selectedRow = r; selectedCol = c; renderBoard(); }
function toggleNoteMode() { noteMode = !noteMode; document.getElementById('note-btn').classList.toggle('active-note'); }
function saveState() { if (historyStack.length >= MAX_HISTORY) historyStack.shift(); historyStack.push({ play: boardPlay.map(r => [...r]), notes: boardNotes.map(r => r.map(c => [...c])) }); }
function undo() { if (historyStack.length === 0 || !gameActive) return; let state = historyStack.pop(); boardPlay = state.play; boardNotes = state.notes; renderBoard(); }
function inputNumber(numIdx) { if (!gameActive || selectedRow === -1 || selectedCol === -1 || boardFixed[selectedRow][selectedCol]) return; playSound('bubble'); saveState(); let r = selectedRow, c = selectedCol; if (noteMode) { if (boardPlay[r][c] !== -1) boardPlay[r][c] = -1; let idx = boardNotes[r][c].indexOf(numIdx); if (idx === -1) { if (boardNotes[r][c].length < 4) boardNotes[r][c].push(numIdx); } else boardNotes[r][c].splice(idx, 1); } else { boardPlay[r][c] = numIdx; autoCleanNotes(r, c, numIdx); } renderBoard(); if(!noteMode) setTimeout(() => document.getElementById(`cell-${r}-${c}`).classList.add('just-placed'), 30); }
function autoCleanNotes(row, col, numIdx) { for(let i=0; i<9; i++) { removeNote(row, i, numIdx); removeNote(i, col, numIdx); } let sr = Math.floor(row/3)*3, sc = Math.floor(col/3)*3; for(let i=0; i<3; i++) for(let j=0; j<3; j++) removeNote(sr+i, sc+j, numIdx); }
function removeNote(r, c, numIdx) { if(!boardFixed[r][c] && boardPlay[r][c] === -1) { let i = boardNotes[r][c].indexOf(numIdx); if(i !== -1) boardNotes[r][c].splice(i, 1); } }
function useHint() { if (!gameActive) return; if (hintsLeft <= 0) { showMessage(t('btn_hint'), t('msg_hint_empty')); return; } if (selectedRow === -1 || selectedCol === -1) { showMessage(t('btn_hint'), t('msg_hint_sel')); return; } if (boardFixed[selectedRow][selectedCol]) return; let correctNum = boardSolution[selectedRow][selectedCol]; if (boardPlay[selectedRow][selectedCol] === correctNum) { showMessage(t('btn_hint'), t('msg_hint_done')); return; } playSound('bubble'); saveState(); boardPlay[selectedRow][selectedCol] = correctNum; autoCleanNotes(selectedRow, selectedCol, correctNum); hintsLeft--; document.getElementById('hint-text').innerText = `${lang === 'cn' ? "提示" : "Hint"}(${hintsLeft})`; renderBoard(); setTimeout(() => document.getElementById(`cell-${selectedRow}-${selectedCol}`).classList.add('just-placed'), 30); }
function formatTime(sec) { if (sec === null || sec === Infinity) return "--:--"; let m = Math.floor(sec / 60).toString().padStart(2, '0'); let s = Math.round(sec % 60).toString().padStart(2, '0'); return `${m}:${s}`; }
function checkWin() { if(!gameActive) return; let hasEmpty = false, hasError = false; for(let r=0; r<9; r++) for(let c=0; c<9; c++) { let v = boardPlay[r][c]; if(v === -1) hasEmpty = true; else if(v !== boardSolution[r][c]) hasError = true; } if(hasEmpty) { showMessage(t('btn_check'), t('msg_win_p1')); return; } if(hasError) { showMessage(t('btn_check'), t('msg_win_p2')); return; } gameActive = false; clearInterval(timerInterval); let diff = document.getElementById('diff-select').value; let s = localStats[diff]; s.count++; s.avg = ((s.avg * (s.count - 1)) + timeElapsed) / s.count; if (s.best === null || timeElapsed < s.best) s.best = timeElapsed; storageSet('public_diy_stats', localStats); triggerConfetti(); showMessage(t('msg_win_title'), t('msg_win_body') + formatTime(timeElapsed)); }
function showMessage(title, body) { showAppMessage(title, body, '#3b82f6'); }
function openStats(silent = false) {
    let html = `<tr><th>${t('stat_col1')}</th><th>${t('stat_col2')}</th><th>${t('stat_col3')}</th><th>${t('stat_col4')}</th><th>${t('stat_col5')}</th></tr>`;
    ['35', '45', '55'].forEach(k => {
        let s = localStats[k];
        let name = k==='35' ? (lang==='cn'?'简单':'Easy') : k==='45' ? (lang==='cn'?'中等':'Medium') : (lang==='cn'?'困难':'Hard');
        html += `<tr><td><b>${name}</b></td><td style="color:var(--stat-best-color);font-weight:bold;">${formatTime(s.best)}</td><td>${s.count===0 ? '--:--' : formatTime(s.avg)}</td><td>${s.count}</td><td>—</td></tr>`;
    });
    document.getElementById('statsTable').innerHTML = html;
    if(!silent) openModal('statsModal');
}

function openSetupModal() {
    closeModal('settingsModal'); document.getElementById('setupModal').style.display = 'flex';
    let hasChars = (charMap.length === 9); document.getElementById('setupCancelBtn').style.display = hasChars ? 'block' : 'none';
    hiddenInput.value = hasChars ? charMap.join('') : ''; hiddenInput.dispatchEvent(new Event('input')); hiddenInput.focus();
}
function clearSetup() {
    hiddenInput.value = '';
    hiddenInput.dispatchEvent(new Event('input'));
    hiddenInput.focus();
}
let hiddenInput = null; let slotsContainer = null; let slots = []; let startBtn = null; let instructionText = null;
function bindSetupInputs() {
    hiddenInput = document.getElementById('hiddenInput'); slotsContainer = document.getElementById('slots-container'); slots = document.querySelectorAll('.diy-slot'); startBtn = document.getElementById('startBtn'); instructionText = document.getElementById('setup-instruction');
    if (!hiddenInput || !slotsContainer || !startBtn) return;
    hiddenInput.addEventListener('input', () => {
        let chars = [...hiddenInput.value.replace(/\s/g, '')]; let uniqueSet = new Set(); let cleanVal = ''; let hasError = false;
        for (let char of chars) { if (!uniqueSet.has(char)) { uniqueSet.add(char); cleanVal += char; } else { hasError = true; } }
        hiddenInput.value = cleanVal;
        slots.forEach((slot, i) => { slot.innerText = [...cleanVal][i] || ''; if ([...cleanVal][i]) slot.classList.add('filled'); else slot.classList.remove('filled'); });
        if (hasError && slotsContainer && instructionText) { slotsContainer.classList.remove('error-shake'); instructionText.classList.remove('text-danger-flash'); void slotsContainer.offsetWidth; slotsContainer.classList.add('error-shake'); instructionText.classList.add('text-danger-flash'); }
        startBtn.disabled = [...cleanVal].length !== 9;
    });
}
function focusHiddenInput() { try { if (hiddenInput) hiddenInput.focus({ preventScroll: true }); } catch (e) { if (hiddenInput) hiddenInput.focus(); } }
function saveCharsAndStart() {
    if (!hiddenInput) return;
    const chars = normalizeChars(hiddenInput.value);
    if (chars.length === 9) { charMap = chars; storageSet('public_diy_chars', charMap.join('')); closeModal('setupModal'); selectedRow = -1; selectedCol = -1; buildKeyboard(); startNewGame(); return; }
    const cur = [...hiddenInput.value.replace(/\s/g, '')];
    const uniq = new Set(cur).size;
    showMessage(t('setup_title'), lang === 'cn' ? `还差 ${9 - Math.min(cur.length, 9)} 个不重复字符（当前 ${cur.length} 个，去重后 ${uniq} 个）。` : `Need ${9 - Math.min(cur.length, 9)} more unique chars (typed ${cur.length}, unique ${uniq}).`);
}
window.addEventListener('DOMContentLoaded', () => {
    bindSetupInputs();
    applyThemeUI();
    applyLanguage();
    const savedChars = normalizeChars(storageGet('public_diy_chars', null));
    charMap = (savedChars.length === 9) ? savedChars : [];
    // 重新进入数独页时必须弹出设置框，让用户重新确认 / 重新输入 9 个字符
    openSetupModal();
});
