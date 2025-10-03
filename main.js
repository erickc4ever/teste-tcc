/**
 * ==================================================================================
 * main.js - Cérebro da "änalitks" (Etapa 2 - Backend: Salvar Histórico)
 * ----------------------------------------------------------------------------------
 * Este ficheiro foi modificado para implementar a lógica de salvar o resultado
 * da calculadora "Quanto Vale a Minha Hora?" no Supabase.
 * CÓDIGO COMPLETO E NÃO SIMPLIFICADO.
 * ==================================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // PARTE 1: CONFIGURAÇÃO E SELETORES DE ELEMENTOS
    // ----------------------------------------------------------------------------------
    console.log("Iniciando o main.js...");

    const SUPABASE_URL = 'https://ejddiovmtjpipangyqeo.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqZGRpb3ZtdGpwaXBhbmd5cWVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3MTU4MDksImV4cCI6MjA3NDI5MTgwOX0.GH53mox_cijkhqAxy-sNmvxGcgtoLzuoE5sfP9hHdho';
    const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('Cliente Supabase inicializado.');

    const screens = {
        auth: document.getElementById('auth-screen'),
        welcome: document.getElementById('welcome-screen'),
        dashboard: document.getElementById('dashboard-screen'),
        pjDashboard: document.getElementById('pj-dashboard-screen'),
        simplesNacional: document.getElementById('simples-nacional-screen'),
        pjHoraValor: document.getElementById('pj-hora-valor-screen'),
        salario: document.getElementById('salario-screen'),
        investimentos: document.getElementById('investimentos-screen'),
        ferias: document.getElementById('ferias-screen'),
        decimoTerceiro: document.getElementById('decimo-terceiro-screen'),
        horaValor: document.getElementById('hora-valor-screen'),
        irpf: document.getElementById('irpf-screen'),
        profile: document.getElementById('profile-screen'),
        reports: document.getElementById('reports-screen'),
    };

    // --- Seletores ---
    const authForms = { login: document.getElementById('login-form'), signup: document.getElementById('signup-form'), choices: document.getElementById('auth-choices') };
    const authButtons = { showLogin: document.getElementById('show-login-btn'), showSignup: document.getElementById('show-signup-btn'), showLoginLink: document.getElementById('show-login-link'), showSignupLink: document.getElementById('show-signup-link'), logout: document.getElementById('logout-btn'), logoutPj: document.getElementById('logout-btn-pj') };
    const welcomeScreenElements = { welcomeMessage: document.getElementById('welcome-message-choice'), buttons: { clt: document.getElementById('goto-clt-dashboard-btn'), pj: document.getElementById('goto-pj-dashboard-btn') } };
    const dashboardButtons = { salario: document.getElementById('goto-salario-btn'), investimentos: document.getElementById('goto-investimentos-btn'), ferias: document.getElementById('goto-ferias-btn'), decimoTerceiro: document.getElementById('goto-decimo-terceiro-btn'), horaValor: document.getElementById('goto-hora-valor-btn'), irpf: document.getElementById('goto-irpf-btn'), showAbout: document.getElementById('show-about-btn'), profile: document.getElementById('goto-profile-btn'), reports: document.getElementById('goto-reports-btn') };
    const pjDashboardButtons = { simples: document.getElementById('goto-simples-nacional-btn'), horaValorPj: document.getElementById('goto-pj-hora-valor-btn'), backToWelcome: document.getElementById('back-to-welcome-from-pj') };
    const simplesNacionalElements = { form: { faturamentoMensal: document.getElementById('faturamento-mensal'), anexo: document.getElementById('anexo-simples') }, buttons: { calcular: document.getElementById('calcular-simples-btn'), voltar: document.getElementById('back-to-pj-dashboard-from-simples') }, results: { container: document.getElementById('simples-results-section'), rbt12: document.getElementById('resultado-rbt12'), aliquotaEfetiva: document.getElementById('resultado-aliquota-efetiva'), valorDas: document.getElementById('resultado-valor-das'), explicacao: document.getElementById('explicacao-simples') } };
    const pjHoraValorElements = { form: { salarioDesejado: document.getElementById('pj-salario-desejado'), custosFixos: document.getElementById('pj-custos-fixos'), feriasAno: document.getElementById('pj-ferias-ano'), horasDia: document.getElementById('pj-horas-dia'), diasSemana: document.getElementById('pj-dias-semana') }, buttons: { calcular: document.getElementById('calcular-pj-hora-valor-btn'), voltar: document.getElementById('back-to-pj-dashboard-from-hora') }, results: { container: document.getElementById('pj-hora-valor-results-section'), valorHora: document.getElementById('resultado-pj-hora-valor'), explicacao: document.getElementById('explicacao-pj-hora-valor') } };
    const dashboardElements = { quote: document.getElementById('dashboard-quote') };
    const modalElements = { overlay: document.getElementById('about-modal-overlay'), closeBtn: document.getElementById('close-about-btn') };
    const profileElements = { form: { salarioBruto: document.getElementById('profile-salario-bruto'), dependentes: document.getElementById('profile-dependentes'), horasDia: document.getElementById('profile-horas-dia'), diasSemana: document.getElementById('profile-dias-semana'), }, buttons: { salvar: document.getElementById('salvar-perfil-btn'), voltar: document.getElementById('back-to-dashboard-from-profile'), }, statusMessage: document.getElementById('profile-status-message'), };
    const reportsElements = { salaryChart: document.getElementById('salary-chart'), investmentChart: document.getElementById('investment-chart'), notice: document.getElementById('reports-notice'), content: document.getElementById('reports-content'), backButton: document.getElementById('back-to-dashboard-from-reports'), summary: { dailyValue: document.getElementById('summary-daily-value'), thirteenthValue: document.getElementById('summary-13th-value') } };
    const salarioElements = { form: { salarioBruto: document.getElementById('salario-bruto'), dependentes: document.getElementById('salario-dependentes') }, buttons: { calcular: document.getElementById('calcular-salario-btn'), voltar: document.getElementById('back-to-dashboard-from-salario') }, results: { container: document.getElementById('salario-results-section'), salarioBruto: document.getElementById('resultado-salario-bruto'), inss: document.getElementById('resultado-inss'), baseIrrf: document.getElementById('resultado-base-irrf'), irrf: document.getElementById('resultado-irrf'), salarioLiquido: document.getElementById('resultado-salario-liquido'), explicacaoInss: document.getElementById('explicacao-inss'), explicacaoIrrf: document.getElementById('explicacao-irrf') } };
    const investimentosElements = { form: { valorInicial: document.getElementById('valor-inicial'), aporteMensal: document.getElementById('aporte-mensal'), taxaJurosAnual: document.getElementById('taxa-juros-anual'), periodoAnos: document.getElementById('periodo-anos') }, buttons: { calcular: document.getElementById('calcular-investimentos-btn'), voltar: document.getElementById('back-to-dashboard-from-investimentos') }, results: { container: document.getElementById('investimentos-results-section'), valorFinal: document.getElementById('resultado-valor-final'), totalInvestido: document.getElementById('resultado-total-investido'), totalJuros: document.getElementById('resultado-total-juros') } };
    const feriasElements = { form: { salarioBruto: document.getElementById('ferias-salario-bruto'), dias: document.getElementById('ferias-dias'), venderDias: document.getElementById('ferias-vender-dias'), adiantar13: document.getElementById('ferias-adiantar-13') }, buttons: { calcular: document.getElementById('calcular-ferias-btn'), voltar: document.getElementById('back-to-dashboard-from-ferias') }, results: { container: document.getElementById('ferias-results-section'), feriasBrutas: document.getElementById('resultado-ferias-brutas'), tercoConstitucional: document.getElementById('resultado-terco-constitucional'), abonoPecuniario: document.getElementById('resultado-abono-pecuniario'), totalBruto: document.getElementById('resultado-total-bruto-ferias'), inss: document.getElementById('resultado-inss-ferias'), irrf: document.getElementById('resultado-irrf-ferias'), adiantamento13: document.getElementById('resultado-adiantamento-13'), liquido: document.getElementById('resultado-liquido-ferias'), abonoLine: document.getElementById('abono-pecuniario-line'), adiantamento13Line: document.getElementById('adiantamento-13-line') } };
    const decimoTerceiroElements = { form: { salarioBruto: document.getElementById('decimo-terceiro-salario-bruto'), meses: document.getElementById('decimo-terceiro-meses'), dependentes: document.getElementById('decimo-terceiro-dependentes') }, buttons: { calcular: document.getElementById('calcular-decimo-terceiro-btn'), voltar: document.getElementById('back-to-dashboard-from-decimo-terceiro') }, results: { container: document.getElementById('decimo-terceiro-results-section'), bruto: document.getElementById('resultado-13-bruto'), primeiraParcela: document.getElementById('resultado-13-primeira-parcela'), segundaParcelaBruta: document.getElementById('resultado-13-segunda-parcela-bruta'), inss: document.getElementById('resultado-inss-13'), irrf: document.getElementById('resultado-irrf-13'), segundaParcelaLiquida: document.getElementById('resultado-13-segunda-parcela-liquida'), liquidoTotal: document.getElementById('resultado-13-liquido-total') } };
    const horaValorElements = { form: { salario: document.getElementById('hora-valor-salario'), horasDia: document.getElementById('hora-valor-horas-dia'), diasSemana: document.getElementById('hora-valor-dias-semana') }, buttons: { calcular: document.getElementById('calcular-hora-valor-btn'), voltar: document.getElementById('back-to-dashboard-from-hora-valor'), salvar: document.getElementById('salvar-hora-valor-btn') }, results: { container: document.getElementById('hora-valor-results-section'), valorHora: document.getElementById('resultado-hora-valor'), explicacao: document.getElementById('explicacao-hora-valor') } };
    const irpfElements = { form: { rendimentosAnuais: document.getElementById('rendimentos-anuais'), despesasSaude: document.getElementById('despesas-saude'), despesasEducacao: document.getElementById('despesas-educacao'), dependentes: document.getElementById('dependentes') }, buttons: { calcular: document.getElementById('calcular-irpf-btn'), voltar: document.getElementById('back-to-dashboard-from-irpf') }, results: { container: document.getElementById('irpf-results-section'), completa: document.getElementById('resultado-irpf-completa'), simplificada: document.getElementById('resultado-irpf-simplificada'), recomendacao: document.getElementById('recomendacao-irpf').querySelector('p') } };

    // PARTE 2: DADOS E CONTEÚDO
    // ----------------------------------------------------------------------------------
    let userProfile = null;
    let salaryChartInstance = null;
    let investmentChartInstance = null;
    const dashboardQuotes = [ "Um objetivo sem um plano é apenas um desejo. Use as nossas ferramentas para transformar os seus desejos em planos.", "A melhor altura para plantar uma árvore foi há 20 anos. A segunda melhor altura é agora. O mesmo vale para os seus investimentos.", "Cuidado com as pequenas despesas; um pequeno furo pode afundar um grande navio.", "O seu futuro financeiro é criado pelo que você faz hoje, não amanhã. Cada cálculo é um passo na direção certa.", "Saber o valor do seu tempo é o primeiro passo para garantir que ele seja bem recompensado." ];

    // PARTE 3: FUNÇÕES DE GESTÃO DE TELA E UI
    // ----------------------------------------------------------------------------------
    function showScreen(screenName) { Object.values(screens).forEach(screen => { if (screen) screen.classList.add('hidden'); }); if (screens[screenName]) { screens[screenName].classList.remove('hidden'); console.log(`A exibir a tela: ${screenName}`); } else { console.warn(`AVISO: A tela "${screenName}" ainda não foi criada no index.html.`); alert(`A funcionalidade para "${screenName}" ainda está em desenvolvimento!`); screens.dashboard.classList.remove('hidden'); } }
    
    async function updateUserUI(user) { if (user) { welcomeScreenElements.welcomeMessage.textContent = `Olá, ${user.email}!`; await fetchUserProfile(user); showScreen('welcome'); } else { userProfile = null; showScreen('auth'); } }

    // PARTE 4: FUNÇÕES DE AUTENTICAÇÃO E PERFIL
    // ----------------------------------------------------------------------------------
    async function handleLogin(event) { event.preventDefault(); const email = authForms.login.querySelector('#login-email').value; const password = authForms.login.querySelector('#login-password').value; const { error } = await supabaseClient.auth.signInWithPassword({ email, password }); if (error) alert(`Erro no login: ${error.message}`); }
    async function handleSignup(event) { event.preventDefault(); const email = authForms.signup.querySelector('#signup-email').value; const password = authForms.signup.querySelector('#signup-password').value; const { error } = await supabaseClient.auth.signUp({ email, password }); if (error) { alert(`Erro no registo: ${error.message}`); } else { alert('Registo realizado! Verifique o seu e-mail para confirmar a conta e depois faça o login.'); authForms.signup.classList.add('hidden'); authForms.login.classList.remove('hidden'); } }
    async function handleLogout() { await supabaseClient.auth.signOut(); authForms.login.reset(); authForms.signup.reset(); authForms.login.classList.add('hidden'); authForms.signup.classList.add('hidden'); authForms.choices.classList.remove('hidden'); }
    async function handleSaveProfile() { const { data: { user } } = await supabaseClient.auth.getUser(); if (!user) { alert('Precisa de estar autenticado para salvar o perfil.'); return; } const salarioBruto = parseFloat(profileElements.form.salarioBruto.value) || null; const dependentes = parseInt(profileElements.form.dependentes.value); const horasDia = parseFloat(profileElements.form.horasDia.value) || null; const diasSemana = parseInt(profileElements.form.diasSemana.value) || null; const updates = { user_id: user.id, salario_bruto: salarioBruto, dependentes: isNaN(dependentes) ? null : dependentes, horas_dia: horasDia, dias_semana: diasSemana, updated_at: new Date(), }; const { error } = await supabaseClient.from('profiles').upsert(updates); if (error) { console.error('Erro ao salvar o perfil:', error); profileElements.statusMessage.textContent = `Erro ao salvar: ${error.message}`; profileElements.statusMessage.classList.remove('hidden'); } else { console.log('Perfil salvo com sucesso!'); userProfile = updates; profileElements.statusMessage.textContent = 'Perfil salvo com sucesso!'; profileElements.statusMessage.classList.remove('hidden'); setTimeout(() => { profileElements.statusMessage.classList.add('hidden'); }, 3000); } }
    async function fetchUserProfile(user) { if (!user) return; const { data, error } = await supabaseClient.from('profiles').select('*').eq('user_id', user.id).single(); if (error && error.code !== 'PGRST116') { console.error('Erro ao buscar o perfil:', error); } else if (data) { userProfile = data; console.log('Perfil do utilizador carregado:', userProfile); } else { console.log('Nenhum perfil encontrado para este utilizador.'); userProfile = null; } }
    function preencherFormulariosComPerfil() { if (!userProfile) return; if (userProfile.salario_bruto) profileElements.form.salarioBruto.value = userProfile.salario_bruto; if (userProfile.dependentes !== null) profileElements.form.dependentes.value = userProfile.dependentes; if (userProfile.horas_dia) profileElements.form.horasDia.value = userProfile.horas_dia; if (userProfile.dias_semana) profileElements.form.diasSemana.value = userProfile.dias_semana; if (userProfile.salario_bruto) salarioElements.form.salarioBruto.value = userProfile.salario_bruto; if (userProfile.dependentes !== null) salarioElements.form.dependentes.value = userProfile.dependentes; if (userProfile.salario_bruto) feriasElements.form.salarioBruto.value = userProfile.salario_bruto; if (userProfile.salario_bruto) decimoTerceiroElements.form.salarioBruto.value = userProfile.salario_bruto; if (userProfile.dependentes !== null) decimoTerceiroElements.form.dependentes.value = userProfile.dependentes; if (userProfile.salario_bruto) horaValorElements.form.salario.value = userProfile.salario_bruto; if (userProfile.horas_dia) horaValorElements.form.horasDia.value = userProfile.horas_dia; if (userProfile.dias_semana) horaValorElements.form.diasSemana.value = userProfile.dias_semana; }

    // PARTE 5: FUNÇÕES DE CÁLCULO E GRÁFICOS
    // ----------------------------------------------------------------------------------
    function calcularINSS(baseDeCalculo) { const faixas = [ { teto: 1412.00, aliquota: 0.075, parcela: 0 }, { teto: 2666.68, aliquota: 0.09,  parcela: 21.18 }, { teto: 4000.03, aliquota: 0.12,  parcela: 101.18 }, { teto: 7786.02, aliquota: 0.14,  parcela: 181.18 } ]; if (baseDeCalculo > faixas[3].teto) { return (faixas[3].teto * faixas[3].aliquota) - faixas[3].parcela; } for (const faixa of faixas) { if (baseDeCalculo <= faixa.teto) { return (baseDeCalculo * faixa.aliquota) - faixa.parcela; } } return 0; }
    function calcularIRRF(baseDeCalculo, numDependentes = 0) { const DEDUCAO_POR_DEPENDENTE = 189.59; const baseReal = baseDeCalculo - (numDependentes * DEDUCAO_POR_DEPENDENTE); const faixas = [ { teto: 2259.20, aliquota: 0,     parcela: 0 }, { teto: 2826.65, aliquota: 0.075, parcela: 169.44 }, { teto: 3751.05, aliquota: 0.15,  parcela: 381.44 }, { teto: 4664.68, aliquota: 0.225, parcela: 662.77 }, { teto: Infinity,aliquota: 0.275, parcela: 896.00 } ]; for (const faixa of faixas) { if (baseReal <= faixa.teto) { const imposto = (baseReal * faixa.aliquota) - faixa.parcela; return Math.max(0, imposto); } } return 0; }
    function calcularImpostoAnual(baseDeCalculo) { const faixas = [ { limite: 24511.92, aliquota: 0,     deducao: 0 }, { limite: 33919.80, aliquota: 0.075, deducao: 1838.39 }, { limite: 45012.60, aliquota: 0.15,  deducao: 4382.38 }, { limite: 55976.16, aliquota: 0.225, deducao: 7758.32 }, { limite: Infinity, aliquota: 0.275, deducao: 10557.13 } ]; for (const faixa of faixas) { if (baseDeCalculo <= faixa.limite) { const imposto = (baseDeCalculo * faixa.aliquota) - faixa.deducao; return imposto > 0 ? imposto : 0; } } return 0; }
    function renderSalaryChart() { if (salaryChartInstance) { salaryChartInstance.destroy(); } if (!userProfile || !userProfile.salario_bruto) { reportsElements.notice.classList.remove('hidden'); reportsElements.content.classList.add('hidden'); return; } reportsElements.notice.classList.add('hidden'); reportsElements.content.classList.remove('hidden'); const salarioBruto = parseFloat(userProfile.salario_bruto); const dependentes = userProfile.dependentes || 0; const descontoINSS = calcularINSS(salarioBruto); const baseCalculoIRRF = salarioBruto - descontoINSS; const descontoIRRF = calcularIRRF(baseCalculoIRRF, dependentes); const salarioLiquido = salarioBruto - descontoINSS - descontoIRRF; const ctx = reportsElements.salaryChart.getContext('2d'); salaryChartInstance = new Chart(ctx, { type: 'doughnut', data: { labels: ['Salário Líquido', 'Desconto INSS', 'Desconto IRRF'], datasets: [{ data: [salarioLiquido, descontoINSS, descontoIRRF], backgroundColor: ['rgba(5, 150, 105, 0.7)', 'rgba(245, 158, 11, 0.7)', 'rgba(239, 68, 68, 0.7)'], borderColor: ['rgba(5, 150, 105, 1)', 'rgba(245, 158, 11, 1)', 'rgba(239, 68, 68, 1)'], borderWidth: 1 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top', }, title: { display: false, text: 'Composição do Salário Bruto' } } } }); }
    function renderInvestmentChart() { if (investmentChartInstance) { investmentChartInstance.destroy(); } if (!userProfile || !userProfile.salario_bruto) { return; } const salarioBruto = parseFloat(userProfile.salario_bruto); const aporteMensal = salarioBruto * 0.10; const taxaJurosAnual = 0.08; const periodoAnos = 5; const taxaMensal = taxaJurosAnual / 12; const periodoMeses = periodoAnos * 12; let valorAcumulado = 0; const dataPoints = []; const labels = []; for (let i = 1; i <= periodoMeses; i++) { valorAcumulado = (valorAcumulado + aporteMensal) * (1 + taxaMensal); if (i % 12 === 0) { labels.push(`Ano ${i / 12}`); dataPoints.push(valorAcumulado.toFixed(2)); } } const ctx = reportsElements.investmentChart.getContext('2d'); investmentChartInstance = new Chart(ctx, { type: 'line', data: { labels: labels, datasets: [{ label: 'Patrimônio Acumulado', data: dataPoints, backgroundColor: 'rgba(10, 132, 255, 0.2)', borderColor: 'rgba(10, 132, 255, 1)', borderWidth: 2, tension: 0.4, fill: true }] }, options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } }, plugins: { legend: { display: false }, title: { display: false, text: 'Projeção de Investimentos (10% do salário)' } } } }); }
    function renderSummaryCards() { if (!userProfile || !userProfile.salario_bruto) { return; } const { salario_bruto, dependentes, horas_dia, dias_semana } = userProfile; const descontoINSS = calcularINSS(salario_bruto); const baseCalculoIRRF = salario_bruto - descontoINSS; const descontoIRRF = calcularIRRF(baseCalculoIRRF, dependentes || 0); const salarioLiquido = salario_bruto - descontoINSS - descontoIRRF; if (horas_dia && dias_semana) { const horasTrabalhadasMes = horas_dia * dias_semana * 4.5; const valorHoraLiquido = salarioLiquido / horasTrabalhadasMes; const valorDiaLiquido = valorHoraLiquido * horas_dia; reportsElements.summary.dailyValue.textContent = `R$ ${valorDiaLiquido.toFixed(2)}`; } else { reportsElements.summary.dailyValue.textContent = 'N/A'; } const decimoTerceiroBruto = salario_bruto; const inssSobre13 = calcularINSS(decimoTerceiroBruto); const baseIrrf13 = decimoTerceiroBruto - inssSobre13; const irrfSobre13 = calcularIRRF(baseIrrf13, dependentes || 0); const decimoTerceiroLiquido = decimoTerceiroBruto - inssSobre13 - irrfSobre13; reportsElements.summary.thirteenthValue.textContent = `~ R$ ${decimoTerceiroLiquido.toFixed(2)}`; }

    // PARTE 6: LÓGICA DAS FERRAMENTAS
    // ----------------------------------------------------------------------------------
    function executarCalculoSalario() { /* ... código existente ... */ }
    function executarSimulacaoInvestimentos() { /* ... código existente ... */ }
    function executarCalculoFerias() { /* ... código existente ... */ }
    function executarCalculo13Salario() { /* ... código existente ... */ }
    
    function executarCalculoHoraValor() {
        const salario = parseFloat(horaValorElements.form.salario.value) || 0;
        const horasDia = parseFloat(horaValorElements.form.horasDia.value) || 0;
        const diasSemana = parseInt(horaValorElements.form.diasSemana.value) || 0;

        if (salario <= 0 || horasDia <= 0 || diasSemana <= 0 || diasSemana > 7) {
            alert('Por favor, insira valores válidos para salário, horas por dia e dias por semana (1 a 7).');
            return;
        }

        const horasTrabalhadasMes = horasDia * diasSemana * 4.5;
        const valorHora = salario / horasTrabalhadasMes;
        const explicacao = `Baseado no salário de R$ ${salario.toFixed(2)} que você informou, o cálculo é: R$ ${salario.toFixed(2)} / (${horasTrabalhadasMes.toFixed(1)} horas/mês).`;

        horaValorElements.results.valorHora.textContent = `R$ ${valorHora.toFixed(2)}`;
        horaValorElements.results.explicacao.textContent = explicacao;
        horaValorElements.results.container.classList.remove('hidden');

        // ATUALIZAÇÃO (ETAPA 2): Mostrar o botão de salvar após o cálculo.
        horaValorElements.buttons.salvar.classList.remove('hidden');
    }

    function executarCalculoIRPFAnual() { /* ... código existente ... */ }
    function executarCalculoSimplesNacional() { /* ... código existente ... */ }
    function executarCalculoPjHoraValor() { /* ... código existente ... */ }

    // ==================================================================================
    // NOVA PARTE: LÓGICA DE BACKEND (SALVAR HISTÓRICO)
    // ==================================================================================
    async function handleSalvarHoraValor() {
        console.log('Botão de salvar "Valor da Hora" clicado.');
        const { data: { user } } = await supabaseClient.auth.getUser();
        if (!user) {
            alert('Você precisa de estar autenticado para salvar um resultado.');
            return;
        }

        // 1. Obter os dados do formulário e dos resultados
        const salarioInformado = parseFloat(horaValorElements.form.salario.value) || 0;
        const horasDia = parseFloat(horaValorElements.form.horasDia.value) || 0;
        const diasSemana = parseInt(horaValorElements.form.diasSemana.value) || 0;
        const valorHoraCalculado = parseFloat(horaValorElements.results.valorHora.textContent.replace('R$ ', '')) || 0;

        // 2. Montar o objeto para enviar ao Supabase
        const calculoParaSalvar = {
            user_id: user.id,
            salario_informado: salarioInformado,
            horas_dia: horasDia,
            dias_semana: diasSemana,
            valor_hora_calculado: valorHoraCalculado
        };

        console.log('A enviar os seguintes dados para o Supabase:', calculoParaSalvar);

        // 3. Enviar (insert) os dados para a tabela
        const { error } = await supabaseClient
            .from('historico_valor_hora')
            .insert(calculoParaSalvar);

        if (error) {
            console.error('Erro ao salvar o cálculo:', error);
            alert(`Ocorreu um erro ao salvar: ${error.message}`);
        } else {
            console.log('Cálculo salvo com sucesso!');
            alert('Resultado salvo com sucesso!');
            horaValorElements.buttons.salvar.textContent = 'Salvo!';
            setTimeout(() => {
                horaValorElements.buttons.salvar.textContent = 'Salvar Resultado';
            }, 2000);
        }
    }

    // PARTE 7: REGISTO DE EVENT LISTENERS
    // ----------------------------------------------------------------------------------
    // ... todos os seus event listeners existentes ...
    if(authButtons.showLogin) authButtons.showLogin.addEventListener('click', () => { authForms.choices.classList.add('hidden'); authForms.login.classList.remove('hidden'); });
    if(authButtons.showSignup) authButtons.showSignup.addEventListener('click', () => { authForms.choices.classList.add('hidden'); authForms.signup.classList.remove('hidden'); });
    if(authButtons.showLoginLink) authButtons.showLoginLink.addEventListener('click', (e) => { e.preventDefault(); authForms.signup.classList.add('hidden'); authForms.login.classList.remove('hidden'); });
    if(authButtons.showSignupLink) authButtons.showSignupLink.addEventListener('click', (e) => { e.preventDefault(); authForms.login.classList.add('hidden'); authForms.signup.classList.remove('hidden'); });
    if(authForms.login) authForms.login.addEventListener('submit', handleLogin);
    if(authForms.signup) authForms.signup.addEventListener('submit', handleSignup);
    if(authButtons.logout) authButtons.logout.addEventListener('click', handleLogout);
    if(authButtons.logoutPj) authButtons.logoutPj.addEventListener('click', handleLogout);

    if(welcomeScreenElements.buttons.clt) welcomeScreenElements.buttons.clt.addEventListener('click', async () => { const { data: { user } } = await supabaseClient.auth.getUser(); const welcomeMessage = document.getElementById('welcome-message'); if (welcomeMessage && user) { welcomeMessage.textContent = `Bem-vindo(a), ${user.email}!`; } const randomIndex = Math.floor(Math.random() * dashboardQuotes.length); dashboardElements.quote.textContent = dashboardQuotes[randomIndex]; showScreen('dashboard'); });
    if(welcomeScreenElements.buttons.pj) welcomeScreenElements.buttons.pj.addEventListener('click', () => showScreen('pjDashboard'));

    if(dashboardButtons.salario) dashboardButtons.salario.addEventListener('click', () => { preencherFormulariosComPerfil(); showScreen('salario'); });
    if(dashboardButtons.investimentos) dashboardButtons.investimentos.addEventListener('click', () => showScreen('investimentos'));
    if(dashboardButtons.ferias) dashboardButtons.ferias.addEventListener('click', () => { preencherFormulariosComPerfil(); showScreen('ferias'); });
    if(dashboardButtons.decimoTerceiro) dashboardButtons.decimoTerceiro.addEventListener('click', () => { preencherFormulariosComPerfil(); showScreen('decimoTerceiro'); });
    if(dashboardButtons.horaValor) dashboardButtons.horaValor.addEventListener('click', () => { preencherFormulariosComPerfil(); showScreen('horaValor'); });
    if(dashboardButtons.irpf) dashboardButtons.irpf.addEventListener('click', () => showScreen('irpf'));
    if(dashboardButtons.profile) dashboardButtons.profile.addEventListener('click', () => { preencherFormulariosComPerfil(); showScreen('profile'); });
    if(dashboardButtons.reports) dashboardButtons.reports.addEventListener('click', () => { renderSalaryChart(); renderInvestmentChart(); renderSummaryCards(); showScreen('reports'); });
    
    if(pjDashboardButtons.simples) pjDashboardButtons.simples.addEventListener('click', () => showScreen('simplesNacional'));
    if(pjDashboardButtons.horaValorPj) pjDashboardButtons.horaValorPj.addEventListener('click', () => showScreen('pjHoraValor'));
    if(pjDashboardButtons.backToWelcome) pjDashboardButtons.backToWelcome.addEventListener('click', () => showScreen('welcome'));

    if(salarioElements.buttons.calcular) salarioElements.buttons.calcular.addEventListener('click', executarCalculoSalario);
    if(salarioElements.buttons.voltar) salarioElements.buttons.voltar.addEventListener('click', () => showScreen('dashboard'));
    if(investimentosElements.buttons.calcular) investimentosElements.buttons.calcular.addEventListener('click', executarSimulacaoInvestimentos);
    if(investimentosElements.buttons.voltar) investimentosElements.buttons.voltar.addEventListener('click', () => showScreen('dashboard'));
    if(feriasElements.buttons.calcular) feriasElements.buttons.calcular.addEventListener('click', executarCalculoFerias);
    if(feriasElements.buttons.voltar) feriasElements.buttons.voltar.addEventListener('click', () => showScreen('dashboard'));
    if(decimoTerceiroElements.buttons.calcular) decimoTerceiroElements.buttons.calcular.addEventListener('click', executarCalculo13Salario);
    if(decimoTerceiroElements.buttons.voltar) decimoTerceiroElements.buttons.voltar.addEventListener('click', () => showScreen('dashboard'));
    if(horaValorElements.buttons.calcular) horaValorElements.buttons.calcular.addEventListener('click', executarCalculoHoraValor);
    if(horaValorElements.buttons.voltar) horaValorElements.buttons.voltar.addEventListener('click', () => showScreen('dashboard'));
    if(irpfElements.buttons.calcular) irpfElements.buttons.calcular.addEventListener('click', executarCalculoIRPFAnual);
    if(irpfElements.buttons.voltar) irpfElements.buttons.voltar.addEventListener('click', () => showScreen('dashboard'));
    if(profileElements.buttons.salvar) profileElements.buttons.salvar.addEventListener('click', handleSaveProfile);
    if(profileElements.buttons.voltar) profileElements.buttons.voltar.addEventListener('click', () => showScreen('dashboard'));
    if(reportsElements.backButton) reportsElements.backButton.addEventListener('click', () => showScreen('dashboard'));
    if(simplesNacionalElements.buttons.calcular) simplesNacionalElements.buttons.calcular.addEventListener('click', executarCalculoSimplesNacional);
    if(simplesNacionalElements.buttons.voltar) simplesNacionalElements.buttons.voltar.addEventListener('click', () => showScreen('pjDashboard'));
    if(pjHoraValorElements.buttons.calcular) pjHoraValorElements.buttons.calcular.addEventListener('click', executarCalculoPjHoraValor);
    if(pjHoraValorElements.buttons.voltar) pjHoraValorElements.buttons.voltar.addEventListener('click', () => showScreen('pjDashboard'));
    
    // ATUALIZAÇÃO: Adicionar o event listener para o novo botão de salvar
    if(horaValorElements.buttons.salvar) horaValorElements.buttons.salvar.addEventListener('click', handleSalvarHoraValor);

    if(dashboardButtons.showAbout) dashboardButtons.showAbout.addEventListener('click', () => { modalElements.overlay.classList.remove('hidden'); });
    if(modalElements.closeBtn) modalElements.closeBtn.addEventListener('click', () => { modalElements.overlay.classList.add('hidden'); });
    if(modalElements.overlay) modalElements.overlay.addEventListener('click', (event) => { if (event.target === modalElements.overlay) { modalElements.overlay.classList.add('hidden'); } });

    supabaseClient.auth.onAuthStateChange((_event, session) => { updateUserUI(session ? session.user : null); });

    console.log("main.js carregado com sucesso. Aplicação pronta.");
});

