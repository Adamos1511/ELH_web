let hraciData = [];

async function nactiData() {
  const response = await fetch("https://raw.githubusercontent.com/Adamos1511/ELH-datab-ze-hr-/refs/heads/main/hraciELH.csv");
  const text = await response.text();
  const radky = text.trim().split("\n").slice(1);

  hraciData = radky.map(r => {
    const [jmeno, prijmeni, smlouva, pozice, tym, vek, drzeni, narodnost, odchovanec] = r.split(";");
    return {
      jmeno: jmeno?.trim(),
      prijmeni: prijmeni?.trim(),
      smlouva: smlouva?.trim(),
      pozice: pozice?.trim(),
      tym: tym?.trim(),
      vek: parseInt(vek?.trim()) || "",
      drzeni: drzeni?.trim(),
      narodnost: narodnost?.trim(),
      odchovanec: odchovanec?.trim()
    };
  });

  naplnitFiltry();
  zobrazHrace(hraciData);
}

function naplnitFiltry() {
  const tymy = [...new Set(hraciData.map(h => h.tym).filter(Boolean))].sort();
  const pozice = [...new Set(hraciData.map(h => h.pozice).filter(Boolean))].sort();
  const narodnosti = [...new Set(hraciData.map(h => h.narodnost).filter(Boolean))].sort();

  function naplnSelect(selectId, hodnoty) {
    const select = document.getElementById(selectId);
    hodnoty.forEach(v => {
      const opt = document.createElement("option");
      opt.value = v;
      opt.textContent = v;
      select.appendChild(opt);
    });
  }

  naplnSelect("filtrTym", tymy);
  naplnSelect("filtrPozice", pozice);
  naplnSelect("filtrNarodnost", narodnosti);
}

function aplikujFiltry() {
  let data = [...hraciData];

  const vybranyTym = document.getElementById("filtrTym").value;
  const vybranaPozice = document.getElementById("filtrPozice").value;
  const vybraneDrzeni = document.getElementById("filtrDrzeni").value;
  const vybranaNarodnost = document.getElementById("filtrNarodnost").value;
  const vybranaSmlouva = document.getElementById("filtrSmlouva").value;
  const razeni = document.getElementById("razeni").value;
  const hledat = document.getElementById("search").value.toLowerCase();

  // Textové vyhledávání
  if (hledat) {
    data = data.filter(h =>
      (`${h.jmeno} ${h.prijmeni}`).toLowerCase().includes(hledat)
    );
  }

  // Filtrace
  if (vybranyTym) data = data.filter(h => h.tym === vybranyTym);
  if (vybranaPozice) data = data.filter(h => h.pozice === vybranaPozice);
  if (vybraneDrzeni) data = data.filter(h => h.drzeni === vybraneDrzeni);
  if (vybranaNarodnost) data = data.filter(h => h.narodnost === vybranaNarodnost);

  // Filtr smlouvy
  if (vybranaSmlouva === "konci") {
    data = data.filter(h => h.smlouva.trim() === "-" || h.smlouva.trim() === "–");
  } else if (vybranaSmlouva === "plati") {
    data = data.filter(h => h.smlouva.trim() !== "-" && h.smlouva.trim() !== "–");
  }

  // Řazení
  switch (razeni) {
    case "prijmeni_az": data.sort((a, b) => a.prijmeni.localeCompare(b.prijmeni)); break;
    case "prijmeni_za": data.sort((a, b) => b.prijmeni.localeCompare(a.prijmeni)); break;
    case "tym_az": data.sort((a, b) => a.tym.localeCompare(b.tym)); break;
    case "tym_za": data.sort((a, b) => b.tym.localeCompare(a.tym)); break;
    case "pozice_az": data.sort((a, b) => a.pozice.localeCompare(b.pozice)); break;
    case "pozice_za": data.sort((a, b) => b.pozice.localeCompare(a.pozice)); break;
    case "narodnost_az": data.sort((a, b) => a.narodnost.localeCompare(b.narodnost)); break;
    case "narodnost_za": data.sort((a, b) => b.narodnost.localeCompare(a.narodnost)); break;
    case "vek_asc": data.sort((a, b) => (a.vek || 0) - (b.vek || 0)); break;
    case "vek_desc": data.sort((a, b) => (b.vek || 0) - (a.vek || 0)); break;
    case "smlouva_asc": data.sort((a, b) => a.smlouva.localeCompare(b.smlouva)); break;
    case "smlouva_desc": data.sort((a, b) => b.smlouva.localeCompare(a.smlouva)); break;
  }

  zobrazHrace(data);
}

function zobrazHrace(data) {
  const container = document.getElementById("hraci");
  if (data.length === 0) {
    container.innerHTML = "<p style='text-align:center;'>Žádní hráči nenalezeni.</p>";
    return;
  }

  container.innerHTML = data.map(h => `
    <div class="hrac">
      <h3>${h.jmeno} ${h.prijmeni}</h3>
      <div class="tag">${h.pozice || "-"}</div>
      <p><b>Tým:</b> ${h.tym || "-"}</p>
      <p><b>Věk:</b> ${h.vek || "-"}</p>
      <p><b>Smlouva:</b> ${h.smlouva || "-"}</p>
      <p><b>Držení hole:</b> ${h.drzeni || "-"}</p>
      <p><b>Národnost:</b> ${h.narodnost || "-"}</p>
    </div>
  `).join("");
}

nactiData();
