import os
import requests
import unicodedata
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Carrega as variáveis de ambiente do arquivo .env
load_dotenv()

# --- CONFIGURAÇÃO BÁSICA ---
app = Flask(__name__)
CORS(app)

# Pega as variáveis diretamente do ambiente (carregadas do .env)
PRESTASHOP_URL = os.environ.get('PRESTASHOP_URL')
PRESTASHOP_KEY = os.environ.get('PRESTASHOP_KEY')

# Verificação de segurança: garante que o programa não rode sem as chaves
if not PRESTASHOP_URL or not PRESTASHOP_KEY:
    raise ValueError("As variáveis PRESTASHOP_URL e PRESTASHOP_KEY não foram encontradas. Verifique seu arquivo .env")

# Mapeamento de IDs retiradas da plataforma PRESTASHOP
THEME_CATEGORY_MAP = {
    'abstrato': 20, 'abstratos': 20,
    'animal': 19, 'animais': 19,
    'botanico': 13, 'botanicos': 13,
    'classico': 9, 'classicos': 9,
    'dente de leao': 18,
    'flor': 17, 'flores': 17,
    'fotografia': 10, 'fotografias': 10,
    'geometrico': 16, 'geometricos': 16,
    'motivacional': 15, 'motivacionais': 15,
    'natureza': 14,
    'profissao': 11, 'profissoes': 11,
    'tipografia': 12,
    'religioso': 56
}

COLOR_CATEGORY_MAP = {
    'azul': 30, 'amarelo': 31, 'bege': 32, 'branco': 33, 'cinza': 34,
    'colorido': 35, 'dourado': 55, 'laranja': 36, 'marrom': 37, 'preto': 38,
    'preto e branco': 39, 'rosa': 40, 'roxo': 41, 'verde': 42, 'vermelho': 43
}

def normalize_text(text):
    return ''.join(c for c in unicodedata.normalize('NFD', text) if unicodedata.category(c) != 'Mn').lower()

# --- A ROTA DA API ---
@app.route('/')
def home():
    return app.send_static_file('index.html')

# Rota que recebe os dados do chat e retorna as recomendações
@app.route('/recomendar', methods=['POST'])

def recomendar():
    respostas = request.get_json()
    tema_interesse = normalize_text(respostas.get('categoria', ''))
    cor_gosto = normalize_text(respostas.get('cores', [''])[0])

    tema_id = THEME_CATEGORY_MAP.get(tema_interesse)
    cor_id = COLOR_CATEGORY_MAP.get(cor_gosto)

    if not tema_id or not cor_id:
        return jsonify({"error": "Desculpe, não entendi sua preferência. Poderia tentar outras palavras?"}), 400

    params = {
        'output_format': 'JSON',
        'display': 'full',
        'filter[id_category_default]': f'[{tema_id}]',
        'filter[active]': '1'
    }
    
    try:
        response = requests.get(f"{PRESTASHOP_URL}/products", params=params, auth=(PRESTASHOP_KEY, ''))
        response.raise_for_status()
        data = response.json()
        
        produtos_do_tema = data.get('products', [])
        produtos_recomendados = []

        for product in produtos_do_tema:
            categorias_do_produto = [str(cat['id']) for cat in product['associations']['categories']]
            
            if str(cor_id) in categorias_do_produto:
                image_url = f"https://decoreiro.com.br/{product['id_default_image']}-home_default/{product['link_rewrite']}.jpg"
                product_url = f"https://decoreiro.com.br/{product['id']}-{product['link_rewrite']}.html"
                
                produtos_recomendados.append({
                    'id': product['id'],
                    'nome': product['name'],
                    'preco': f"{float(product['price']):.2f}".replace('.',','),
                    'url_imagem': image_url,
                    'product_url': product_url
                })
        
        return jsonify(produtos_recomendados[:6])

    except requests.exceptions.RequestException as e:
        print(f"Erro ao conectar com a API do PrestaShop: {e}")
        return jsonify({"error": "Não foi possível buscar os produtos no momento."}), 500
    except Exception as e:
        print(f"Erro inesperado: {e}")
        return jsonify({"error": "Ocorreu um erro inesperado."}), 500

# --- INICIALIZAÇÃO DO SERVIDOR ---
if __name__ == '__main__':
    # Pega a porta da variável de ambiente PORT, ou usa 5001 como padrão.
    port = int(os.environ.get('PORT', 5001))

    # O host='0.0.0.0' é importante para que o servidor seja acessível externamente quando estiver hospedado, e não apenas localmente.
    app.run(debug=False, host='0.0.0.0', port=port)