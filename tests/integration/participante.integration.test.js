// tests/integration/participante.integration.test.js
// Teste de INTEGRAÇÃO: o service conversa com o banco de TESTE de verdade.
const { sequelize, Participante } = require("../../src/models");
const ParticipanteService = require("../../src/services/ParticipanteService");
const limparBanco = require("../helpers/limparBanco");

// Antes de CADA teste: banco vazio
beforeEach(async () => {
  await limparBanco();
});

// Depois de TODOS os testes deste arquivo: fecha a conexão com o banco
afterAll(async () => {
  await sequelize.close();
});

describe("ParticipanteService.criar (integração)", () => {
  it("grava o participante no banco com nome e e-mail corretos", async () => {
    // Arrange
    const dados = { nome: "Ana Souza", email: "ana@senai.br" };

    // Act
    const criado = await ParticipanteService.criar(dados);

    // Assert: busca de novo NO BANCO, não confia no objeto devolvido
    const doBanco = await Participante.findByPk(criado.id);
    expect(doBanco).not.toBeNull();
    expect(doBanco.nome).toBe("Ana Souza");
    expect(doBanco.email).toBe("ana@senai.br");
  });

  it("não grava dois participantes com o mesmo e-mail", async () => {
    // Arrange: já existe uma Ana no banco
    await ParticipanteService.criar({ nome: "Ana", email: "ana@senai.br" });

    // Act + Assert: a segunda gravação com o mesmo e-mail precisa dar erro
    await expect(
      ParticipanteService.criar({ nome: "Outra Ana", email: "ana@senai.br" }),
    ).rejects.toThrow();

    // Assert no banco: continua existindo só um participante
    const total = await Participante.count();
    expect(total).toBe(1);
  });

  // Parte 4 — Teste 2: e-mail inválido não é gravado
  it("não grava participante com e-mail inválido", async () => {
    // Arrange: um participante com e-mail SEM @
    const dados = { nome: "Bruno", email: "brunosenai.br" };

    // Act + Assert: a gravação precisa ser recusada
    await expect(ParticipanteService.criar(dados)).rejects.toThrow();

    // Assert no banco: quantos participantes devem existir agora?
    const total = await Participante.count();
    expect(total).toBe(0);
  });
});

// Parte 5 — Teste 3: o desafio (Atualizar participante)
describe("ParticipanteService.atualizar (integração)", () => {
  it("grava o nome novo no banco", async () => {
    // Arrange: criem um participante "Ana", e-mail "ana@senai.br"
    const criado = await ParticipanteService.criar({ 
      nome: "Ana", 
      email: "ana@senai.br" 
    });

    // Act: atualizem o nome para "Ana Maria"
    await ParticipanteService.atualizar(criado.id, { nome: "Ana Maria" });

    // Assert: busquem o participante no banco e confiram se o nome é "Ana Maria"
    const doBanco = await Participante.findByPk(criado.id);
    
    expect(doBanco).not.toBeNull();
    expect(doBanco.nome).toBe("Ana Maria");
  });
});
