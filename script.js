document.addEventListener('DOMContentLoaded', () => {
  
  // --- 1. GESTÃO DE TEMPO (168 HORAS) ---
  const inputSono = document.getElementById('input-sono');
  const inputEstudo = document.getElementById('input-estudo');
  const inputTrabalho = document.getElementById('input-trabalho');
  const inputRotina = document.getElementById('input-rotina');

  const valSono = document.getElementById('val-sono');
  const valEstudo = document.getElementById('val-estudo');
  const valTrabalho = document.getElementById('val-trabalho');
  const valRotina = document.getElementById('val-rotina');
  const horasLivresText = document.getElementById('horas-livres');

  // Inicializar Gráfico Pie Chart (Chart.js)
  const ctxTempo = document.getElementById('chartTempo').getContext('2d');
  const chartTempo = new Chart(ctxTempo, {
    type: 'doughnut',
    data: {
      labels: ['Sono', 'Estudo', 'Trabalho', 'Rotina', 'Horas Livres'],
      datasets: [{
        data: [56, 42, 28, 21, 21],
        backgroundColor: [
          '#6366f1', // Indigo
          '#06b6d4', // Cyan
          '#3b82f6', // Blue
          '#f59e0b', // Amber
          '#10b981'  // Emerald (Livres)
        ],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: '#94a3b8', font: { size: 12 } }
        }
      }
    }
  });

  function atualizarTempo() {
    const s = parseFloat(inputSono.value);
    const e = parseFloat(inputEstudo.value);
    const t = parseFloat(inputTrabalho.value);
    const r = parseFloat(inputRotina.value);

    valSono.textContent = `${s}h`;
    valEstudo.textContent = `${e}h`;
    valTrabalho.textContent = `${t}h`;
    valRotina.textContent = `${r}h`;

    const totalOcupadoSemanal = (s + e + t + r) * 7;
    const livres = Math.max(0, 168 - totalOcupadoSemanal);

    horasLivresText.textContent = `${livres.toFixed(1)}h / semana`;

    chartTempo.data.datasets[0].data = [s*7, e*7, t*7, r*7, livres];
    chartTempo.update();
  }

  [inputSono, inputEstudo, inputTrabalho, inputRotina].forEach(input => {
    input.addEventListener('input', atualizarTempo);
  });


  // --- 2. SIMULADOR DE JUROS COMPOSTOS ---
  const finInicial = document.getElementById('finance-inicial');
  const finMensal = document.getElementById('finance-mensal');
  const finAnos = document.getElementById('finance-anos');

  const resInvestido = document.getElementById('res-investido');
  const resJuros = document.getElementById('res-juros');
  const resTotal = document.getElementById('res-total');

  const ctxFinance = document.getElementById('chartFinance').getContext('2d');
  const chartFinance = new Chart(ctxFinance, {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        {
          label: 'Total Acumulado (R$)',
          data: [],
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: true,
          tension: 0.3
        },
        {
          label: 'Total Investido (R$)',
          data: [],
          borderColor: '#64748b',
          borderDash: [5, 5],
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: '#94a3b8' } }
      },
      scales: {
        x: { ticks: { color: '#64748b' }, grid: { display: false } },
        y: { ticks: { color: '#64748b' }, grid: { color: '#334155' } }
      }
    }
  });

  function calcularFinanceiro() {
    const p = parseFloat(finInicial.value) || 0;
    const a = parseFloat(finMensal.value) || 0;
    const anos = parseInt(finAnos.value) || 1;
    const taxaAnual = 0.10; // 10% ao ano
    const taxaMensal = Math.pow(1 + taxaAnual, 1/12) - 1;
    const meses = anos * 12;

    let total = p;
    let investido = p;

    const labels = [];
    const dataTotal = [];
    const dataInvestido = [];

    for (let m = 1; m <= meses; m++) {
      total = total * (1 + taxaMensal) + a;
      investido += a;

      if (m % 12 === 0 || m === meses) {
        labels.push(`Ano ${Math.ceil(m/12)}`);
        dataTotal.push(Math.round(total));
        dataInvestido.push(Math.round(investido));
      }
    }

    const juros = total - investido;

    resInvestido.textContent = investido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    resJuros.textContent = juros.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    resTotal.textContent = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    chartFinance.data.labels = labels;
    chartFinance.data.datasets[0].data = dataTotal;
    chartFinance.data.datasets[1].data = dataInvestido;
    chartFinance.update();
  }

  [finInicial, finMensal, finAnos].forEach(input => {
    input.addEventListener('input', calcularFinanceiro);
  });


  // --- 3. CALCULADORA DE ESFORÇO ---
  const goalHours = document.getElementById('goal-hours');
  const goalMonths = document.getElementById('goal-months');
  const esforcoResultado = document.getElementById('esforco-resultado');
  const esforcoDetalhe = document.getElementById('esforco-detalhe');

  function calcularEsforco() {
    const horas = parseFloat(goalHours.value) || 0;
    const meses = parseFloat(goalMonths.value) || 1;

    const diasTotais = meses * 30;
    const horasPorDia = horas / diasTotais;

    const minTotais = Math.round((horasPorDia - Math.floor(horasPorDia)) * 60);
    const horasInteiras = Math.floor(horasPorDia);

    esforcoResultado.textContent = `${horasPorDia.toFixed(1)} Horas / dia`;
    esforcoDetalhe.textContent = `Dedique aproximadamente ${horasInteiras}h e ${minTotais}min por dia (todos os dias) durante ${meses} mês(es) para completar as ${horas} horas totais.`;
  }

  [goalHours, goalMonths].forEach(input => {
    input.addEventListener('input', calcularEsforco);
  });

  // Inicializar Cálculos
  atualizarTempo();
  calcularFinanceiro();
  calcularEsforco();
});