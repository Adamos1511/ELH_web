let hraciData = [];
/* === PŘEHLED KLUBŮ === */
const kluby = [
  { nazev: "HC Dynamo Pardubice", zkratka: "PCE" },
  { nazev: "HC Sparta Praha", zkratka: "SPA" },
  { nazev: "HC Oceláři Třinec", zkratka: "TRI" },
  { nazev: "HC Kometa Brno", zkratka: "KOM" },
  { nazev: "HC Škoda Plzeň", zkratka: "PLZ" },
  { nazev: "Mountfield HK", zkratka: "MHK" },
  { nazev: "HC Vítkovice Ridera", zkratka: "VIT" },
  { nazev: "HC Olomouc", zkratka: "OLO" },
  { nazev: "BK Mladá Boleslav", zkratka: "MBL" },
  { nazev: "HC Energie Karlovy Vary", zkratka: "KVA" },
  { nazev: "HC Motor České Budějovice", zkratka: "CBU" },
  { nazev: "HC Litvínov", zkratka: "LIT" },
  { nazev: "Bílí Tygři Liberec", zkratka: "LIB" },
  { nazev: "Rytíři Kladno", zkratka: "KLA" }
];
// --- MAPA ZKRATEK TÝMŮ ELH ---
const zkratkyTymu = {
  "HC Dynamo Pardubice": "PCE",
  "HC Sparta Praha": "SPA",
  "HC Oceláři Třinec": "TRI",
  "HC Kometa Brno": "BRN",
  "HC Škoda Plzeň": "PLZ",
  "Mountfield HK": "HKM",
  "HC Vítkovice Ridera": "VIT",
  "HC Olomouc": "OLO",
  "BK Mladá Boleslav": "MBL",
  "HC Energie Karlovy Vary": "KVA",
  "HC Motor České Budějovice": "CBU",
  "HC Litvínov": "LIT",
  "Bílí Tygři Liberec": "LIB",
  "Rytíři Kladno": "KLA"
};
const nazvyTymu = {
  CBU: "Banes Motor České Budějovice",
  PLZ: "HC Škoda Plzeň",
  SPA: "HC Sparta Praha",
  TRI: "HC Oceláři Třinec",
  KOM: "HC Kometa Brno",
  MBL: "BK Mladá Boleslav",
  LIT: "HC Verva Litvínov",
  KVA: "HC Energie Karlovy Vary",
  OLO: "HC Olomouc",
  LIB: "Bílí Tygři Liberec",
  HRA: "Mountfield HK",
  PCE: "HC Dynamo Pardubice",
  KLA: "Rytíři Kladno",
};

// --- FUNKCE PRO ZOBRAZENÍ LOGA TÝMU ---
function logoTymu(nazev) {
  if (!nazev) return "";
  const zkratka = zkratkyTymu[nazev] || nazev;
  const path = `https://raw.githubusercontent.com/Adamos1511/ELH-web/main/loga_tymu/${zkratka}.png`;
  return `<img src="${path}" alt="${zkratka}" class="logoMale">`;
}

// --- NAČTENÍ DAT Z CSV ---
async function nactiData() {
  const response = await fetch("https://raw.githubusercontent.com/Adamos1511/ELH_web/refs/heads/main/hraciELH.csv");
  const text = await response.text();
  const radky = text.trim().split("\n").slice(1);

  hraciData = radky.map(r => {
    const [jmeno, prijmeni, smlouva, pozice, tym, vek, drzeni, narodnost, foto] = r.split(";");
    return {
      jmeno: jmeno?.trim(),
      prijmeni: prijmeni?.trim(),
      smlouva: smlouva?.trim(),
      pozice: pozice?.trim(),
      tym: tym?.trim(),
      vek: parseInt(vek?.trim()) || "",
      drzeni: drzeni?.trim(),
      narodnost: narodnost?.trim(),
      foto: foto?.trim().replace(/\r/g, "")

    };
  });

  naplnitFiltry();
  zobrazHrace(hraciData);
}
let dataKluby = [];

Papa.parse("https://raw.githubusercontent.com/Adamos1511/ELH-web/main/kluby.csv", {
  download: true,
  header: true,
  complete: function(results) {
    dataKluby = results.data;
  }
});

// --- ZOBRAZENÍ HRÁČŮ ---
function zobrazHrace(data) {
  const container = document.getElementById("hraci");
  if (!container) return;
  
  if (data.length === 0) {
    container.innerHTML = "<p style='text-align:center;'>Žádní hráči nenalezeni.</p>";
    return;
  }

  container.innerHTML = data.map(h => `
    <div class="hrac" onclick="zobrazDetail('${h.jmeno}', '${h.prijmeni}', '${h.tym}', '${h.pozice}', '${h.vek}', '${h.smlouva}', '${h.drzeni}', '${h.narodnost}', '${h.foto}')">
      
      <div class="foto-box">
        ${h.foto 
          ? `<img src="${h.foto}" alt="${h.jmeno} ${h.prijmeni}" class="fotoHraceKarta">`
          : `<div class="fotoPlaceholder"></div>`}
      </div>

      <div class="hrac-info">
        <h3>${h.jmeno} ${h.prijmeni}</h3>
        <p><b>Tým:</b> 
          ${zkratkyTymu[h.tym] ? zkratkyTymu[h.tym] : h.tym} 
          ${logoTymu(h.tym)} 
          
        </p>
        <p><b>Pozice:</b> ${h.pozice || "-"}</p>
        <p><b>Věk:</b> ${h.vek || "-"}</p>
        <p><b>Smlouva:</b> ${h.smlouva || "-"}</p>
        <p><b>Držení hole:</b> ${h.drzeni || "-"}</p>
        <p><b>Národnost:</b> ${h.narodnost || "-"}</p>
      </div>
    </div>
  `).join("");
}


// --- DETAIL HRÁČE ---
function zobrazDetail(jmeno, prijmeni, tym, pozice, vek, smlouva, drzeni, narodnost, foto) {
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
      ${foto ? `<img src="${foto}" alt="${jmeno} ${prijmeni}" class="fotoDetail">` : ""}
      <h2>${jmeno} ${prijmeni}</h2>
      <p><b>Tým:</b> ${zkratkyTymu[tym] || tym} ${logoTymu(tym)} ${tym}</p>
      <p><b>Pozice:</b> ${pozice}</p>
      <p><b>Věk:</b> ${vek}</p>
      <p><b>Smlouva:</b> ${smlouva}</p>
      <p><b>Držení hole:</b> ${drzeni}</p>
      <p><b>Národnost:</b> ${narodnost}</p>
    </div>
  `;
  document.body.appendChild(modal);

  modal.addEventListener("click", e => {
    if (e.target === modal) modal.remove();
  });
}


// --- FILTRY ---
function naplnitFiltry() {
  const tymy = [...new Set(hraciData.map(h => h.tym))].sort();
  const pozice = [...new Set(hraciData.map(h => h.pozice))].sort();
  const drzeni = [...new Set(hraciData.map(h => h.drzeni))].sort();
  const narody = [...new Set(hraciData.map(h => h.narodnost))].sort();
  const smlouvy = [...new Set(hraciData.map(h => h.smlouva))].sort();
  

  function naplnSelect(id, pole, popisek) {
    const select = document.getElementById(id);
    if (!select) return;
    select.innerHTML = `<option value="">${popisek}</option>`;
    pole.forEach(val => {
      if (val) {
        const option = document.createElement("option");
        option.value = val;
        option.textContent = val;
        select.appendChild(option);
      }
    });
    select.addEventListener("change", filtruj);
  }

  naplnSelect("filtrTymu", tymy, "Všechny týmy");
  naplnSelect("filtrPozice", pozice, "Všechny pozice");
  naplnSelect("filtrDrzeni", drzeni, "Všechna držení");
  naplnSelect("filtrNarodnost", narody, "Všechny národnosti");
  naplnSelect("filtrSmlouva", smlouvy, "Všechny smlouvy");

  const vyhledavani = document.getElementById("vyhledavani");
  if (vyhledavani) vyhledavani.addEventListener("input", filtruj);
}

/* --- FUNKCE PRO FILTROVÁNÍ --- */
function naplnitFiltry() {
  const tymy = [...new Set(hraciData.map(h => h.tym))].sort();
  const pozice = [...new Set(hraciData.map(h => h.pozice))].sort();
  const drzeni = [...new Set(hraciData.map(h => h.drzeni))].sort();
  const narody = [...new Set(hraciData.map(h => h.narodnost))].sort();
  const smlouvy = [...new Set(hraciData.map(h => h.smlouva))].sort();

  function naplnSelect(id, pole, popisek) {
    const select = document.getElementById(id);
    if (!select) return;
    select.innerHTML = `<option value="">${popisek}</option>`;
    pole.forEach(val => {
      if (val) {
        const option = document.createElement("option");
        option.value = val;
        option.textContent = val;
        select.appendChild(option);
      }
    });
    select.addEventListener("change", filtruj);
  }

  naplnSelect("filtrTymu", tymy, "Všechny týmy");
  naplnSelect("filtrPozice", pozice, "Všechny pozice");
  naplnSelect("filtrDrzeni", drzeni, "Všechna držení");
  naplnSelect("filtrNarodnost", narody, "Všechny národnosti");
  naplnSelect("filtrSmlouva", smlouvy, "Všechny smlouvy");

  const vyhledavani = document.getElementById("vyhledavani");
  if (vyhledavani) vyhledavani.addEventListener("input", filtruj);

  const razeni = document.getElementById("razeni");
  if (razeni) razeni.addEventListener("change", filtruj);
}

function filtruj() {
  const hledani = document.getElementById("vyhledavani")?.value.toLowerCase() || "";
  const tym = document.getElementById("filtrTymu")?.value || "";
  const pozice = document.getElementById("filtrPozice")?.value || "";
  const drzeni = document.getElementById("filtrDrzeni")?.value || "";
  const narodnost = document.getElementById("filtrNarodnost")?.value || "";
  const smlouva = document.getElementById("filtrSmlouva")?.value || "";
  const razeni = document.getElementById("razeni")?.value || "";

  let filtrovani = hraciData.filter(h =>
    (!tym || h.tym === tym) &&
    (!pozice || h.pozice === pozice) &&
    (!drzeni || h.drzeni === drzeni) &&
    (!narodnost || h.narodnost === narodnost) &&
    (!smlouva || h.smlouva === smlouva) &&
    (`${h.jmeno} ${h.prijmeni}`.toLowerCase().includes(hledani))
  );


  if (razeni) {
  filtrovani.sort((a, b) => {
    switch (razeni) {
      case "prijmeni_az":
        return a.prijmeni.localeCompare(b.prijmeni, "cs");
      case "prijmeni_za":
        return b.prijmeni.localeCompare(a.prijmeni, "cs");

      case "vek_asc":
        return (a.vek || 0) - (b.vek || 0);
      case "vek_desc":
        return (b.vek || 0) - (a.vek || 0);

      case "tym_az":
        return a.tym.localeCompare(b.tym, "cs");
      case "tym_za":
        return b.tym.localeCompare(a.tym, "cs");

      case "pozice_az":
        return a.pozice.localeCompare(b.pozice, "cs");
      case "pozice_za":
        return b.pozice.localeCompare(a.pozice, "cs");

      case "narodnost_az":
        return a.narodnost.localeCompare(b.narodnost, "cs");
      case "narodnost_za":
        return b.narodnost.localeCompare(a.narodnost, "cs");

      case "smlouva_asc":
        return a.smlouva.localeCompare(b.smlouva, "cs");
      case "smlouva_desc":
        return b.smlouva.localeCompare(a.smlouva, "cs");

      default:
        return 0;
    }
  });
}


  zobrazHrace(filtrovani);
}
/* === FUNKCE PRO ZOBRAZENÍ KLUBŮ === */


// Po kliknutí na "Kluby" v menu
document.addEventListener("DOMContentLoaded", () => {
  const odkazKluby = document.getElementById("odkazKluby");
  if (odkazKluby) {
    odkazKluby.addEventListener("click", (e) => {
      e.preventDefault();
      zobrazKluby();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});

function zobrazKluby() {
  const container = document.getElementById("seznam-klubu");
  if (!container) return;
  container.innerHTML = kluby.map(k => `
    <div class="klub-karta" onclick="otevriKlub('${k.zkratka}')">
      <img src="https://raw.githubusercontent.com/Adamos1511/ELH-web/main/loga_tymu/${k.zkratka}.png" alt="${k.nazev}">
      <h3>${k.nazev}</h3>
    </div>
  `).join("");

  document.getElementById("kluby").style.display = "block";
}
function otevriKlub(zkratka) {
  // Najdeme klub podle názvu týmu
  const klub = dataKluby.find(k => k["NÁZEV TÝMU"] === zkratka);
  if (!klub) {
    alert("⚠️ Klub nebyl nalezen v CSV souboru.");
    console.log("Hledaná hodnota:", zkratka);
    console.log("Dostupné hodnoty:", dataKluby.map(k => k["NÁZEV TÝMU"]));
    return;
  }

  // Najdeme hráče podle týmu
  const hraciTymu = hraciData.filter(h => h.tym === zkratka);

  // Otevře novou kartu
  const okno = window.open("", "_blank");
  okno.document.write(`
    <html lang="cs">
      <head>
        <meta charset="UTF-8">
        <title>${klub["NÁZEV TÝMU"]}</title>
        <link rel="stylesheet" href="style.css">
        <style>
          body {
            background: linear-gradient(to bottom, #001147, #002b80);
            color: white;
            font-family: 'Segoe UI', Tahoma, sans-serif;
            padding: 40px;
          }
          .klub-detail {
            text-align: center;
            margin-bottom: 40px;
          }
          .klub-detail img {
            height: 120px;
            margin-bottom: 10px;
          }
          .info-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px 25px;
            max-width: 950px;
            margin: 0 auto 40px auto;
            text-align: left;
            background: rgba(255,255,255,0.08);
            padding: 20px 40px;
            border-radius: 15px;
          }
          .info-grid p {
            margin: 4px 0;
            font-size: 15px;
          }
          h1 {
            font-size: 30px;
            margin-bottom: 15px;
          }
          h2 {
            text-align: center;
            margin-top: 50px;
            margin-bottom: 10px;
            font-size: 24px;
          }
          .hraci-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
            gap: 20px;
            margin-top: 30px;
          }
          .hrac-karta {
            background: #fff;
            border-radius: 8px;
            padding: 10px;
            text-align: center;
            color: black;
            box-shadow: 0 2px 6px rgba(0,0,0,0.2);
            transition: transform 0.2s;
          }
          .hrac-karta:hover {
            transform: scale(1.04);
          }
        </style>
      </head>

      <body>
        <div class="klub-detail">
          <img src="https://raw.githubusercontent.com/Adamos1511/ELH-web/main/loga_tymu/${zkratka}.png" alt="${klub["NÁZEV TÝMU"]}">
          <h1>${klub["NÁZEV TÝMU"]}</h1>
        </div>

        <div class="info-grid">
          <p><b>Rok založení:</b> ${klub["ROK ZALOŽENÍ"] || "-"}</p>
          <p><b>Počet titulů:</b> ${klub["POČET TITULŮ"] || "-"}</p>
          <p><b>Hlavní trenér:</b> ${klub["HLAVNÍ TRENÉR"] || "-"}</p>
          <p><b>Sezona kdy nastoupil:</b> ${klub["SEZONA KDY NASTOUPIL"] || "-"}</p>
          <p><b>Dní jako hl. trenér:</b> ${klub["DNÍ JAKO HL.TRENÉR"] || "-"}</p>
          <p><b>Poslední titul:</b> ${klub["POSLEDNÍ TITUL"] || "-"}</p>
          <p><b>Průměrná návštěvnost:</b> ${klub["PRŮMĚRNÁ NÁVŠTĚVNOST"] || "-"}</p>
          <p><b>Kapacita stadionu:</b> ${klub["KAPACITA"] || "-"}</p>
          <p><b>% zaplněnost:</b> ${klub["% ZAPLNĚNOST"] || "-"}</p>
          <p><b>Název stadionu:</b> ${klub["NÁZEV STADIONU"] || "-"}</p>
        </div>

        <h2>Výsledky umístění</h2>
        <div class="info-grid">
          <p><b>2024/25 ZČ:</b> ${klub["2024/25 ZČ"] || "-"}</p>
          <p><b>2024/25 Playoff:</b> ${klub["2024/25 PLAYOFF"] || "-"}</p>
          <p><b>2023/24 ZČ:</b> ${klub["2023/24 ZČ"] || "-"}</p>
          <p><b>2023/24 Playoff:</b> ${klub["2023/24 PLAYOFF"] || "-"}</p>
          <p><b>2022/23 ZČ:</b> ${klub["2022/23 ZČ"] || "-"}</p>
          <p><b>2022/23 Playoff:</b> ${klub["2022/23 PLAYOFF"] || "-"}</p>
          <p><b>2021/22 ZČ:</b> ${klub["2021/22 ZČ"] || "-"}</p>
          <p><b>2021/22 Playoff:</b> ${klub["2021/22 PLAYOFF"] || "-"}</p>
          <p><b>2020/21 ZČ:</b> ${klub["2020/21 Z"] || "-"}</p>
          <p><b>2020/21 Playoff:</b> ${klub["2020/21 PLAYOFF"] || "-"}</p>
        </div>

        <h2>Soupiska týmu</h2>
        <div class="hraci-grid">
          ${hraciTymu.map(h => `
            <div class="hrac-karta">
              ${h.foto ? `<img src="${h.foto}" style="width:100%;border-radius:8px;">` : ""}
              <h3>${h.jmeno} ${h.prijmeni}</h3>
              <p><b>Pozice:</b> ${h.pozice}</p>
              <p><b>Věk:</b> ${h.vek}</p>
              <p><b>Národnost:</b> ${h.narodnost}</p>
              <p><b>Smlouva:</b> ${h.smlouva}</p>
            </div>
          `).join("")}
        </div>
      </body>
    </html>
  `);
}




// --- NAČTENÍ DAT PO STARTU ---
naplnitFiltry();
zobrazHrace(hraciData);
nactiData();
