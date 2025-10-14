/**
 * ==================================================================================
 * app.js - Lógica da Interface do Utilizador (UI) da "änalitks"
 * ----------------------------------------------------------------------------------
 * Responsabilidades:
 * 1. Controlar a troca de tema (claro/escuro).
 * 2. Manipular animações visuais, como o efeito de virar dos cartões.
 * 3. ATUALIZADO: Controlar a troca de formulários na interface Frutiger Aero.
 * ==================================================================================
 */

// Espera que o HTML esteja completamente carregado antes de executar o script
document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA DE TROCA DE TEMA (Mantida) ---
    const themeToggleButton = document.getElementById('theme-toggle-btn');
    const body = document.body;

    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', () => {
            const isDarkMode = body.getAttribute('data-theme') === 'dark';
            if (isDarkMode) {
                body.removeAttribute('data-theme');
            } else {
                body.setAttribute('data-theme', 'dark');
            }
        });
    }

    // --- LÓGICA PARA ANIMAÇÃO DOS CARTÕES (FLIP CARDS) (Mantida) ---
    const cardContainers = document.querySelectorAll('.card-container');
    cardContainers.forEach(container => {
        container.addEventListener('mouseenter', () => {
            container.classList.add('is-flipped');
        });
        container.addEventListener('mouseleave', () => {
            container.classList.remove('is-flipped');
        });
    });
    
    // ========================================================================
    // --- LÓGICA DA NOVA INTERFACE DE AUTENTICAÇÃO FRUTIGER AERO ---
    // ========================================================================

    // 1. Seleciona os elementos da nova interface de card.
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    
    const showSignupLink = document.getElementById('show-signup-link');
    const showLoginLink = document.getElementById('show-login-link');

    const loginLinkP = document.getElementById('login-link-p');
    const signupLinkP = document.getElementById('signup-link-p');

    // 2. Verifica se os elementos do formulário existem na página atual.
    if (loginForm && signupForm && showSignupLink && showLoginLink) {

        // Função para mostrar o formulário de CADASTRO.
        const showSignup = (event) => {
            event.preventDefault(); // Impede o link de recarregar a página.
            body.classList.add('form-active'); // Ativa a animação do fundo.

            // Esconde o formulário de login e o seu link correspondente.
            loginForm.classList.add('hidden');
            loginLinkP.classList.add('hidden');

            // Mostra o formulário de cadastro e o seu link correspondente.
            signupForm.classList.remove('hidden');
            signupLinkP.classList.remove('hidden');
        };

        // Função para mostrar o formulário de LOGIN.
        const showLogin = (event) => {
            event.preventDefault(); // Impede o link de recarregar a página.
            body.classList.add('form-active'); // Garante que a animação do fundo permaneça ativa.
            
            // Esconde o formulário de cadastro e o seu link.
            signupForm.classList.add('hidden');
            signupLinkP.classList.add('hidden');

            // Mostra o formulário de login e o seu link.
            loginForm.classList.remove('hidden');
            loginLinkP.classList.remove('hidden');
        };

        // 3. Adiciona os "ouvintes" para os cliques nos links.
        showSignupLink.addEventListener('click', showSignup);
        showLoginLink.addEventListener('click', showLogin);
    }
});

