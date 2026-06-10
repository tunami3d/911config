const DATA = {
  leather: {
    cognac: { name: "Cognac Leather", img: "seat_baseleather.png", chip: "cognac" },
    black: { name: "Black Leather", img: "seat_baseblack.png", chip: "black" },
    slate: { name: "Slate Grey", img: "seat_basegrey.png", chip: "slate" },
    cream: { name: "Cream", img: "seat_basecream.png", chip: "cream" },
    burgundy: { name: "Burgundy Red", img: "seat_basered.png", chip: "burgundy" }
  },
  insert: {
    none: { name: "None / Full Leather", img: "", chip: "none" },
    pepita: { name: "Pepita", img: "insert_pepita.png", chip: "pepita" },
    pinkTartan: { name: "Pink Tartan", img: "insert_pinktartan.png", chip: "pinkTartan" },
    coolJazz: { name: "Cool Jazz", img: "insert_cooljazz.png", chip: "coolJazz" }
  },
  hardware: {
    aluminum: { name: "Satin Aluminum", img: "hardware_alum.png", chip: "aluminum" },
    gold: { name: "Champagne Gold", img: "hardware_gold.png", chip: "gold" },
    carbon: { name: "Carbon Fiber", img: "hardware_carbon.png", chip: "carbon" },
    pink: { name: "Pink Anodized", img: "hardware_pink.png", chip: "pink" }
  }
};

let state = JSON.parse(localStorage.getItem("commission001") || "null") || { leather:"cognac", insert:"none", hardware:"carbon" };

function storyText() {
  const l = DATA.leather[state.leather].name.toLowerCase();
  const i = DATA.insert[state.insert].name.toLowerCase();
  const h = DATA.hardware[state.hardware].name.toLowerCase();
  if (state.insert === "none") {
    return `Commission 001 pairs ${l} with a full leather construction and ${h}. The result is a restrained grand touring study with warm material hierarchy, period influence, and a clean client-ready specification.`;
  }
  return `Commission 001 pairs ${l} with ${i} inserts and ${h}. The direction balances tactile craft, period-inspired character, and a clear material story for client review.`;
}

function assetPath(img) { return img ? `assets/${img}` : ""; }

function render() {
  const leather = DATA.leather[state.leather];
  const insert = DATA.insert[state.insert];
  const hardware = DATA.hardware[state.hardware];

  document.getElementById("baseLayer").src = assetPath(leather.img);
  document.getElementById("insertLayer").src = assetPath(insert.img);
  document.getElementById("hardwareLayer").src = assetPath(hardware.img);

  document.getElementById("insertLayer").style.display = insert.img ? "block" : "none";

  document.getElementById("leatherName").textContent = leather.name;
  document.getElementById("insertName").textContent = insert.name;
  document.getElementById("hardwareName").textContent = hardware.name;
  document.getElementById("specLeather").textContent = leather.name;
  document.getElementById("specInsert").textContent = insert.name;
  document.getElementById("specHardware").textContent = hardware.name;
  document.getElementById("story").textContent = storyText();

  setSample("leatherSample", ["sample","leather", leather.chip]);
  setSample("insertSample", ["sample","insert", insert.chip]);
  setSample("hardwareSample", ["sample","hardware", hardware.chip]);

  document.querySelectorAll(".option").forEach(o => {
    o.classList.toggle("active", state[o.dataset.type] === o.dataset.key);
  });
}

function setSample(id, classes) {
  document.getElementById(id).className = classes.join(" ");
}

document.querySelectorAll(".option").forEach(btn => {
  btn.addEventListener("click", () => {
    state[btn.dataset.type] = btn.dataset.key;
    document.getElementById("saveBtn").addEventListener("click", () => {
  localStorage.setItem("commission001", JSON.stringify(state));
  const b = document.getElementById("saveBtn");
  b.textContent = "Saved";
  setTimeout(() => b.textContent = "Save", 1200);
});

document.getElementById("resetBtn").addEventListener("click", () => {
  state = { ...PRESETS.heritage };
  document.getElementById("copyBtn").addEventListener("click", async () => {
  const text = `Commission 001\nLeather: ${DATA.leather[state.leather].name}\nInsert: ${DATA.insert[state.insert].name}\nHardware: ${DATA.hardware[state.hardware].name}\n\n${storyText()}`;
  try { await navigator.clipboard.writeText(text); } catch(e) {}
  const b = document.getElementById("copyBtn");
  b.textContent = "Copied";
  setTimeout(() => b.textContent = "Copy Spec", 1200);
});

document.getElementById("printBtn").addEventListener("click", () => window.print());

const dropZone = document.getElementById("dropZone");
const fileInput = document.getElementById("fileInput");
const moodGrid = document.getElementById("moodGrid");

document.getElementById("browseBtn").addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", e => addFiles(e.target.files));

["dragenter","dragover"].forEach(evt => dropZone.addEventListener(evt, e => {
  e.preventDefault();
  dropZone.classList.add("dragover");
}));
["dragleave","drop"].forEach(evt => dropZone.addEventListener(evt, e => {
  e.preventDefault();
  dropZone.classList.remove("dragover");
}));
dropZone.addEventListener("drop", e => addFiles(e.dataTransfer.files));

function addFiles(files) {
  [...files].filter(file => file.type.startsWith("image/")).forEach(file => {
    const reader = new FileReader();
    reader.onload = () => {
      const figure = document.createElement("figure");
      figure.innerHTML = `<button class="remove-img" aria-label="Remove image">×</button><img src="${reader.result}" alt="Uploaded inspiration"><figcaption>Client reference / uploaded inspiration</figcaption>`;
      figure.querySelector(".remove-img").addEventListener("click", () => figure.remove());
      moodGrid.prepend(figure);
    };
    reader.readAsDataURL(file);
  });
}

document.getElementById("clearMood").addEventListener("click", () => moodGrid.innerHTML = "");

render();
