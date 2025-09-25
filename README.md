# Decoreiro - Assistente de Decoração Virtual

Este é o repositório do Assistente de Decoração Virtual da Decoreiro, um chatbot projetado para ajudar os clientes a encontrar os produtos de decoração perfeitos com base em suas preferências de estilo e cor.

## ✨ Funcionalidades

* **Chat Interativo:** Guia o usuário através de uma série de perguntas para entender suas necessidades.
* **Recomendações Personalizadas:** Conecta-se à API do PrestaShop para buscar produtos em tempo real que correspondam às respostas do usuário.
* **Links Diretos:** Fornece links clicáveis para as páginas dos produtos recomendados, facilitando a jornada de compra.

## 🛠️ Tecnologias Utilizadas

* **Backend:** Python 3
* **Framework:** Flask
* **Comunicação com API:** Requests
* **Gerenciamento de Segredos:** python-dotenv
* **Plataforma E-commerce:** PrestaShop API
* **Frontend:** HTML, CSS, JavaScript

## 🚀 Como Rodar o Projeto Localmente

Siga os passos abaixo para configurar e rodar o ambiente de desenvolvimento.

### Pré-requisitos

* Python 3.x instalado
* Git instalado

### Passos

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/LucasMognon/ecommerce-recommendation-assistant](https://github.com/LucasMognon/ecommerce-recommendation-assistant)
    cd ecommerce-recommendation-assistant
    ```

2.  **Crie e ative o ambiente virtual:**
    ```bash
    # Cria o ambiente
    python -m venv venv

    # Ativa no Windows
    .\venv\Scripts\activate

    # Ativa no macOS/Linux
    source venv/bin/activate
    ```

3.  **Instale as dependências:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Configure as variáveis de ambiente:**
    * Crie um arquivo chamado `.env` na raiz do projeto.
    * Copie o conteúdo do arquivo `.env.example` (se você criar um) ou adicione as seguintes chaves:
    ```
    PRESTASHOP_URL="https://SUA_LOJA.com.br/api"
    PRESTASHOP_KEY="SUA_CHAVE_API_AQUI"
    ```

5.  **Rode o servidor Flask:**
    ```bash
    python app.py
    ```
    O servidor estará rodando em `http://127.0.0.1:5001`.

6.  **Acesse o frontend:**
    Abra seu navegador e acesse `http://127.0.0.1:5001` para interagir com o assistente.
