 // Elementos do DOM
 const memeImage = document.getElementById('meme-image');
 const loadingOverlay = document.getElementById('loading-overlay');
 const textTop = document.getElementById('text-top');
 const textBottom = document.getElementById('text-bottom');
 const topTextInput = document.getElementById('top-text');
 const bottomTextInput = document.getElementById('bottom-text');
 const themeSelect = document.getElementById('theme-select');
 const generateBtn = document.getElementById('generate-btn');
 const downloadBtn = document.getElementById('download-btn');
 const apiOption = document.getElementById('api-option');
 const uploadOption = document.getElementById('upload-option');
 const apiSelection = document.getElementById('api-selection');
 const uploadControls = document.getElementById('upload-controls');
 const imageUpload = document.getElementById('image-upload');
 const fileName = document.getElementById('file-name');

 // APIs para diferentes temas
 const APIs = {
  
     cats: {
         url: 'https://api.thecatapi.com/v1/images/search',
         getImageUrl: data => data[0].url
     },

     dogs: {
         url: 'https://dog.ceo/api/breeds/image/random',
         getImageUrl: data => data.message
     },

     memes: {
         url: 'https://api.imgflip.com/get_memes',
         getImageUrl: data => {
             const memes = data.data.memes;
             const randomIndex = Math.floor(Math.random() * memes.length);
             return memes[randomIndex].url;
         }
     },

     images : {
        url: 'https://api.unsplash.com/photos/random?client_id=cR_VApOKNN6Tgx9qm3IZOCiA8CKHidKuUbo_t6FycKE',
        getImageUrl: data => data.urls.regular
    },

    funnyImages : {
      url:  'https://meme-api.com/gimme/funny',
      getImageUrl: data => data.url

    }
 };
 
 // Frases pré-definidas para inspiração
 const presetPhrases = {
     top: [
         "QUANDO EU",
         "AQUELE MOMENTO",
         "EU TENTANDO",
         "NINGUÉM:",
         "MEU PROFESSOR:",
         "SEGUNDA-FEIRA BE LIKE",
         "ESTUDANDO PARA A PROVA",
         "DESENVOLVENDO EM JAVASCRIPT"
     ],
     bottom: [
         "E NADA ACONTECE",
         "FAZER O QUÊ?",
         "NÃO PIORAR A SITUAÇÃO",
         "STONKS!",
         "MISSÃO CUMPRIDA",
         "DEU TUDO ERRADO",
         "FALHEI COM SUCESSO",
         "FUNCIONA SÓ NA MÁQUINA"
     ]
 };
 
 // Atualiza o texto do meme quando os inputs mudam
 topTextInput.addEventListener('input', () => {
     textTop.textContent = topTextInput.value.toUpperCase();
 });
 
 bottomTextInput.addEventListener('input', () => {
     textBottom.textContent = bottomTextInput.value.toUpperCase();
 });
 
 // Alternar entre API e upload de imagem
 apiOption.addEventListener('change', () => {
     if (apiOption.checked) {
         apiSelection.style.display = 'flex';
         uploadControls.style.display = 'none';
         generateBtn.textContent = 'Gerar Novo Meme';
     }
 });
 
 uploadOption.addEventListener('change', () => {
     if (uploadOption.checked) {
         apiSelection.style.display = 'none';
         uploadControls.style.display = 'flex';
         generateBtn.textContent = 'Usar Esta Imagem';
     }
 });
 
 // Atualizar nome do arquivo quando selecionado
 imageUpload.addEventListener('change', () => {
     if (imageUpload.files.length > 0) {
         fileName.textContent = imageUpload.files[0].name;
     } else {
         fileName.textContent = 'Nenhum arquivo selecionado';
     }
 });
 
 // Gera um número aleatório dentro de um intervalo
 function getRandomInt(max) {
     return Math.floor(Math.random() * max);
 }
 
 // Gera textos aleatórios para o meme
 function generateRandomTexts() {
     topTextInput.value = presetPhrases.top[getRandomInt(presetPhrases.top.length)];
     bottomTextInput.value = presetPhrases.bottom[getRandomInt(presetPhrases.bottom.length)];
     
     textTop.textContent = topTextInput.value.toUpperCase();
     textBottom.textContent = bottomTextInput.value.toUpperCase();
 }
 
 // Função para mostrar/esconder o loading
 function setLoading(isLoading) {
     if (isLoading) {
         loadingOverlay.style.display = 'flex';
         generateBtn.disabled = true;
         generateBtn.textContent = apiOption.checked ? 'Carregando...' : 'Processando...';
     } else {
         loadingOverlay.style.display = 'none';
         generateBtn.disabled = false;
         generateBtn.textContent = apiOption.checked ? 'Gerar Novo Meme' : 'Usar Esta Imagem';
     }
 }
 
 // Função para buscar imagem da API
 async function fetchImageFromAPI(theme) {
     setLoading(true);
     
     try {
         if (theme === 'random') {
             // Escolhe um tema aleatório (exceto 'random')
             const themes = Object.keys(APIs).filter(t => t !== 'random');
             theme = themes[getRandomInt(themes.length)];
         }
         
         const api = APIs[theme];
         
         // Para a API do Unsplash que retorna diretamente a imagem
         if (theme === 'nature') {
             // Adiciona um timestamp para evitar cache
             memeImage.src = api.url + '&timestamp=' + new Date().getTime();
             memeImage.onload = () => setLoading(false);
             return;
         }
         
         // Para APIs que retornam JSON
         const response = await fetch(api.url);
         const data = await response.json();
         const imageUrl = api.getImageUrl(data);
         
         memeImage.src = imageUrl;
         memeImage.onload = () => setLoading(false);
     } catch (error) {
         console.error('Erro ao buscar imagem:', error);
         alert('Houve um erro ao buscar a imagem. Tente novamente.');
         setLoading(false);
         // Usa imagem placeholder se houver erro
         memeImage.src = '/api/placeholder/500/375';
     }
 }
 
 // Função para usar imagem enviada pelo usuário
 function useUploadedImage() {
     if (!imageUpload.files || imageUpload.files.length === 0) {
         alert('Por favor, selecione uma imagem primeiro.');
         return;
     }
     
     setLoading(true);
     
     const file = imageUpload.files[0];
     const reader = new FileReader();
     
     reader.onload = function(e) {
         memeImage.src = e.target.result;
         memeImage.onload = () => setLoading(false);
     };
     
     reader.onerror = function() {
         alert('Erro ao ler o arquivo. Tente novamente.');
         setLoading(false);
     };
     
     reader.readAsDataURL(file);
 }
 
 // Gera um novo meme
 function generateMeme() {
     if (apiOption.checked) {
         const selectedTheme = themeSelect.value;
         fetchImageFromAPI(selectedTheme);
         
         // 50% de chance de gerar textos aleatórios
         if (Math.random() > 0.5) {
             generateRandomTexts();
         }
     } else {
         useUploadedImage();
     }
 }
 
 // Função para salvar o meme (usando Canvas)
 function downloadMeme() {
     const canvas = document.createElement('canvas');
     const container = document.querySelector('.meme-image-container');
     canvas.width = container.offsetWidth;
     canvas.height = container.offsetHeight;
     
     const ctx = canvas.getContext('2d');
     
     // Desenha a imagem
     ctx.drawImage(memeImage, 0, 0, canvas.width, canvas.height);
     
     // Configura o estilo do texto
     ctx.font = 'bold 36px sans-serif';
     ctx.textAlign = 'center';
     ctx.strokeStyle = 'black';
     ctx.lineWidth = 8;
     ctx.fillStyle = 'white';
     
     // Desenha o texto superior
     ctx.strokeText(textTop.textContent, canvas.width / 2, 50);
     ctx.fillText(textTop.textContent, canvas.width / 2, 50);
     
     // Desenha o texto inferior
     ctx.strokeText(textBottom.textContent, canvas.width / 2, canvas.height - 30);
     ctx.fillText(textBottom.textContent, canvas.width / 2, canvas.height - 30);
     
     // Cria link de download
     const link = document.createElement('a');
     link.download = 'meu-meme.png';
     link.href = canvas.toDataURL('image/png');
     link.click();
 }
 
 // Event listeners
 generateBtn.addEventListener('click', generateMeme);
 downloadBtn.addEventListener('click', downloadMeme);
 
 // Gera o primeiro meme ao carregar a página
 window.addEventListener('load', () => {
     setLoading(false); // Esconde o loading inicial
     fetchImageFromAPI('random');
 });
 
 // Configura manipulador de erros para imagens
 memeImage.onerror = () => {
     console.error('Erro ao carregar imagem');
     setLoading(false);
     memeImage.src = '/api/placeholder/500/375';
 };