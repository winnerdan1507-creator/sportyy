    // DATA & STATE
    // ========================================
    
    const sports = [
      { id: 'football', name: 'Football', icon: '<circle cx="12" cy="12" r="10"/>', live: 45 },
      { id: 'basketball', name: 'Basketball', icon: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/>', live: 23 },
      { id: 'tennis', name: 'Tennis', icon: '<circle cx="12" cy="12" r="10"/><path d="M12 2v20"/>', live: 12 },
      { id: 'esports', name: 'Esports', icon: '<rect x="2" y="6" width="20" height="12" rx="2"/>', live: 34 },
    ];

    const leagues = [
      { id: 'premier-league', name: 'Premier League', country: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
      { id: 'la-liga', name: 'La Liga', country: 'Spain', flag: '🇪🇸' },
      { id: 'bundesliga', name: 'Bundesliga', country: 'Germany', flag: '🇩🇪' },
      { id: 'serie-a', name: 'Serie A', country: 'Italy', flag: '🇮🇹' },
      { id: 'nba', name: 'NBA', country: 'USA', flag: '🇺🇸' },
    ];

    const teamNames = {
      football: ['Arsenal', 'Chelsea', 'Man Utd', 'Liverpool', 'Man City', 'Tottenham', 'Barcelona', 'Real Madrid', 'Juventus', 'Bayern', 'PSG', 'Dortmund'],
      basketball: ['Lakers', 'Celtics', 'Warriors', 'Bulls', 'Heat', 'Nets', 'Bucks', 'Suns'],
      tennis: ['Djokovic', 'Alcaraz', 'Sinner', 'Medvedev', 'Federer', 'Nadal'],
      esports: ['T1', 'Gen.G', 'Fnatic', 'G2', 'Cloud9', 'Team Liquid', 'NAVI', 'FaZe'],
    };

    // State
    let allMatches = [];
    let betslip = [];
    let currentStake = 10;
    let userBalance = 2450.00;

    // DOM Cache
    let els = {};

    // ========================================
    // INITIALIZATION
    // ========================================
    
    document.addEventListener('DOMContentLoaded', () => {
      cacheElements();
      generateMatches();
      renderAll();
      setupEventListeners();
    });

    function cacheElements() {
      els = {
        sidebar: document.getElementById('leftSidebar'),
        sidebarToggle: document.getElementById('sidebarToggle'),
        notifBtn: document.getElementById('notifBtn'),
        notifDropdown: document.getElementById('notifDropdown'),
        depositBtn: document.getElementById('depositBtn'),
        withdrawBtn: document.getElementById('withdrawBtn'),
        walletModal: document.getElementById('walletModal'),
        closeWalletModal: document.getElementById('closeWalletModal'),
        walletModalBackdrop: document.getElementById('walletModalBackdrop'),
        depositTabBtn: document.getElementById('depositTabBtn'),
        withdrawTabBtn: document.getElementById('withdrawTabBtn'),
        walletSubmitBtn: document.getElementById('walletSubmitBtn'),
        userBalance: document.getElementById('userBalance'),
        
        matchModal: document.getElementById('matchModal'),
        modalBackdrop: document.getElementById('modalBackdrop'),
        closeModal: document.getElementById('closeModal'),
        modalTitle: document.getElementById('modalTitle'),
        modalContent: document.getElementById('modalContent'),

        sportsSidebar: document.getElementById('sportsSidebar'),
        heroSection: document.getElementById('heroSection'),
        liveMatchesContainer: document.getElementById('liveMatchesContainer'),
        liveCount: document.getElementById('liveCount'),
        upcomingMatchesContainer: document.getElementById('upcomingMatchesContainer'),
        popularLeagues: document.getElementById('popularLeagues'),
        casinoGames: document.getElementById('casinoGames'),

        betslipEmpty: document.getElementById('betslipEmpty'),
        betslipItems: document.getElementById('betslipItems'),
        betslipFooter: document.getElementById('betslipFooter'),
        betslipCount: document.getElementById('betslipCount'),
        mobileBetCount: document.getElementById('mobileBetCount'),
        totalOdds: document.getElementById('totalOdds'),
        potentialWin: document.getElementById('potentialWin'),
        stakeInput: document.getElementById('stakeInput'),
        placeBetBtn: document.getElementById('placeBetBtn'),
        clearSlipBtn: document.getElementById('clearSlipBtn'),
        toastContainer: document.getElementById('toastContainer'),
      };
    }

    function generateMatches() {
      const sportsKeys = Object.keys(teamNames);
      sportsKeys.forEach(sport => {
        const teams = teamNames[sport];
        for (let i = 0; i < 15; i++) {
          const home = teams[Math.floor(Math.random() * teams.length)];
          let away = teams[Math.floor(Math.random() * teams.length)];
          while (home === away) away = teams[Math.floor(Math.random() * teams.length)];

          const isLive = Math.random() > 0.7;
          
          allMatches.push({
            id: `${sport}-${i}-${Date.now()}`,
            sport,
            league: leagues[Math.floor(Math.random() * leagues.length)],
            home, away,
            time: isLive ? null : `${Math.floor(Math.random() * 24)}:${Math.random() > 0.5 ? '00' : '30'}`,
            isLive,
            minute: isLive ? Math.floor(Math.random() * 90) : null,
            homeScore: isLive ? Math.floor(Math.random() * 4) : null,
            awayScore: isLive ? Math.floor(Math.random() * 4) : null,
            odds: { home: (Math.random() * 3 + 1.2).toFixed(2), draw: (Math.random() * 2 + 2.5).toFixed(2), away: (Math.random() * 5 + 1.5).toFixed(2) }
          });
        }
      });
    }

    // ========================================
    // RENDERING
    // ========================================

    function renderAll() {
      renderSportsSidebar();
      renderHero();
      renderLiveMatches();
      renderUpcomingMatches('football');
      renderPopularLeagues();
      renderCasinoGames();
    }

    function renderSportsSidebar() {
      els.sportsSidebar.innerHTML = sports.map(s => `
        <button class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left hover:bg-[var(--bg-card)] transition-colors group">
          <svg class="w-5 h-5 text-[var(--text-secondary)] group-hover:text-[var(--accent-primary)]" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">${s.icon}</svg>
          <span class="flex-1 text-sm">${s.name}</span>
          ${s.live > 0 ? `<span class="text-xs bg-[var(--accent-red)] text-white px-1.5 py-0.5 rounded">${s.live}</span>` : ''}
        </button>
      `).join('');
    }

    function renderHero() {
      const match = allMatches.find(m => m.isLive);
      if (!match) return;
      els.heroSection.innerHTML = `
        <div class="relative bg-gradient-to-r from-[#0f2922] to-[#0a1a14] p-6 md:p-8 cursor-pointer" onclick="openMatchModal('${match.id}')">
           <div class="flex flex-col md:flex-row items-center justify-between gap-6">
             <div>
               <div class="inline-flex items-center gap-2 bg-[var(--accent-red)]/20 text-[var(--accent-red)] px-3 py-1 rounded-full text-xs font-semibold mb-3">
                 <span class="w-2 h-2 bg-[var(--accent-red)] rounded-full animate-pulse-live"></span> LIVE ${match.minute}'
               </div>
               <div class="text-xs text-[var(--text-muted)] mb-2">${match.league.flag} ${match.league.name}</div>
               <h2 class="font-display text-2xl md:text-4xl font-bold mb-2">${match.home} vs ${match.away}</h2>
             </div>
             <div class="flex items-center gap-8 text-center">
               <div><div class="font-display text-4xl font-bold">${match.homeScore}</div><div class="text-xs text-[var(--text-muted)]">${match.home}</div></div>
               <div class="text-2xl text-[var(--text-muted)]">VS</div>
               <div><div class="font-display text-4xl font-bold">${match.awayScore}</div><div class="text-xs text-[var(--text-muted)]">${match.away}</div></div>
             </div>
             <div class="flex gap-2">
               <button class="odds-btn px-6 py-3 rounded-xl text-center" data-match="${match.id}" data-type="home" data-odd="${match.odds.home}"><div class="text-xs text-[var(--text-muted)]">1</div><div class="font-bold">${match.odds.home}</div></button>
               <button class="odds-btn px-6 py-3 rounded-xl text-center" data-match="${match.id}" data-type="draw" data-odd="${match.odds.draw}"><div class="text-xs text-[var(--text-muted)]">X</div><div class="font-bold">${match.odds.draw}</div></button>
               <button class="odds-btn px-6 py-3 rounded-xl text-center" data-match="${match.id}" data-type="away" data-odd="${match.odds.away}"><div class="text-xs text-[var(--text-muted)]">2</div><div class="font-bold">${match.odds.away}</div></button>
             </div>
           </div>
        </div>`;
    }

    function renderLiveMatches() {
      const live = allMatches.filter(m => m.isLive).slice(0, 6);
      els.liveCount.textContent = `(${live.length} events)`;
      els.liveMatchesContainer.innerHTML = live.map(m => `
        <div class="bg-[var(--bg-card)] rounded-xl border border-[var(--border-primary)] overflow-hidden hover:border-[var(--accent-primary)]/50 transition-all match-card" data-match-id="${m.id}">
          <div class="p-3 bg-[var(--bg-elevated)] border-b border-[var(--border-primary)] flex items-center justify-between">
            <div class="flex items-center gap-2"><span class="text-sm">${m.league.flag}</span><span class="text-xs font-medium">${m.league.name}</span></div>
            <div class="flex items-center gap-1.5"><span class="w-2 h-2 bg-[var(--accent-red)] rounded-full animate-pulse-live"></span><span class="text-xs font-semibold text-[var(--accent-red)]">${m.minute}'</span></div>
          </div>
          <div class="p-4">
            <div class="flex justify-between items-center mb-4">
              <span class="font-medium">${m.home}</span><span class="font-display text-xl font-bold">${m.homeScore}</span>
            </div>
            <div class="flex justify-between items-center mb-4">
              <span class="font-medium">${m.away}</span><span class="font-display text-xl font-bold">${m.awayScore}</span>
            </div>
            <div class="grid grid-cols-3 gap-2">
              <button class="odds-btn rounded-lg p-2 text-center" data-match="${m.id}" data-type="home" data-odd="${m.odds.home}"><div class="text-[10px] text-[var(--text-muted)]">1</div><div class="font-semibold text-sm">${m.odds.home}</div></button>
              <button class="odds-btn rounded-lg p-2 text-center" data-match="${m.id}" data-type="draw" data-odd="${m.odds.draw}"><div class="text-[10px] text-[var(--text-muted)]">X</div><div class="font-semibold text-sm">${m.odds.draw}</div></button>
              <button class="odds-btn rounded-lg p-2 text-center" data-match="${m.id}" data-type="away" data-odd="${m.odds.away}"><div class="text-[10px] text-[var(--text-muted)]">2</div><div class="font-semibold text-sm">${m.odds.away}</div></button>
            </div>
          </div>
        </div>
      `).join('');
    }

    function renderUpcomingMatches(filter = 'football') {
      const upcoming = allMatches.filter(m => m.sport === filter && !m.isLive);
      const grouped = {};
      upcoming.forEach(m => {
        if (!grouped[m.league.id]) grouped[m.league.id] = [];
        grouped[m.league.id].push(m);
      });

      els.upcomingMatchesContainer.innerHTML = Object.values(grouped).map(matches => `
        <div class="bg-[var(--bg-card)] rounded-xl border border-[var(--border-primary)] overflow-hidden mb-4">
          <div class="p-3 bg-[var(--bg-elevated)] border-b border-[var(--border-primary)] flex items-center gap-2">
            <span>${matches[0].league.flag}</span><span class="font-medium text-sm">${matches[0].league.name}</span>
          </div>
          <div class="divide-y divide-[var(--border-primary)]">
            ${matches.map(m => `
              <div class="match-row p-3 flex items-center gap-4 transition-colors" data-match-id="${m.id}">
                <div class="text-xs text-[var(--text-muted)] w-12">${m.time}</div>
                <div class="flex-1 flex items-center justify-between text-sm">
                  <span>${m.home}</span><span class="text-[var(--text-muted)] text-xs mx-2">vs</span><span>${m.away}</span>
                </div>
                <div class="flex gap-2">
                  <button class="odds-btn w-16 py-2 rounded-lg text-center" data-match="${m.id}" data-type="home" data-odd="${m.odds.home}"><div class="text-[10px] text-[var(--text-muted)]">1</div><div class="font-semibold text-sm">${m.odds.home}</div></button>
                  <button class="odds-btn w-16 py-2 rounded-lg text-center" data-match="${m.id}" data-type="draw" data-odd="${m.odds.draw}"><div class="text-[10px] text-[var(--text-muted)]">X</div><div class="font-semibold text-sm">${m.odds.draw}</div></button>
                  <button class="odds-btn w-16 py-2 rounded-lg text-center" data-match="${m.id}" data-type="away" data-odd="${m.odds.away}"><div class="text-[10px] text-[var(--text-muted)]">2</div><div class="font-semibold text-sm">${m.odds.away}</div></button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `).join('');
    }

    function renderPopularLeagues() {
      els.popularLeagues.innerHTML = leagues.map(l => `
        <a href="#" class="bg-[var(--bg-card)] rounded-xl p-4 border border-[var(--border-primary)] hover:border-[var(--accent-primary)]/50 transition-all text-center group">
          <div class="text-2xl mb-2">${l.flag}</div>
          <div class="text-xs font-medium group-hover:text-[var(--accent-primary)]">${l.name}</div>
          <div class="text-[10px] text-[var(--text-muted)]">${l.country}</div>
        </a>
      `).join('');
    }

    function renderCasinoGames() {
      const games = ['Sweet Bonanza', 'Gates of Olympus', 'Big Bass', 'Starburst', 'Mega Moolah', 'Razor Shark'];
      els.casinoGames.innerHTML = games.map(g => `
        <a href="#" class="rounded-xl overflow-hidden group relative h-32 bg-gradient-to-br from-purple-600 to-blue-500 p-4 flex items-end">
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          <div class="relative z-10"><div class="text-xs font-semibold">${g}</div><div class="text-[10px] text-[var(--text-muted)]">Play Now</div></div>
        </a>
      `).join('');
    }

    // ========================================
    // BETSLIP LOGIC
    // ========================================

    function toggleOdds(btn) {
      const id = btn.dataset.match;
      const type = btn.dataset.type;
      const odd = btn.dataset.odd;
      const match = allMatches.find(m => m.id === id);
      if (!match) return;

      const idx = betslip.findIndex(b => b.id === id);

      if (idx !== -1) {
        if (betslip[idx].type === type) {
          betslip.splice(idx, 1);
          btn.classList.remove('selected');
        } else {
          document.querySelector(`.odds-btn[data-match="${id}"][data-type="${betslip[idx].type}"]`)?.classList.remove('selected');
          betslip[idx] = { id, home: match.home, away: match.away, type, odd };
          btn.classList.add('selected');
        }
      } else {
        betslip.push({ id, home: match.home, away: match.away, type, odd });
        btn.classList.add('selected');
      }
      updateBetslip();
    }

    function updateBetslip() {
      const hasItems = betslip.length > 0;
      els.betslipEmpty.classList.toggle('hidden', hasItems);
      els.betslipItems.classList.toggle('hidden', !hasItems);
      els.betslipFooter.classList.toggle('hidden', !hasItems);
      els.betslipCount.textContent = betslip.length;
      els.mobileBetCount.textContent = betslip.length;

      if (hasItems) {
        els.betslipItems.innerHTML = betslip.map(b => `
          <div class="bg-[var(--bg-base)] rounded-lg p-3 animate-slide-right">
            <div class="flex justify-between items-center mb-2">
              <span class="text-xs text-[var(--text-muted)]">${b.home} vs ${b.away}</span>
              <button class="remove-bet text-[var(--text-muted)] hover:text-[var(--accent-red)]" data-id="${b.id}"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
            </div>
            <div class="flex justify-between"><span class="text-sm font-medium capitalize">${b.type}</span><span class="font-bold text-[var(--accent-primary)]">${b.odd}</span></div>
          </div>
        `).join('');

        const total = betslip.reduce((a, b) => a * parseFloat(b.odd), 1);
        els.totalOdds.textContent = total.toFixed(2);
        els.potentialWin.textContent = `$${(total * currentStake).toFixed(2)}`;
      }
    }

    // ========================================
    // MODAL LOGIC
    // ========================================

    function openMatchModal(id) {
      const m = allMatches.find(m => m.id === id);
      if (!m) return;
      
      // Generate extended markets dynamically
      const markets = [
        { name: 'Match Result', options: [ { label: '1', odd: m.odds.home }, { label: 'X', odd: m.odds.draw }, { label: '2', odd: m.odds.away } ] },
        { name: 'Total Goals - Over/Under 2.5', options: [ { label: 'Over 2.5', odd: '1.85' }, { label: 'Under 2.5', odd: '1.95' } ] },
        { name: 'Both Teams To Score', options: [ { label: 'Yes', odd: '1.75' }, { label: 'No', odd: '2.10' } ] },
        { name: 'Corners - Over/Under 9.5', options: [ { label: 'Over 9.5', odd: '1.90' }, { label: 'Under 9.5', odd: '1.90' } ] },
        { name: 'Total Corners', options: [ { label: '1-6', odd: '4.50' }, { label: '7-9', odd: '3.20' }, { label: '10-12', odd: '2.80' }, { label: '13+', odd: '2.10' } ] },
        { name: 'Goalkeeper Saves - Over/Under 4.5', options: [ { label: 'Over 4.5', odd: '1.65' }, { label: 'Under 4.5', odd: '2.20' } ] },
        { name: 'First Goal Scorer', options: [ { label: m.home.substring(0,3) + ' Striker', odd: '3.50' }, { label: m.away.substring(0,3) + ' Striker', odd: '4.00' }, { label: 'Other', odd: '1.80' } ] },
        { name: 'Anytime Goal Scorer', options: [ { label: m.home.substring(0,3) + ' Star', odd: '2.10' }, { label: m.away.substring(0,3) + ' Star', odd: '2.40' } ] },
        { name: 'Last Goal Scorer', options: [ { label: m.home.substring(0,3) + ' Striker', odd: '3.60' }, { label: m.away.substring(0,3) + ' Striker', odd: '4.10' }, { label: 'Other', odd: '1.85' } ] },
        { name: 'Cards - Total Over/Under 3.5', options: [ { label: 'Over 3.5', odd: '1.70' }, { label: 'Under 3.5', odd: '2.10' } ] },
        { name: 'Offsides - Over/Under 2.5', options: [ { label: 'Over 2.5', odd: '1.90' }, { label: 'Under 2.5', odd: '1.90' } ] },
        { name: 'Penalty Awarded', options: [ { label: 'Yes', odd: '2.80' }, { label: 'No', odd: '1.40' } ] },
        { name: 'Red Card Shown', options: [ { label: 'Yes', odd: '3.50' }, { label: 'No', odd: '1.28' } ] },
        { name: 'Clean Sheet - ' + m.home, options: [ { label: 'Yes', odd: '2.60' }, { label: 'No', odd: '1.45' } ] },
        { name: 'Clean Sheet - ' + m.away, options: [ { label: 'Yes', odd: '3.20' }, { label: 'No', odd: '1.30' } ] },
      ];

      els.modalTitle.textContent = `${m.home} vs ${m.away}`;
      els.modalContent.innerHTML = `
        <div class="grid lg:grid-cols-3 gap-6">
          <!-- Main Info -->
          <div class="lg:col-span-2 space-y-4">
            <div class="bg-[var(--bg-card)] rounded-xl p-6 text-center">
              <div class="text-xs text-[var(--text-muted)] mb-2">${m.league.name}</div>
              <div class="flex items-center justify-center gap-6">
                <div class="w-16 h-16 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center font-display font-bold text-xl">${m.home.substring(0,2).toUpperCase()}</div>
                <div class="text-center">
                  ${m.isLive ? `<div class="text-3xl font-bold">${m.homeScore} - ${m.awayScore}</div><div class="text-xs text-[var(--accent-red)]">${m.minute}'</div>` : `<div class="text-xl font-bold">${m.time}</div>`}
                </div>
                <div class="w-16 h-16 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center font-display font-bold text-xl">${m.away.substring(0,2).toUpperCase()}</div>
              </div>
            </div>

            <!-- Markets -->
            <div class="space-y-3">
              ${markets.map(market => `
                <div class="bg-[var(--bg-card)] rounded-xl p-4">
                  <div class="text-sm font-semibold mb-3">${market.name}</div>
                  <div class="grid grid-cols-${Math.min(market.options.length, 4)} gap-2">
                    ${market.options.map(opt => `
                      <button class="odds-btn py-2 rounded-lg text-center text-sm" data-match="${m.id}" data-type="${opt.label}" data-odd="${opt.odd}">
                        <div class="text-[10px] text-[var(--text-muted)]">${opt.label}</div>
                        <div class="font-bold">${opt.odd}</div>
                      </button>
                    `).join('')}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Stats -->
          <div class="space-y-4">
            <div class="bg-[var(--bg-card)] rounded-xl p-4">
              <div class="font-semibold mb-3">Match Stats</div>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between"><span class="text-[var(--text-muted)]">Form</span><span>W W D L W</span></div>
                <div class="flex justify-between"><span class="text-[var(--text-muted)]">Last 5</span><span>W L W D D</span></div>
                <div class="flex justify-between"><span class="text-[var(--text-muted)]">H2H Wins</span><span>12 - 8</span></div>
              </div>
            </div>
          </div>
        </div>
      `;

      els.matchModal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      
      // Re-attach odds listeners for modal content
      els.modalContent.querySelectorAll('.odds-btn').forEach(btn => {
        btn.addEventListener('click', () => toggleOdds(btn));
      });
    }

    function closeMatchModal() {
      els.matchModal.classList.add('hidden');
      document.body.style.overflow = '';
    }

    // ========================================
    // EVENT LISTENERS
    // ========================================

    function setupEventListeners() {
      // Sidebar Toggle
      els.sidebarToggle.addEventListener('click', () => {
        els.sidebar.classList.toggle('open');
      });

      // Notifications
      els.notifBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        els.notifDropdown.classList.toggle('hidden');
      });
      document.addEventListener('click', () => els.notifDropdown.classList.add('hidden'));

      // Wallet Modal
      els.depositBtn.addEventListener('click', () => {
        els.walletModal.classList.remove('hidden');
        els.depositTabBtn.classList.add('border-[var(--accent-primary)]', 'text-[var(--accent-primary)]');
        els.depositTabBtn.classList.remove('border-transparent', 'text-[var(--text-muted)]');
      });
      els.withdrawBtn.addEventListener('click', () => {
        els.walletModal.classList.remove('hidden');
        els.withdrawTabBtn.classList.add('border-[var(--accent-primary)]', 'text-[var(--accent-primary)]');
        els.withdrawTabBtn.classList.remove('border-transparent', 'text-[var(--text-muted)]');
      });
      els.closeWalletModal.addEventListener('click', () => els.walletModal.classList.add('hidden'));
      els.walletModalBackdrop.addEventListener('click', () => els.walletModal.classList.add('hidden'));

      els.walletSubmitBtn.addEventListener('click', () => {
        const amount = parseFloat(document.getElementById('walletAmount').value);
        userBalance += amount;
        els.userBalance.textContent = `$${userBalance.toFixed(2)}`;
        els.walletModal.classList.add('hidden');
        showToast(`$${amount.toFixed(2)} added to balance!`);
      });

      // Match Modal
      els.closeModal.addEventListener('click', closeMatchModal);
      els.modalBackdrop.addEventListener('click', closeMatchModal);

      // Delegation for match clicks
      document.addEventListener('click', (e) => {
        const card = e.target.closest('.match-card');
        const row = e.target.closest('.match-row');
        const oddsBtn = e.target.closest('.odds-btn');

        if (oddsBtn) {
          e.stopPropagation();
          toggleOdds(oddsBtn);
        } else if (card && !card.contains(oddsBtn)) {
          openMatchModal(card.dataset.matchId);
        } else if (row && !row.contains(oddsBtn)) {
          openMatchModal(row.dataset.matchId);
        }
      });

      // Betslip
      els.stakeInput.addEventListener('input', (e) => {
        currentStake = parseFloat(e.target.value) || 0;
        updateBetslip();
      });
      
      document.querySelectorAll('.quick-stake').forEach(btn => {
        btn.addEventListener('click', () => {
          currentStake = parseInt(btn.dataset.amount);
          els.stakeInput.value = currentStake;
          updateBetslip();
        });
      });

      els.placeBetBtn.addEventListener('click', () => {
        if (betslip.length > 0) {
          showToast('Bet Placed Successfully!');
          betslip = [];
          document.querySelectorAll('.odds-btn.selected').forEach(b => b.classList.remove('selected'));
          updateBetslip();
        }
      });

      els.clearSlipBtn.addEventListener('click', () => {
        betslip = [];
        document.querySelectorAll('.odds-btn.selected').forEach(b => b.classList.remove('selected'));
        updateBetslip();
      });

      // Tabs
      document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.tab-btn').forEach(b => {
            b.classList.remove('active', 'border-[var(--accent-primary)]', 'text-[var(--accent-primary)]');
            b.classList.add('text-[var(--text-secondary)]', 'border-transparent');
          });
          btn.classList.add('active', 'border-[var(--accent-primary)]', 'text-[var(--accent-primary)]');
          btn.classList.remove('text-[var(--text-secondary)]', 'border-transparent');
          renderUpcomingMatches(btn.dataset.tab);
        });
      });
    }

    function showToast(msg) {
      const t = document.createElement('div');
      t.className = 'px-4 py-3 rounded-lg bg-[var(--accent-primary)] text-[var(--bg-base)] font-medium text-sm animate-slide-left shadow-lg';
      t.textContent = msg;
      els.toastContainer.appendChild(t);
      setTimeout(() => {
        t.style.opacity = '0';
        t.style.transform = 'translateX(100%)';
        t.style.transition = 'all 0.3s ease';
        setTimeout(() => t.remove(), 300);
      }, 2000);
    }
