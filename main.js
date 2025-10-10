/**
 * ==================================================================================
 * main.js - Cérebro da "änalitks"
 * ----------------------------------------------------------------------------------
 * Este ficheiro foi modificado para implementar a lógica de salvar o resultado
 * do SIMULADOR DE IRPF ANUAL e finalizar a integração de todas as calculadoras
 * do Módulo CLT com o sistema de Histórico.
 * ==================================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==================================================================================
// PARTE 1: CONFIGURAÇÃO E SELETORES DE ELEMENTOS (Versão Corrigida e Reorganizada)
// ----------------------------------------------------------------------------------
console.log("Iniciando o main.js...");

// --- 1. Configuração do Backend (Supabase) ---
// Estas linhas estabelecem a conexão com o banco de dados Supabase, que é usado
// para guardar as informações dos utilizadores e os seus cálculos salvos.
const SUPABASE_URL = 'https://ejddiovmtjpipangyqeo.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqZGRpb3ZtdGpwaXBhbmd5cWVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgзMTU4MDksImV4cCI6MjA3NDI5MTgwOX0.GH53mox_cijkhqAxy-sNmvxGcgtoLzuoE5sfP9hHdho';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
console.log('Cliente Supabase inicializado.');

// --- 2. Mapeamento de Telas Principais ---
// Esta constante é o nosso "GPS" de navegação. Cada entrada aqui representa uma
// "tela" (uma div principal) da nossa aplicação. A função showScreen usa este mapa
// para saber qual tela mostrar e quais esconder.
const screens = {
    auth: document.getElementById('auth-screen'),
    welcome: document.getElementById('welcome-screen'),
    dashboard: document.getElementById('dashboard-screen'),
    pjDashboard: document.getElementById('pj-dashboard-screen'),
    salario: document.getElementById('salario-screen'),
    investimentos: document.getElementById('investimentos-screen'),
    ferias: document.getElementById('ferias-screen'),
    decimoTerceiro: document.getElementById('decimo-terceiro-screen'),
    horaValor: document.getElementById('hora-valor-screen'),
    irpf: document.getElementById('irpf-screen'),
    simplesNacional: document.getElementById('simples-nacional-screen'),
    pjHoraValor: document.getElementById('pj-hora-valor-screen'),
    profile: document.getElementById('profile-screen'),
    reports: document.getElementById('reports-screen'),
    historico: document.getElementById('historico-screen'),
    // CORREÇÃO: A linha abaixo estava em falta, o que causava o alerta de "em desenvolvimento".
    aposentadoria: document.getElementById('aposentadoria-screen'),
};

// --- 3. Mapeamento de Componentes (Seletores) ---
// Aqui, criamos "atalhos" para todos os botões, formulários e campos de resultado.
// Em vez de procurar um elemento no HTML toda a vez que precisamos dele, nós guardamo-lo
// numa constante no início, o que deixa o código mais limpo e organizado.

// 3.1 - Autenticação e Boas-Vindas
const authForms = { login: document.getElementById('login-form'), signup: document.getElementById('signup-form'), choices: document.getElementById('auth-choices') };
const authButtons = { showLogin: document.getElementById('show-login-btn'), showSignup: document.getElementById('show-signup-btn'), showLoginLink: document.getElementById('show-login-link'), showSignupLink: document.getElementById('show-signup-link'), logout: document.getElementById('logout-btn'), logoutPj: document.getElementById('logout-btn-pj') };
const welcomeScreenElements = { welcomeMessage: document.getElementById('welcome-message-choice'), buttons: { clt: document.getElementById('goto-clt-dashboard-btn'), pj: document.getElementById('goto-pj-dashboard-btn') } };

// 3.2 - Dashboards
const dashboardElements = { quote: document.getElementById('dashboard-quote') };
const dashboardButtons = { salario: document.getElementById('goto-salario-btn'), investimentos: document.getElementById('goto-investimentos-btn'), ferias: document.getElementById('goto-ferias-btn'), decimoTerceiro: document.getElementById('goto-decimo-terceiro-btn'), horaValor: document.getElementById('goto-hora-valor-btn'), irpf: document.getElementById('goto-irpf-btn'), showAbout: document.getElementById('show-about-btn'), profile: document.getElementById('goto-profile-btn'), reports: document.getElementById('goto-reports-btn'), historico: document.getElementById('goto-historico-btn') };
const pjDashboardButtons = { simples: document.getElementById('goto-simples-nacional-btn'), horaValorPj: document.getElementById('goto-pj-hora-valor-btn'), backToWelcome: document.getElementById('back-to-welcome-from-pj') };

// 3.3 - Ferramentas CLT
const salarioElements = { form: { salarioBruto: document.getElementById('salario-bruto'), dependentes: document.getElementById('salario-dependentes') }, buttons: { calcular: document.getElementById('calcular-salario-btn'), voltar: document.getElementById('back-to-dashboard-from-salario'), salvar: document.getElementById('salvar-salario-btn') }, results: { container: document.getElementById('salario-results-section'), salarioBruto: document.getElementById('resultado-salario-bruto'), inss: document.getElementById('resultado-inss'), baseIrrf: document.getElementById('resultado-base-irrf'), irrf: document.getElementById('resultado-irrf'), salarioLiquido: document.getElementById('resultado-salario-liquido'), explicacaoInss: document.getElementById('explicacao-inss'), explicacaoIrrf: document.getElementById('explicacao-irrf') } };
const investimentosElements = { form: { valorInicial: document.getElementById('valor-inicial'), aporteMensal: document.getElementById('aporte-mensal'), taxaJurosAnual: document.getElementById('taxa-juros-anual'), periodoAnos: document.getElementById('periodo-anos') }, buttons: { calcular: document.getElementById('calcular-investimentos-btn'), voltar: document.getElementById('back-to-dashboard-from-investimentos'), salvar: document.getElementById('salvar-investimentos-btn') }, results: { container: document.getElementById('investimentos-results-section'), valorFinal: document.getElementById('resultado-valor-final'), totalInvestido: document.getElementById('resultado-total-investido'), totalJuros: document.getElementById('resultado-total-juros') } };
const feriasElements = { form: { salarioBruto: document.getElementById('ferias-salario-bruto'), dias: document.getElementById('ferias-dias'), venderDias: document.getElementById('ferias-vender-dias'), adiantar13: document.getElementById('ferias-adiantar-13') }, buttons: { calcular: document.getElementById('calcular-ferias-btn'), voltar: document.getElementById('back-to-dashboard-from-ferias'), salvar: document.getElementById('salvar-ferias-btn') }, results: { container: document.getElementById('ferias-results-section'), feriasBrutas: document.getElementById('resultado-ferias-brutas'), tercoConstitucional: document.getElementById('resultado-terco-constitucional'), abonoPecuniario: document.getElementById('resultado-abono-pecuniario'), totalBruto: document.getElementById('resultado-total-bruto-ferias'), inss: document.getElementById('resultado-inss-ferias'), irrf: document.getElementById('resultado-irrf-ferias'), adiantamento13: document.getElementById('resultado-adiantamento-13'), liquido: document.getElementById('resultado-liquido-ferias'), abonoLine: document.getElementById('abono-pecuniario-line'), adiantamento13Line: document.getElementById('adiantamento-13-line') } };
const decimoTerceiroElements = { form: { salarioBruto: document.getElementById('decimo-terceiro-salario-bruto'), meses: document.getElementById('decimo-terceiro-meses'), dependentes: document.getElementById('decimo-terceiro-dependentes') }, buttons: { calcular: document.getElementById('calcular-decimo-terceiro-btn'), voltar: document.getElementById('back-to-dashboard-from-decimo-terceiro'), salvar: document.getElementById('salvar-decimo-terceiro-btn') }, results: { container: document.getElementById('decimo-terceiro-results-section'), bruto: document.getElementById('resultado-13-bruto'), primeiraParcela: document.getElementById('resultado-13-primeira-parcela'), segundaParcelaBruta: document.getElementById('resultado-13-segunda-parcela-bruta'), inss: document.getElementById('resultado-inss-13'), irrf: document.getElementById('resultado-irrf-13'), segundaParcelaLiquida: document.getElementById('resultado-13-segunda-parcela-liquida'), liquidoTotal: document.getElementById('resultado-13-liquido-total') } };
const horaValorElements = { form: { salario: document.getElementById('hora-valor-salario'), horasDia: document.getElementById('hora-valor-horas-dia'), diasSemana: document.getElementById('hora-valor-dias-semana') }, buttons: { calcular: document.getElementById('calcular-hora-valor-btn'), voltar: document.getElementById('back-to-dashboard-from-hora-valor'), salvar: document.getElementById('salvar-hora-valor-btn') }, results: { container: document.getElementById('hora-valor-results-section'), valorHora: document.getElementById('resultado-hora-valor'), explicacao: document.getElementById('explicacao-hora-valor') } };
const irpfElements = { form: { rendimentosAnuais: document.getElementById('rendimentos-anuais'), despesasSaude: document.getElementById('despesas-saude'), despesasEducacao: document.getElementById('despesas-educacao'), dependentes: document.getElementById('dependentes') }, buttons: { calcular: document.getElementById('calcular-irpf-btn'), voltar: document.getElementById('back-to-dashboard-from-irpf'), salvar: document.getElementById('salvar-irpf-btn') }, results: { container: document.getElementById('irpf-results-section'), completa: document.getElementById('resultado-irpf-completa'), simplificada: document.getElementById('resultado-irpf-simplificada'), recomendacao: document.getElementById('recomendacao-irpf').querySelector('p') } };

// 3.4 - Ferramentas PJ
const simplesNacionalElements = { form: { faturamentoMensal: document.getElementById('faturamento-mensal'), anexo: document.getElementById('anexo-simples') }, buttons: { calcular: document.getElementById('calcular-simples-btn'), voltar: document.getElementById('back-to-pj-dashboard-from-simples'), salvar: document.getElementById('salvar-simples-nacional-btn') }, results: { container: document.getElementById('simples-results-section'), rbt12: document.getElementById('resultado-rbt12'), aliquotaEfetiva: document.getElementById('resultado-aliquota-efetiva'), valorDas: document.getElementById('resultado-valor-das'), explicacao: document.getElementById('explicacao-simples') } };
const pjHoraValorElements = { form: { salarioDesejado: document.getElementById('pj-salario-desejado'), custosFixos: document.getElementById('pj-custos-fixos'), feriasAno: document.getElementById('pj-ferias-ano'), horasDia: document.getElementById('pj-horas-dia'), diasSemana: document.getElementById('pj-dias-semana') }, buttons: { calcular: document.getElementById('calcular-pj-hora-valor-btn'), voltar: document.getElementById('back-to-pj-dashboard-from-hora'), salvar: document.getElementById('salvar-pj-hora-valor-btn') }, results: { container: document.getElementById('pj-hora-valor-results-section'), valorHora: document.getElementById('resultado-pj-hora-valor'), explicacao: document.getElementById('explicacao-pj-hora-valor') } };

// 3.5 - Ferramentas e Telas Comuns
const aposentadoriaElements = { screen: document.getElementById('aposentadoria-screen'), form: { idadeAtual: document.getElementById('aposentadoria-idade-atual'), idadeObjetivo: document.getElementById('aposentadoria-idade-objetivo'), patrimonioAtual: document.getElementById('aposentadoria-patrimonio-atual'), aporteMensal: document.getElementById('aposentadoria-aporte-mensal'), rendaDesejada: document.getElementById('aposentadoria-renda-desejada') }, buttons: { calcular: document.getElementById('calcular-aposentadoria-btn'), voltar: document.getElementById('back-to-dashboard-from-aposentadoria'), salvar: null }, results: { container: document.getElementById('aposentadoria-results-section'), objetivo: document.getElementById('resultado-aposentadoria-objetivo'), projecao: document.getElementById('resultado-aposentadoria-projecao'), recomendacao: document.getElementById('aposentadoria-recomendacao').querySelector('p') } };
const profileElements = { form: { salarioBruto: document.getElementById('profile-salario-bruto'), dependentes: document.getElementById('profile-dependentes'), horasDia: document.getElementById('profile-horas-dia'), diasSemana: document.getElementById('profile-dias-semana'), }, buttons: { salvar: document.getElementById('salvar-perfil-btn'), voltar: document.getElementById('back-to-dashboard-from-profile'), }, statusMessage: document.getElementById('profile-status-message'), };
const reportsElements = { salaryChart: document.getElementById('salary-chart'), investmentChart: document.getElementById('investment-chart'), notice: document.getElementById('reports-notice'), content: document.getElementById('reports-content'), backButton: document.getElementById('back-to-dashboard-from-reports'), summary: { dailyValue: document.getElementById('summary-daily-value'), thirteenthValue: document.getElementById('summary-13th-value') } };
const historicoElements = { lista: document.getElementById('historico-lista'), voltar: document.getElementById('back-to-dashboard-from-historico') };
const modalElements = { overlay: document.getElementById('about-modal-overlay'), closeBtn: document.getElementById('close-about-btn') };

// ==================================================================================
// PARTE 2: DADOS E CONTEÚDO
// ----------------------------------------------------------------------------------
// Aqui guardamos "variáveis de estado" e conteúdo estático. Variáveis de estado
// são como a memória de curto prazo da aplicação (ex: quem é o utilizador logado?).
// ==================================================================================
let userProfile = null; // Guarda os dados do perfil do utilizador quando ele faz login.
let salaryChartInstance = null; // Guarda a "instância" do gráfico de salário para podermos atualizá-lo.
let investmentChartInstance = null; // Guarda a "instância" do gráfico de investimentos.
const dashboardQuotes = [ "Um objetivo sem um plano é apenas um desejo. Use as nossas ferramentas para transformar os seus desejos em planos.", "A melhor altura para plantar uma árvore foi há 20 anos. A segunda melhor altura é agora. O mesmo vale para os seus investimentos.", "Cuidado com as pequenas despesas; um pequeno furo pode afundar um grande navio.", "O seu futuro financeiro é criado pelo que você faz hoje, não amanhã. Cada cálculo é um passo na direção certa.", "Saber o valor do seu tempo é o primeiro passo para garantir que ele seja bem recompensado." ];

// ==================================================================================
// PARTE 3: FUNÇÕES DE GESTÃO DE TELA E UI
// ----------------------------------------------------------------------------------
// Esta secção controla o que o utilizador vê no ecrã.
// ==================================================================================
// A função principal de navegação. Ela esconde todas as telas e depois mostra
// apenas a que foi pedida pelo nome (ex: 'salario', 'investimentos').
function showScreen(screenName) { Object.values(screens).forEach(screen => { if (screen) screen.classList.add('hidden'); }); if (screens[screenName]) { screens[screenName].classList.remove('hidden'); console.log(`A exibir a tela: ${screenName}`); } else { console.warn(`AVISO: A tela "${screenName}" ainda não foi criada no index.html.`); alert(`A funcionalidade para "${screenName}" ainda está em desenvolvimento!`); screens.dashboard.classList.remove('hidden'); } }
    
// Atualiza a interface com base no estado de autenticação. Se o utilizador
// estiver logado, busca o perfil dele e mostra a tela de boas-vindas. Senão, mostra a tela de login.
async function updateUserUI(user) { if (user) { welcomeScreenElements.welcomeMessage.textContent = `Olá, ${user.email}!`; await fetchUserProfile(user); showScreen('welcome'); } else { userProfile = null; showScreen('auth'); } }

// ==================================================================================
// PARTE 4: FUNÇÕES DE AUTENTICAÇÃO E PERFIL
// ----------------------------------------------------------------------------------
// Aqui ficam todas as funções que falam com o Supabase para gerir os dados do utilizador.
// ==================================================================================
// Pega no e-mail e senha do formulário e tenta fazer o login via Supabase.
async function handleLogin(event) { event.preventDefault(); const email = authForms.login.querySelector('#login-email').value; const password = authForms.login.querySelector('#login-password').value; const { error } = await supabaseClient.auth.signInWithPassword({ email, password }); if (error) alert(`Erro no login: ${error.message}`); }
    
// Pega no e-mail e senha e tenta criar uma nova conta no Supabase.
async function handleSignup(event) { event.preventDefault(); const email = authForms.signup.querySelector('#signup-email').value; const password = authForms.signup.querySelector('#signup-password').value; const { error } = await supabaseClient.auth.signUp({ email, password }); if (error) { alert(`Erro no registo: ${error.message}`); } else { alert('Registo realizado! Verifique o seu e-mail para confirmar a conta e depois faça o login.'); authForms.signup.classList.add('hidden'); authForms.login.classList.remove('hidden'); } }
    
// Desconecta o utilizador da aplicação.
async function handleLogout() { await supabaseClient.auth.signOut(); authForms.login.reset(); authForms.signup.reset(); authForms.login.classList.add('hidden'); authForms.signup.classList.add('hidden'); authForms.choices.classList.remove('hidden'); }
    
// Pega nos dados do formulário "Meu Perfil" e salva-os no banco de dados.
async function handleSaveProfile() { const { data: { user } } = await supabaseClient.auth.getUser(); if (!user) { alert('Precisa de estar autenticado para salvar o perfil.'); return; } const salarioBruto = parseFloat(profileElements.form.salarioBruto.value) || null; const dependentes = parseInt(profileElements.form.dependentes.value); const horasDia = parseFloat(profileElements.form.horasDia.value) || null; const diasSemana = parseInt(profileElements.form.diasSemana.value) || null; const updates = { user_id: user.id, salario_bruto: salarioBruto, dependentes: isNaN(dependentes) ? null : dependentes, horas_dia: horasDia, dias_semana: diasSemana, updated_at: new Date(), }; const { error } = await supabaseClient.from('profiles').upsert(updates); if (error) { console.error('Erro ao salvar o perfil:', error); profileElements.statusMessage.textContent = `Erro ao salvar: ${error.message}`; profileElements.statusMessage.classList.remove('hidden'); } else { console.log('Perfil salvo com sucesso!'); userProfile = updates; profileElements.statusMessage.textContent = 'Perfil salvo com sucesso!'; profileElements.statusMessage.classList.remove('hidden'); setTimeout(() => { profileElements.statusMessage.classList.add('hidden'); }, 3000); } }
    
// Busca os dados do perfil do utilizador que está logado e guarda-os na variável `userProfile`.
async function fetchUserProfile(user) { if (!user) return; const { data, error } = await supabaseClient.from('profiles').select('*').eq('user_id', user.id).single(); if (error && error.code !== 'PGRST116') { console.error('Erro ao buscar o perfil:', error); } else if (data) { userProfile = data; console.log('Perfil do utilizador carregado:', userProfile); } else { console.log('Nenhum perfil encontrado para este utilizador.'); userProfile = null; } }
    
// Uma função de conveniência que pega nos dados guardados em `userProfile` e preenche
// automaticamente os campos das várias calculadoras para poupar tempo ao utilizador.
function preencherFormulariosComPerfil() { if (!userProfile) return; if (userProfile.salario_bruto) profileElements.form.salarioBruto.value = userProfile.salario_bruto; if (userProfile.dependentes !== null) profileElements.form.dependentes.value = userProfile.dependentes; if (userProfile.horas_dia) profileElements.form.horasDia.value = userProfile.horas_dia; if (userProfile.dias_semana) profileElements.form.diasSemana.value = userProfile.dias_semana; if (userProfile.salario_bruto) salarioElements.form.salarioBruto.value = userProfile.salario_bruto; if (userProfile.dependentes !== null) salarioElements.form.dependentes.value = userProfile.dependentes; if (userProfile.salario_bruto) feriasElements.form.salarioBruto.value = userProfile.salario_bruto; if (userProfile.salario_bruto) decimoTerceiroElements.form.salarioBruto.value = userProfile.salario_bruto; if (userProfile.dependentes !== null) decimoTerceiroElements.form.dependentes.value = userProfile.dependentes; if (userProfile.salario_bruto) horaValorElements.form.salario.value = userProfile.salario_bruto; if (userProfile.horas_dia) horaValorElements.form.horasDia.value = userProfile.horas_dia; if (userProfile.dias_semana) horaValorElements.form.diasSemana.value = userProfile.dias_semana; }

/**
 * ==================================================================================
 * main.js - Cérebro da "änalitks"
 * ----------------------------------------------------------------------------------
 * Este ficheiro foi modificado para implementar a lógica de salvar o resultado
 * do SIMULADOR DE IRPF ANUAL e finalizar a integração de todas as calculadoras
 * do Módulo CLT com o sistema de Histórico.
 * ==================================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==================================================================================
// PARTE 1: CONFIGURAÇÃO E SELETORES DE ELEMENTOS (Versão Corrigida e Reorganizada)
// ----------------------------------------------------------------------------------
console.log("Iniciando o main.js...");

// --- 1. Configuração do Backend (Supabase) ---
// Estas linhas estabelecem a conexão com o banco de dados Supabase, que é usado
// para guardar as informações dos utilizadores e os seus cálculos salvos.
const SUPABASE_URL = 'https://ejddiovmtjpipangyqeo.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqZGRpb3ZtdGpwaXBhbmd5cWVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgзMTU4MDksImV4cCI6MjA3NDI5MTgwOX0.GH53mox_cijkhqAxy-sNmvxGcgtoLzuoE5sfP9hHdho';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
console.log('Cliente Supabase inicializado.');

// --- 2. Mapeamento de Telas Principais ---
// Esta constante é o nosso "GPS" de navegação. Cada entrada aqui representa uma
// "tela" (uma div principal) da nossa aplicação. A função showScreen usa este mapa
// para saber qual tela mostrar e quais esconder.
const screens = {
    auth: document.getElementById('auth-screen'),
    welcome: document.getElementById('welcome-screen'),
    dashboard: document.getElementById('dashboard-screen'),
    pjDashboard: document.getElementById('pj-dashboard-screen'),
    salario: document.getElementById('salario-screen'),
    investimentos: document.getElementById('investimentos-screen'),
    ferias: document.getElementById('ferias-screen'),
    decimoTerceiro: document.getElementById('decimo-terceiro-screen'),
    horaValor: document.getElementById('hora-valor-screen'),
    irpf: document.getElementById('irpf-screen'),
    simplesNacional: document.getElementById('simples-nacional-screen'),
    pjHoraValor: document.getElementById('pj-hora-valor-screen'),
    profile: document.getElementById('profile-screen'),
    reports: document.getElementById('reports-screen'),
    historico: document.getElementById('historico-screen'),
    // CORREÇÃO: A linha abaixo estava em falta, o que causava o alerta de "em desenvolvimento".
    aposentadoria: document.getElementById('aposentadoria-screen'),
};

// --- 3. Mapeamento de Componentes (Seletores) ---
// Aqui, criamos "atalhos" para todos os botões, formulários e campos de resultado.
// Em vez de procurar um elemento no HTML toda a vez que precisamos dele, nós guardamo-lo
// numa constante no início, o que deixa o código mais limpo e organizado.

// 3.1 - Autenticação e Boas-Vindas
const authForms = { login: document.getElementById('login-form'), signup: document.getElementById('signup-form'), choices: document.getElementById('auth-choices') };
const authButtons = { showLogin: document.getElementById('show-login-btn'), showSignup: document.getElementById('show-signup-btn'), showLoginLink: document.getElementById('show-login-link'), showSignupLink: document.getElementById('show-signup-link'), logout: document.getElementById('logout-btn'), logoutPj: document.getElementById('logout-btn-pj') };
const welcomeScreenElements = { welcomeMessage: document.getElementById('welcome-message-choice'), buttons: { clt: document.getElementById('goto-clt-dashboard-btn'), pj: document.getElementById('goto-pj-dashboard-btn') } };

// 3.2 - Dashboards
const dashboardElements = { quote: document.getElementById('dashboard-quote') };
const dashboardButtons = { salario: document.getElementById('goto-salario-btn'), investimentos: document.getElementById('goto-investimentos-btn'), ferias: document.getElementById('goto-ferias-btn'), decimoTerceiro: document.getElementById('goto-decimo-terceiro-btn'), horaValor: document.getElementById('goto-hora-valor-btn'), irpf: document.getElementById('goto-irpf-btn'), showAbout: document.getElementById('show-about-btn'), profile: document.getElementById('goto-profile-btn'), reports: document.getElementById('goto-reports-btn'), historico: document.getElementById('goto-historico-btn') };
const pjDashboardButtons = { simples: document.getElementById('goto-simples-nacional-btn'), horaValorPj: document.getElementById('goto-pj-hora-valor-btn'), backToWelcome: document.getElementById('back-to-welcome-from-pj') };

// 3.3 - Ferramentas CLT
const salarioElements = { form: { salarioBruto: document.getElementById('salario-bruto'), dependentes: document.getElementById('salario-dependentes') }, buttons: { calcular: document.getElementById('calcular-salario-btn'), voltar: document.getElementById('back-to-dashboard-from-salario'), salvar: document.getElementById('salvar-salario-btn') }, results: { container: document.getElementById('salario-results-section'), salarioBruto: document.getElementById('resultado-salario-bruto'), inss: document.getElementById('resultado-inss'), baseIrrf: document.getElementById('resultado-base-irrf'), irrf: document.getElementById('resultado-irrf'), salarioLiquido: document.getElementById('resultado-salario-liquido'), explicacaoInss: document.getElementById('explicacao-inss'), explicacaoIrrf: document.getElementById('explicacao-irrf') } };
const investimentosElements = { form: { valorInicial: document.getElementById('valor-inicial'), aporteMensal: document.getElementById('aporte-mensal'), taxaJurosAnual: document.getElementById('taxa-juros-anual'), periodoAnos: document.getElementById('periodo-anos') }, buttons: { calcular: document.getElementById('calcular-investimentos-btn'), voltar: document.getElementById('back-to-dashboard-from-investimentos'), salvar: document.getElementById('salvar-investimentos-btn') }, results: { container: document.getElementById('investimentos-results-section'), valorFinal: document.getElementById('resultado-valor-final'), totalInvestido: document.getElementById('resultado-total-investido'), totalJuros: document.getElementById('resultado-total-juros') } };
const feriasElements = { form: { salarioBruto: document.getElementById('ferias-salario-bruto'), dias: document.getElementById('ferias-dias'), venderDias: document.getElementById('ferias-vender-dias'), adiantar13: document.getElementById('ferias-adiantar-13') }, buttons: { calcular: document.getElementById('calcular-ferias-btn'), voltar: document.getElementById('back-to-dashboard-from-ferias'), salvar: document.getElementById('salvar-ferias-btn') }, results: { container: document.getElementById('ferias-results-section'), feriasBrutas: document.getElementById('resultado-ferias-brutas'), tercoConstitucional: document.getElementById('resultado-terco-constitucional'), abonoPecuniario: document.getElementById('resultado-abono-pecuniario'), totalBruto: document.getElementById('resultado-total-bruto-ferias'), inss: document.getElementById('resultado-inss-ferias'), irrf: document.getElementById('resultado-irrf-ferias'), adiantamento13: document.getElementById('resultado-adiantamento-13'), liquido: document.getElementById('resultado-liquido-ferias'), abonoLine: document.getElementById('abono-pecuniario-line'), adiantamento13Line: document.getElementById('adiantamento-13-line') } };
const decimoTerceiroElements = { form: { salarioBruto: document.getElementById('decimo-terceiro-salario-bruto'), meses: document.getElementById('decimo-terceiro-meses'), dependentes: document.getElementById('decimo-terceiro-dependentes') }, buttons: { calcular: document.getElementById('calcular-decimo-terceiro-btn'), voltar: document.getElementById('back-to-dashboard-from-decimo-terceiro'), salvar: document.getElementById('salvar-decimo-terceiro-btn') }, results: { container: document.getElementById('decimo-terceiro-results-section'), bruto: document.getElementById('resultado-13-bruto'), primeiraParcela: document.getElementById('resultado-13-primeira-parcela'), segundaParcelaBruta: document.getElementById('resultado-13-segunda-parcela-bruta'), inss: document.getElementById('resultado-inss-13'), irrf: document.getElementById('resultado-irrf-13'), segundaParcelaLiquida: document.getElementById('resultado-13-segunda-parcela-liquida'), liquidoTotal: document.getElementById('resultado-13-liquido-total') } };
const horaValorElements = { form: { salario: document.getElementById('hora-valor-salario'), horasDia: document.getElementById('hora-valor-horas-dia'), diasSemana: document.getElementById('hora-valor-dias-semana') }, buttons: { calcular: document.getElementById('calcular-hora-valor-btn'), voltar: document.getElementById('back-to-dashboard-from-hora-valor'), salvar: document.getElementById('salvar-hora-valor-btn') }, results: { container: document.getElementById('hora-valor-results-section'), valorHora: document.getElementById('resultado-hora-valor'), explicacao: document.getElementById('explicacao-hora-valor') } };
const irpfElements = { form: { rendimentosAnuais: document.getElementById('rendimentos-anuais'), despesasSaude: document.getElementById('despesas-saude'), despesasEducacao: document.getElementById('despesas-educacao'), dependentes: document.getElementById('dependentes') }, buttons: { calcular: document.getElementById('calcular-irpf-btn'), voltar: document.getElementById('back-to-dashboard-from-irpf'), salvar: document.getElementById('salvar-irpf-btn') }, results: { container: document.getElementById('irpf-results-section'), completa: document.getElementById('resultado-irpf-completa'), simplificada: document.getElementById('resultado-irpf-simplificada'), recomendacao: document.getElementById('recomendacao-irpf').querySelector('p') } };

// 3.4 - Ferramentas PJ
const simplesNacionalElements = { form: { faturamentoMensal: document.getElementById('faturamento-mensal'), anexo: document.getElementById('anexo-simples') }, buttons: { calcular: document.getElementById('calcular-simples-btn'), voltar: document.getElementById('back-to-pj-dashboard-from-simples'), salvar: document.getElementById('salvar-simples-nacional-btn') }, results: { container: document.getElementById('simples-results-section'), rbt12: document.getElementById('resultado-rbt12'), aliquotaEfetiva: document.getElementById('resultado-aliquota-efetiva'), valorDas: document.getElementById('resultado-valor-das'), explicacao: document.getElementById('explicacao-simples') } };
const pjHoraValorElements = { form: { salarioDesejado: document.getElementById('pj-salario-desejado'), custosFixos: document.getElementById('pj-custos-fixos'), feriasAno: document.getElementById('pj-ferias-ano'), horasDia: document.getElementById('pj-horas-dia'), diasSemana: document.getElementById('pj-dias-semana') }, buttons: { calcular: document.getElementById('calcular-pj-hora-valor-btn'), voltar: document.getElementById('back-to-pj-dashboard-from-hora'), salvar: document.getElementById('salvar-pj-hora-valor-btn') }, results: { container: document.getElementById('pj-hora-valor-results-section'), valorHora: document.getElementById('resultado-pj-hora-valor'), explicacao: document.getElementById('explicacao-pj-hora-valor') } };

// 3.5 - Ferramentas e Telas Comuns
const aposentadoriaElements = { screen: document.getElementById('aposentadoria-screen'), form: { idadeAtual: document.getElementById('aposentadoria-idade-atual'), idadeObjetivo: document.getElementById('aposentadoria-idade-objetivo'), patrimonioAtual: document.getElementById('aposentadoria-patrimonio-atual'), aporteMensal: document.getElementById('aposentadoria-aporte-mensal'), rendaDesejada: document.getElementById('aposentadoria-renda-desejada') }, buttons: { calcular: document.getElementById('calcular-aposentadoria-btn'), voltar: document.getElementById('back-to-dashboard-from-aposentadoria'), salvar: null }, results: { container: document.getElementById('aposentadoria-results-section'), objetivo: document.getElementById('resultado-aposentadoria-objetivo'), projecao: document.getElementById('resultado-aposentadoria-projecao'), recomendacao: document.getElementById('aposentadoria-recomendacao').querySelector('p') } };
const profileElements = { form: { salarioBruto: document.getElementById('profile-salario-bruto'), dependentes: document.getElementById('profile-dependentes'), horasDia: document.getElementById('profile-horas-dia'), diasSemana: document.getElementById('profile-dias-semana'), }, buttons: { salvar: document.getElementById('salvar-perfil-btn'), voltar: document.getElementById('back-to-dashboard-from-profile'), }, statusMessage: document.getElementById('profile-status-message'), };
const reportsElements = { salaryChart: document.getElementById('salary-chart'), investmentChart: document.getElementById('investment-chart'), notice: document.getElementById('reports-notice'), content: document.getElementById('reports-content'), backButton: document.getElementById('back-to-dashboard-from-reports'), summary: { dailyValue: document.getElementById('summary-daily-value'), thirteenthValue: document.getElementById('summary-13th-value') } };
const historicoElements = { lista: document.getElementById('historico-lista'), voltar: document.getElementById('back-to-dashboard-from-historico') };
const modalElements = { overlay: document.getElementById('about-modal-overlay'), closeBtn: document.getElementById('close-about-btn') };

// ==================================================================================
// PARTE 2: DADOS E CONTEÚDO
// ----------------------------------------------------------------------------------
// Aqui guardamos "variáveis de estado" e conteúdo estático. Variáveis de estado
// são como a memória de curto prazo da aplicação (ex: quem é o utilizador logado?).
// ==================================================================================
let userProfile = null; // Guarda os dados do perfil do utilizador quando ele faz login.
let salaryChartInstance = null; // Guarda a "instância" do gráfico de salário para podermos atualizá-lo.
let investmentChartInstance = null; // Guarda a "instância" do gráfico de investimentos.
const dashboardQuotes = [ "Um objetivo sem um plano é apenas um desejo. Use as nossas ferramentas para transformar os seus desejos em planos.", "A melhor altura para plantar uma árvore foi há 20 anos. A segunda melhor altura é agora. O mesmo vale para os seus investimentos.", "Cuidado com as pequenas despesas; um pequeno furo pode afundar um grande navio.", "O seu futuro financeiro é criado pelo que você faz hoje, não amanhã. Cada cálculo é um passo na direção certa.", "Saber o valor do seu tempo é o primeiro passo para garantir que ele seja bem recompensado." ];

// ==================================================================================
// PARTE 3: FUNÇÕES DE GESTÃO DE TELA E UI
// ----------------------------------------------------------------------------------
// Esta secção controla o que o utilizador vê no ecrã.
// ==================================================================================
// A função principal de navegação. Ela esconde todas as telas e depois mostra
// apenas a que foi pedida pelo nome (ex: 'salario', 'investimentos').
function showScreen(screenName) { Object.values(screens).forEach(screen => { if (screen) screen.classList.add('hidden'); }); if (screens[screenName]) { screens[screenName].classList.remove('hidden'); console.log(`A exibir a tela: ${screenName}`); } else { console.warn(`AVISO: A tela "${screenName}" ainda não foi criada no index.html.`); alert(`A funcionalidade para "${screenName}" ainda está em desenvolvimento!`); screens.dashboard.classList.remove('hidden'); } }
    
// Atualiza a interface com base no estado de autenticação. Se o utilizador
// estiver logado, busca o perfil dele e mostra a tela de boas-vindas. Senão, mostra a tela de login.
async function updateUserUI(user) { if (user) { welcomeScreenElements.welcomeMessage.textContent = `Olá, ${user.email}!`; await fetchUserProfile(user); showScreen('welcome'); } else { userProfile = null; showScreen('auth'); } }

// ==================================================================================
// PARTE 4: FUNÇÕES DE AUTENTICAÇÃO E PERFIL
// ----------------------------------------------------------------------------------
// Aqui ficam todas as funções que falam com o Supabase para gerir os dados do utilizador.
// ==================================================================================
// Pega no e-mail e senha do formulário e tenta fazer o login via Supabase.
async function handleLogin(event) { event.preventDefault(); const email = authForms.login.querySelector('#login-email').value; const password = authForms.login.querySelector('#login-password').value; const { error } = await supabaseClient.auth.signInWithPassword({ email, password }); if (error) alert(`Erro no login: ${error.message}`); }
    
// Pega no e-mail e senha e tenta criar uma nova conta no Supabase.
async function handleSignup(event) { event.preventDefault(); const email = authForms.signup.querySelector('#signup-email').value; const password = authForms.signup.querySelector('#signup-password').value; const { error } = await supabaseClient.auth.signUp({ email, password }); if (error) { alert(`Erro no registo: ${error.message}`); } else { alert('Registo realizado! Verifique o seu e-mail para confirmar a conta e depois faça o login.'); authForms.signup.classList.add('hidden'); authForms.login.classList.remove('hidden'); } }
    
// Desconecta o utilizador da aplicação.
async function handleLogout() { await supabaseClient.auth.signOut(); authForms.login.reset(); authForms.signup.reset(); authForms.login.classList.add('hidden'); authForms.signup.classList.add('hidden'); authForms.choices.classList.remove('hidden'); }
    
// Pega nos dados do formulário "Meu Perfil" e salva-os no banco de dados.
async function handleSaveProfile() { const { data: { user } } = await supabaseClient.auth.getUser(); if (!user) { alert('Precisa de estar autenticado para salvar o perfil.'); return; } const salarioBruto = parseFloat(profileElements.form.salarioBruto.value) || null; const dependentes = parseInt(profileElements.form.dependentes.value); const horasDia = parseFloat(profileElements.form.horasDia.value) || null; const diasSemana = parseInt(profileElements.form.diasSemana.value) || null; const updates = { user_id: user.id, salario_bruto: salarioBruto, dependentes: isNaN(dependentes) ? null : dependentes, horas_dia: horasDia, dias_semana: diasSemana, updated_at: new Date(), }; const { error } = await supabaseClient.from('profiles').upsert(updates); if (error) { console.error('Erro ao salvar o perfil:', error); profileElements.statusMessage.textContent = `Erro ao salvar: ${error.message}`; profileElements.statusMessage.classList.remove('hidden'); } else { console.log('Perfil salvo com sucesso!'); userProfile = updates; profileElements.statusMessage.textContent = 'Perfil salvo com sucesso!'; profileElements.statusMessage.classList.remove('hidden'); setTimeout(() => { profileElements.statusMessage.classList.add('hidden'); }, 3000); } }
    
// Busca os dados do perfil do utilizador que está logado e guarda-os na variável `userProfile`.
async function fetchUserProfile(user) { if (!user) return; const { data, error } = await supabaseClient.from('profiles').select('*').eq('user_id', user.id).single(); if (error && error.code !== 'PGRST116') { console.error('Erro ao buscar o perfil:', error); } else if (data) { userProfile = data; console.log('Perfil do utilizador carregado:', userProfile); } else { console.log('Nenhum perfil encontrado para este utilizador.'); userProfile = null; } }
    
// Uma função de conveniência que pega nos dados guardados em `userProfile` e preenche
// automaticamente os campos das várias calculadoras para poupar tempo ao utilizador.
function preencherFormulariosComPerfil() { if (!userProfile) return; if (userProfile.salario_bruto) profileElements.form.salarioBruto.value = userProfile.salario_bruto; if (userProfile.dependentes !== null) profileElements.form.dependentes.value = userProfile.dependentes; if (userProfile.horas_dia) profileElements.form.horasDia.value = userProfile.horas_dia; if (userProfile.dias_semana) profileElements.form.diasSemana.value = userProfile.dias_semana; if (userProfile.salario_bruto) salarioElements.form.salarioBruto.value = userProfile.salario_bruto; if (userProfile.dependentes !== null) salarioElements.form.dependentes.value = userProfile.dependentes; if (userProfile.salario_bruto) feriasElements.form.salarioBruto.value = userProfile.salario_bruto; if (userProfile.salario_bruto) decimoTerceiroElements.form.salarioBruto.value = userProfile.salario_bruto; if (userProfile.dependentes !== null) decimoTerceiroElements.form.dependentes.value = userProfile.dependentes; if (userProfile.salario_bruto) horaValorElements.form.salario.value = userProfile.salario_bruto; if (userProfile.horas_dia) horaValorElements.form.horasDia.value = userProfile.horas_dia; if (userProfile.dias_semana) horaValorElements.form.diasSemana.value = userProfile.dias_semana; }

// ==================================================================================
// PARTE 5: FUNÇÕES DE CÁLCULO E GRÁFICOS
// ----------------------------------------------------------------------------------
// Esta secção contém as funções de "baixo nível" que realizam os cálculos matemáticos
// (como os impostos) e as funções que desenham os gráficos na tela de "Visão Geral".
// A lógica foi atualizada para que os gráficos sejam dinâmicos, buscando dados do histórico,
// e para corrigir um bug que impedia a reabertura da tela.
// ==================================================================================

// Calcula o desconto do INSS com base na tabela progressiva oficial.
function calcularINSS(baseDeCalculo) { const faixas = [ { teto: 1412.00, aliquota: 0.075, parcela: 0 }, { teto: 2666.68, aliquota: 0.09,  parcela: 21.18 }, { teto: 4000.03, aliquota: 0.12,  parcela: 101.18 }, { teto: 7786.02, aliquota: 0.14,  parcela: 181.18 } ]; if (baseDeCalculo > faixas[3].teto) { return (faixas[3].teto * faixas[3].aliquota) - faixas[3].parcela; } for (const faixa of faixas) { if (baseDeCalculo <= faixa.teto) { return (baseDeCalculo * faixa.aliquota) - faixa.parcela; } } return 0; }

// Calcula o desconto do Imposto de Renda Retido na Fonte, também com base na tabela progressiva.
function calcularIRRF(baseDeCalculo, numDependentes = 0) { const DEDUCAO_POR_DEPENDENTE = 189.59; const baseReal = baseDeCalculo - (numDependentes * DEDUCAO_POR_DEPENDENTE); const faixas = [ { teto: 2259.20, aliquota: 0,     parcela: 0 }, { teto: 2826.65, aliquota: 0.075, parcela: 169.44 }, { teto: 3751.05, aliquota: 0.15,  parcela: 381.44 }, { teto: 4664.68, aliquota: 0.225, parcela: 662.77 }, { teto: Infinity,aliquota: 0.275, parcela: 896.00 } ]; for (const faixa of faixas) { if (baseReal <= faixa.teto) { const imposto = (baseReal * faixa.aliquota) - faixa.parcela; return Math.max(0, imposto); } } return 0; }

// Calcula o imposto de renda devido na declaração anual.
function calcularImpostoAnual(baseDeCalculo) { const faixas = [ { limite: 24511.92, aliquota: 0,     deducao: 0 }, { limite: 33919.80, aliquota: 0.075, deducao: 1838.39 }, { limite: 45012.60, aliquota: 0.15,  deducao: 4382.38 }, { limite: 55976.16, aliquota: 0.225, deducao: 7758.32 }, { limite: Infinity, aliquota: 0.275, deducao: 10557.13 } ]; for (const faixa of faixas) { if (baseDeCalculo <= faixa.limite) { const imposto = (baseDeCalculo * faixa.aliquota) - faixa.deducao; return imposto > 0 ? imposto : 0; } } return 0; }

// Desenha o gráfico de linha que mostra a evolução dos salários líquidos salvos.
async function renderSalaryChart() {
    // CORREÇÃO: Destrói a instância anterior do gráfico para evitar sobreposição e bugs.
    if (salaryChartInstance) {
        salaryChartInstance.destroy();
    }
    
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) return;

    const canvas = reportsElements.salaryChart;
    const container = canvas.parentElement;
    
    // CORREÇÃO: Limpa a mensagem "sem dados" se ela existir de uma visualização anterior.
    const existingMessage = container.querySelector('.chart-notice');
    if (existingMessage) existingMessage.remove();

    // Busca os dados de salário salvos no histórico do utilizador.
    const { data, error } = await supabaseClient
        .from('historico_salarios')
        .select('created_at, salario_liquido_calculado')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

    // Se não houver dados, exibe uma mensagem amigável em vez do gráfico.
    if (error || !data || data.length === 0) {
        canvas.style.display = 'none'; // Esconde a área do gráfico.
        const noDataMessage = document.createElement('p');
        noDataMessage.className = 'explanation-text text-center chart-notice';
        noDataMessage.textContent = 'Salve o seu primeiro cálculo de salário para ver a sua evolução aqui!';
        container.appendChild(noDataMessage);
        return;
    }

    canvas.style.display = 'block'; // Garante que a área do gráfico esteja visível.

    const labels = data.map(item => new Date(item.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }));
    const chartData = data.map(item => item.salario_liquido_calculado);

    // Cria a nova instância do gráfico com os dados do histórico.
    salaryChartInstance = new Chart(canvas.getContext('2d'), {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Salário Líquido',
                data: chartData,
                borderColor: '#6D28D9',
                backgroundColor: 'rgba(109, 40, 217, 0.1)',
                fill: true,
                tension: 0.3
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

// Desenha o gráfico de barras que compara as diferentes projeções de investimento salvas.
async function renderInvestmentChart() {
    // CORREÇÃO: Destrói a instância anterior do gráfico.
    if (investmentChartInstance) {
        investmentChartInstance.destroy();
    }
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) return;

    const canvas = reportsElements.investmentChart;
    const container = canvas.parentElement;

    const existingMessage = container.querySelector('.chart-notice');
    if (existingMessage) existingMessage.remove();

    // Busca as simulações de investimento salvas no histórico.
    const { data, error } = await supabaseClient
        .from('historico_investimentos')
        .select('created_at, valor_final_calculado, periodo_anos_informado')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

    // Se não houver dados, exibe uma mensagem.
    if (error || !data || data.length === 0) {
        canvas.style.display = 'none';
        const noDataMessage = document.createElement('p');
        noDataMessage.className = 'explanation-text text-center chart-notice';
        noDataMessage.textContent = 'Salve a sua primeira simulação de investimento para comparar cenários aqui!';
        container.appendChild(noDataMessage);
        return;
    }
    
    canvas.style.display = 'block';

    const labels = data.map(item => `Salvo em ${new Date(item.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })} (${item.periodo_anos_informado} anos)`);
    const chartData = data.map(item => item.valor_final_calculado);

    // Cria a nova instância do gráfico.
    investmentChartInstance = new Chart(canvas.getContext('2d'), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Valor Final Projetado',
                data: chartData,
                backgroundColor: '#8B5CF6',
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

// Calcula e exibe os valores nos cartões de resumo com base nos dados do perfil do utilizador.
function renderSummaryCards() {
    if (!userProfile || !userProfile.salario_bruto || !userProfile.horas_dia || !userProfile.dias_semana) {
        reportsElements.summary.dailyValue.textContent = 'N/A';
        reportsElements.summary.thirteenthValue.textContent = 'N/A';
        return;
    }
    const salarioBruto = userProfile.salario_bruto;
    const diasSemana = userProfile.dias_semana;
    const descontoINSS = calcularINSS(salarioBruto);
    const salarioLiquido = salarioBruto - descontoINSS - calcularIRRF(salarioBruto - descontoINSS, userProfile.dependentes || 0);
    const diasTrabalhadosMes = diasSemana * 4.5;
    const valorDiaLiquido = salarioLiquido / diasTrabalhadosMes;
    reportsElements.summary.dailyValue.textContent = `R$ ${valorDiaLiquido.toFixed(2)}`;
    const decimoTerceiroBruto = (salarioBruto / 12) * 12;
    const decimoTerceiroLiquido = (decimoTerceiroBruto - calcularINSS(decimoTerceiroBruto) - calcularIRRF(decimoTerceiroBruto - calcularINSS(decimoTerceiroBruto), userProfile.dependentes || 0));
    reportsElements.summary.thirteenthValue.textContent = `R$ ${decimoTerceiroLiquido.toFixed(2)}`;
}

/**
 * ==================================================================================
 * main.js - Cérebro da "änalitks"
 * ----------------------------------------------------------------------------------
 * Este ficheiro foi modificado para implementar a lógica de salvar o resultado
 * do SIMULADOR DE IRPF ANUAL e finalizar a integração de todas as calculadoras
 * do Módulo CLT com o sistema de Histórico.
 * ==================================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==================================================================================
// PARTE 1: CONFIGURAÇÃO E SELETORES DE ELEMENTOS (Versão Corrigida e Reorganizada)
// ----------------------------------------------------------------------------------
console.log("Iniciando o main.js...");

// --- 1. Configuração do Backend (Supabase) ---
// Estas linhas estabelecem a conexão com o banco de dados Supabase, que é usado
// para guardar as informações dos utilizadores e os seus cálculos salvos.
const SUPABASE_URL = 'https://ejddiovmtjpipangyqeo.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqZGRpb3ZtdGpwaXBhbmd5cWVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgзMTU4MDksImV4cCI6MjA3NDI5MTgwOX0.GH53mox_cijkhqAxy-sNmvxGcgtoLzuoE5sfP9hHdho';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
console.log('Cliente Supabase inicializado.');

// --- 2. Mapeamento de Telas Principais ---
// Esta constante é o nosso "GPS" de navegação. Cada entrada aqui representa uma
// "tela" (uma div principal) da nossa aplicação. A função showScreen usa este mapa
// para saber qual tela mostrar e quais esconder.
const screens = {
    auth: document.getElementById('auth-screen'),
    welcome: document.getElementById('welcome-screen'),
    dashboard: document.getElementById('dashboard-screen'),
    pjDashboard: document.getElementById('pj-dashboard-screen'),
    salario: document.getElementById('salario-screen'),
    investimentos: document.getElementById('investimentos-screen'),
    ferias: document.getElementById('ferias-screen'),
    decimoTerceiro: document.getElementById('decimo-terceiro-screen'),
    horaValor: document.getElementById('hora-valor-screen'),
    irpf: document.getElementById('irpf-screen'),
    simplesNacional: document.getElementById('simples-nacional-screen'),
    pjHoraValor: document.getElementById('pj-hora-valor-screen'),
    profile: document.getElementById('profile-screen'),
    reports: document.getElementById('reports-screen'),
    historico: document.getElementById('historico-screen'),
    // CORREÇÃO: A linha abaixo estava em falta, o que causava o alerta de "em desenvolvimento".
    aposentadoria: document.getElementById('aposentadoria-screen'),
};

// --- 3. Mapeamento de Componentes (Seletores) ---
// Aqui, criamos "atalhos" para todos os botões, formulários e campos de resultado.
// Em vez de procurar um elemento no HTML toda a vez que precisamos dele, nós guardamo-lo
// numa constante no início, o que deixa o código mais limpo e organizado.

// 3.1 - Autenticação e Boas-Vindas
const authForms = { login: document.getElementById('login-form'), signup: document.getElementById('signup-form'), choices: document.getElementById('auth-choices') };
const authButtons = { showLogin: document.getElementById('show-login-btn'), showSignup: document.getElementById('show-signup-btn'), showLoginLink: document.getElementById('show-login-link'), showSignupLink: document.getElementById('show-signup-link'), logout: document.getElementById('logout-btn'), logoutPj: document.getElementById('logout-btn-pj') };
const welcomeScreenElements = { welcomeMessage: document.getElementById('welcome-message-choice'), buttons: { clt: document.getElementById('goto-clt-dashboard-btn'), pj: document.getElementById('goto-pj-dashboard-btn') } };

// 3.2 - Dashboards
const dashboardElements = { quote: document.getElementById('dashboard-quote') };
const dashboardButtons = { salario: document.getElementById('goto-salario-btn'), investimentos: document.getElementById('goto-investimentos-btn'), ferias: document.getElementById('goto-ferias-btn'), decimoTerceiro: document.getElementById('goto-decimo-terceiro-btn'), horaValor: document.getElementById('goto-hora-valor-btn'), irpf: document.getElementById('goto-irpf-btn'), showAbout: document.getElementById('show-about-btn'), profile: document.getElementById('goto-profile-btn'), reports: document.getElementById('goto-reports-btn'), historico: document.getElementById('goto-historico-btn') };
const pjDashboardButtons = { simples: document.getElementById('goto-simples-nacional-btn'), horaValorPj: document.getElementById('goto-pj-hora-valor-btn'), backToWelcome: document.getElementById('back-to-welcome-from-pj') };

// 3.3 - Ferramentas CLT
const salarioElements = { form: { salarioBruto: document.getElementById('salario-bruto'), dependentes: document.getElementById('salario-dependentes') }, buttons: { calcular: document.getElementById('calcular-salario-btn'), voltar: document.getElementById('back-to-dashboard-from-salario'), salvar: document.getElementById('salvar-salario-btn') }, results: { container: document.getElementById('salario-results-section'), salarioBruto: document.getElementById('resultado-salario-bruto'), inss: document.getElementById('resultado-inss'), baseIrrf: document.getElementById('resultado-base-irrf'), irrf: document.getElementById('resultado-irrf'), salarioLiquido: document.getElementById('resultado-salario-liquido'), explicacaoInss: document.getElementById('explicacao-inss'), explicacaoIrrf: document.getElementById('explicacao-irrf') } };
const investimentosElements = { form: { valorInicial: document.getElementById('valor-inicial'), aporteMensal: document.getElementById('aporte-mensal'), taxaJurosAnual: document.getElementById('taxa-juros-anual'), periodoAnos: document.getElementById('periodo-anos') }, buttons: { calcular: document.getElementById('calcular-investimentos-btn'), voltar: document.getElementById('back-to-dashboard-from-investimentos'), salvar: document.getElementById('salvar-investimentos-btn') }, results: { container: document.getElementById('investimentos-results-section'), valorFinal: document.getElementById('resultado-valor-final'), totalInvestido: document.getElementById('resultado-total-investido'), totalJuros: document.getElementById('resultado-total-juros') } };
const feriasElements = { form: { salarioBruto: document.getElementById('ferias-salario-bruto'), dias: document.getElementById('ferias-dias'), venderDias: document.getElementById('ferias-vender-dias'), adiantar13: document.getElementById('ferias-adiantar-13') }, buttons: { calcular: document.getElementById('calcular-ferias-btn'), voltar: document.getElementById('back-to-dashboard-from-ferias'), salvar: document.getElementById('salvar-ferias-btn') }, results: { container: document.getElementById('ferias-results-section'), feriasBrutas: document.getElementById('resultado-ferias-brutas'), tercoConstitucional: document.getElementById('resultado-terco-constitucional'), abonoPecuniario: document.getElementById('resultado-abono-pecuniario'), totalBruto: document.getElementById('resultado-total-bruto-ferias'), inss: document.getElementById('resultado-inss-ferias'), irrf: document.getElementById('resultado-irrf-ferias'), adiantamento13: document.getElementById('resultado-adiantamento-13'), liquido: document.getElementById('resultado-liquido-ferias'), abonoLine: document.getElementById('abono-pecuniario-line'), adiantamento13Line: document.getElementById('adiantamento-13-line') } };
const decimoTerceiroElements = { form: { salarioBruto: document.getElementById('decimo-terceiro-salario-bruto'), meses: document.getElementById('decimo-terceiro-meses'), dependentes: document.getElementById('decimo-terceiro-dependentes') }, buttons: { calcular: document.getElementById('calcular-decimo-terceiro-btn'), voltar: document.getElementById('back-to-dashboard-from-decimo-terceiro'), salvar: document.getElementById('salvar-decimo-terceiro-btn') }, results: { container: document.getElementById('decimo-terceiro-results-section'), bruto: document.getElementById('resultado-13-bruto'), primeiraParcela: document.getElementById('resultado-13-primeira-parcela'), segundaParcelaBruta: document.getElementById('resultado-13-segunda-parcela-bruta'), inss: document.getElementById('resultado-inss-13'), irrf: document.getElementById('resultado-irrf-13'), segundaParcelaLiquida: document.getElementById('resultado-13-segunda-parcela-liquida'), liquidoTotal: document.getElementById('resultado-13-liquido-total') } };
const horaValorElements = { form: { salario: document.getElementById('hora-valor-salario'), horasDia: document.getElementById('hora-valor-horas-dia'), diasSemana: document.getElementById('hora-valor-dias-semana') }, buttons: { calcular: document.getElementById('calcular-hora-valor-btn'), voltar: document.getElementById('back-to-dashboard-from-hora-valor'), salvar: document.getElementById('salvar-hora-valor-btn') }, results: { container: document.getElementById('hora-valor-results-section'), valorHora: document.getElementById('resultado-hora-valor'), explicacao: document.getElementById('explicacao-hora-valor') } };
const irpfElements = { form: { rendimentosAnuais: document.getElementById('rendimentos-anuais'), despesasSaude: document.getElementById('despesas-saude'), despesasEducacao: document.getElementById('despesas-educacao'), dependentes: document.getElementById('dependentes') }, buttons: { calcular: document.getElementById('calcular-irpf-btn'), voltar: document.getElementById('back-to-dashboard-from-irpf'), salvar: document.getElementById('salvar-irpf-btn') }, results: { container: document.getElementById('irpf-results-section'), completa: document.getElementById('resultado-irpf-completa'), simplificada: document.getElementById('resultado-irpf-simplificada'), recomendacao: document.getElementById('recomendacao-irpf').querySelector('p') } };

// 3.4 - Ferramentas PJ
const simplesNacionalElements = { form: { faturamentoMensal: document.getElementById('faturamento-mensal'), anexo: document.getElementById('anexo-simples') }, buttons: { calcular: document.getElementById('calcular-simples-btn'), voltar: document.getElementById('back-to-pj-dashboard-from-simples'), salvar: document.getElementById('salvar-simples-nacional-btn') }, results: { container: document.getElementById('simples-results-section'), rbt12: document.getElementById('resultado-rbt12'), aliquotaEfetiva: document.getElementById('resultado-aliquota-efetiva'), valorDas: document.getElementById('resultado-valor-das'), explicacao: document.getElementById('explicacao-simples') } };
const pjHoraValorElements = { form: { salarioDesejado: document.getElementById('pj-salario-desejado'), custosFixos: document.getElementById('pj-custos-fixos'), feriasAno: document.getElementById('pj-ferias-ano'), horasDia: document.getElementById('pj-horas-dia'), diasSemana: document.getElementById('pj-dias-semana') }, buttons: { calcular: document.getElementById('calcular-pj-hora-valor-btn'), voltar: document.getElementById('back-to-pj-dashboard-from-hora'), salvar: document.getElementById('salvar-pj-hora-valor-btn') }, results: { container: document.getElementById('pj-hora-valor-results-section'), valorHora: document.getElementById('resultado-pj-hora-valor'), explicacao: document.getElementById('explicacao-pj-hora-valor') } };

// 3.5 - Ferramentas e Telas Comuns
const aposentadoriaElements = { screen: document.getElementById('aposentadoria-screen'), form: { idadeAtual: document.getElementById('aposentadoria-idade-atual'), idadeObjetivo: document.getElementById('aposentadoria-idade-objetivo'), patrimonioAtual: document.getElementById('aposentadoria-patrimonio-atual'), aporteMensal: document.getElementById('aposentadoria-aporte-mensal'), rendaDesejada: document.getElementById('aposentadoria-renda-desejada') }, buttons: { calcular: document.getElementById('calcular-aposentadoria-btn'), voltar: document.getElementById('back-to-dashboard-from-aposentadoria'), salvar: null }, results: { container: document.getElementById('aposentadoria-results-section'), objetivo: document.getElementById('resultado-aposentadoria-objetivo'), projecao: document.getElementById('resultado-aposentadoria-projecao'), recomendacao: document.getElementById('aposentadoria-recomendacao').querySelector('p') } };
const profileElements = { form: { salarioBruto: document.getElementById('profile-salario-bruto'), dependentes: document.getElementById('profile-dependentes'), horasDia: document.getElementById('profile-horas-dia'), diasSemana: document.getElementById('profile-dias-semana'), }, buttons: { salvar: document.getElementById('salvar-perfil-btn'), voltar: document.getElementById('back-to-dashboard-from-profile'), }, statusMessage: document.getElementById('profile-status-message'), };
const reportsElements = { salaryChart: document.getElementById('salary-chart'), investmentChart: document.getElementById('investment-chart'), notice: document.getElementById('reports-notice'), content: document.getElementById('reports-content'), backButton: document.getElementById('back-to-dashboard-from-reports'), summary: { dailyValue: document.getElementById('summary-daily-value'), thirteenthValue: document.getElementById('summary-13th-value') } };
const historicoElements = { lista: document.getElementById('historico-lista'), voltar: document.getElementById('back-to-dashboard-from-historico') };
const modalElements = { overlay: document.getElementById('about-modal-overlay'), closeBtn: document.getElementById('close-about-btn') };

// ==================================================================================
// PARTE 2: DADOS E CONTEÚDO
// ----------------------------------------------------------------------------------
// Aqui guardamos "variáveis de estado" e conteúdo estático. Variáveis de estado
// são como a memória de curto prazo da aplicação (ex: quem é o utilizador logado?).
// ==================================================================================
let userProfile = null; // Guarda os dados do perfil do utilizador quando ele faz login.
let salaryChartInstance = null; // Guarda a "instância" do gráfico de salário para podermos atualizá-lo.
let investmentChartInstance = null; // Guarda a "instância" do gráfico de investimentos.
const dashboardQuotes = [ "Um objetivo sem um plano é apenas um desejo. Use as nossas ferramentas para transformar os seus desejos em planos.", "A melhor altura para plantar uma árvore foi há 20 anos. A segunda melhor altura é agora. O mesmo vale para os seus investimentos.", "Cuidado com as pequenas despesas; um pequeno furo pode afundar um grande navio.", "O seu futuro financeiro é criado pelo que você faz hoje, não amanhã. Cada cálculo é um passo na direção certa.", "Saber o valor do seu tempo é o primeiro passo para garantir que ele seja bem recompensado." ];

// ==================================================================================
// PARTE 3: FUNÇÕES DE GESTÃO DE TELA E UI
// ----------------------------------------------------------------------------------
// Esta secção controla o que o utilizador vê no ecrã.
// ==================================================================================
// A função principal de navegação. Ela esconde todas as telas e depois mostra
// apenas a que foi pedida pelo nome (ex: 'salario', 'investimentos').
function showScreen(screenName) { Object.values(screens).forEach(screen => { if (screen) screen.classList.add('hidden'); }); if (screens[screenName]) { screens[screenName].classList.remove('hidden'); console.log(`A exibir a tela: ${screenName}`); } else { console.warn(`AVISO: A tela "${screenName}" ainda não foi criada no index.html.`); alert(`A funcionalidade para "${screenName}" ainda está em desenvolvimento!`); screens.dashboard.classList.remove('hidden'); } }
    
// Atualiza a interface com base no estado de autenticação. Se o utilizador
// estiver logado, busca o perfil dele e mostra a tela de boas-vindas. Senão, mostra a tela de login.
async function updateUserUI(user) { if (user) { welcomeScreenElements.welcomeMessage.textContent = `Olá, ${user.email}!`; await fetchUserProfile(user); showScreen('welcome'); } else { userProfile = null; showScreen('auth'); } }

// ==================================================================================
// PARTE 4: FUNÇÕES DE AUTENTICAÇÃO E PERFIL
// ----------------------------------------------------------------------------------
// Aqui ficam todas as funções que falam com o Supabase para gerir os dados do utilizador.
// ==================================================================================
// Pega no e-mail e senha do formulário e tenta fazer o login via Supabase.
async function handleLogin(event) { event.preventDefault(); const email = authForms.login.querySelector('#login-email').value; const password = authForms.login.querySelector('#login-password').value; const { error } = await supabaseClient.auth.signInWithPassword({ email, password }); if (error) alert(`Erro no login: ${error.message}`); }
    
// Pega no e-mail e senha e tenta criar uma nova conta no Supabase.
async function handleSignup(event) { event.preventDefault(); const email = authForms.signup.querySelector('#signup-email').value; const password = authForms.signup.querySelector('#signup-password').value; const { error } = await supabaseClient.auth.signUp({ email, password }); if (error) { alert(`Erro no registo: ${error.message}`); } else { alert('Registo realizado! Verifique o seu e-mail para confirmar a conta e depois faça o login.'); authForms.signup.classList.add('hidden'); authForms.login.classList.remove('hidden'); } }
    
// Desconecta o utilizador da aplicação.
async function handleLogout() { await supabaseClient.auth.signOut(); authForms.login.reset(); authForms.signup.reset(); authForms.login.classList.add('hidden'); authForms.signup.classList.add('hidden'); authForms.choices.classList.remove('hidden'); }
    
// Pega nos dados do formulário "Meu Perfil" e salva-os no banco de dados.
async function handleSaveProfile() { const { data: { user } } = await supabaseClient.auth.getUser(); if (!user) { alert('Precisa de estar autenticado para salvar o perfil.'); return; } const salarioBruto = parseFloat(profileElements.form.salarioBruto.value) || null; const dependentes = parseInt(profileElements.form.dependentes.value); const horasDia = parseFloat(profileElements.form.horasDia.value) || null; const diasSemana = parseInt(profileElements.form.diasSemana.value) || null; const updates = { user_id: user.id, salario_bruto: salarioBruto, dependentes: isNaN(dependentes) ? null : dependentes, horas_dia: horasDia, dias_semana: diasSemana, updated_at: new Date(), }; const { error } = await supabaseClient.from('profiles').upsert(updates); if (error) { console.error('Erro ao salvar o perfil:', error); profileElements.statusMessage.textContent = `Erro ao salvar: ${error.message}`; profileElements.statusMessage.classList.remove('hidden'); } else { console.log('Perfil salvo com sucesso!'); userProfile = updates; profileElements.statusMessage.textContent = 'Perfil salvo com sucesso!'; profileElements.statusMessage.classList.remove('hidden'); setTimeout(() => { profileElements.statusMessage.classList.add('hidden'); }, 3000); } }
    
// Busca os dados do perfil do utilizador que está logado e guarda-os na variável `userProfile`.
async function fetchUserProfile(user) { if (!user) return; const { data, error } = await supabaseClient.from('profiles').select('*').eq('user_id', user.id).single(); if (error && error.code !== 'PGRST116') { console.error('Erro ao buscar o perfil:', error); } else if (data) { userProfile = data; console.log('Perfil do utilizador carregado:', userProfile); } else { console.log('Nenhum perfil encontrado para este utilizador.'); userProfile = null; } }
    
// Uma função de conveniência que pega nos dados guardados em `userProfile` e preenche
// automaticamente os campos das várias calculadoras para poupar tempo ao utilizador.
function preencherFormulariosComPerfil() { if (!userProfile) return; if (userProfile.salario_bruto) profileElements.form.salarioBruto.value = userProfile.salario_bruto; if (userProfile.dependentes !== null) profileElements.form.dependentes.value = userProfile.dependentes; if (userProfile.horas_dia) profileElements.form.horasDia.value = userProfile.horas_dia; if (userProfile.dias_semana) profileElements.form.diasSemana.value = userProfile.dias_semana; if (userProfile.salario_bruto) salarioElements.form.salarioBruto.value = userProfile.salario_bruto; if (userProfile.dependentes !== null) salarioElements.form.dependentes.value = userProfile.dependentes; if (userProfile.salario_bruto) feriasElements.form.salarioBruto.value = userProfile.salario_bruto; if (userProfile.salario_bruto) decimoTerceiroElements.form.salarioBruto.value = userProfile.salario_bruto; if (userProfile.dependentes !== null) decimoTerceiroElements.form.dependentes.value = userProfile.dependentes; if (userProfile.salario_bruto) horaValorElements.form.salario.value = userProfile.salario_bruto; if (userProfile.horas_dia) horaValorElements.form.horasDia.value = userProfile.horas_dia; if (userProfile.dias_semana) horaValorElements.form.diasSemana.value = userProfile.dias_semana; }

// ==================================================================================
// PARTE 5: FUNÇÕES DE CÁLCULO E GRÁFICOS
// ----------------------------------------------------------------------------------
// Esta secção contém as funções de "baixo nível" que realizam os cálculos matemáticos
// (como os impostos) e as funções que desenham os gráficos na tela de "Visão Geral".
// A lógica foi atualizada para que os gráficos sejam dinâmicos, buscando dados do histórico,
// e para corrigir um bug que impedia a reabertura da tela.
// ==================================================================================

// Calcula o desconto do INSS com base na tabela progressiva oficial.
function calcularINSS(baseDeCalculo) { const faixas = [ { teto: 1412.00, aliquota: 0.075, parcela: 0 }, { teto: 2666.68, aliquota: 0.09,  parcela: 21.18 }, { teto: 4000.03, aliquota: 0.12,  parcela: 101.18 }, { teto: 7786.02, aliquota: 0.14,  parcela: 181.18 } ]; if (baseDeCalculo > faixas[3].teto) { return (faixas[3].teto * faixas[3].aliquota) - faixas[3].parcela; } for (const faixa of faixas) { if (baseDeCalculo <= faixa.teto) { return (baseDeCalculo * faixa.aliquota) - faixa.parcela; } } return 0; }

// Calcula o desconto do Imposto de Renda Retido na Fonte, também com base na tabela progressiva.
function calcularIRRF(baseDeCalculo, numDependentes = 0) { const DEDUCAO_POR_DEPENDENTE = 189.59; const baseReal = baseDeCalculo - (numDependentes * DEDUCAO_POR_DEPENDENTE); const faixas = [ { teto: 2259.20, aliquota: 0,     parcela: 0 }, { teto: 2826.65, aliquota: 0.075, parcela: 169.44 }, { teto: 3751.05, aliquota: 0.15,  parcela: 381.44 }, { teto: 4664.68, aliquota: 0.225, parcela: 662.77 }, { teto: Infinity,aliquota: 0.275, parcela: 896.00 } ]; for (const faixa of faixas) { if (baseReal <= faixa.teto) { const imposto = (baseReal * faixa.aliquota) - faixa.parcela; return Math.max(0, imposto); } } return 0; }

// Calcula o imposto de renda devido na declaração anual.
function calcularImpostoAnual(baseDeCalculo) { const faixas = [ { limite: 24511.92, aliquota: 0,     deducao: 0 }, { limite: 33919.80, aliquota: 0.075, deducao: 1838.39 }, { limite: 45012.60, aliquota: 0.15,  deducao: 4382.38 }, { limite: 55976.16, aliquota: 0.225, deducao: 7758.32 }, { limite: Infinity, aliquota: 0.275, deducao: 10557.13 } ]; for (const faixa of faixas) { if (baseDeCalculo <= faixa.limite) { const imposto = (baseDeCalculo * faixa.aliquota) - faixa.deducao; return imposto > 0 ? imposto : 0; } } return 0; }

// Desenha o gráfico de linha que mostra a evolução dos salários líquidos salvos.
async function renderSalaryChart() {
    // CORREÇÃO: Destrói a instância anterior do gráfico para evitar sobreposição e bugs.
    if (salaryChartInstance) {
        salaryChartInstance.destroy();
    }
    
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) return;

    const canvas = reportsElements.salaryChart;
    const container = canvas.parentElement;
    
    // CORREÇÃO: Limpa a mensagem "sem dados" se ela existir de uma visualização anterior.
    const existingMessage = container.querySelector('.chart-notice');
    if (existingMessage) existingMessage.remove();

    // Busca os dados de salário salvos no histórico do utilizador.
    const { data, error } = await supabaseClient
        .from('historico_salarios')
        .select('created_at, salario_liquido_calculado')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

    // Se não houver dados, exibe uma mensagem amigável em vez do gráfico.
    if (error || !data || data.length === 0) {
        canvas.style.display = 'none'; // Esconde a área do gráfico.
        const noDataMessage = document.createElement('p');
        noDataMessage.className = 'explanation-text text-center chart-notice';
        noDataMessage.textContent = 'Salve o seu primeiro cálculo de salário para ver a sua evolução aqui!';
        container.appendChild(noDataMessage);
        return;
    }

    canvas.style.display = 'block'; // Garante que a área do gráfico esteja visível.

    const labels = data.map(item => new Date(item.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }));
    const chartData = data.map(item => item.salario_liquido_calculado);

    // Cria a nova instância do gráfico com os dados do histórico.
    salaryChartInstance = new Chart(canvas.getContext('2d'), {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Salário Líquido',
                data: chartData,
                borderColor: '#6D28D9',
                backgroundColor: 'rgba(109, 40, 217, 0.1)',
                fill: true,
                tension: 0.3
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

// Desenha o gráfico de barras que compara as diferentes projeções de investimento salvas.
async function renderInvestmentChart() {
    // CORREÇÃO: Destrói a instância anterior do gráfico.
    if (investmentChartInstance) {
        investmentChartInstance.destroy();
    }
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) return;

    const canvas = reportsElements.investmentChart;
    const container = canvas.parentElement;

    const existingMessage = container.querySelector('.chart-notice');
    if (existingMessage) existingMessage.remove();

    // Busca as simulações de investimento salvas no histórico.
    const { data, error } = await supabaseClient
        .from('historico_investimentos')
        .select('created_at, valor_final_calculado, periodo_anos_informado')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

    // Se não houver dados, exibe uma mensagem.
    if (error || !data || data.length === 0) {
        canvas.style.display = 'none';
        const noDataMessage = document.createElement('p');
        noDataMessage.className = 'explanation-text text-center chart-notice';
        noDataMessage.textContent = 'Salve a sua primeira simulação de investimento para comparar cenários aqui!';
        container.appendChild(noDataMessage);
        return;
    }
    
    canvas.style.display = 'block';

    const labels = data.map(item => `Salvo em ${new Date(item.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })} (${item.periodo_anos_informado} anos)`);
    const chartData = data.map(item => item.valor_final_calculado);

    // Cria a nova instância do gráfico.
    investmentChartInstance = new Chart(canvas.getContext('2d'), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Valor Final Projetado',
                data: chartData,
                backgroundColor: '#8B5CF6',
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

// Calcula e exibe os valores nos cartões de resumo com base nos dados do perfil do utilizador.
function renderSummaryCards() {
    if (!userProfile || !userProfile.salario_bruto || !userProfile.horas_dia || !userProfile.dias_semana) {
        reportsElements.summary.dailyValue.textContent = 'N/A';
        reportsElements.summary.thirteenthValue.textContent = 'N/A';
        return;
    }
    const salarioBruto = userProfile.salario_bruto;
    const diasSemana = userProfile.dias_semana;
    const descontoINSS = calcularINSS(salarioBruto);
    const salarioLiquido = salarioBruto - descontoINSS - calcularIRRF(salarioBruto - descontoINSS, userProfile.dependentes || 0);
    const diasTrabalhadosMes = diasSemana * 4.5;
    const valorDiaLiquido = salarioLiquido / diasTrabalhadosMes;
    reportsElements.summary.dailyValue.textContent = `R$ ${valorDiaLiquido.toFixed(2)}`;
    const decimoTerceiroBruto = (salarioBruto / 12) * 12;
    const decimoTerceiroLiquido = (decimoTerceiroBruto - calcularINSS(decimoTerceiroBruto) - calcularIRRF(decimoTerceiroBruto - calcularINSS(decimoTerceiroBruto), userProfile.dependentes || 0));
    reportsElements.summary.thirteenthValue.textContent = `R$ ${decimoTerceiroLiquido.toFixed(2)}`;
}

// ==================================================================================
// PARTE 6: LÓGICA DAS FERRAMENTAS
// ----------------------------------------------------------------------------------
// Esta secção é o coração de cada calculadora. Cada função `executarCalculo...`
// é responsável por ler os dados que o utilizador inseriu, chamar as funções
// de cálculo da PARTE 5, e depois exibir os resultados de forma clara no ecrã.
// ==================================================================================

// --- Ferramentas CLT ---

function executarCalculoSalario() {
    const salarioBruto = parseFloat(salarioElements.form.salarioBruto.value) || 0;
    const numDependentes = parseInt(salarioElements.form.dependentes.value) || 0;
    if (salarioBruto <= 0) { alert('Por favor, insira um salário bruto válido.'); return; }
    
    const descontoINSS = calcularINSS(salarioBruto);
    const baseCalculoIRRF = salarioBruto - descontoINSS;
    const descontoIRRF = calcularIRRF(baseCalculoIRRF, numDependentes);
    const salarioLiquido = salarioBruto - descontoINSS - descontoIRRF;

    salarioElements.results.salarioBruto.textContent = `R$ ${salarioBruto.toFixed(2)}`;
    salarioElements.results.inss.textContent = `- R$ ${descontoINSS.toFixed(2)}`;
    salarioElements.results.baseIrrf.textContent = `R$ ${baseCalculoIRRF.toFixed(2)}`;
    salarioElements.results.irrf.textContent = `- R$ ${descontoIRRF.toFixed(2)}`;
    salarioElements.results.salarioLiquido.textContent = `R$ ${salarioLiquido.toFixed(2)}`;
    salarioElements.results.explicacaoInss.textContent = `O cálculo do INSS é progressivo, baseado em faixas salariais.`;
    salarioElements.results.explicacaoIrrf.textContent = `O IRRF incide sobre o salário bruto menos o desconto do INSS e as deduções por dependente.`;
    
    salarioElements.results.container.classList.remove('hidden');
    salarioElements.buttons.salvar.classList.remove('hidden');
}

function executarSimulacaoInvestimentos() {
    const valorInicial = parseFloat(investimentosElements.form.valorInicial.value) || 0;
    const aporteMensal = parseFloat(investimentosElements.form.aporteMensal.value) || 0;
    const taxaAnual = parseFloat(investimentosElements.form.taxaJurosAnual.value) || 0;
    const periodoAnos = parseInt(investimentosElements.form.periodoAnos.value) || 0;

    if (taxaAnual <= 0 || periodoAnos <= 0) { alert('Por favor, insira valores válidos para a taxa e o período.'); return; }

    const taxaMensal = taxaAnual / 100 / 12;
    const numMeses = periodoAnos * 12;
    let valorFinal = valorInicial;

    for (let i = 0; i < numMeses; i++) {
        valorFinal = (valorFinal + aporteMensal) * (1 + taxaMensal);
    }

    const totalInvestido = valorInicial + (aporteMensal * numMeses);
    const totalJuros = valorFinal - totalInvestido;

    investimentosElements.results.valorFinal.textContent = `R$ ${valorFinal.toFixed(2)}`;
    investimentosElements.results.totalInvestido.textContent = `R$ ${totalInvestido.toFixed(2)}`;
    investimentosElements.results.totalJuros.textContent = `R$ ${totalJuros.toFixed(2)}`;

    investimentosElements.results.container.classList.remove('hidden');
    investimentosElements.buttons.salvar.classList.remove('hidden');
}

function executarCalculoFerias() {
    const salarioBruto = parseFloat(feriasElements.form.salarioBruto.value) || 0;
    const diasFerias = parseInt(feriasElements.form.dias.value) || 30;
    const venderDias = feriasElements.form.venderDias.checked;
    const adiantar13 = feriasElements.form.adiantar13.checked;

    if (salarioBruto <= 0) { alert('Por favor, insira um salário bruto válido.'); return; }

    const feriasProporcionais = (salarioBruto / 30) * diasFerias;
    const tercoConstitucional = feriasProporcionais / 3;
    let abonoPecuniario = 0;
    if (venderDias) {
        const valorDia = salarioBruto / 30;
        abonoPecuniario = valorDia * 10; // Venda de 1/3 das férias, máx 10 dias
    }

    const totalBrutoFerias = feriasProporcionais + tercoConstitucional;
    const descontoINSSFerias = calcularINSS(totalBrutoFerias);
    const descontoIRRFFerias = calcularIRRF(totalBrutoFerias - descontoINSSFerias, userProfile ? userProfile.dependentes : 0);
    
    let adiantamento13 = 0;
    if (adiantar13) {
        adiantamento13 = (salarioBruto / 12 * 6) / 2; // Metade da primeira parcela do 13º
    }

    const liquidoReceber = totalBrutoFerias - descontoINSSFerias - descontoIRRFFerias + abonoPecuniario + adiantamento13;

    feriasElements.results.feriasBrutas.textContent = `R$ ${feriasProporcionais.toFixed(2)}`;
    feriasElements.results.tercoConstitucional.textContent = `R$ ${tercoConstitucional.toFixed(2)}`;
    feriasElements.results.abonoPecuniario.textContent = `R$ ${abonoPecuniario.toFixed(2)}`;
    feriasElements.results.totalBruto.textContent = `R$ ${totalBrutoFerias.toFixed(2)}`;
    feriasElements.results.inss.textContent = `- R$ ${descontoINSSFerias.toFixed(2)}`;
    feriasElements.results.irrf.textContent = `- R$ ${descontoIRRFFerias.toFixed(2)}`;
    feriasElements.results.adiantamento13.textContent = `R$ ${adiantamento13.toFixed(2)}`;
    feriasElements.results.liquido.textContent = `R$ ${liquidoReceber.toFixed(2)}`;

    feriasElements.results.abonoLine.style.display = venderDias ? 'flex' : 'none';
    feriasElements.results.adiantamento13Line.style.display = adiantar13 ? 'flex' : 'none';

    feriasElements.results.container.classList.remove('hidden');
    feriasElements.buttons.salvar.classList.remove('hidden');
}

function executarCalculoDecimoTerceiro() {
    const salarioBruto = parseFloat(decimoTerceiroElements.form.salarioBruto.value) || 0;
    const mesesTrabalhados = parseInt(decimoTerceiroElements.form.meses.value) || 12;
    const numDependentes = parseInt(decimoTerceiroElements.form.dependentes.value) || 0;

    if (salarioBruto <= 0 || mesesTrabalhados <= 0 || mesesTrabalhados > 12) { alert('Insira valores válidos.'); return; }

    const bruto13 = (salarioBruto / 12) * mesesTrabalhados;
    const primeiraParcela = bruto13 / 2;
    const segundaParcelaBruta = bruto13 / 2;
    const inss13 = calcularINSS(bruto13);
    const irrf13 = calcularIRRF(bruto13 - inss13, numDependentes);
    const segundaParcelaLiquida = segundaParcelaBruta - inss13 - irrf13;
    const liquidoTotal = primeiraParcela + segundaParcelaLiquida;

    decimoTerceiroElements.results.bruto.textContent = `R$ ${bruto13.toFixed(2)}`;
    decimoTerceiroElements.results.primeiraParcela.textContent = `R$ ${primeiraParcela.toFixed(2)}`;
    decimoTerceiroElements.results.segundaParcelaBruta.textContent = `R$ ${segundaParcelaBruta.toFixed(2)}`;
    decimoTerceiroElements.results.inss.textContent = `- R$ ${inss13.toFixed(2)}`;
    decimoTerceiroElements.results.irrf.textContent = `- R$ ${irrf13.toFixed(2)}`;
    decimoTerceiroElements.results.segundaParcelaLiquida.textContent = `R$ ${segundaParcelaLiquida.toFixed(2)}`;
    decimoTerceiroElements.results.liquidoTotal.textContent = `R$ ${liquidoTotal.toFixed(2)}`;

    decimoTerceiroElements.results.container.classList.remove('hidden');
    decimoTerceiroElements.buttons.salvar.classList.remove('hidden');
}

function executarCalculoHoraValor() {
    const salario = parseFloat(horaValorElements.form.salario.value) || 0;
    const horasDia = parseFloat(horaValorElements.form.horasDia.value) || 0;
    const diasSemana = parseInt(horaValorElements.form.diasSemana.value) || 0;

    if (salario <= 0 || horasDia <= 0 || diasSemana <= 0 || diasSemana > 7) { alert('Insira valores válidos.'); return; }

    const horasTrabalhadasMes = horasDia * diasSemana * 4.5;
    const valorHora = salario / horasTrabalhadasMes;

    horaValorElements.results.valorHora.textContent = `R$ ${valorHora.toFixed(2)}`;
    horaValorElements.results.explicacao.textContent = `Baseado em ${horasTrabalhadasMes.toFixed(1)} horas trabalhadas no mês.`;
    
    horaValorElements.results.container.classList.remove('hidden');
    horaValorElements.buttons.salvar.classList.remove('hidden');
}

function executarCalculoIrpf() {
    const rendimentos = parseFloat(irpfElements.form.rendimentosAnuais.value) || 0;
    const despesasSaude = parseFloat(irpfElements.form.despesasSaude.value) || 0;
    const despesasEducacao = parseFloat(irpfElements.form.despesasEducacao.value) || 0;
    const numDependentes = parseInt(irpfElements.form.dependentes.value) || 0;
    
    if (rendimentos <= 0) { alert('Insira o total de rendimentos anuais.'); return; }
    
    // Limites de dedução
    const LIMITE_DEDUCAO_EDUCACAO = 3561.50;
    const DEDUCAO_POR_DEPENDENTE_ANUAL = 2275.08;

    // Cálculo Simplificado
    const baseCalculoSimplificada = rendimentos - (rendimentos * 0.20);
    const impostoSimplificado = calcularImpostoAnual(baseCalculoSimplificada);

    // Cálculo Completo
    const deducaoEducacao = Math.min(despesasEducacao, LIMITE_DEDUCAO_EDUCACAO);
    const deducaoDependentes = numDependentes * DEDUCAO_POR_DEPENDENTE_ANUAL;
    const totalDeducoes = despesasSaude + deducaoEducacao + deducaoDependentes;
    const baseCalculoCompleta = rendimentos - totalDeducoes;
    const impostoCompleto = calcularImpostoAnual(baseCalculoCompleta);
    
    let recomendacao = '';
    let corRecomendacao = '';
    if (impostoCompleto < impostoSimplificado) {
        recomendacao = 'Recomendação: A Declaração Completa parece mais vantajosa.';
        corRecomendacao = 'success-text';
    } else {
        recomendacao = 'Recomendação: A Declaração Simplificada parece mais vantajosa.';
        corRecomendacao = 'success-text'; // Ambas são "sucesso" em encontrar a melhor
    }

    irpfElements.results.completa.textContent = `R$ ${impostoCompleto.toFixed(2)}`;
    irpfElements.results.simplificada.textContent = `R$ ${impostoSimplificado.toFixed(2)}`;
    irpfElements.results.recomendacao.textContent = recomendacao;
    irpfElements.results.recomendacao.parentElement.className = `text-center font-bold ${corRecomendacao}`;
    
    irpfElements.results.container.classList.remove('hidden');
    irpfElements.buttons.salvar.classList.remove('hidden');
}

// --- Ferramentas PJ ---

function executarCalculoSimplesNacional() {
    const faturamentoMensal = parseFloat(simplesNacionalElements.form.faturamentoMensal.value) || 0;
    const anexo = simplesNacionalElements.form.anexo.value;

    if (faturamentoMensal <= 0) { alert('Insira um faturamento válido.'); return; }
    
    const rbt12 = faturamentoMensal * 12;
    let aliquotaNominal, parcelaDeduzir;

    const faixas = {
        anexo3: [
            { teto: 180000, aliquota: 0.06, parcela: 0 },
            { teto: 360000, aliquota: 0.112, parcela: 9360 },
            { teto: 720000, aliquota: 0.135, parcela: 17640 },
            { teto: 1800000, aliquota: 0.16, parcela: 35640 },
            { teto: 3600000, aliquota: 0.21, parcela: 125640 },
            { teto: 4800000, aliquota: 0.33, parcela: 648000 }
        ],
        anexo5: [
            { teto: 180000, aliquota: 0.155, parcela: 0 },
            { teto: 360000, aliquota: 0.18, parcela: 4500 },
            { teto: 720000, aliquota: 0.195, parcela: 9900 },
            { teto: 1800000, aliquota: 0.205, parcela: 17100 },
            { teto: 3600000, aliquota: 0.23, parcela: 62100 },
            { teto: 4800000, aliquota: 0.305, parcela: 540000 }
        ]
    };

    const faixasAnexo = faixas[anexo];
    for(const faixa of faixasAnexo) {
        if (rbt12 <= faixa.teto) {
            aliquotaNominal = faixa.aliquota;
            parcelaDeduzir = faixa.parcela;
            break;
        }
    }

    const aliquotaEfetiva = ((rbt12 * aliquotaNominal) - parcelaDeduzir) / rbt12;
    const valorDAS = faturamentoMensal * aliquotaEfetiva;

    simplesNacionalElements.results.rbt12.textContent = `R$ ${rbt12.toFixed(2)}`;
    simplesNacionalElements.results.aliquotaEfetiva.textContent = `${(aliquotaEfetiva * 100).toFixed(2)}%`;
    simplesNacionalElements.results.valorDas.textContent = `R$ ${valorDAS.toFixed(2)}`;
    simplesNacionalElements.results.explicacao.textContent = `A alíquota efetiva foi calculada com base no seu faturamento anual estimado (RBT12).`;
    
    simplesNacionalElements.results.container.classList.remove('hidden');
    simplesNacionalElements.buttons.salvar.classList.remove('hidden');
}

function executarCalculoPjHoraValor() {
    const salarioDesejado = parseFloat(pjHoraValorElements.form.salarioDesejado.value) || 0;
    const custosFixos = parseFloat(pjHoraValorElements.form.custosFixos.value) || 0;
    const feriasAno = parseInt(pjHoraValorElements.form.feriasAno.value) || 0;
    const horasDia = parseFloat(pjHoraValorElements.form.horasDia.value) || 0;
    const diasSemana = parseInt(pjHoraValorElements.form.diasSemana.value) || 0;

    if (salarioDesejado <= 0 || horasDia <= 0 || diasSemana <= 0) { alert('Preencha os campos com valores válidos.'); return; }

    const semanasAno = 52;
    const diasTrabalhoAno = (diasSemana * semanasAno) - feriasAno;
    const horasTrabalhoAno = diasTrabalhoAno * horasDia;
    const horasTrabalhoMes = horasTrabalhoAno / 12;
    
    const custoAnual = (salarioDesejado + custosFixos) * 12;
    const valorHora = custoAnual / horasTrabalhoAno;

    pjHoraValorElements.results.valorHora.textContent = `R$ ${valorHora.toFixed(2)}`;
    pjHoraValorElements.results.explicacao.textContent = `Cálculo baseado em ${horasTrabalhoMes.toFixed(1)} horas produtivas por mês.`;
    
    pjHoraValorElements.results.container.classList.remove('hidden');
    pjHoraValorElements.buttons.salvar.classList.remove('hidden');
}

// --- Ferramentas Comuns ---

function executarCalculoAposentadoria() {
    const idadeAtual = parseInt(aposentadoriaElements.form.idadeAtual.value) || 0;
    const idadeObjetivo = parseInt(aposentadoriaElements.form.idadeObjetivo.value) || 0;
    const patrimonioAtual = parseFloat(aposentadoriaElements.form.patrimonioAtual.value) || 0;
    const aporteMensal = parseFloat(aposentadoriaElements.form.aporteMensal.value) || 0;
    const rendaDesejada = parseFloat(aposentadoriaElements.form.rendaDesejada.value) || 0;

    if (idadeAtual <= 0 || idadeObjetivo <= idadeAtual || aporteMensal <= 0 || rendaDesejada <= 0) {
        alert('Por favor, preencha todos os campos com valores válidos.');
        return;
    }

    const rendaAnualDesejada = rendaDesejada * 12;
    const objetivoTotal = rendaAnualDesejada * 25; 

    const anosParaAposentar = idadeObjetivo - idadeAtual;
    const periodoMeses = anosParaAposentar * 12;
    const taxaJurosAnual = 0.06; // Taxa de juros real (acima da inflação) de 6%
    const taxaMensal = Math.pow(1 + taxaJurosAnual, 1/12) - 1;

    let projecaoTotal = patrimonioAtual;
    for (let i = 0; i < periodoMeses; i++) {
        projecaoTotal = projecaoTotal * (1 + taxaMensal) + aporteMensal;
    }

    let recomendacao = '';
    let corRecomendacao = '';
    if (projecaoTotal >= objetivoTotal) {
        recomendacao = 'Parabéns! Com este plano, você está no caminho certo para atingir a sua meta de aposentadoria.';
        corRecomendacao = 'success-text';
    } else {
        const falta = objetivoTotal - projecaoTotal;
        recomendacao = `Você está quase lá! Faltam aproximadamente R$ ${falta.toFixed(2)} para atingir a sua meta. Considere aumentar o seu aporte mensal.`;
        corRecomendacao = 'error-text';
    }

    aposentadoriaElements.results.objetivo.textContent = `R$ ${objetivoTotal.toFixed(2)}`;
    aposentadoriaElements.results.projecao.textContent = `R$ ${projecaoTotal.toFixed(2)}`;
    aposentadoriaElements.results.recomendacao.textContent = recomendacao;
    
    aposentadoriaElements.results.recomendacao.classList.remove('success-text', 'error-text');
    aposentadoriaElements.results.recomendacao.classList.add(corRecomendacao);

    aposentadoriaElements.results.container.classList.remove('hidden');
}

/**
 * ==================================================================================
 * main.js - Cérebro da "änalitks"
 * ----------------------------------------------------------------------------------
 * Este ficheiro foi modificado para implementar a lógica de salvar o resultado
 * do SIMULADOR DE IRPF ANUAL e finalizar a integração de todas as calculadoras
 * do Módulo CLT com o sistema de Histórico.
 * ==================================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==================================================================================
// PARTE 1: CONFIGURAÇÃO E SELETORES DE ELEMENTOS (Versão Corrigida e Reorganizada)
// ----------------------------------------------------------------------------------
console.log("Iniciando o main.js...");

// --- 1. Configuração do Backend (Supabase) ---
// Estas linhas estabelecem a conexão com o banco de dados Supabase, que é usado
// para guardar as informações dos utilizadores e os seus cálculos salvos.
const SUPABASE_URL = 'https://ejddiovmtjpipangyqeo.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqZGRpb3ZtdGpwaXBhbmd5cWVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgзMTU4MDksImV4cCI6MjA3NDI5MTgwOX0.GH53mox_cijkhqAxy-sNmvxGcgtoLzuoE5sfP9hHdho';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
console.log('Cliente Supabase inicializado.');

// --- 2. Mapeamento de Telas Principais ---
// Esta constante é o nosso "GPS" de navegação. Cada entrada aqui representa uma
// "tela" (uma div principal) da nossa aplicação. A função showScreen usa este mapa
// para saber qual tela mostrar e quais esconder.
const screens = {
    auth: document.getElementById('auth-screen'),
    welcome: document.getElementById('welcome-screen'),
    dashboard: document.getElementById('dashboard-screen'),
    pjDashboard: document.getElementById('pj-dashboard-screen'),
    salario: document.getElementById('salario-screen'),
    investimentos: document.getElementById('investimentos-screen'),
    ferias: document.getElementById('ferias-screen'),
    decimoTerceiro: document.getElementById('decimo-terceiro-screen'),
    horaValor: document.getElementById('hora-valor-screen'),
    irpf: document.getElementById('irpf-screen'),
    simplesNacional: document.getElementById('simples-nacional-screen'),
    pjHoraValor: document.getElementById('pj-hora-valor-screen'),
    profile: document.getElementById('profile-screen'),
    reports: document.getElementById('reports-screen'),
    historico: document.getElementById('historico-screen'),
    // CORREÇÃO: A linha abaixo estava em falta, o que causava o alerta de "em desenvolvimento".
    aposentadoria: document.getElementById('aposentadoria-screen'),
};

// --- 3. Mapeamento de Componentes (Seletores) ---
// Aqui, criamos "atalhos" para todos os botões, formulários e campos de resultado.
// Em vez de procurar um elemento no HTML toda a vez que precisamos dele, nós guardamo-lo
// numa constante no início, o que deixa o código mais limpo e organizado.

// 3.1 - Autenticação e Boas-Vindas
const authForms = { login: document.getElementById('login-form'), signup: document.getElementById('signup-form'), choices: document.getElementById('auth-choices') };
const authButtons = { showLogin: document.getElementById('show-login-btn'), showSignup: document.getElementById('show-signup-btn'), showLoginLink: document.getElementById('show-login-link'), showSignupLink: document.getElementById('show-signup-link'), logout: document.getElementById('logout-btn'), logoutPj: document.getElementById('logout-btn-pj') };
const welcomeScreenElements = { welcomeMessage: document.getElementById('welcome-message-choice'), buttons: { clt: document.getElementById('goto-clt-dashboard-btn'), pj: document.getElementById('goto-pj-dashboard-btn') } };

// 3.2 - Dashboards
const dashboardElements = { quote: document.getElementById('dashboard-quote') };
const dashboardButtons = { salario: document.getElementById('goto-salario-btn'), investimentos: document.getElementById('goto-investimentos-btn'), ferias: document.getElementById('goto-ferias-btn'), decimoTerceiro: document.getElementById('goto-decimo-terceiro-btn'), horaValor: document.getElementById('goto-hora-valor-btn'), irpf: document.getElementById('goto-irpf-btn'), showAbout: document.getElementById('show-about-btn'), profile: document.getElementById('goto-profile-btn'), reports: document.getElementById('goto-reports-btn'), historico: document.getElementById('goto-historico-btn') };
const pjDashboardButtons = { simples: document.getElementById('goto-simples-nacional-btn'), horaValorPj: document.getElementById('goto-pj-hora-valor-btn'), backToWelcome: document.getElementById('back-to-welcome-from-pj') };

// 3.3 - Ferramentas CLT
const salarioElements = { form: { salarioBruto: document.getElementById('salario-bruto'), dependentes: document.getElementById('salario-dependentes') }, buttons: { calcular: document.getElementById('calcular-salario-btn'), voltar: document.getElementById('back-to-dashboard-from-salario'), salvar: document.getElementById('salvar-salario-btn') }, results: { container: document.getElementById('salario-results-section'), salarioBruto: document.getElementById('resultado-salario-bruto'), inss: document.getElementById('resultado-inss'), baseIrrf: document.getElementById('resultado-base-irrf'), irrf: document.getElementById('resultado-irrf'), salarioLiquido: document.getElementById('resultado-salario-liquido'), explicacaoInss: document.getElementById('explicacao-inss'), explicacaoIrrf: document.getElementById('explicacao-irrf') } };
const investimentosElements = { form: { valorInicial: document.getElementById('valor-inicial'), aporteMensal: document.getElementById('aporte-mensal'), taxaJurosAnual: document.getElementById('taxa-juros-anual'), periodoAnos: document.getElementById('periodo-anos') }, buttons: { calcular: document.getElementById('calcular-investimentos-btn'), voltar: document.getElementById('back-to-dashboard-from-investimentos'), salvar: document.getElementById('salvar-investimentos-btn') }, results: { container: document.getElementById('investimentos-results-section'), valorFinal: document.getElementById('resultado-valor-final'), totalInvestido: document.getElementById('resultado-total-investido'), totalJuros: document.getElementById('resultado-total-juros') } };
const feriasElements = { form: { salarioBruto: document.getElementById('ferias-salario-bruto'), dias: document.getElementById('ferias-dias'), venderDias: document.getElementById('ferias-vender-dias'), adiantar13: document.getElementById('ferias-adiantar-13') }, buttons: { calcular: document.getElementById('calcular-ferias-btn'), voltar: document.getElementById('back-to-dashboard-from-ferias'), salvar: document.getElementById('salvar-ferias-btn') }, results: { container: document.getElementById('ferias-results-section'), feriasBrutas: document.getElementById('resultado-ferias-brutas'), tercoConstitucional: document.getElementById('resultado-terco-constitucional'), abonoPecuniario: document.getElementById('resultado-abono-pecuniario'), totalBruto: document.getElementById('resultado-total-bruto-ferias'), inss: document.getElementById('resultado-inss-ferias'), irrf: document.getElementById('resultado-irrf-ferias'), adiantamento13: document.getElementById('resultado-adiantamento-13'), liquido: document.getElementById('resultado-liquido-ferias'), abonoLine: document.getElementById('abono-pecuniario-line'), adiantamento13Line: document.getElementById('adiantamento-13-line') } };
const decimoTerceiroElements = { form: { salarioBruto: document.getElementById('decimo-terceiro-salario-bruto'), meses: document.getElementById('decimo-terceiro-meses'), dependentes: document.getElementById('decimo-terceiro-dependentes') }, buttons: { calcular: document.getElementById('calcular-decimo-terceiro-btn'), voltar: document.getElementById('back-to-dashboard-from-decimo-terceiro'), salvar: document.getElementById('salvar-decimo-terceiro-btn') }, results: { container: document.getElementById('decimo-terceiro-results-section'), bruto: document.getElementById('resultado-13-bruto'), primeiraParcela: document.getElementById('resultado-13-primeira-parcela'), segundaParcelaBruta: document.getElementById('resultado-13-segunda-parcela-bruta'), inss: document.getElementById('resultado-inss-13'), irrf: document.getElementById('resultado-irrf-13'), segundaParcelaLiquida: document.getElementById('resultado-13-segunda-parcela-liquida'), liquidoTotal: document.getElementById('resultado-13-liquido-total') } };
const horaValorElements = { form: { salario: document.getElementById('hora-valor-salario'), horasDia: document.getElementById('hora-valor-horas-dia'), diasSemana: document.getElementById('hora-valor-dias-semana') }, buttons: { calcular: document.getElementById('calcular-hora-valor-btn'), voltar: document.getElementById('back-to-dashboard-from-hora-valor'), salvar: document.getElementById('salvar-hora-valor-btn') }, results: { container: document.getElementById('hora-valor-results-section'), valorHora: document.getElementById('resultado-hora-valor'), explicacao: document.getElementById('explicacao-hora-valor') } };
const irpfElements = { form: { rendimentosAnuais: document.getElementById('rendimentos-anuais'), despesasSaude: document.getElementById('despesas-saude'), despesasEducacao: document.getElementById('despesas-educacao'), dependentes: document.getElementById('dependentes') }, buttons: { calcular: document.getElementById('calcular-irpf-btn'), voltar: document.getElementById('back-to-dashboard-from-irpf'), salvar: document.getElementById('salvar-irpf-btn') }, results: { container: document.getElementById('irpf-results-section'), completa: document.getElementById('resultado-irpf-completa'), simplificada: document.getElementById('resultado-irpf-simplificada'), recomendacao: document.getElementById('recomendacao-irpf').querySelector('p') } };

// 3.4 - Ferramentas PJ
const simplesNacionalElements = { form: { faturamentoMensal: document.getElementById('faturamento-mensal'), anexo: document.getElementById('anexo-simples') }, buttons: { calcular: document.getElementById('calcular-simples-btn'), voltar: document.getElementById('back-to-pj-dashboard-from-simples'), salvar: document.getElementById('salvar-simples-nacional-btn') }, results: { container: document.getElementById('simples-results-section'), rbt12: document.getElementById('resultado-rbt12'), aliquotaEfetiva: document.getElementById('resultado-aliquota-efetiva'), valorDas: document.getElementById('resultado-valor-das'), explicacao: document.getElementById('explicacao-simples') } };
const pjHoraValorElements = { form: { salarioDesejado: document.getElementById('pj-salario-desejado'), custosFixos: document.getElementById('pj-custos-fixos'), feriasAno: document.getElementById('pj-ferias-ano'), horasDia: document.getElementById('pj-horas-dia'), diasSemana: document.getElementById('pj-dias-semana') }, buttons: { calcular: document.getElementById('calcular-pj-hora-valor-btn'), voltar: document.getElementById('back-to-pj-dashboard-from-hora'), salvar: document.getElementById('salvar-pj-hora-valor-btn') }, results: { container: document.getElementById('pj-hora-valor-results-section'), valorHora: document.getElementById('resultado-pj-hora-valor'), explicacao: document.getElementById('explicacao-pj-hora-valor') } };

// 3.5 - Ferramentas e Telas Comuns
const aposentadoriaElements = { screen: document.getElementById('aposentadoria-screen'), form: { idadeAtual: document.getElementById('aposentadoria-idade-atual'), idadeObjetivo: document.getElementById('aposentadoria-idade-objetivo'), patrimonioAtual: document.getElementById('aposentadoria-patrimonio-atual'), aporteMensal: document.getElementById('aposentadoria-aporte-mensal'), rendaDesejada: document.getElementById('aposentadoria-renda-desejada') }, buttons: { calcular: document.getElementById('calcular-aposentadoria-btn'), voltar: document.getElementById('back-to-dashboard-from-aposentadoria'), salvar: null }, results: { container: document.getElementById('aposentadoria-results-section'), objetivo: document.getElementById('resultado-aposentadoria-objetivo'), projecao: document.getElementById('resultado-aposentadoria-projecao'), recomendacao: document.getElementById('aposentadoria-recomendacao').querySelector('p') } };
const profileElements = { form: { salarioBruto: document.getElementById('profile-salario-bruto'), dependentes: document.getElementById('profile-dependentes'), horasDia: document.getElementById('profile-horas-dia'), diasSemana: document.getElementById('profile-dias-semana'), }, buttons: { salvar: document.getElementById('salvar-perfil-btn'), voltar: document.getElementById('back-to-dashboard-from-profile'), }, statusMessage: document.getElementById('profile-status-message'), };
const reportsElements = { salaryChart: document.getElementById('salary-chart'), investmentChart: document.getElementById('investment-chart'), notice: document.getElementById('reports-notice'), content: document.getElementById('reports-content'), backButton: document.getElementById('back-to-dashboard-from-reports'), summary: { dailyValue: document.getElementById('summary-daily-value'), thirteenthValue: document.getElementById('summary-13th-value') } };
const historicoElements = { lista: document.getElementById('historico-lista'), voltar: document.getElementById('back-to-dashboard-from-historico') };
const modalElements = { overlay: document.getElementById('about-modal-overlay'), closeBtn: document.getElementById('close-about-btn') };

// ==================================================================================
// PARTE 2: DADOS E CONTEÚDO
// ----------------------------------------------------------------------------------
// Aqui guardamos "variáveis de estado" e conteúdo estático. Variáveis de estado
// são como a memória de curto prazo da aplicação (ex: quem é o utilizador logado?).
// ==================================================================================
let userProfile = null; // Guarda os dados do perfil do utilizador quando ele faz login.
let salaryChartInstance = null; // Guarda a "instância" do gráfico de salário para podermos atualizá-lo.
let investmentChartInstance = null; // Guarda a "instância" do gráfico de investimentos.
const dashboardQuotes = [ "Um objetivo sem um plano é apenas um desejo. Use as nossas ferramentas para transformar os seus desejos em planos.", "A melhor altura para plantar uma árvore foi há 20 anos. A segunda melhor altura é agora. O mesmo vale para os seus investimentos.", "Cuidado com as pequenas despesas; um pequeno furo pode afundar um grande navio.", "O seu futuro financeiro é criado pelo que você faz hoje, não amanhã. Cada cálculo é um passo na direção certa.", "Saber o valor do seu tempo é o primeiro passo para garantir que ele seja bem recompensado." ];

// ==================================================================================
// PARTE 3: FUNÇÕES DE GESTÃO DE TELA E UI
// ----------------------------------------------------------------------------------
// Esta secção controla o que o utilizador vê no ecrã.
// ==================================================================================
// A função principal de navegação. Ela esconde todas as telas e depois mostra
// apenas a que foi pedida pelo nome (ex: 'salario', 'investimentos').
function showScreen(screenName) { Object.values(screens).forEach(screen => { if (screen) screen.classList.add('hidden'); }); if (screens[screenName]) { screens[screenName].classList.remove('hidden'); console.log(`A exibir a tela: ${screenName}`); } else { console.warn(`AVISO: A tela "${screenName}" ainda não foi criada no index.html.`); alert(`A funcionalidade para "${screenName}" ainda está em desenvolvimento!`); screens.dashboard.classList.remove('hidden'); } }
    
// Atualiza a interface com base no estado de autenticação. Se o utilizador
// estiver logado, busca o perfil dele e mostra a tela de boas-vindas. Senão, mostra a tela de login.
async function updateUserUI(user) { if (user) { welcomeScreenElements.welcomeMessage.textContent = `Olá, ${user.email}!`; await fetchUserProfile(user); showScreen('welcome'); } else { userProfile = null; showScreen('auth'); } }

// ==================================================================================
// PARTE 4: FUNÇÕES DE AUTENTICAÇÃO E PERFIL
// ----------------------------------------------------------------------------------
// Aqui ficam todas as funções que falam com o Supabase para gerir os dados do utilizador.
// ==================================================================================
// Pega no e-mail e senha do formulário e tenta fazer o login via Supabase.
async function handleLogin(event) { event.preventDefault(); const email = authForms.login.querySelector('#login-email').value; const password = authForms.login.querySelector('#login-password').value; const { error } = await supabaseClient.auth.signInWithPassword({ email, password }); if (error) alert(`Erro no login: ${error.message}`); }
    
// Pega no e-mail e senha e tenta criar uma nova conta no Supabase.
async function handleSignup(event) { event.preventDefault(); const email = authForms.signup.querySelector('#signup-email').value; const password = authForms.signup.querySelector('#signup-password').value; const { error } = await supabaseClient.auth.signUp({ email, password }); if (error) { alert(`Erro no registo: ${error.message}`); } else { alert('Registo realizado! Verifique o seu e-mail para confirmar a conta e depois faça o login.'); authForms.signup.classList.add('hidden'); authForms.login.classList.remove('hidden'); } }
    
// Desconecta o utilizador da aplicação.
async function handleLogout() { await supabaseClient.auth.signOut(); authForms.login.reset(); authForms.signup.reset(); authForms.login.classList.add('hidden'); authForms.signup.classList.add('hidden'); authForms.choices.classList.remove('hidden'); }
    
// Pega nos dados do formulário "Meu Perfil" e salva-os no banco de dados.
async function handleSaveProfile() { const { data: { user } } = await supabaseClient.auth.getUser(); if (!user) { alert('Precisa de estar autenticado para salvar o perfil.'); return; } const salarioBruto = parseFloat(profileElements.form.salarioBruto.value) || null; const dependentes = parseInt(profileElements.form.dependentes.value); const horasDia = parseFloat(profileElements.form.horasDia.value) || null; const diasSemana = parseInt(profileElements.form.diasSemana.value) || null; const updates = { user_id: user.id, salario_bruto: salarioBruto, dependentes: isNaN(dependentes) ? null : dependentes, horas_dia: horasDia, dias_semana: diasSemana, updated_at: new Date(), }; const { error } = await supabaseClient.from('profiles').upsert(updates); if (error) { console.error('Erro ao salvar o perfil:', error); profileElements.statusMessage.textContent = `Erro ao salvar: ${error.message}`; profileElements.statusMessage.classList.remove('hidden'); } else { console.log('Perfil salvo com sucesso!'); userProfile = updates; profileElements.statusMessage.textContent = 'Perfil salvo com sucesso!'; profileElements.statusMessage.classList.remove('hidden'); setTimeout(() => { profileElements.statusMessage.classList.add('hidden'); }, 3000); } }
    
// Busca os dados do perfil do utilizador que está logado e guarda-os na variável `userProfile`.
async function fetchUserProfile(user) { if (!user) return; const { data, error } = await supabaseClient.from('profiles').select('*').eq('user_id', user.id).single(); if (error && error.code !== 'PGRST116') { console.error('Erro ao buscar o perfil:', error); } else if (data) { userProfile = data; console.log('Perfil do utilizador carregado:', userProfile); } else { console.log('Nenhum perfil encontrado para este utilizador.'); userProfile = null; } }
    
// Uma função de conveniência que pega nos dados guardados em `userProfile` e preenche
// automaticamente os campos das várias calculadoras para poupar tempo ao utilizador.
function preencherFormulariosComPerfil() { if (!userProfile) return; if (userProfile.salario_bruto) profileElements.form.salarioBruto.value = userProfile.salario_bruto; if (userProfile.dependentes !== null) profileElements.form.dependentes.value = userProfile.dependentes; if (userProfile.horas_dia) profileElements.form.horasDia.value = userProfile.horas_dia; if (userProfile.dias_semana) profileElements.form.diasSemana.value = userProfile.dias_semana; if (userProfile.salario_bruto) salarioElements.form.salarioBruto.value = userProfile.salario_bruto; if (userProfile.dependentes !== null) salarioElements.form.dependentes.value = userProfile.dependentes; if (userProfile.salario_bruto) feriasElements.form.salarioBruto.value = userProfile.salario_bruto; if (userProfile.salario_bruto) decimoTerceiroElements.form.salarioBruto.value = userProfile.salario_bruto; if (userProfile.dependentes !== null) decimoTerceiroElements.form.dependentes.value = userProfile.dependentes; if (userProfile.salario_bruto) horaValorElements.form.salario.value = userProfile.salario_bruto; if (userProfile.horas_dia) horaValorElements.form.horasDia.value = userProfile.horas_dia; if (userProfile.dias_semana) horaValorElements.form.diasSemana.value = userProfile.dias_semana; }

// ==================================================================================
// PARTE 5: FUNÇÕES DE CÁLCULO E GRÁFICOS
// ----------------------------------------------------------------------------------
// Esta secção contém as funções de "baixo nível" que realizam os cálculos matemáticos
// (como os impostos) e as funções que desenham os gráficos na tela de "Visão Geral".
// A lógica foi atualizada para que os gráficos sejam dinâmicos, buscando dados do histórico,
// e para corrigir um bug que impedia a reabertura da tela.
// ==================================================================================

// Calcula o desconto do INSS com base na tabela progressiva oficial.
function calcularINSS(baseDeCalculo) { const faixas = [ { teto: 1412.00, aliquota: 0.075, parcela: 0 }, { teto: 2666.68, aliquota: 0.09,  parcela: 21.18 }, { teto: 4000.03, aliquota: 0.12,  parcela: 101.18 }, { teto: 7786.02, aliquota: 0.14,  parcela: 181.18 } ]; if (baseDeCalculo > faixas[3].teto) { return (faixas[3].teto * faixas[3].aliquota) - faixas[3].parcela; } for (const faixa of faixas) { if (baseDeCalculo <= faixa.teto) { return (baseDeCalculo * faixa.aliquota) - faixa.parcela; } } return 0; }

// Calcula o desconto do Imposto de Renda Retido na Fonte, também com base na tabela progressiva.
function calcularIRRF(baseDeCalculo, numDependentes = 0) { const DEDUCAO_POR_DEPENDENTE = 189.59; const baseReal = baseDeCalculo - (numDependentes * DEDUCAO_POR_DEPENDENTE); const faixas = [ { teto: 2259.20, aliquota: 0,     parcela: 0 }, { teto: 2826.65, aliquota: 0.075, parcela: 169.44 }, { teto: 3751.05, aliquota: 0.15,  parcela: 381.44 }, { teto: 4664.68, aliquota: 0.225, parcela: 662.77 }, { teto: Infinity,aliquota: 0.275, parcela: 896.00 } ]; for (const faixa of faixas) { if (baseReal <= faixa.teto) { const imposto = (baseReal * faixa.aliquota) - faixa.parcela; return Math.max(0, imposto); } } return 0; }

// Calcula o imposto de renda devido na declaração anual.
function calcularImpostoAnual(baseDeCalculo) { const faixas = [ { limite: 24511.92, aliquota: 0,     deducao: 0 }, { limite: 33919.80, aliquota: 0.075, deducao: 1838.39 }, { limite: 45012.60, aliquota: 0.15,  deducao: 4382.38 }, { limite: 55976.16, aliquota: 0.225, deducao: 7758.32 }, { limite: Infinity, aliquota: 0.275, deducao: 10557.13 } ]; for (const faixa of faixas) { if (baseDeCalculo <= faixa.limite) { const imposto = (baseDeCalculo * faixa.aliquota) - faixa.deducao; return imposto > 0 ? imposto : 0; } } return 0; }

// Desenha o gráfico de linha que mostra a evolução dos salários líquidos salvos.
async function renderSalaryChart() {
    // CORREÇÃO: Destrói a instância anterior do gráfico para evitar sobreposição e bugs.
    if (salaryChartInstance) {
        salaryChartInstance.destroy();
    }
    
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) return;

    const canvas = reportsElements.salaryChart;
    const container = canvas.parentElement;
    
    // CORREÇÃO: Limpa a mensagem "sem dados" se ela existir de uma visualização anterior.
    const existingMessage = container.querySelector('.chart-notice');
    if (existingMessage) existingMessage.remove();

    // Busca os dados de salário salvos no histórico do utilizador.
    const { data, error } = await supabaseClient
        .from('historico_salarios')
        .select('created_at, salario_liquido_calculado')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

    // Se não houver dados, exibe uma mensagem amigável em vez do gráfico.
    if (error || !data || data.length === 0) {
        canvas.style.display = 'none'; // Esconde a área do gráfico.
        const noDataMessage = document.createElement('p');
        noDataMessage.className = 'explanation-text text-center chart-notice';
        noDataMessage.textContent = 'Salve o seu primeiro cálculo de salário para ver a sua evolução aqui!';
        container.appendChild(noDataMessage);
        return;
    }

    canvas.style.display = 'block'; // Garante que a área do gráfico esteja visível.

    const labels = data.map(item => new Date(item.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }));
    const chartData = data.map(item => item.salario_liquido_calculado);

    // Cria a nova instância do gráfico com os dados do histórico.
    salaryChartInstance = new Chart(canvas.getContext('2d'), {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Salário Líquido',
                data: chartData,
                borderColor: '#6D28D9',
                backgroundColor: 'rgba(109, 40, 217, 0.1)',
                fill: true,
                tension: 0.3
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

// Desenha o gráfico de barras que compara as diferentes projeções de investimento salvas.
async function renderInvestmentChart() {
    // CORREÇÃO: Destrói a instância anterior do gráfico.
    if (investmentChartInstance) {
        investmentChartInstance.destroy();
    }
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) return;

    const canvas = reportsElements.investmentChart;
    const container = canvas.parentElement;

    const existingMessage = container.querySelector('.chart-notice');
    if (existingMessage) existingMessage.remove();

    // Busca as simulações de investimento salvas no histórico.
    const { data, error } = await supabaseClient
        .from('historico_investimentos')
        .select('created_at, valor_final_calculado, periodo_anos_informado')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

    // Se não houver dados, exibe uma mensagem.
    if (error || !data || data.length === 0) {
        canvas.style.display = 'none';
        const noDataMessage = document.createElement('p');
        noDataMessage.className = 'explanation-text text-center chart-notice';
        noDataMessage.textContent = 'Salve a sua primeira simulação de investimento para comparar cenários aqui!';
        container.appendChild(noDataMessage);
        return;
    }
    
    canvas.style.display = 'block';

    const labels = data.map(item => `Salvo em ${new Date(item.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })} (${item.periodo_anos_informado} anos)`);
    const chartData = data.map(item => item.valor_final_calculado);

    // Cria a nova instância do gráfico.
    investmentChartInstance = new Chart(canvas.getContext('2d'), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Valor Final Projetado',
                data: chartData,
                backgroundColor: '#8B5CF6',
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

// Calcula e exibe os valores nos cartões de resumo com base nos dados do perfil do utilizador.
function renderSummaryCards() {
    if (!userProfile || !userProfile.salario_bruto || !userProfile.horas_dia || !userProfile.dias_semana) {
        reportsElements.summary.dailyValue.textContent = 'N/A';
        reportsElements.summary.thirteenthValue.textContent = 'N/A';
        return;
    }
    const salarioBruto = userProfile.salario_bruto;
    const diasSemana = userProfile.dias_semana;
    const descontoINSS = calcularINSS(salarioBruto);
    const salarioLiquido = salarioBruto - descontoINSS - calcularIRRF(salarioBruto - descontoINSS, userProfile.dependentes || 0);
    const diasTrabalhadosMes = diasSemana * 4.5;
    const valorDiaLiquido = salarioLiquido / diasTrabalhadosMes;
    reportsElements.summary.dailyValue.textContent = `R$ ${valorDiaLiquido.toFixed(2)}`;
    const decimoTerceiroBruto = (salarioBruto / 12) * 12;
    const decimoTerceiroLiquido = (decimoTerceiroBruto - calcularINSS(decimoTerceiroBruto) - calcularIRRF(decimoTerceiroBruto - calcularINSS(decimoTerceiroBruto), userProfile.dependentes || 0));
    reportsElements.summary.thirteenthValue.textContent = `R$ ${decimoTerceiroLiquido.toFixed(2)}`;
}

// ==================================================================================
// PARTE 6: LÓGICA DAS FERRAMENTAS
// ----------------------------------------------------------------------------------
// Esta secção é o coração de cada calculadora. Cada função `executarCalculo...`
// é responsável por ler os dados que o utilizador inseriu, chamar as funções
// de cálculo da PARTE 5, e depois exibir os resultados de forma clara no ecrã.
// ==================================================================================

// --- Ferramentas CLT ---

function executarCalculoSalario() {
    const salarioBruto = parseFloat(salarioElements.form.salarioBruto.value) || 0;
    const numDependentes = parseInt(salarioElements.form.dependentes.value) || 0;
    if (salarioBruto <= 0) { alert('Por favor, insira um salário bruto válido.'); return; }
    
    const descontoINSS = calcularINSS(salarioBruto);
    const baseCalculoIRRF = salarioBruto - descontoINSS;
    const descontoIRRF = calcularIRRF(baseCalculoIRRF, numDependentes);
    const salarioLiquido = salarioBruto - descontoINSS - descontoIRRF;

    salarioElements.results.salarioBruto.textContent = `R$ ${salarioBruto.toFixed(2)}`;
    salarioElements.results.inss.textContent = `- R$ ${descontoINSS.toFixed(2)}`;
    salarioElements.results.baseIrrf.textContent = `R$ ${baseCalculoIRRF.toFixed(2)}`;
    salarioElements.results.irrf.textContent = `- R$ ${descontoIRRF.toFixed(2)}`;
    salarioElements.results.salarioLiquido.textContent = `R$ ${salarioLiquido.toFixed(2)}`;
    salarioElements.results.explicacaoInss.textContent = `O cálculo do INSS é progressivo, baseado em faixas salariais.`;
    salarioElements.results.explicacaoIrrf.textContent = `O IRRF incide sobre o salário bruto menos o desconto do INSS e as deduções por dependente.`;
    
    salarioElements.results.container.classList.remove('hidden');
    salarioElements.buttons.salvar.classList.remove('hidden');
}

function executarSimulacaoInvestimentos() {
    const valorInicial = parseFloat(investimentosElements.form.valorInicial.value) || 0;
    const aporteMensal = parseFloat(investimentosElements.form.aporteMensal.value) || 0;
    const taxaAnual = parseFloat(investimentosElements.form.taxaJurosAnual.value) || 0;
    const periodoAnos = parseInt(investimentosElements.form.periodoAnos.value) || 0;

    if (taxaAnual <= 0 || periodoAnos <= 0) { alert('Por favor, insira valores válidos para a taxa e o período.'); return; }

    const taxaMensal = taxaAnual / 100 / 12;
    const numMeses = periodoAnos * 12;
    let valorFinal = valorInicial;

    for (let i = 0; i < numMeses; i++) {
        valorFinal = (valorFinal + aporteMensal) * (1 + taxaMensal);
    }

    const totalInvestido = valorInicial + (aporteMensal * numMeses);
    const totalJuros = valorFinal - totalInvestido;

    investimentosElements.results.valorFinal.textContent = `R$ ${valorFinal.toFixed(2)}`;
    investimentosElements.results.totalInvestido.textContent = `R$ ${totalInvestido.toFixed(2)}`;
    investimentosElements.results.totalJuros.textContent = `R$ ${totalJuros.toFixed(2)}`;

    investimentosElements.results.container.classList.remove('hidden');
    investimentosElements.buttons.salvar.classList.remove('hidden');
}

function executarCalculoFerias() {
    const salarioBruto = parseFloat(feriasElements.form.salarioBruto.value) || 0;
    const diasFerias = parseInt(feriasElements.form.dias.value) || 30;
    const venderDias = feriasElements.form.venderDias.checked;
    const adiantar13 = feriasElements.form.adiantar13.checked;

    if (salarioBruto <= 0) { alert('Por favor, insira um salário bruto válido.'); return; }

    const feriasProporcionais = (salarioBruto / 30) * diasFerias;
    const tercoConstitucional = feriasProporcionais / 3;
    let abonoPecuniario = 0;
    if (venderDias) {
        const valorDia = salarioBruto / 30;
        abonoPecuniario = valorDia * 10; // Venda de 1/3 das férias, máx 10 dias
    }

    const totalBrutoFerias = feriasProporcionais + tercoConstitucional;
    const descontoINSSFerias = calcularINSS(totalBrutoFerias);
    const descontoIRRFFerias = calcularIRRF(totalBrutoFerias - descontoINSSFerias, userProfile ? userProfile.dependentes : 0);
    
    let adiantamento13 = 0;
    if (adiantar13) {
        adiantamento13 = (salarioBruto / 12 * 6) / 2; // Metade da primeira parcela do 13º
    }

    const liquidoReceber = totalBrutoFerias - descontoINSSFerias - descontoIRRFFerias + abonoPecuniario + adiantamento13;

    feriasElements.results.feriasBrutas.textContent = `R$ ${feriasProporcionais.toFixed(2)}`;
    feriasElements.results.tercoConstitucional.textContent = `R$ ${tercoConstitucional.toFixed(2)}`;
    feriasElements.results.abonoPecuniario.textContent = `R$ ${abonoPecuniario.toFixed(2)}`;
    feriasElements.results.totalBruto.textContent = `R$ ${totalBrutoFerias.toFixed(2)}`;
    feriasElements.results.inss.textContent = `- R$ ${descontoINSSFerias.toFixed(2)}`;
    feriasElements.results.irrf.textContent = `- R$ ${descontoIRRFFerias.toFixed(2)}`;
    feriasElements.results.adiantamento13.textContent = `R$ ${adiantamento13.toFixed(2)}`;
    feriasElements.results.liquido.textContent = `R$ ${liquidoReceber.toFixed(2)}`;

    feriasElements.results.abonoLine.style.display = venderDias ? 'flex' : 'none';
    feriasElements.results.adiantamento13Line.style.display = adiantar13 ? 'flex' : 'none';

    feriasElements.results.container.classList.remove('hidden');
    feriasElements.buttons.salvar.classList.remove('hidden');
}

function executarCalculoDecimoTerceiro() {
    const salarioBruto = parseFloat(decimoTerceiroElements.form.salarioBruto.value) || 0;
    const mesesTrabalhados = parseInt(decimoTerceiroElements.form.meses.value) || 12;
    const numDependentes = parseInt(decimoTerceiroElements.form.dependentes.value) || 0;

    if (salarioBruto <= 0 || mesesTrabalhados <= 0 || mesesTrabalhados > 12) { alert('Insira valores válidos.'); return; }

    const bruto13 = (salarioBruto / 12) * mesesTrabalhados;
    const primeiraParcela = bruto13 / 2;
    const segundaParcelaBruta = bruto13 / 2;
    const inss13 = calcularINSS(bruto13);
    const irrf13 = calcularIRRF(bruto13 - inss13, numDependentes);
    const segundaParcelaLiquida = segundaParcelaBruta - inss13 - irrf13;
    const liquidoTotal = primeiraParcela + segundaParcelaLiquida;

    decimoTerceiroElements.results.bruto.textContent = `R$ ${bruto13.toFixed(2)}`;
    decimoTerceiroElements.results.primeiraParcela.textContent = `R$ ${primeiraParcela.toFixed(2)}`;
    decimoTerceiroElements.results.segundaParcelaBruta.textContent = `R$ ${segundaParcelaBruta.toFixed(2)}`;
    decimoTerceiroElements.results.inss.textContent = `- R$ ${inss13.toFixed(2)}`;
    decimoTerceiroElements.results.irrf.textContent = `- R$ ${irrf13.toFixed(2)}`;
    decimoTerceiroElements.results.segundaParcelaLiquida.textContent = `R$ ${segundaParcelaLiquida.toFixed(2)}`;
    decimoTerceiroElements.results.liquidoTotal.textContent = `R$ ${liquidoTotal.toFixed(2)}`;

    decimoTerceiroElements.results.container.classList.remove('hidden');
    decimoTerceiroElements.buttons.salvar.classList.remove('hidden');
}

function executarCalculoHoraValor() {
    const salario = parseFloat(horaValorElements.form.salario.value) || 0;
    const horasDia = parseFloat(horaValorElements.form.horasDia.value) || 0;
    const diasSemana = parseInt(horaValorElements.form.diasSemana.value) || 0;

    if (salario <= 0 || horasDia <= 0 || diasSemana <= 0 || diasSemana > 7) { alert('Insira valores válidos.'); return; }

    const horasTrabalhadasMes = horasDia * diasSemana * 4.5;
    const valorHora = salario / horasTrabalhadasMes;

    horaValorElements.results.valorHora.textContent = `R$ ${valorHora.toFixed(2)}`;
    horaValorElements.results.explicacao.textContent = `Baseado em ${horasTrabalhadasMes.toFixed(1)} horas trabalhadas no mês.`;
    
    horaValorElements.results.container.classList.remove('hidden');
    horaValorElements.buttons.salvar.classList.remove('hidden');
}

function executarCalculoIrpf() {
    const rendimentos = parseFloat(irpfElements.form.rendimentosAnuais.value) || 0;
    const despesasSaude = parseFloat(irpfElements.form.despesasSaude.value) || 0;
    const despesasEducacao = parseFloat(irpfElements.form.despesasEducacao.value) || 0;
    const numDependentes = parseInt(irpfElements.form.dependentes.value) || 0;
    
    if (rendimentos <= 0) { alert('Insira o total de rendimentos anuais.'); return; }
    
    // Limites de dedução
    const LIMITE_DEDUCAO_EDUCACAO = 3561.50;
    const DEDUCAO_POR_DEPENDENTE_ANUAL = 2275.08;

    // Cálculo Simplificado
    const baseCalculoSimplificada = rendimentos - (rendimentos * 0.20);
    const impostoSimplificado = calcularImpostoAnual(baseCalculoSimplificada);

    // Cálculo Completo
    const deducaoEducacao = Math.min(despesasEducacao, LIMITE_DEDUCAO_EDUCACAO);
    const deducaoDependentes = numDependentes * DEDUCAO_POR_DEPENDENTE_ANUAL;
    const totalDeducoes = despesasSaude + deducaoEducacao + deducaoDependentes;
    const baseCalculoCompleta = rendimentos - totalDeducoes;
    const impostoCompleto = calcularImpostoAnual(baseCalculoCompleta);
    
    let recomendacao = '';
    let corRecomendacao = '';
    if (impostoCompleto < impostoSimplificado) {
        recomendacao = 'Recomendação: A Declaração Completa parece mais vantajosa.';
        corRecomendacao = 'success-text';
    } else {
        recomendacao = 'Recomendação: A Declaração Simplificada parece mais vantajosa.';
        corRecomendacao = 'success-text'; // Ambas são "sucesso" em encontrar a melhor
    }

    irpfElements.results.completa.textContent = `R$ ${impostoCompleto.toFixed(2)}`;
    irpfElements.results.simplificada.textContent = `R$ ${impostoSimplificado.toFixed(2)}`;
    irpfElements.results.recomendacao.textContent = recomendacao;
    irpfElements.results.recomendacao.parentElement.className = `text-center font-bold ${corRecomendacao}`;
    
    irpfElements.results.container.classList.remove('hidden');
    irpfElements.buttons.salvar.classList.remove('hidden');
}

// --- Ferramentas PJ ---

function executarCalculoSimplesNacional() {
    const faturamentoMensal = parseFloat(simplesNacionalElements.form.faturamentoMensal.value) || 0;
    const anexo = simplesNacionalElements.form.anexo.value;

    if (faturamentoMensal <= 0) { alert('Insira um faturamento válido.'); return; }
    
    const rbt12 = faturamentoMensal * 12;
    let aliquotaNominal, parcelaDeduzir;

    const faixas = {
        anexo3: [
            { teto: 180000, aliquota: 0.06, parcela: 0 },
            { teto: 360000, aliquota: 0.112, parcela: 9360 },
            { teto: 720000, aliquota: 0.135, parcela: 17640 },
            { teto: 1800000, aliquota: 0.16, parcela: 35640 },
            { teto: 3600000, aliquota: 0.21, parcela: 125640 },
            { teto: 4800000, aliquota: 0.33, parcela: 648000 }
        ],
        anexo5: [
            { teto: 180000, aliquota: 0.155, parcela: 0 },
            { teto: 360000, aliquota: 0.18, parcela: 4500 },
            { teto: 720000, aliquota: 0.195, parcela: 9900 },
            { teto: 1800000, aliquota: 0.205, parcela: 17100 },
            { teto: 3600000, aliquota: 0.23, parcela: 62100 },
            { teto: 4800000, aliquota: 0.305, parcela: 540000 }
        ]
    };

    const faixasAnexo = faixas[anexo];
    for(const faixa of faixasAnexo) {
        if (rbt12 <= faixa.teto) {
            aliquotaNominal = faixa.aliquota;
            parcelaDeduzir = faixa.parcela;
            break;
        }
    }

    const aliquotaEfetiva = ((rbt12 * aliquotaNominal) - parcelaDeduzir) / rbt12;
    const valorDAS = faturamentoMensal * aliquotaEfetiva;

    simplesNacionalElements.results.rbt12.textContent = `R$ ${rbt12.toFixed(2)}`;
    simplesNacionalElements.results.aliquotaEfetiva.textContent = `${(aliquotaEfetiva * 100).toFixed(2)}%`;
    simplesNacionalElements.results.valorDas.textContent = `R$ ${valorDAS.toFixed(2)}`;
    simplesNacionalElements.results.explicacao.textContent = `A alíquota efetiva foi calculada com base no seu faturamento anual estimado (RBT12).`;
    
    simplesNacionalElements.results.container.classList.remove('hidden');
    simplesNacionalElements.buttons.salvar.classList.remove('hidden');
}

function executarCalculoPjHoraValor() {
    const salarioDesejado = parseFloat(pjHoraValorElements.form.salarioDesejado.value) || 0;
    const custosFixos = parseFloat(pjHoraValorElements.form.custosFixos.value) || 0;
    const feriasAno = parseInt(pjHoraValorElements.form.feriasAno.value) || 0;
    const horasDia = parseFloat(pjHoraValorElements.form.horasDia.value) || 0;
    const diasSemana = parseInt(pjHoraValorElements.form.diasSemana.value) || 0;

    if (salarioDesejado <= 0 || horasDia <= 0 || diasSemana <= 0) { alert('Preencha os campos com valores válidos.'); return; }

    const semanasAno = 52;
    const diasTrabalhoAno = (diasSemana * semanasAno) - feriasAno;
    const horasTrabalhoAno = diasTrabalhoAno * horasDia;
    const horasTrabalhoMes = horasTrabalhoAno / 12;
    
    const custoAnual = (salarioDesejado + custosFixos) * 12;
    const valorHora = custoAnual / horasTrabalhoAno;

    pjHoraValorElements.results.valorHora.textContent = `R$ ${valorHora.toFixed(2)}`;
    pjHoraValorElements.results.explicacao.textContent = `Cálculo baseado em ${horasTrabalhoMes.toFixed(1)} horas produtivas por mês.`;
    
    pjHoraValorElements.results.container.classList.remove('hidden');
    pjHoraValorElements.buttons.salvar.classList.remove('hidden');
}

// --- Ferramentas Comuns ---

function executarCalculoAposentadoria() {
    const idadeAtual = parseInt(aposentadoriaElements.form.idadeAtual.value) || 0;
    const idadeObjetivo = parseInt(aposentadoriaElements.form.idadeObjetivo.value) || 0;
    const patrimonioAtual = parseFloat(aposentadoriaElements.form.patrimonioAtual.value) || 0;
    const aporteMensal = parseFloat(aposentadoriaElements.form.aporteMensal.value) || 0;
    const rendaDesejada = parseFloat(aposentadoriaElements.form.rendaDesejada.value) || 0;

    if (idadeAtual <= 0 || idadeObjetivo <= idadeAtual || aporteMensal <= 0 || rendaDesejada <= 0) {
        alert('Por favor, preencha todos os campos com valores válidos.');
        return;
    }

    const rendaAnualDesejada = rendaDesejada * 12;
    const objetivoTotal = rendaAnualDesejada * 25; 

    const anosParaAposentar = idadeObjetivo - idadeAtual;
    const periodoMeses = anosParaAposentar * 12;
    const taxaJurosAnual = 0.06; // Taxa de juros real (acima da inflação) de 6%
    const taxaMensal = Math.pow(1 + taxaJurosAnual, 1/12) - 1;

    let projecaoTotal = patrimonioAtual;
    for (let i = 0; i < periodoMeses; i++) {
        projecaoTotal = projecaoTotal * (1 + taxaMensal) + aporteMensal;
    }

    let recomendacao = '';
    let corRecomendacao = '';
    if (projecaoTotal >= objetivoTotal) {
        recomendacao = 'Parabéns! Com este plano, você está no caminho certo para atingir a sua meta de aposentadoria.';
        corRecomendacao = 'success-text';
    } else {
        const falta = objetivoTotal - projecaoTotal;
        recomendacao = `Você está quase lá! Faltam aproximadamente R$ ${falta.toFixed(2)} para atingir a sua meta. Considere aumentar o seu aporte mensal.`;
        corRecomendacao = 'error-text';
    }

    aposentadoriaElements.results.objetivo.textContent = `R$ ${objetivoTotal.toFixed(2)}`;
    aposentadoriaElements.results.projecao.textContent = `R$ ${projecaoTotal.toFixed(2)}`;
    aposentadoriaElements.results.recomendacao.textContent = recomendacao;
    
    aposentadoriaElements.results.recomendacao.classList.remove('success-text', 'error-text');
    aposentadoriaElements.results.recomendacao.classList.add(corRecomendacao);

    aposentadoriaElements.results.container.classList.remove('hidden');
}
// ==================================================================================
// PARTE 8: REGISTO DE EVENT LISTENERS (O "PAINEL DE CONTROLO")
// ----------------------------------------------------------------------------------
// Esta é a secção final e uma das mais importantes. Ela conecta a interface (HTML)
// com a lógica (JavaScript). Para cada botão ou formulário, adicionamos um "ouvinte"
// (addEventListener) que espera por uma ação do utilizador (como um 'click' ou 'submit')
// para então "disparar" a função correspondente.
// ==================================================================================

// --- 8.1: Listeners de Autenticação e Navegação Inicial ---
if(authButtons.showLogin) authButtons.showLogin.addEventListener('click', () => { authForms.choices.classList.add('hidden'); authForms.login.classList.remove('hidden'); });
if(authButtons.showSignup) authButtons.showSignup.addEventListener('click', () => { authForms.choices.classList.add('hidden'); authForms.signup.classList.remove('hidden'); });
if(authForms.login) authForms.login.addEventListener('submit', handleLogin);
if(authForms.signup) authForms.signup.addEventListener('submit', handleSignup);
if(authButtons.logout) authButtons.logout.addEventListener('click', handleLogout);
if(authButtons.logoutPj) authButtons.logoutPj.addEventListener('click', handleLogout);

// Listener para o botão "Sou CLT" na tela de escolha.
if(welcomeScreenElements.buttons.clt) welcomeScreenElements.buttons.clt.addEventListener('click', async () => { 
    const { data: { user } } = await supabaseClient.auth.getUser(); 
    const welcomeMessage = document.getElementById('welcome-message'); 
    if (welcomeMessage && user) { 
        welcomeMessage.textContent = `Bem-vindo(a), ${user.email}!`; 
    } 
    // Seleciona e exibe uma frase inspiradora aleatória na dashboard.
    const randomIndex = Math.floor(Math.random() * dashboardQuotes.length); 
    dashboardElements.quote.textContent = dashboardQuotes[randomIndex]; 
    showScreen('dashboard'); 
});

// Listener para o botão "Sou PJ" na tela de escolha.
if(welcomeScreenElements.buttons.pj) welcomeScreenElements.buttons.pj.addEventListener('click', () => showScreen('pjDashboard'));

// --- 8.2: Listeners dos Botões das Dashboards (CLT e PJ) ---
// Listeners que abrem as calculadoras a partir da Dashboard CLT.
if(dashboardButtons.salario) dashboardButtons.salario.addEventListener('click', () => { preencherFormulariosComPerfil(); showScreen('salario'); });
if(dashboardButtons.investimentos) dashboardButtons.investimentos.addEventListener('click', () => showScreen('investimentos'));
if(dashboardButtons.ferias) dashboardButtons.ferias.addEventListener('click', () => { preencherFormulariosComPerfil(); showScreen('ferias'); });
if(dashboardButtons.decimoTerceiro) dashboardButtons.decimoTerceiro.addEventListener('click', () => { preencherFormulariosComPerfil(); showScreen('decimoTerceiro'); });
if(dashboardButtons.horaValor) dashboardButtons.horaValor.addEventListener('click', () => { preencherFormulariosComPerfil(); showScreen('horaValor'); });
if(dashboardButtons.irpf) dashboardButtons.irpf.addEventListener('click', () => showScreen('irpf'));
if(dashboardButtons.profile) dashboardButtons.profile.addEventListener('click', () => { preencherFormulariosComPerfil(); showScreen('profile'); });

// Listener para o botão "Minha Visão Geral", que renderiza os gráficos antes de mostrar a tela.
if(dashboardButtons.reports) {
    dashboardButtons.reports.addEventListener('click', async () => {
        if (!userProfile) {
            reportsElements.content.classList.add('hidden');
            reportsElements.notice.classList.remove('hidden');
        } else {
            reportsElements.content.classList.remove('hidden');
            reportsElements.notice.classList.add('hidden');
            await renderSalaryChart();
            await renderInvestmentChart();
            renderSummaryCards();
        }
        showScreen('reports');
    });
}

// Listener para o botão "Meu Histórico".
if(dashboardButtons.historico) dashboardButtons.historico.addEventListener('click', carregarHistorico);

// Listeners que abrem as calculadoras a partir da Dashboard PJ.
if(pjDashboardButtons.simples) pjDashboardButtons.simples.addEventListener('click', () => showScreen('simplesNacional'));
if(pjDashboardButtons.horaValorPj) pjDashboardButtons.horaValorPj.addEventListener('click', () => showScreen('pjHoraValor'));
if(pjDashboardButtons.backToWelcome) pjDashboardButtons.backToWelcome.addEventListener('click', () => showScreen('welcome'));

// --- 8.3: Listeners dos Botões Internos das Ferramentas (Calcular e Voltar) ---
if(salarioElements.buttons.calcular) salarioElements.buttons.calcular.addEventListener('click', executarCalculoSalario);
if(salarioElements.buttons.voltar) salarioElements.buttons.voltar.addEventListener('click', () => showScreen('dashboard'));
if(investimentosElements.buttons.calcular) investimentosElements.buttons.calcular.addEventListener('click', executarSimulacaoInvestimentos);
if(investimentosElements.buttons.voltar) investimentosElements.buttons.voltar.addEventListener('click', () => showScreen('dashboard'));
if(feriasElements.buttons.calcular) feriasElements.buttons.calcular.addEventListener('click', executarCalculoFerias);
if(feriasElements.buttons.voltar) feriasElements.buttons.voltar.addEventListener('click', () => showScreen('dashboard'));
// CORREÇÃO: O nome da função estava incorreto (executarCalculo13Salario -> executarCalculoDecimoTerceiro).
if(decimoTerceiroElements.buttons.calcular) decimoTerceiroElements.buttons.calcular.addEventListener('click', executarCalculoDecimoTerceiro);
if(decimoTerceiroElements.buttons.voltar) decimoTerceiroElements.buttons.voltar.addEventListener('click', () => showScreen('dashboard'));
if(horaValorElements.buttons.calcular) horaValorElements.buttons.calcular.addEventListener('click', executarCalculoHoraValor);
if(horaValorElements.buttons.voltar) horaValorElements.buttons.voltar.addEventListener('click', () => showScreen('dashboard'));
// CORREÇÃO: O nome da função estava incorreto (executarCalculoIRPFAnual -> executarCalculoIrpf).
if(irpfElements.buttons.calcular) irpfElements.buttons.calcular.addEventListener('click', executarCalculoIrpf);
if(irpfElements.buttons.voltar) irpfElements.buttons.voltar.addEventListener('click', () => showScreen('dashboard'));
if(profileElements.buttons.salvar) profileElements.buttons.salvar.addEventListener('click', handleSaveProfile);
if(profileElements.buttons.voltar) profileElements.buttons.voltar.addEventListener('click', () => showScreen('dashboard'));
if(reportsElements.backButton) reportsElements.backButton.addEventListener('click', () => showScreen('dashboard'));
if(simplesNacionalElements.buttons.calcular) simplesNacionalElements.buttons.calcular.addEventListener('click', executarCalculoSimplesNacional);
if(simplesNacionalElements.buttons.voltar) simplesNacionalElements.buttons.voltar.addEventListener('click', () => showScreen('pjDashboard'));
if(pjHoraValorElements.buttons.calcular) pjHoraValorElements.buttons.calcular.addEventListener('click', executarCalculoPjHoraValor);
if(pjHoraValorElements.buttons.voltar) pjHoraValorElements.buttons.voltar.addEventListener('click', () => showScreen('pjDashboard'));
if(historicoElements.voltar) historicoElements.voltar.addEventListener('click', () => showScreen('dashboard'));

// --- 8.4: Listeners dos Botões "Salvar Resultado" ---
if(horaValorElements.buttons.salvar) horaValorElements.buttons.salvar.addEventListener('click', handleSalvarHoraValor);
if(salarioElements.buttons.salvar) salarioElements.buttons.salvar.addEventListener('click', handleSalvarSalario);
if(investimentosElements.buttons.salvar) investimentosElements.buttons.salvar.addEventListener('click', handleSalvarInvestimentos);
if(feriasElements.buttons.salvar) feriasElements.buttons.salvar.addEventListener('click', handleSalvarFerias);
if(decimoTerceiroElements.buttons.salvar) decimoTerceiroElements.buttons.salvar.addEventListener('click', handleSalvarDecimoTerceiro);
if(irpfElements.buttons.salvar) irpfElements.buttons.salvar.addEventListener('click', handleSalvarIRPF);
    
// --- 8.5: Listeners do Modal "Sobre e Parâmetros" ---
if(dashboardButtons.showAbout) {
    const tabSobreBtn = document.getElementById('tab-sobre-btn');
    const tabParametrosBtn = document.getElementById('tab-parametros-btn');
    const tabSobreContent = document.getElementById('tab-sobre-content');
    const tabParametrosContent = document.getElementById('tab-parametros-content');

    // Abre o modal e garante que a primeira aba esteja sempre ativa.
    dashboardButtons.showAbout.addEventListener('click', () => {
        tabSobreContent.classList.remove('hidden');
        tabParametrosContent.classList.add('hidden');
        tabSobreBtn.classList.add('active');
        tabParametrosBtn.classList.remove('active');
        modalElements.overlay.classList.remove('hidden');
    });

    // Fecha o modal ao clicar no 'X' ou fora da área do card.
    if(modalElements.closeBtn) modalElements.closeBtn.addEventListener('click', () => { modalElements.overlay.classList.add('hidden'); });
    if(modalElements.overlay) modalElements.overlay.addEventListener('click', (event) => { if (event.target === modalElements.overlay) { modalElements.overlay.classList.add('hidden'); } });

    // Lógica para alternar entre as abas "Sobre" e "Parâmetros".
    if(tabSobreBtn) tabSobreBtn.addEventListener('click', () => {
        tabSobreContent.classList.remove('hidden');
        tabParametrosContent.classList.add('hidden');
        tabSobreBtn.classList.add('active');
        tabParametrosBtn.classList.remove('active');
    });

    if(tabParametrosBtn) tabParametrosBtn.addEventListener('click', () => {
        tabSobreContent.classList.add('hidden');
        tabParametrosContent.classList.remove('hidden');
        tabSobreBtn.classList.remove('active');
        tabParametrosBtn.classList.add('active');
    });
}

// --- 8.6: Listeners da Nova Ferramenta de Aposentadoria ---
const gotoAposentadoriaBtn = document.getElementById('goto-aposentadoria-btn');
const gotoAposentadoriaBtnPj = document.getElementById('goto-aposentadoria-btn-pj');

if (gotoAposentadoriaBtn) {
    gotoAposentadoriaBtn.addEventListener('click', () => showScreen('aposentadoria'));
}
if (gotoAposentadoriaBtnPj) {
    gotoAposentadoriaBtnPj.addEventListener('click', () => showScreen('aposentadoria'));
}
if (aposentadoriaElements.buttons.calcular) {
    aposentadoriaElements.buttons.calcular.addEventListener('click', executarCalculoAposentadoria);
}

// ==================================================================================
// PARTE 9: INICIALIZAÇÃO FINAL
// ----------------------------------------------------------------------------------
// O código final que é executado. Ele "ouve" as mudanças de estado de autenticação
// do Supabase (login, logout) para atualizar a UI e, por fim, confirma no console
// que tudo foi carregado com sucesso.
// ==================================================================================
supabaseClient.auth.onAuthStateChange((_event, session) => { updateUserUI(session ? session.user : null); });

console.log("main.js carregado com sucesso. Aplicação pronta.");
});

