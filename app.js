/**
 * ==================================================================================
 * app.js - Lógica da Interface do Utilizador (UI) da "änalitks"
 * ----------------------------------------------------------------------------------
 * Responsabilidades:
 * 1. Controlar a troca de tema (claro/escuro).
 * 2. Manipular pequenas animações ou interações visuais que não são a lógica
 * principal de negócio, como o efeito de virar os cartões da dashboard.
 * 3. ADICIONADO: Controlar a exibição dos formulários de login e cadastro.
 * ==================================================================================
 */

// Espera que o HTML esteja completamente carregado antes de executar o script
document.addEventListener('DOMContentLoaded', () => {

    console.log("app.js (UI) carregado com sucesso.");

    // --- LÓGICA DE TROCA DE TEMA ---

    // Seleciona o botão de troca de tema e o body do documento.
    const themeToggleButton = document.getElementById('theme-toggle-btn');
    const body = document.body;

    // Adiciona um "ouvinte" que aguarda por um clique no botão.
    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', () => {
            // Verifica se o body já tem o atributo 'data-theme' com o valor 'dark'.
            const isDarkMode = body.getAttribute('data-theme') === 'dark';

            if (isDarkMode) {
                // Se estiver no modo escuro, remove o atributo para voltar ao tema claro (padrão).
                body.removeAttribute('data-theme');
                console.log("Tema alterado para: Claro");
            } else {
                // Se estiver no modo claro, define o atributo para 'dark' para ativar o tema escuro.
                body.setAttribute('data-theme', 'dark');
                console.log("Tema alterado para: Escuro");
            }
        });
    }

    // ================================================================
    // --- NOVA LÓGICA PARA ANIMAÇÃO DOS CARTÕES (FLIP CARDS) ---
    // ================================================================

    // 1. Seleciona todos os contentores de cartões que devem ter o efeito.
    const cardContainers = document.querySelectorAll('.card-container');

    // 2. Itera sobre cada um dos contentores encontrados.
    cardContainers.forEach(container => {
        // 3. Adiciona um "ouvinte" para quando o rato entra na área do cartão.
        container.addEventListener('mouseenter', () => {
            // Adiciona a classe 'is-flipped', que ativa a animação no CSS.
            container.classList.add('is-flipped');
        });

        // 4. Adiciona um "ouvinte" para quando o rato sai da área do cartão.
        container.addEventListener('mouseleave', () => {
            // Remove a classe 'is-flipped', fazendo o cartão voltar à posição inicial.
            container.classList.remove('is-flipped');
        });
    });
    
    // ================================================================
    // --- LÓGICA DA TELA DE AUTENTICAÇÃO ---
    // ================================================================

    // 1. Seleciona todos os elementos interativos da tela de autenticação.
    const authChoices = document.getElementById('auth-choices');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    
    const showLoginBtn = document.getElementById('show-login-btn');
    const showSignupBtn = document.getElementById('show-signup-btn');
    
    const showLoginLink = document.getElementById('show-login-link');
    const showSignupLink = document.getElementById('show-signup-link');

    // Função para mostrar o formulário de login e esconder os outros elementos.
    const displayLoginForm = () => {
        authChoices.classList.add('hidden');
        signupForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
    };

    // Função para mostrar o formulário de cadastro e esconder os outros elementos.
    const displaySignupForm = () => {
        authChoices.classList.add('hidden');
        loginForm.classList.add('hidden');
        signupForm.classList.remove('hidden');
    };

    // 2. Adiciona "ouvintes" para os cliques nos botões e links.
    // Verifica se os elementos existem antes de adicionar os "ouvintes".
    if (showLoginBtn && showLoginLink) {
        // Se o utilizador clicar em "Já tenho cadastro" ou no link "Faça login".
        showLoginBtn.addEventListener('click', displayLoginForm);
        showLoginLink.addEventListener('click', (event) => {
            event.preventDefault(); // Impede o link de recarregar a página.
            displayLoginForm();
        });
    }

    if (showSignupBtn && showSignupLink) {
        // Se o utilizador clicar em "Sou novo aqui" ou no link "Registre-se".
        showSignupBtn.addEventListener('click', displaySignupForm);
        showSignupLink.addEventListener('click', (event) => {
            event.preventDefault(); // Impede o link de recarregar a página.
            displaySignupForm();
        });
    }
});
