/* =====================================================
   후위얼.Zip — main.js
   순수 HTML/CSS/JS (보관 및 파일 백업/복구 기능 탑재)
   ===================================================== */

// ─── 기본 데이터 ─────────────────────────────────────────
const STORAGE_KEY = 'whowearezip_v2';

const DEFAULT_CARDS = [
  {
    id: 1,
    name: 'gy-urii',
    nick: '김규리',
    img: 'https://avatars.githubusercontent.com/u/271248146?v=4',
    hobby: '노래듣기 🎶',
    interest: 'Back-End',
    job: '개발자, 아이돌',
    isArchived: false,
    skills: [
      { name: 'Java',  pct: 90 },
      { name: 'HTML',  pct: 50 },
      { name: 'JS',    pct: 30 },
    ],
  },
  {
    id: 2,
    name: 'Linkshimcat',
    nick: '이윤재',
    img: 'https://avatars.githubusercontent.com/u/121439974?v=4',
    hobby: '디자인 , 코딩 💻',
    interest: 'Full-Stack',
    job: '개발자, 디자이너',
    isArchived: false,
    skills: [
      { name: 'HTML', pct: 90 },
      { name: 'Java',  pct: 95 },
      { name: 'Design',   pct: 70 },
    ],
  },
  {
    id: 3,
    name: 's2635-qwer',
    nick: '한병민',
    img: 'https://avatars.githubusercontent.com/u/275469335?v=4',
    hobby: '운동 🎾',
    interest: 'Front-End',
    job: '개발자, 선생님',
    isArchived: false,
    skills: [
      { name: 'HTML', pct: 90 },
      { name: 'CSS',  pct: 75 },
      { name: 'JS',   pct: 70 },
    ],
  },
  {
    id: 4,
    name: 'JihoonKim',
    nick: '김지훈',
    img: 'https://scontent-ssn1-1.xx.fbcdn.net/v/t1.15752-9/726391499_1973448150042521_2075792514944185838_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=fc17b8&_nc_ohc=Jevk5F6I9QMQ7kNvwGeGPtk&_nc_oc=Adr66KfYpE_xExmbUI13RnNL565lxOaWSULeXygxi5zNhfu7RNT0mhBlsP9qvhiYZuA&_nc_zt=23&_nc_ht=scontent-ssn1-1.xx&_nc_ss=7b6a8&oh=03_Q7cD5gHIwTt8TugbqJ3CWnuXr8TyjXwt3QOzf0_JT6V3YEN18g&oe=6A61AEE0',
    hobby: '야구 ⚾',
    interest: 'Language',
    job: '영어 선생님, 개발자',
    isArchived: false,
    skills: [
      { name: 'English', pct: 100 },
      { name: 'Develop', pct: 70 },
      { name: 'Spanish', pct: 50 },
    ],
  },
  {
    id: 5,
    name: 'chldudals',
    nick: '최영민',
    img: 'https://scontent-ssn1-1.xx.fbcdn.net/v/t1.15752-9/730039982_2839441539744781_8652153907345576170_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=fc17b8&_nc_ohc=tHUKtql4rPcQ7kNvwG7iDDZ&_nc_oc=AdpuaINZlSE79Sfz8svoBOFA5HOnuLzi7K6PiiCngycvD5Fq5TRjqIKb05YhbCxLwcA&_nc_zt=23&_nc_ht=scontent-ssn1-1.xx&_nc_ss=7b6a8&oh=03_Q7cD5gHIwTt8TugbqJ3CWnuXr8TyjXwt3QOzf0_JT6V3YEN18g&oe=6A61B84F',
    hobby: '농구 🏀',
    interest: 'Back-End',
    job: '개발자, 선생님',
    isArchived: false,
    skills: [
      { name: 'Java', pct: 90 },
      { name: 'HTML', pct: 60 },
      { name: 'Basketball', pct: 50 },
    ]
  },
];

// ─── 저장/불러오기 ────────────────────────────────────────
function loadCards() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return JSON.parse(JSON.stringify(DEFAULT_CARDS));
}

function saveCards() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
}

let cards = loadCards();
let nextId = cards.length ? Math.max(...cards.map(c => c.id)) + 1 : 1;
let currentModalMusicUrl = '';

// ─── HTML 이스케이프 ──────────────────────────────────────
function esc(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ─── 팬 배치 계산 ─────────────────────────────────────────
function calcFan(index, total) {
  if (total === 0 || total === 1) return { angle: 0, tx: 0, ty: 0 };

  const MAX_ANGLE = 22;    
  const MAX_TX    = 220;   

  const ratio = index / (total - 1);           
  const angle = -MAX_ANGLE + MAX_ANGLE * 2 * ratio;
  const tx    = -MAX_TX    + MAX_TX    * 2 * ratio;
  const ty = 0;        

  return { angle, tx, ty };
}

// ─── 카드 DOM 생성 ────────────────────────────────────────
function createCard(data, zIndex, transform, isArchivedSection = false) {
  const el = document.createElement('div');
  el.className = 'card';
  el.style.zIndex = zIndex;
  el.style.transform = `translateX(${transform.tx}px) translateY(${transform.ty}px) rotate(${transform.angle}deg)`;

  const { tx, ty, angle } = transform;

  const imgHtml = data.img
    ? `<img src="${esc(data.img)}" alt="" onerror="this.style.display='none';this.nextElementSibling.style.display='block'" />
       <div class="card-img-empty" style="display:none"></div>`
    : `<div class="card-img-empty"></div>`;

  const skillsHtml = (data.skills || []).map(s => `
    <div class="skill-item">
      <div class="skill-name">${esc(s.name)}</div>
      <div class="skill-bar-bg">
        <div class="skill-bar-fill" style="width:${s.pct}%"></div>
      </div>
    </div>`).join('');

  // 보관소 섹션 여부에 따라 버튼 및 툴팁 분기처리
  const deleteTitle = isArchivedSection ? "영구 삭제" : "보관소로 이동";
  const restoreBtnHtml = isArchivedSection ? `<button class="card-restore" title="메인으로 복원">↩</button>` : '';

  el.innerHTML = `
    <div class="card-img-area">${imgHtml}</div>
    <div class="card-body">
      <p class="card-line"><span class="lbl">이름:</span> ${esc(data.name)} (${esc(data.nick || '???')})</p>
      <p class="card-line"><span class="lbl">취미:</span> ${esc(data.hobby || '???')}</p>
      <p class="card-line"><span class="lbl">관심분야:</span> ${esc(data.interest || '???')}</p>
      <p class="card-line"><span class="lbl">장래희망:</span> ${esc(data.job || '???')}</p>
      <div class="card-skills">${skillsHtml}</div>
    </div>
    <button class="card-music">&#9835; ${esc(data.name)}의 플레이리스트</button>
    ${restoreBtnHtml}
    <button class="card-delete" title="${deleteTitle}">&#10005;</button>`;

  el.querySelector('.card-music').addEventListener('click', (e) => {
    e.stopPropagation();
    if (data.music) {
      window.open(data.music, '_blank');
    } else {
      alert('등록된 플레이리스트가 없습니다.');
    }
  });

  // 호버 효과
  el.addEventListener('mouseenter', () => {
    el.style.transform = `translateX(${tx}px) translateY(${ty - 28}px) rotate(${angle * 0.35}deg) scale(1.05)`;
    el.style.zIndex = 999;
    el.style.boxShadow = '0 20px 60px rgba(0,0,0,0.75)';
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = `translateX(${tx}px) translateY(${ty}px) rotate(${angle}deg)`;
    el.style.zIndex = zIndex;
    el.style.boxShadow = '';
  });

  // 복원 버튼 동작 (보관소 내부의 카드에만 매핑)
  if (isArchivedSection) {
    el.querySelector('.card-restore').addEventListener('click', e => {
      e.stopPropagation();
      data.isArchived = false;
      saveCards();
      renderAll();
    });
  }

  // 삭제 버튼 동작
  el.querySelector('.card-delete').addEventListener('click', e => {
    e.stopPropagation();
    if (isArchivedSection) {
      if (confirm(`"${data.name}" 카드를 보관소에서 영구 삭제할까요? (복구 불가능)`)) {
        cards = cards.filter(c => c.id !== data.id);
        saveCards();
        renderAll();
      }
    } else {
      if (confirm(`"${data.name}" 카드를 보관소로 이동할까요?`)) {
        data.isArchived = true;
        saveCards();
        renderAll();
      }
    }
  });

  return el;
}

// ─── 추가 카드 DOM 생성 ───────────────────────────────────
function createAddCard(transform, zIndex) {
  const el = document.createElement('div');
  el.className = 'card card-add';
  el.style.zIndex = zIndex;
  el.style.transform = `translateX(${transform.tx}px) translateY(${transform.ty}px) rotate(${transform.angle}deg)`;

  const { tx, ty, angle } = transform;

  el.innerHTML = `
    <div class="card-add-icon">+</div>
    <div class="card-add-label">여기를 눌러<br>새로 만들기</div>`;

  el.addEventListener('mouseenter', () => {
    el.style.transform = `translateX(${tx}px) translateY(${ty - 20}px) rotate(${angle * 0.35}deg) scale(1.05)`;
    el.style.zIndex = 999;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = `translateX(${tx}px) translateY(${ty}px) rotate(${angle}deg)`;
    el.style.zIndex = zIndex;
  });

  el.addEventListener('click', openModal);
  return el;
}

// ─── 팬 렌더링 ────────────────────────────────────────────
function renderFan(containerId, showAddCard, filterType) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';

  // 보관 여부(filterType)에 맞는 카드들만 분류
  let targetCards = cards;
  if (filterType === 'active') {
    targetCards = cards.filter(c => !c.isArchived);
  } else if (filterType === 'archived') {
    targetCards = cards.filter(c => c.isArchived);
  }

  const totalSlots = targetCards.length + (showAddCard ? 1 : 0);
  if (totalSlots === 0) return;

  let slotIdx = 0;

  if (showAddCard) {
    const t = calcFan(slotIdx, totalSlots);
    const addEl = createAddCard(t, slotIdx + 5);
    container.appendChild(addEl);
    slotIdx++;
  }

  targetCards.forEach((card, i) => {
    const t = calcFan(slotIdx, totalSlots);
    const zIndex = slotIdx + 10;
    const el = createCard(card, zIndex, t, filterType === 'archived');
    el.style.animationDelay = `${i * 0.05}s`;
    container.appendChild(el);
    slotIdx++;
  });
}

// ─── 히어로 미니 팬 ───────────────────────────────────────
function renderHeroFan() {
  const container = document.getElementById('heroFan');
  if (!container) return;
  container.innerHTML = '';

  // 히어로 영역에는 보관되지 않은(활성화된) 카드들만 노출
  const display = cards.filter(c => !c.isArchived);
  if (display.length === 0) return;

  display.forEach((card, i) => {
    const t = calcFan(i, display.length);
    const el = document.createElement('div');
    el.className = 'mini-card';
    el.style.transform = `translateX(${t.tx * 0.85}px) translateY(${t.ty}px) rotate(${t.angle}deg)`;
    el.style.zIndex = i + 5;

    const imgHtml = card.img
      ? `<img src="${esc(card.img)}" alt="" onerror="this.style.display='none'" />`
      : `<div class="card-img-empty" style="background:#2a2a2a"></div>`;

    el.innerHTML = `
      <div class="card-img-area">${imgHtml}</div>
      <div class="card-body">
        <p class="card-line"><span class="lbl">이름:</span> ${esc(card.name)} (${esc(card.nick || '')})</p>
        <p class="card-line"><span class="lbl">취미:</span> ${esc(card.hobby || '')}</p>
        <p class="card-line"><span class="lbl">관심분야:</span> ${esc(card.interest || '')}</p>
        <p class="card-line"><span class="lbl">잠재직업:</span> ${esc(card.job || '')}</p>
      </div>`;
    container.appendChild(el);
  });
}

// ─── 데이터 백업 (JSON 파일 다운로드) ─────────────────────────
function exportCards() {
  if (cards.length === 0) {
    alert('백업할 카드 데이터가 없습니다.');
    return;
  }
  const dataStr = JSON.stringify(cards, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.download = 'whoweare_cards_backup.json';
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
}

// ─── 데이터 복구 (JSON 파일 업로드) ─────────────────────────
function importCards(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(event) {
    try {
      const importedData = JSON.parse(event.target.result);
      if (Array.isArray(importedData)) {
        if (confirm('파일을 불러오면 기존에 브라우저에 저장된 카드가 모두 덮어씌워집니다. 진행할까요?')) {
          cards = importedData;
          nextId = cards.length ? Math.max(...cards.map(c => c.id)) + 1 : 1;
          saveCards();
          renderAll();
          alert('🗄️ 카드가 파일로부터 성공적으로 복구되었습니다!');
        }
      } else {
        alert('올바른 파일 형식이 아닙니다. (JSON 배열 구조여야 합니다.)');
      }
    } catch (err) {
      alert('파일을 읽는 도중 오류가 발생했습니다. 파일 내용을 확인해 주세요.');
    }
    e.target.value = ''; 
  };
  reader.readAsText(file);
}

// ─── 전체 렌더링 ──────────────────────────────────────────
function renderAll() {
  renderFan('teamFan',    false, 'active');
  renderFan('addFan',     true,  'active');
  renderFan('archiveFan', false, 'archived');
  renderHeroFan();
}

// ─── 모달 제어 및 기타 로직 (기존과 동일) ───────────────────
const SKILL_OPTIONS = ['HTML','CSS','JavaScript','Java','Python','React','Node.js','Git','Figma','기타'];

function openModal() {
  resetForm();
  document.getElementById('modalOverlay').classList.add('open');
  document.getElementById('f-name').focus();
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
}

function resetForm() {
  document.getElementById('cardForm').reset();
  document.getElementById('f-img')._b64 = null;
  currentModalMusicUrl = '';

  document.getElementById('skillsContainer').innerHTML = '';
  addSkillRow('HTML', 90);
  addSkillRow('CSS',  79);
  addSkillRow('JavaScript', 79);

  updatePreview();
}

function addSkillRow(selected, pct) {
  const container = document.getElementById('skillsContainer');
  const row = document.createElement('div');
  row.className = 'skill-row';

  const opts = SKILL_OPTIONS.map(o => `<option${o === selected ? ' selected' : ''}>${o}</option>`).join('');

  row.innerHTML = `
    <select class="skill-select">${opts}</select>
    <input type="range" class="skill-range" min="0" max="100" value="${pct || 50}" />
    <span class="skill-pct-label">${pct || 50}</span>
    <span style="font-size:11px;color:#888">%</span>
    <button type="button" class="btn-remove-skill">&#10005;</button>`;

  const range  = row.querySelector('.skill-range');
  const label  = row.querySelector('.skill-pct-label');
  const select = row.querySelector('.skill-select');
  const removeBtn = row.querySelector('.btn-remove-skill');

  range.addEventListener('input', () => { label.textContent = range.value; updatePreview(); });
  select.addEventListener('change', updatePreview);
  removeBtn.addEventListener('click', () => { row.remove(); updatePreview(); });

  container.appendChild(row);
  updatePreview();
}

function getSkills() {
  return Array.from(document.querySelectorAll('#skillsContainer .skill-row')).map(row => ({
    name: row.querySelector('.skill-select').value,
    pct:  parseInt(row.querySelector('.skill-range').value, 10),
  }));
}

function updatePreview() {
  const name     = document.getElementById('f-name').value.trim()     || '???';
  const nick     = document.getElementById('f-nick').value.trim()     || '???';
  const imgInput = document.getElementById('f-img');
  const hobby    = document.getElementById('f-hobby').value.trim()    || '???';
  const interest = document.getElementById('f-interest').value.trim() || '???';
  const job      = document.getElementById('f-job').value.trim()      || '???';
  const skills   = getSkills();

  document.getElementById('pv-name').textContent     = name;
  document.getElementById('pv-nick').textContent     = nick;
  document.getElementById('pv-hobby').textContent    = hobby;
  document.getElementById('pv-interest').textContent = interest;
  document.getElementById('pv-job').textContent      = job;

  const btnText = currentModalMusicUrl ? `🎵 플레이리스트 입력됨` : `♫ ${name}의 플레이리스트`;
  document.getElementById('pv-music').innerHTML = btnText;

  const effectiveImg = imgInput._b64 || imgInput.value.trim();
  const pvImg   = document.getElementById('pv-img');
  const pvEmpty = document.getElementById('pv-empty');
  if (effectiveImg) {
    pvImg.src = effectiveImg;
    pvImg.style.display  = 'block';
    pvEmpty.style.display = 'none';
  } else {
    pvImg.style.display  = 'none';
    pvEmpty.style.display = 'block';
  }

  document.getElementById('pv-skills').innerHTML = skills.map(s => `
    <div class="skill-item">
      <div class="skill-name">${esc(s.name)}</div>
      <div class="skill-bar-bg">
        <div class="skill-bar-fill" style="width:${s.pct}%"></div>
      </div>
    </div>`).join('');
}

function handleFileUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    const imgInput = document.getElementById('f-img');
    imgInput._b64 = ev.target.result;
    updatePreview();
  };
  reader.readAsDataURL(file);
}

function submitCard(e) {
  e.preventDefault();
  const imgInput = document.getElementById('f-img');
  const imgSrc   = imgInput._b64 || imgInput.value.trim();

  const newCard = {
    id:       nextId++,
    name:     document.getElementById('f-name').value.trim(),
    nick:     document.getElementById('f-nick').value.trim(),
    img:      imgSrc,
    hobby:    document.getElementById('f-hobby').value.trim(),
    interest: document.getElementById('f-interest').value.trim(),
    job:      document.getElementById('f-job').value.trim(),
    music:    currentModalMusicUrl, 
    skills:   getSkills(),
    isArchived: false // 새로 만든 카드는 활성화 상태로 저장
  };

  cards.push(newCard);
  saveCards();
  renderAll();
  closeModal();
}

// ─── 이벤트 리스너 연결 ──────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderAll();

  document.getElementById('modalCloseBtn').addEventListener('click', closeModal);
  document.getElementById('cancelBtn').addEventListener('click', closeModal);
  document.getElementById('modalOverlay').addEventListener('click', e => {
    if (e.target === document.getElementById('modalOverlay')) closeModal();
  });

  document.getElementById('cardForm').addEventListener('submit', submitCard);
  document.getElementById('addSkillBtn').addEventListener('click', () => addSkillRow('HTML', 50));

  ['f-name','f-nick','f-img','f-hobby','f-interest','f-job'].forEach(id => {
    document.getElementById(id).addEventListener('input', updatePreview);
  });

  document.getElementById('f-file').addEventListener('change', handleFileUpload);

  // 백업 및 복구 버튼 이벤트 리스너 추가
  document.getElementById('btnExport').addEventListener('click', exportCards);
  document.getElementById('btnImport').addEventListener('change', importCards);

  const pvMusicBtn = document.getElementById('pv-music');
  if (pvMusicBtn) {
    pvMusicBtn.addEventListener('click', () => {
      const nameVal = document.getElementById('f-name').value.trim() || '???';
      const userUrl = prompt(`🎵 "${nameVal}" 님의 플레이리스트(유튜브 링크)를 입력해주세요:`);
      if (userUrl === null) return;

      const trimmedUrl = userUrl.trim();
      if (trimmedUrl === '') {
        alert('올바른 주소를 입력해주세요.');
        return;
      }

      currentModalMusicUrl = trimmedUrl;
      updatePreview();
      alert('✅ 플레이리스트 링크가 등록되었습니다! 카드 등록 시 최종 저장됩니다.');
    });
  }
});