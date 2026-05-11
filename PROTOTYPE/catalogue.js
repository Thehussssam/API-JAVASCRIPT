const API_URL = "https://countries-api-hsak.onrender.com/api/countries";

const container    = document.getElementById("Catalog");
const loadingEl    = document.getElementById("loading");
const selectEl     = document.getElementById("sort");
const searchEl     = document.getElementById("search");
const statsEl      = document.getElementById("status");
const resultsCount = document.getElementById("resultsCount");

let countries = [];

/* ── Fetch ─────────────────────────────────────────────── */
async function getContent() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    const data = await response.json();
    
    const extraCountries = [
      { id: 101, name: "Italy", capital: "Rome", continent: "Europe", population: 58870000, area: 301340, currency: "Euro (EUR)", language: "Italian", timezone: "UTC+01:00", flag: "https://flagcdn.com/w320/it.png" },
      { id: 102, name: "Spain", capital: "Madrid", continent: "Europe", population: 47420000, area: 505990, currency: "Euro (EUR)", language: "Spanish", timezone: "UTC+01:00", flag: "https://flagcdn.com/w320/es.png" },
      { id: 103, name: "United Kingdom", capital: "London", continent: "Europe", population: 67330000, area: 242495, currency: "British pound (GBP)", language: "English", timezone: "UTC+00:00", flag: "https://flagcdn.com/w320/gb.png" },
      { id: 104, name: "Argentina", capital: "Buenos Aires", continent: "South America", population: 45810000, area: 2780400, currency: "Argentine peso (ARS)", language: "Spanish", timezone: "UTC-03:00", flag: "https://flagcdn.com/w320/ar.png" },
      { id: 105, name: "South Korea", capital: "Seoul", continent: "Asia", population: 51740000, area: 100210, currency: "South Korean won (KRW)", language: "Korean", timezone: "UTC+09:00", flag: "https://flagcdn.com/w320/kr.png" },
      { id: 106, name: "Nigeria", capital: "Abuja", continent: "Africa", population: 213400000, area: 923768, currency: "Nigerian naira (NGN)", language: "English", timezone: "UTC+01:00", flag: "https://flagcdn.com/w320/ng.png" },
      { id: 107, name: "New Zealand", capital: "Wellington", continent: "Oceania", population: 5123000, area: 268021, currency: "New Zealand dollar (NZD)", language: "English", timezone: "UTC+12:00", flag: "https://flagcdn.com/w320/nz.png" },
      { id: 108, name: "Sweden", capital: "Stockholm", continent: "Europe", population: 10420000, area: 450295, currency: "Swedish krona (SEK)", language: "Swedish", timezone: "UTC+01:00", flag: "https://flagcdn.com/w320/se.png" },
      { id: 109, name: "Turkey", capital: "Ankara", continent: "Asia", population: 84680000, area: 783562, currency: "Turkish lira (TRY)", language: "Turkish", timezone: "UTC+03:00", flag: "https://flagcdn.com/w320/tr.png" },
      { id: 110, name: "Saudi Arabia", capital: "Riyadh", continent: "Asia", population: 35950000, area: 2149690, currency: "Saudi riyal (SAR)", language: "Arabic", timezone: "UTC+03:00", flag: "https://flagcdn.com/w320/sa.png" }
    ];

    const combinedData = [...data, ...extraCountries];
    const seen = new Set();
    countries = combinedData.filter(c => {
      if (seen.has(c.name)) return false;
      seen.add(c.name);
      return true;
    });
    loadingEl.style.display = "none";
    renderCards(countries);
    updateStatus();
  } catch (error) {
    loadingEl.style.display = "none";
    container.innerHTML = `
      <div class="empty-state">
        <svg width="64" height="64" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <p>Failed to load countries. Please try again later.</p>
      </div>`;
    console.error("Error loading countries:", error);
  }
}

/* ── Render ─────────────────────────────────────────────── */
function renderCards(list) {
  container.innerHTML = "";

  if (list.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <svg width="64" height="64" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <p>No countries match your search.</p>
      </div>`;
    resultsCount.textContent = "0 results";
    return;
  }

  resultsCount.textContent = `${list.length} ${list.length === 1 ? "country" : "countries"}`;

  list.forEach((country, index) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.style.animationDelay = `${Math.min(index * 40, 400)}ms`;

    card.innerHTML = `
      <img src="${country.flag}" alt="Flag of ${country.name}" loading="lazy" />
      <h3>${country.name}</h3>
      <div class="info-row"><span class="label">Capital</span> ${country.capital ?? "—"}</div>
      <div class="info-row"><span class="label">Language</span> ${country.language ?? "—"}</div>
      <div class="continent-badge">${country.continent}</div>
    `;

    card.addEventListener("click", () => {
      window.location.href = `country-details.html?id=${country.id}`;
    });

    container.appendChild(card);
  });
}

/* ── Filters ────────────────────────────────────────────── */
function getFiltered() {
  const query     = searchEl.value.toLowerCase().trim();
  const continent = selectEl.value;

  return countries.filter((c) => {
    const matchesSearch    = c.name.toLowerCase().includes(query);
    const matchesContinent = continent === "All" || c.continent === continent;
    return matchesSearch && matchesContinent;
  });
}

searchEl.addEventListener("input",  () => renderCards(getFiltered()));
selectEl.addEventListener("change", () => renderCards(getFiltered()));

/* ── Stats Bar ──────────────────────────────────────────── */
function updateStatus() {
  const total = countries.length;

  const continents = countries.reduce((acc, c) => {
    acc[c.continent] = (acc[c.continent] || 0) + 1;
    return acc;
  }, {});

  let html = `<span><strong>Total:</strong> ${total}</span>`;
  for (const [cont, count] of Object.entries(continents)) {
    html += `<span>${cont}: <strong>${count}</strong></span>`;
  }

  statsEl.innerHTML = html;
}

/* ── Init ───────────────────────────────────────────────── */
getContent();