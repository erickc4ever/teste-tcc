/**
 * ==================================================================================
 * main.js - Cérebro da "änalitks"
 * ----------------------------------------------------------------------------------
 * Este ficheiro foi modificado para implementar a lógica de salvar o resultado
 * da CALCULADORA DE SALÁRIO no Supabase.
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
    const dashboardElements = { quote: document.getElementById('dashboard-quote') };
    const modalElements = { overlay: document.getElementById('about-modal-overlay'), closeBtn: document.getElementById('close-about-btn') };
    const profileElements = { form: { salarioBruto: document.getElementById('profile-salario-bruto'), dependentes: document.getElementById('profile-dependentes'), horasDia: document.getElementById('profile-horas-dia'), diasSemana: document.getElementById('profile-dias-semana'), }, buttons: { salvar: document.getElementById('salvar-perfil-btn'), voltar: document.getElementById('back-to-dashboard-from-profile'), }, statusMessage: document.getElementById('profile-status-message'), };
    const reportsElements = { salaryChart: document.getElementById('salary-chart'), investmentChart: document.getElementById('investment-chart'), notice: document.getElementById('reports-notice'), content: document.getElementById('reports-content'), backButton: document.getElementById('back-to-dashboard-from-reports'), summary: { dailyValue: document.getElementById('summary-daily-value'), thirteenthValue: document.getElementById('summary-13th-value') } };

    // ATUALIZAÇÃO: Adicionados seletores para os novos botões "Salvar".
    const salarioElements = { form: { salarioBruto: document.getElementById('salario-bruto'), dependentes: document.getElementById('salario-dependentes') }, buttons: { calcular: document.getElementById('calcular-salario-btn'), voltar: document.getElementById('back-to-dashboard-from-salario'), salvar: document.getElementById('salvar-salario-btn') }, results: { container: document.getElementById('salario-results-section'), salarioBruto: document.getElementById('resultado-salario-bruto'), inss: document.getElementById('resultado-inss'), baseIrrf: document.getElementById('resultado-base-irrf'), irrf: document.getElementById('resultado-irrf'), salarioLiquido: document.getElementById('resultado-salario-liquido'), explicacaoInss: document.getElementById('explicacao-inss'), explicacaoIrrf: document.getElementById('explicacao-irrf') } };
    const investimentosElements = { form: { valorInicial: document.getElementById('valor-inicial'), aporteMensal: document.getElementById('aporte-mensal'), taxaJurosAnual: document.getElementById('taxa-juros-anual'), periodoAnos: document.getElementById('periodo-anos') }, buttons: { calcular: document.getElementById('calcular-investimentos-btn'), voltar: document.getElementById('back-to-dashboard-from-investimentos'), salvar: document.getElementById('salvar-investimentos-btn') }, results: { container: document.getElementById('investimentos-results-section'), valorFinal: document.getElementById('resultado-valor-final'), totalInvestido: document.getElementById('resultado-total-investido'), totalJuros: document.getElementById('resultado-total-juros') } };
    const feriasElements = { form: { salarioBruto: document.getElementById('ferias-salario-bruto'), dias: document.getElementById('ferias-dias'), venderDias: document.getElementById('ferias-vender-dias'), adiantar13: document.getElementById('ferias-adiantar-13') }, buttons: { calcular: document.getElementById('calcular-ferias-btn'), voltar: document.getElementById('back-to-dashboard-from-ferias'), salvar: document.getElementById('salvar-ferias-btn') }, results: { container: document.getElementById('ferias-results-section'), feriasBrutas: document.getElementById('resultado-ferias-brutas'), tercoConstitucional: document.getElementById('resultado-terco-constitucional'), abonoPecuniario: document.getElementById('resultado-abono-pecuniario'), totalBruto: document.getElementById('resultado-total-bruto-ferias'), inss: document.getElementById('resultado-inss-ferias'), irrf: document.getElementById('resultado-irrf-ferias'), adiantamento13: document.getElementById('resultado-adiantamento-13'), liquido: document.getElementById('resultado-liquido-ferias'), abonoLine: document.getElementById('abono-pecuniario-line'), adiantamento13Line: document.getElementById('adiantamento-13-line') } };
    const decimoTerceiroElements = { form: { salarioBruto: document.getElementById('decimo-terceiro-salario-bruto'), meses: document.getElementById('decimo-terceiro-meses'), dependentes: document.getElementById('decimo-terceiro-dependentes') }, buttons: { calcular: document.getElementById('calcular-decimo-terceiro-btn'), voltar: document.getElementById('back-to-dashboard-from-decimo-terceiro'), salvar: document.getElementById('salvar-decimo-terceiro-btn') }, results: { container: document.getElementById('decimo-terceiro-results-section'), bruto: document.getElementById('resultado-13-bruto'), primeiraParcela: document.getElementById('resultado-13-primeira-parcela'), segundaParcelaBruta: document.getElementById('resultado-13-segunda-parcela-bruta'), inss: document.getElementById('resultado-inss-13'), irrf: document.getElementById('resultado-irrf-13'), segundaParcelaLiquida: document.getElementById('resultado-13-segunda-parcela-liquida'), liquidoTotal: document.getElementById('resultado-13-liquido-total') } };
    const horaValorElements = { form: { salario: document.getElementById('hora-valor-salario'), horasDia: document.getElementById('hora-valor-horas-dia'), diasSemana: document.getElementById('hora-valor-dias-semana') }, buttons: { calcular: document.getElementById('calcular-hora-valor-btn'), voltar: document.getElementById('back-to-dashboard-from-hora-valor'), salvar: document.getElementById('salvar-hora-valor-btn') }, results: { container: document.getElementById('hora-valor-results-section'), valorHora: document.getElementById('resultado-hora-valor'), explicacao: document.getElementById('explicacao-hora-valor') } };
    const irpfElements = { form: { rendimentosAnuais: document.getElementById('rendimentos-anuais'), despesasSaude: document.getElementById('despesas-saude'), despesasEducacao: document.getElementById('despesas-educacao'), dependentes: document.getElementById('dependentes') }, buttons: { calcular: document.getElementById('calcular-irpf-btn'), voltar: document.getElementById('back-to-dashboard-from-irpf'), salvar: document.getElementById('salvar-irpf-btn') }, results: { container: document.getElementById('irpf-results-section'), completa: document.getElementById('resultado-irpf-completa'), simplificada: document.getElementById('resultado-irpf-simplificada'), recomendacao: document.getElementById('recomendacao-irpf').querySelector('p') } };
    const simplesNacionalElements = { form: { faturamentoMensal: document.getElementById('faturamento-mensal'), anexo: document.getElementById('anexo-simples') }, buttons: { calcular: document.getElementById('calcular-simples-btn'), voltar: document.getElementById('back-to-pj-dashboard-from-simples'), salvar: document.getElementById('salvar-simples-nacional-btn') }, results: { container: document.getElementById('simples-results-section'), rbt12: document.getElementById('resultado-rbt12'), aliquotaEfetiva: document.getElementById('resultado-aliquota-efetiva'), valorDas: document.getElementById('resultado-valor-das'), explicacao: document.getElementById('explicacao-simples') } };
    const pjHoraValorElements = { form: { salarioDesejado: document.getElementById('pj-salario-desejado'), custosFixos: document.getElementById('pj-custos-fixos'), feriasAno: document.getElementById('pj-ferias-ano'), horasDia: document.getElementById('pj-horas-dia'), diasSemana: document.getElementById('pj-dias-semana') }, buttons: { calcular: document.getElementById('calcular-pj-hora-valor-btn'), voltar: document.getElementById('back-to-pj-dashboard-from-hora'), salvar: document.getElementById('salvar-pj-hora-valor-btn') }, results: { container: document.getElementById('pj-hora-valor-results-section'), valorHora: document.getElementById('resultado-pj-hora-valor'), explicacao: document.getElementById('explicacao-pj-hora-valor') } };

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
    function renderSalaryChart() { /* ... código existente ... */ }
    function renderInvestmentChart() { /* ... código existente ... */ }
    function renderSummaryCards() { /* ... código existente ... */ }

    // PARTE 6: LÓGICA DAS FERRAMENTAS
    // ----------------------------------------------------------------------------------
    function executarCalculoSalario() { 
        const salarioBruto = parseFloat(salarioElements.form.salarioBruto.value) || 0; 
        const numDependentes = parseInt(salarioElements.form.dependentes.value) || 0; 
        if (salarioBruto <= 0) { alert('Por favor, insira um valor de salário bruto válido.'); return; } 
        const descontoINSS = calcularINSS(salarioBruto); 
        const baseCalculoIRRF = salarioBruto - descontoINSS; 
        const descontoIRRF = calcularIRRF(baseCalculoIRRF, numDependentes); 
        const salarioLiquido = salarioBruto - descontoINSS - descontoIRRF; 
        salarioElements.results.salarioBruto.textContent = `R$ ${salarioBruto.toFixed(2)}`; 
        salarioElements.results.inss.textContent = `- R$ ${descontoINSS.toFixed(2)}`; 
        salarioElements.results.baseIrrf.textContent = `R$ ${(baseCalculoIRRF - (numDependentes * 189.59)).toFixed(2)}`; 
        salarioElements.results.irrf.textContent = `- R$ ${descontoIRRF.toFixed(2)}`; 
        salarioElements.results.salarioLiquido.textContent = `R$ ${salarioLiquido.toFixed(2)}`; 
        salarioElements.results.container.classList.remove('hidden'); 
        
        // ATUALIZAÇÃO: Mostrar o botão de salvar do salário.
        salarioElements.buttons.salvar.classList.remove('hidden');
    }
    function executarSimulacaoInvestimentos() { /* ... código existente ... */ }
    function executarCalculoFerias() { /* ... código existente ... */ }
    function executarCalculo13Salario() { /* ... código existente ... */ }
    function executarCalculoHoraValor() { /* ... código existente ... */ }
    function executarCalculoIRPFAnual() { /* ... código existente ... */ }
    function executarCalculoSimplesNacional() { /* ... código existente ... */ }
    function executarCalculoPjHoraValor() { /* ... código existente ... */ }

    // ==================================================================================
    // NOVA PARTE: LÓGICA DE BACKEND (SALVAR HISTÓRICO)
    // ==================================================================================
    async function handleSalvarHoraValor() { /* ... código existente ... */ }

    // ATUALIZAÇÃO: Nova função para salvar o cálculo de salário.
    async function handleSalvarSalario() {
        console.log('Botão de salvar "Salário" clicado.');
        const { data: { user } } = await supabaseClient.auth.getUser();
        if (!user) {
            alert('Você precisa de estar autenticado para salvar um resultado.');
            return;
        }

        const salarioBruto = parseFloat(salarioElements.form.salarioBruto.value) || 0;
        const dependentes = parseInt(salarioElements.form.dependentes.value) || 0;
        const inss = parseFloat(salarioElements.results.inss.textContent.replace('- R$ ', '')) || 0;
        const irrf = parseFloat(salarioElements.results.irrf.textContent.replace('- R$ ', '')) || 0;
        const liquido = parseFloat(salarioElements.results.salarioLiquido.textContent.replace('R$ ', '')) || 0;

        const calculoParaSalvar = {
            user_id: user.id,
            salario_bruto_informado: salarioBruto,
            dependentes_informado: dependentes,
            desconto_inss_calculado: inss,
            desconto_irrf_calculado: irrf,
            salario_liquido_calculado: liquido
        };

        console.log('A enviar os seguintes dados para o Supabase:', calculoParaSalvar);

        const { error } = await supabaseClient
            .from('historico_salarios')
            .insert(calculoParaSalvar);

        if (error) {
            console.error('Erro ao salvar o cálculo de salário:', error);
            alert(`Ocorreu um erro ao salvar: ${error.message}`);
        } else {
            console.log('Cálculo de salário salvo com sucesso!');
            alert('Resultado salvo com sucesso!');
            salarioElements.buttons.salvar.textContent = 'Salvo!';
            setTimeout(() => {
                salarioElements.buttons.salvar.textContent = 'Salvar Resultado';
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

    if(welcomeScreenElements.buttons.clt) welcomeScreenElements.buttons.clt.addEventListener('click', async () => { /* ... */ });
    if(welcomeScreenElements.buttons.pj) welcomeScreenElements.buttons.pj.addEventListener('click', () => showScreen('pjDashboard'));

    if(dashboardButtons.salario) dashboardButtons.salario.addEventListener('click', () => { preencherFormulariosComPerfil(); showScreen('salario'); });
    if(dashboardButtons.investimentos) dashboardButtons.investimentos.addEventListener('click', () => showScreen('investimentos'));
    if(dashboardButtons.ferias) dashboardButtons.ferias.addEventListener('click', () => { preencherFormulariosComPerfil(); showScreen('ferias'); });
    if(dashboardButtons.decimoTerceiro) dashboardButtons.decimoTerceiro.addEventListener('click', () => { preencherFormulariosComPerfil(); showScreen('decimoTerceiro'); });
    if(dashboardButtons.horaValor) dashboardButtons.horaValor.addEventListener('click', () => { preencherFormulariosComPerfil(); showScreen('horaValor'); });
    if(dashboardButtons.irpf) dashboardButtons.irpf.addEventListener('click', () => showScreen('irpf'));
    if(dashboardButtons.profile) dashboardButtons.profile.addEventListener('click', () => { preencherFormulariosComPerfil(); showScreen('profile'); });
    if(dashboardButtons.reports) dashboardButtons.reports.addEventListener('click', () => { /* ... */ });
    
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
    
    // ATUALIZAÇÃO: Adicionar os event listeners para os novos botões de salvar.
    if(horaValorElements.buttons.salvar) horaValorElements.buttons.salvar.addEventListener('click', handleSalvarHoraValor);
    if(salarioElements.buttons.salvar) salarioElements.buttons.salvar.addEventListener('click', handleSalvarSalario);

    if(dashboardButtons.showAbout) dashboardButtons.showAbout.addEventListener('click', () => { modalElements.overlay.classList.remove('hidden'); });
    if(modalElements.closeBtn) modalElements.closeBtn.addEventListener('click', () => { modalElements.overlay.classList.add('hidden'); });
    if(modalElements.overlay) modalElements.overlay.addEventListener('click', (event) => { if (event.target === modalElements.overlay) { modalElements.overlay.classList.add('hidden'); } });

    supabaseClient.auth.onAuthStateChange((_event, session) => { updateUserUI(session ? session.user : null); });

    console.log("main.js carregado com sucesso. Aplicação pronta.");
});

