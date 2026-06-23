/* =====================================================
   후위얼.Zip — main.js
   순수 HTML/CSS/JS (React, Vue 없음)
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
    img: 'https://scontent-ssn1-1.xx.fbcdn.net/v/t1.15752-9/730039982_2839441539744781_8652153907345576170_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=fc17b8&_nc_ohc=tHUKtql4rPcQ7kNvwG7iDDZ&_nc_oc=AdpuaINZlSE79Sfz8svoBOFA5HOnuLzi7K6PiiCngycvD5Fq5TRjqIKb05YhbCxLwcA&_nc_zt=23&_nc_ht=scontent-ssn1-1.xx&_nc_ss=7b6a8&oh=03_Q7cD5gHL2SpjcAGCbuyP8Facy79MmZ6wNo0UgrSWmyThU40qSA&oe=6A61B84F',
    hobby: '농구 🏀',
    interest: 'Back-End',
    job: '개발자, 선생님',
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

// 💡 모달 창에서 입력한 임시 유튜브 링크를 보관할 변수
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
  if (total === 0) return { angle: 0, tx: 0, ty: 0 };
  if (total === 1) return { angle: 0, tx: 0, ty: 0 };

  const MAX_ANGLE = 22;    // 최대 기울기 (도)
  const MAX_TX    = 220;   // 최대 수평 이동 (px)

  const ratio = index / (total - 1);           // 0 ~ 1
  const angle = -MAX_ANGLE + MAX_ANGLE * 2 * ratio;
  const tx    = -MAX_TX    + MAX_TX    * 2 * ratio;
  const ty = 0;        

  return { angle, tx, ty };
}

// ─── 카드 DOM 생성 ────────────────────────────────────────
function createCard(data, zIndex, transform) {
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
    <button class="card-delete" title="카드 삭제">&#10005;</button>`;

  // 💡 메인 화면의 카드에 연결된 플레이리스트 버튼 클릭 시 동작
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

  // 삭제
  el.querySelector('.card-delete').addEventListener('click', e => {
    e.stopPropagation();
    if (confirm(`"${data.name}" 카드를 삭제할까요?`)) {
      cards = cards.filter(c => c.id !== data.id);
      saveCards();
      renderAll();
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
function renderFan(containerId, showAddCard) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';

  const totalSlots = cards.length + (showAddCard ? 1 : 0);
  if (totalSlots === 0) return;

  let slotIdx = 0;

  if (showAddCard) {
    const t = calcFan(slotIdx, totalSlots);
    const addEl = createAddCard(t, slotIdx + 5);
    container.appendChild(addEl);
    slotIdx++;
  }

  cards.forEach((card, i) => {
    const t = calcFan(slotIdx, totalSlots);
    const zIndex = slotIdx + 10;
    const el = createCard(card, zIndex, t);
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

  const display = cards;
  if (display.length === 0) return;

  display.forEach((card, i) => {
    const t = calcFan(i, display.length);
    const el = document.createElement('div');
    el.className = 'mini-card';
    el.style.transform = `translateX(${t.tx * 0.85}px) translateY(${t.ty}px) rotate(${t.angle}deg)`;
    el.style.zIndex = i + 5;

    const imgHtml = card.img
      ? `<img src="${esc(card.img)}" alt="" onerror="this.style.display='none'" />`
      : `<div class="card-img-empty"></div>`;

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

// ─── 전체 렌더링 ──────────────────────────────────────────
function renderAll() {
  renderFan('teamFan',    false);
  renderFan('addFan',     true);
  renderFan('archiveFan', false);
  renderHeroFan();
}

// ─── 모달 ────────────────────────────────────────────────
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
  currentModalMusicUrl = ''; // 모달 초기화 시 임시 보관된 유튜브 링크도 리셋

  document.getElementById('skillsContainer').innerHTML = '';
  addSkillRow('HTML', 90);
  addSkillRow('CSS',  79);
  addSkillRow('JavaScript', 79);

  updatePreview();
}

// ─── 스킬 행 추가 ────────────────────────────────────────
function addSkillRow(selected, pct) {
  const container = document.getElementById('skillsContainer');
  const row = document.createElement('div');
  row.className = 'skill-row';

  const opts = SKILL_OPTIONS.map(o =>
    `<option${o === selected ? ' selected' : ''}>${o}</option>`
  ).join('');

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

// ─── 스킬 데이터 읽기 ────────────────────────────────────
function getSkills() {
  return Array.from(document.querySelectorAll('#skillsContainer .skill-row')).map(row => ({
    name: row.querySelector('.skill-select').value,
    pct:  parseInt(row.querySelector('.skill-range').value, 10),
  }));
}

// ─── 실시간 미리보기 ──────────────────────────────────────
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

  // 💡 유튜브 링크가 입력되었는지 여부에 따라 미리보기 버튼의 텍스트 체킹
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

// ─── 파일 업로드 ──────────────────────────────────────────
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

// ─── 폼 제출 ─────────────────────────────────────────────
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
    music:    currentModalMusicUrl, // 💡 모달에서 미리보기 버튼을 눌러 입력했던 유튜브 링크 주입!
    skills:   getSkills(),
  };

  cards.push(newCard);
  saveCards();
  renderAll();
  closeModal();
}

// ─── 초기화 ───────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderAll();

  // 모달 이벤트
  document.getElementById('modalCloseBtn').addEventListener('click', closeModal);
  document.getElementById('cancelBtn').addEventListener('click', closeModal);
  document.getElementById('modalOverlay').addEventListener('click', e => {
    if (e.target === document.getElementById('modalOverlay')) closeModal();
  });

  // 폼 제출
  document.getElementById('cardForm').addEventListener('submit', submitCard);

  // 스킬 추가 버튼
  document.getElementById('addSkillBtn').addEventListener('click', () => addSkillRow('HTML', 50));

  // 실시간 미리보기 — 폼 필드 변경 감지
  ['f-name','f-nick','f-img','f-hobby','f-interest','f-job'].forEach(id => {
    document.getElementById(id).addEventListener('input', updatePreview);
  });

  // 파일 업로드
  document.getElementById('f-file').addEventListener('change', handleFileUpload);

  // 💡 [핵심 핵심!] 모달창 내부 우측 미리보기(#pv-music) 버튼 클릭 이벤트 연결
  const pvMusicBtn = document.getElementById('pv-music');
  if (pvMusicBtn) {
    pvMusicBtn.addEventListener('click', () => {
      const nameVal = document.getElementById('f-name').value.trim() || '???';
      const userUrl = prompt(
        `🎵 "${nameVal}" 님의 플레이리스트(유튜브 링크)를 주소창에 넣어주세요:\n(예: https://www.youtube.com/watch?v=...)`
      );

      if (userUrl === null) return; // 취소 누르면 종료

      const trimmedUrl = userUrl.trim();
      if (trimmedUrl === '') {
        alert('올바른 주소를 입력해주세요.');
        return;
      }

      currentModalMusicUrl = trimmedUrl; // 임시 변수에 저장
      updatePreview(); // 미리보기 텍스트를 "🎵 플레이리스트 입력됨"으로 변경하기 위해 호출
      alert('✅ 플레이리스트 링크가 임시 추가되었습니다! 카드 등록을 완료하면 완전히 저장됩니다.');
    });
  }
});