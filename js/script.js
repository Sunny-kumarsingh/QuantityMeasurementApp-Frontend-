/* ===========================
   AUTH GUARD
=========================== */
(function () {
  const session = JSON.parse(localStorage.getItem('qm_session') || '{}');
  if (!session.loggedIn) window.location.href = 'login.html';
})();

/* ===========================
   UNIT DEFINITIONS
=========================== */
const UNITS = {
  length:      { units: ['Kilometer','Meter','Centimeter','Millimeter','Mile','Yard','Foot','Inch'], toBase: { Kilometer:1000,Meter:1,Centimeter:0.01,Millimeter:0.001,Mile:1609.344,Yard:0.9144,Foot:0.3048,Inch:0.0254 } },
  weight:      { units: ['Kilogram','Gram','Milligram','Metric Ton','Pound','Ounce'], toBase: { Kilogram:1,Gram:0.001,Milligram:0.000001,'Metric Ton':1000,Pound:0.453592,Ounce:0.0283495 } },
  temperature: { units: ['Celsius','Fahrenheit','Kelvin'], toBase: null },
  volume:      { units: ['Liter','Milliliter','Cubic Meter','Gallon (US)','Pint (US)','Cup','Fluid Ounce'], toBase: { Liter:1,Milliliter:0.001,'Cubic Meter':1000,'Gallon (US)':3.78541,'Pint (US)':0.473176,Cup:0.236588,'Fluid Ounce':0.0295735 } }
};

let state = { type: 'length', action: 'comparison', operator: '+' };

/* ===========================
   TEMPERATURE
=========================== */
function convertTemperature(value, from, to) {
  let c = from==='Celsius' ? value : from==='Fahrenheit' ? (value-32)*5/9 : value-273.15;
  return to==='Celsius' ? c : to==='Fahrenheit' ? c*9/5+32 : c+273.15;
}

function convertValue(value, from, to, type) {
  if (type==='temperature') return convertTemperature(value, from, to);
  return value * UNITS[type].toBase[from] / UNITS[type].toBase[to];
}

/* ===========================
   POPULATE SELECTS
=========================== */
function populateSelect(el, units, idx=0) {
  el.innerHTML = '';
  units.forEach((u,i) => {
    const o = document.createElement('option');
    o.value = o.textContent = u;
    if (i===idx) o.selected = true;
    el.appendChild(o);
  });
}

function populateAllSelects() {
  const u = UNITS[state.type].units;
  populateSelect(document.getElementById('comp-from-unit'), u, 0);
  populateSelect(document.getElementById('comp-to-unit'),   u, 1);
  populateSelect(document.getElementById('conv-from-unit'), u, 0);
  populateSelect(document.getElementById('conv-to-unit'),   u, 1);
  populateSelect(document.getElementById('arith-unit1'),       u, 0);
  populateSelect(document.getElementById('arith-unit2'),       u, 1);
  populateSelect(document.getElementById('arith-result-unit'), u, 0);
  updateAll();
}

function updateAll() { updateComparison(); updateConversion(); updateArithmetic(); }

function updateComparison() {
  const v  = parseFloat(document.getElementById('comp-from-val').value)||0;
  const fu = document.getElementById('comp-from-unit').value;
  const tu = document.getElementById('comp-to-unit').value;
  document.getElementById('comp-to-val').value = fmt(convertValue(v,fu,tu,state.type));
}

function updateConversion() {
  const v  = parseFloat(document.getElementById('conv-from-val').value)||0;
  const fu = document.getElementById('conv-from-unit').value;
  const tu = document.getElementById('conv-to-unit').value;
  document.getElementById('conv-to-val').value = fmt(convertValue(v,fu,tu,state.type));
}

function updateArithmetic() {
  const v1=parseFloat(document.getElementById('arith-val1').value)||0;
  const v2=parseFloat(document.getElementById('arith-val2').value)||0;
  const u1=document.getElementById('arith-unit1').value;
  const u2=document.getElementById('arith-unit2').value;
  const ru=document.getElementById('arith-result-unit').value;
  const a=convertValue(v1,u1,ru,state.type), b=convertValue(v2,u2,ru,state.type);
  let r;
  switch(state.operator){case'+':r=a+b;break;case'-':r=a-b;break;case'*':r=a*b;break;case'/':r=b!==0?a/b:NaN;break;}
  document.getElementById('arith-result').textContent = isNaN(r)?'Error':fmt(r);
}

function fmt(n) {
  if (Math.abs(n)>=1e6||(Math.abs(n)<0.001&&n!==0)) return n.toExponential(4);
  return parseFloat(n.toFixed(6)).toString();
}

/* ===========================
   PANEL SWITCHER
=========================== */
function showPanel(action) {
  document.querySelectorAll('.panel').forEach(p=>p.classList.add('hidden'));
  document.getElementById(`panel-${action}`).classList.remove('hidden');
}

/* ===========================
   LOGOUT
=========================== */
function logout() {
  localStorage.removeItem('qm_session');
  window.location.href = 'login.html';
}

/* ===========================
   QUERY PARAM INIT
   Supports ?type=weight&action=conversion from dashboard
=========================== */
function initFromParams() {
  const params = new URLSearchParams(window.location.search);
  const type   = params.get('type');
  const action = params.get('action');

  if (type && UNITS[type]) {
    state.type = type;
    document.querySelectorAll('.type-card').forEach(c=>{
      c.classList.toggle('active', c.dataset.type===type);
    });
  }

  populateAllSelects();

  if (action && ['comparison','conversion','arithmetic'].includes(action)) {
    state.action = action;
    document.querySelectorAll('.action-tab').forEach(t=>{
      t.classList.toggle('active', t.dataset.action===action);
    });
    showPanel(action);
  } else {
    showPanel('comparison');
  }
}

/* ===========================
   EVENT LISTENERS
=========================== */
document.querySelectorAll('.type-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.type-card').forEach(c=>c.classList.remove('active'));
    card.classList.add('active');
    state.type = card.dataset.type;
    populateAllSelects();
  });
});

document.querySelectorAll('.action-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.action-tab').forEach(t=>t.classList.remove('active'));
    tab.classList.add('active');
    state.action = tab.dataset.action;
    showPanel(state.action);
  });
});

document.querySelectorAll('.op-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.op-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    state.operator = btn.dataset.op;
    updateArithmetic();
  });
});

document.getElementById('comp-from-val').addEventListener('input', updateComparison);
document.getElementById('comp-from-unit').addEventListener('change', updateComparison);
document.getElementById('comp-to-unit').addEventListener('change', updateComparison);
document.getElementById('conv-from-val').addEventListener('input', updateConversion);
document.getElementById('conv-from-unit').addEventListener('change', updateConversion);
document.getElementById('conv-to-unit').addEventListener('change', updateConversion);
['arith-val1','arith-val2','arith-unit1','arith-unit2','arith-result-unit'].forEach(id=>{
  const el=document.getElementById(id);
  el.addEventListener('input', updateArithmetic);
  el.addEventListener('change', updateArithmetic);
});

/* ===========================
   INIT
=========================== */
initFromParams();
