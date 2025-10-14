/**
 * ==================================================================================
 * app.js - Lógica da Interface do Utilizador (UI) da "änalitks"
 * ----------------------------------------------------------------------------------
 * Responsabilidades:
 * 1. Controlar a troca de tema (claro/escuro).
 * 2. Manipular pequenas animações ou interações visuais que não são a lógica
 * principal de negócio, como o efeito de virar os cartões da dashboard.
 * 3. ATUALIZADO: Controlar a nova interface de autenticação com gavetas.
 * ==================================================================================
 */

// Espera que o HTML esteja completamente carregado antes de executar o script
document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA DE TROCA DE TEMA (Mantida) ---

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
            } else {
                // Se estiver no modo claro, define o atributo para 'dark' para ativar o tema escuro.
                body.setAttribute('data-theme', 'dark');
            }
        });
    }

    // --- LÓGICA PARA ANIMAÇÃO DOS CARTÕES (FLIP CARDS) (Mantida) ---

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
    
    // ========================================================================
    // --- LÓGICA DA NOVA INTERFACE DE AUTENTICAÇÃO COM GAVETAS ---
    // ========================================================================

    // 1. Seleciona os elementos da nova interface.
    const authContainer = document.getElementById('auth-container');
    const switchToLoginBtn = document.getElementById('switch-to-login');
    const switchToSignupBtn = document.getElementById('switch-to-signup');
    const switchHighlight = document.getElementById('switch-highlight');

    // 2. Verifica se estamos na tela de autenticação para o código ser executado.
    if (authContainer && switchToLoginBtn && switchToSignupBtn && switchHighlight) {

        // 3. Função para atualizar o estado da interface (mostrar gaveta e mover realce).
        const updateAuthState = (mode) => {
            const isLogin = mode === 'login';
            
            // Determina qual botão está ativo.
            const activeButton = isLogin ? switchToLoginBtn : switchToSignupBtn;

            // a. Atualiza as classes no container principal para o CSS animar a gaveta correta.
            authContainer.classList.toggle('login-active', isLogin);
            authContainer.classList.toggle('signup-active', !isLogin);

            // b. Atualiza a classe 'active' nos botões do interruptor.
            switchToLoginBtn.classList.toggle('active', isLogin);
            switchToSignupBtn.classList.toggle('active', !isLogin);

            // c. Calcula a posição e o tamanho do botão ativo.
            const buttonWidth = activeButton.offsetWidth;
            const buttonLeftOffset = activeButton.offsetLeft;

            // d. Move e redimensiona o realce para se alinhar com o botão ativo.
            switchHighlight.style.width = `${buttonWidth}px`;
            switchHighlight.style.transform = `translateX(${buttonLeftOffset}px)`;
        };

        // 4. Adiciona "ouvintes" para os cliques nos botões do interruptor.
        switchToLoginBtn.addEventListener('click', () => updateAuthState('login'));
        switchToSignupBtn.addEventListener('click', () => updateAuthState('signup'));

        // 5. Define o estado inicial da interface.
        // Usamos um pequeno timeout para garantir que o navegador já calculou o tamanho dos botões.
        setTimeout(() => {
            updateAuthState('login'); // Começa mostrando a opção de login como ativa.
        }, 100);
    }
});

