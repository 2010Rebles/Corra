let carroJogador;
let obstaculos = [];
let velocidadeObstaculo = 5; // Velocidade inicial dos obstáculos
let pontuacao = 0;
let gameState = 'playing'; // Estados: 'playing', 'gameOver'

let imgCarroJogador; // Variável para a imagem do carro do jogador
let imgCarroObstaculo; // Variável para a imagem dos carros obstáculos

// Função para carregar ativos antes do setup
function preload() {
  // Carrega a imagem do carro do jogador.
  // URL de placeholder: Substitua por sua própria imagem de carro!
  imgCarroJogador = loadImage('https://placehold.co/50x80/0000FF/FFFFFF?text=Seu+Carro');
  // Carrega a imagem dos carros obstáculos.
  // URL de placeholder: Substitua por suas próprias imagens de obstáculos!
  imgCarroObstaculo = loadImage('https://placehold.co/50x80/FF0000/FFFFFF?text=Carro+CPU');
}

// Classe para o carro do jogador
class Carro {
  constructor(x, y, largura, altura, imagem) {
    this.x = x;
    this.y = y;
    this.largura = largura;
    this.altura = altura;
    this.imagem = imagem; // A imagem do carro
  }

  mostrar() {
    // Desenha a imagem do carro em vez de um retângulo
    image(this.imagem, this.x, this.y, this.largura, this.altura);
  }

  mover(direcao) {
    if (direcao === 'esquerda') {
      this.x -= 8; // Velocidade de movimento do carro
    } else if (direcao === 'direita') {
      this.x += 8; // Velocidade de movimento do carro
    }
    // Garante que o carro não saia da tela
    this.x = constrain(this.x, 0, width - this.largura);
  }
}

// Classe para os obstáculos (outros carros)
class Obstaculo {
  constructor(x, y, largura, altura, imagem) {
    this.x = x;
    this.y = y;
    this.largura = largura;
    this.altura = altura;
    this.imagem = imagem; // A imagem do obstáculo
  }

  mostrar() {
    // Desenha a imagem do obstáculo em vez de um retângulo
    image(this.imagem, this.x, this.y, this.largura, this.altura);
  }

  mover() {
    this.y += velocidadeObstaculo;
  }

  // Verifica colisão com outro objeto
  colidiuCom(outroObjeto) {
    return (
      this.x < outroObjeto.x + outroObjeto.largura &&
      this.x + this.largura > outroObjeto.x &&
      this.y < outroObjeto.y + outroObjeto.altura &&
      this.y + this.altura > outroObjeto.y
    );
  }
}

function setup() {
  createCanvas(400, 600); // Largura, Altura
  // Cria o carro do jogador usando a imagem carregada
  carroJogador = new Carro(width / 2 - 25, height - 100, 50, 80, imgCarroJogador);
  rectMode(CORNER); // Define o modo de desenho do retângulo (ponto superior esquerdo)
}

function draw() {
  background(100); // Fundo cinza para a estrada

  if (gameState === 'playing') {
    // Desenha as linhas da estrada
    desenhaEstrada();

    // Movimento do carro do jogador
    if (keyIsDown(LEFT_ARROW)) {
      carroJogador.mover('esquerda');
    }
    if (keyIsDown(RIGHT_ARROW)) {
      carroJogador.mover('direita');
    }

    carroJogador.mostrar();

    // Geração de obstáculos
    if (frameCount % 60 === 0) { // Cria um novo obstáculo a cada 60 frames (aprox. 1 segundo)
      let xAleatorio = random(0, width - 50); // Posição X aleatória
      // Cria o obstáculo usando a imagem carregada
      obstaculos.push(new Obstaculo(xAleatorio, -80, 50, 80, imgCarroObstaculo)); // Começa acima da tela
    }

    // Move e mostra os obstáculos
    for (let i = obstaculos.length - 1; i >= 0; i--) {
      obstaculos[i].mover();
      obstaculos[i].mostrar();

      // Verifica colisão
      if (obstaculos[i].colidiuCom(carroJogador)) {
        gameState = 'gameOver';
      }

      // Remove obstáculos que saíram da tela e aumenta a pontuação
      if (obstaculos[i].y > height) {
        obstaculos.splice(i, 1);
        pontuacao++;
        // Opcional: Aumentar a velocidade dos obstáculos com a pontuação
        if (pontuacao % 10 === 0) { // Aumenta a velocidade a cada 10 pontos
          velocidadeObstaculo += 0.5;
        }
      }
    }

    // Exibe a pontuação
    fill(255); // Cor do texto branco
    textSize(24);
    textAlign(LEFT, TOP);
    text('Pontuação: ' + pontuacao, 10, 10);

  } else if (gameState === 'gameOver') {
    fill(255, 0, 0); // Texto vermelho
    textSize(48);
    textAlign(CENTER, CENTER);
    text('GAME OVER', width / 2, height / 2 - 30);
    textSize(24);
    text('Pontuação Final: ' + pontuacao, width / 2, height / 2 + 20);
    text('Pressione R para reiniciar', width / 2, height / 2 + 60);
  }
}

// Função para reiniciar o jogo
function keyPressed() {
  if (keyCode === 82 && gameState === 'gameOver') { // Tecla 'R'
    reiniciarJogo();
  }
}

function reiniciarJogo() {
  pontuacao = 0;
  velocidadeObstaculo = 5;
  obstaculos = []; // Limpa todos os obstáculos
  carroJogador.x = width / 2 - 25; // Reposiciona o carro do jogador
  gameState = 'playing';
}

// Função para desenhar as linhas da estrada
let linhaY = 0; // Posição Y inicial da linha da estrada
function desenhaEstrada() {
  stroke(255, 255, 0); // Amarelo
  strokeWeight(5);

  // Desenha as linhas do meio da estrada
  for (let i = 0; i < height / 80; i++) {
    line(width / 2, linhaY + i * 80, width / 2, linhaY + i * 80 + 40);
  }

  // Desenha as linhas laterais da estrada
  stroke(255); // Branco
  line(width / 4, 0, width / 4, height);
  line(width * 3 / 4, 0, width * 3 / 4, height);


  linhaY += velocidadeObstaculo; // Move as linhas para baixo na velocidade do obstáculo
  if (linhaY >= 80) { // Reseta a posição Y para criar um loop contínuo
    linhaY = 0;
  }
}