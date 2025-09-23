document.addEventListener('DOMContentLoaded', () => {
    // Referências aos elementos do HTML
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const recommendationsContainer = document.getElementById('recommendations');
    const recommendationsTitle = document.getElementById('recommendations-title');

    // Roteiro da conversa
    const questions = [
        { key: 'categoria', text: 'Olá! Sou seu assistente de decoração. Para começar, que tipo de arte mais te interessa? (Ex: animais, natureza, abstrato...)' },
        { key: 'cores', text: 'Ótima escolha! E qual cor você gostaria que se destacasse no quadro? (Ex: azul, marrom, verde...)' }
    ];
    let currentQuestionIndex = 0;
    const userAnswers = {
        cores: [] // Garante que a chave 'cores' seja sempre um array
    };

    // Função para adicionar mensagens na tela do chat
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        messageDiv.innerHTML = `<span>${text}</span>`;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight; // Rola para a última mensagem
    }

    // Função para fazer a próxima pergunta ou buscar recomendações
    async function askNextQuestion() {
        if (currentQuestionIndex < questions.length) {
            addMessage(questions[currentQuestionIndex].text, 'assistant');
        } else {
            addMessage('Perfeito! Com base nas suas respostas, estou buscando as melhores opções para você...', 'assistant');
            await getRecommendations();
        }
    }

    // Função que se comunica com o seu backend (app.py)
    async function getRecommendations() {
        userInput.disabled = true;
        sendBtn.disabled = true;

        try {
            // Esta é a chamada para o servidor Python
            const response = await fetch('http://127.0.0.1:5001/recomendar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userAnswers),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Ocorreu um erro no servidor.');
            }

            const products = await response.json();
            displayRecommendations(products);

        } catch (error) {
            console.error('Erro ao buscar recomendações:', error);
            addMessage(`Desculpe, tive um problema: ${error.message}. Tente outras palavras ou recarregue a página.`, 'assistant');
        }
    }

    // Função para mostrar os cards dos produtos na tela
    function displayRecommendations(products) {
        recommendationsTitle.classList.remove('hidden');
        products.forEach(product => {
            // Cria um elemento de link <a>
            const productLink = document.createElement('a');
            productLink.href = product.product_url; // Usa o link que o backend enviou
            productLink.target = '_blank'; // Abre o link em uma nova aba
            productLink.rel = 'noopener noreferrer'; // Boa prática de segurança
            productLink.classList.add('product-link'); // Adiciona uma classe para estilo

            // Cria o conteúdo do card (exatamente como era antes)
            const cardHTML = `
                <div class="product-card">
                    <img src="${product.url_imagem}" alt="${product.nome}">
                    <h4>${product.nome}</h4>
                    <p>R$ ${product.preco}</p>
                </div>
            `;

            // Coloca o HTML do card dentro do link
            productLink.innerHTML = cardHTML;
            
            // Adiciona o link (com o card dentro) ao container de recomendações
            recommendationsContainer.appendChild(productLink);
        });

        recommendationsTitle.classList.remove('hidden');
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <img src="${product.url_imagem}" alt="${product.nome}">
                <h4>${product.nome}</h4>
                <p>R$ ${product.preco}</p>
            `;
            recommendationsContainer.appendChild(productCard);
        });
    }

    // Função para lidar com o envio da resposta do usuário
    function handleUserInput() {
        const text = userInput.value.trim();
        if (text === '') return;

        addMessage(text, 'user');

        const currentQuestion = questions[currentQuestionIndex];
        // Armazena a resposta. Se a chave for 'cores', coloca dentro do array.
        if (currentQuestion.key === 'cores') {
            userAnswers.cores.push(text);
        } else {
            userAnswers[currentQuestion.key] = text;
        }

        userInput.value = '';
        currentQuestionIndex++;
        
        setTimeout(askNextQuestion, 500); // Dá um pequeno delay antes da próxima pergunta
    }
    
    sendBtn.addEventListener('click', handleUserInput);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleUserInput();
        }
    });

    // Inicia a conversa
    askNextQuestion();
});