const readline = require("readline-sync");
const fs = require("fs");

const perguntas = [
  {
    pergunta: "Qual país venceu a Copa do Mundo de 2002?",
    alternativas: ["A) Alemanha", "B) Brasil", "C) Argentina"],
    correta: "B"
  },
  {
    pergunta: "Quem é conhecido como Rei do Futebol?",
    alternativas: ["A) Maradona", "B) Messi", "C) Pelé"],
    correta: "C"
  },
  {
    pergunta: "Quantos jogadores cada time tem em campo no futebol profissional?",
    alternativas: ["A) 11", "B) 10", "C) 12"],
    correta: "A"
  },
  {
    pergunta: "Qual jogador é o maior artilheiro da história da seleção brasileira?",
    alternativas: ["A) Ronaldo Fenômeno", "B) Pelé", "C) Neymar"],
    correta: "C"
  },
  {
    pergunta: "Quantas copas do mundo o Brasil já ganhou?",
    alternativas: ["A) 4", "B) 5", "C) 6"],
    correta: "B"
  },
  {
    pergunta: "O que acontece se uma partida de futebol termina empatada numa final?",
    alternativas: ["A) Os dois vencem", "B) Disputa por pênaltis", "C) Não há campeão"],
    correta: "B"
  },
  {
    pergunta: "Qual dessas posições é responsável por defender o gol?",
    alternativas: ["A) Zagueiro", "B) Atacante", "C) Goleiro"],
    correta: "C"
  },
  {
    pergunta: "Quantas cartas cada jogador recebe no início da rodada no truco paulista?",
    alternativas: ["A) 3", "B) 5", "C) 7"],
    correta: "A"
  },
  {
    pergunta: "Qual a manilha mais forte no truco?",
    alternativas: ["A) Copas", "B) Zap", "C) Espada"],
    correta: "B"
  },
  {
    pergunta: "Qual o valor da rodada se alguém pede truco e o adversário aceita?",
    alternativas: ["A) 3 pontos", "B) 4 pontos", "C) 5 pontos"],
    correta: "A"
  },
  {
    pergunta: "Onde nasceu o futebol?",
    alternativas: ["A) Inglaterra", "B) Brasil", "C) Itália"],
    correta: "A"
  },
  {
    pergunta: "Como se chama a jogada onde um jogador blefa ou engana o adversário?",
    alternativas: ["A) Cavadinha", "B) Mão de ferro", "C) Blefe"],
    correta: "C"
  },
  {
    pergunta: "Quando o jogador grita Seis, o que ele está pedindo?",
    alternativas: ["A) Que a rodada valha 6 pontos", "B) Que troquem de cartas", "C) Que o jogo termine"],
    correta: "A"
  },
  {
    pergunta: "Quantos pontos são necessários para vencer uma partida tradicional de truco paulista?",
    alternativas: ["A) 9", "B) 12", "C) 15"],
    correta: "B"
  },
  {
    pergunta: "O que é “mão de ferro” no truco?",
    alternativas: [
      "A) Rodada em que todos jogam com cartas viradas",
      "B) Rodada decisiva onde ninguém vê as cartas",
      "C) Quando todos os jogadores têm que jogar com uma mão"
    ],
    correta: "B"
  }
];

const premiacoes = [1000, 5000, 10000, 30000, 100000];

function escolherPergunta(usadas) {
  let index;
  do {
    index = Math.floor(Math.random() * perguntas.length);
  } while (usadas.includes(index));
  usadas.push(index);
  return perguntas[index];
}

function salvarNoRanking(nome, premio) {
  let ranking = [];

  try {
    const dados = fs.readFileSync("ranking.json", "utf-8");
    ranking = JSON.parse(dados);
  } catch (err) {
    ranking = [];
  }

  ranking.push({ nome, premio });

  ranking.sort((a, b) => b.premio - a.premio);

  fs.writeFileSync("ranking.json", JSON.stringify(ranking, null, 2));
}

function exibirRanking() {
  console.log("\nRanking dos Melhores Jogadores:");
  try {
    const dados = fs.readFileSync("ranking.json", "utf-8");
    const ranking = JSON.parse(dados);

    const top = ranking.slice(0, 10);

    top.forEach((jogador, index) => {
      console.log(`${index + 1}º - ${jogador.nome} - R$${jogador.premio}`);
    });
  } catch (err) {
    console.log("Não foi possível carregar o ranking.");
  }
}

function mostrarResumo(nome, rodada, premio, respostaCorreta, status) {
  console.log("\nFim de jogo!");
  console.log(`Nome do jogador: ${nome}`);
  console.log(`Rodada em que parou: ${rodada}`);
  console.log(`Rodadas restantes: ${5 - rodada}`);

  if (status === "erro") {
    console.log(`Você errou. A resposta correta era: ${respostaCorreta}`);
  } else if (status === "parou") {
    console.log("Você decidiu parar antes de responder a pergunta.");
  } else if (status === "vitoria") {
    console.log("Você respondeu todas corretamente!");
  }

  console.log(`Premiação final: R$${premio}`);

  salvarNoRanking(nome, premio);

  const opcao = readline.question("Deseja jogar novamente S/N? ");
  if (opcao.toUpperCase() === "S") {
    jogar();
  } else {
    console.log("\nObrigado por jogar!");
    exibirRanking();
  }
}

function jogar() {
  const verRanking = readline.question("Deseja ver o ranking antes de jogar? S/N ");
  if (verRanking.toUpperCase() === "S") {
    exibirRanking();
  }

  const nome = readline.question("\nDigite seu nome: ");
  if (!nome) {
    console.log("Nome inválido. Jogo encerrado.");
    return;
  }

  let premio = 0;
  let usadas = [];
  let ajudaUniversitariosUsada = false;
  let pergunta = null; 
  let rodada = 0;

  while (rodada < 5) {
    if (!pergunta) {
      pergunta = escolherPergunta(usadas);
    }

    const premioAcerto = premiacoes[rodada];
    const premioErro = rodada === 0 ? 0 : premiacoes[rodada - 1];

    let texto = `\nRodada ${rodada + 1}
Pergunta: ${pergunta.pergunta}
${pergunta.alternativas.join('\n')}

Premiação se acertar: R$${premioAcerto}
Premiação se errar: R$${premioErro}
Premiação se parar: R$${premio}

Digite A, B, C, P para PARAR ou U para pedir ajuda dos UNIVERSITÁRIOS: `;

    let resposta = readline.question(texto).trim().toUpperCase();

    if (resposta === "U") {
      if (ajudaUniversitariosUsada) {
        console.log("\nVocê já usou a ajuda dos universitários!");
        continue; 
      }

      ajudaUniversitariosUsada = true;
      const alternativas = ["A", "B", "C"];
      const opinioes = [];

      for (let j = 0; j < 2; j++) {
        const chanceCerta = Math.random();
        if (chanceCerta < 0.7) {
          opinioes.push(pergunta.correta);
        } else {
          let incorreta;
          do {
            incorreta = alternativas[Math.floor(Math.random() * 3)];
          } while (incorreta === pergunta.correta);
          opinioes.push(incorreta);
        }
      }

      console.log("\nUniversitários opinam:");
      console.log(` - Universitário 1: Acho que é "${opinioes[0]}"`);
      console.log(` - Universitário 2: Acho que é "${opinioes[1]}"`);
      console.log("\nAgora responda a pergunta.");
      continue; 
    }

    if (resposta === "P") {
      console.log("Você decidiu parar!");
      mostrarResumo(nome, rodada + 1, premio, null, "parou");
      return;
    }

    if (!["A", "B", "C"].includes(resposta)) {
      console.log("Resposta inválida!");
      continue; 
    }

    if (resposta === pergunta.correta) {
      console.log("Resposta correta!");
      premio = premioAcerto;
      pergunta = null;
      rodada++;
    } else {
      console.log(`Resposta incorreta! A correta era: ${pergunta.correta}`);
      premio = premioErro;
      mostrarResumo(nome, rodada + 1, premio, pergunta.correta, "erro");
      return;
    }
  }

  mostrarResumo(nome, rodada, premio, null, "vitoria");
}

jogar();
