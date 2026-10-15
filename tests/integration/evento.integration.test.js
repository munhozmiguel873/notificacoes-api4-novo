// tests/integration/evento.integration.test.js
// Teste de INTEGRAÇÃO: o service conversa com o banco de TESTE de verdade.
const { sequelize, Evento } = require("../../src/models");
const EventoService = require("../../src/services/EventoService");
const { ValidationError } = require("../../src/errors/AppError");
const limparBanco = require("../helpers/limparBanco");

beforeEach(async () => {
  await limparBanco();
});

afterAll(async () => {
  await sequelize.close();
});

describe("EventoService.criar (integração)", () => {
  it("não grava evento com nome de 2 letras", async () => {
    // Arrange
    const dados = { nome: "TI", data: "2026-10-15" };

    // Act + Assert: a gravação precisa ser recusada com ValidationError
    await expect(EventoService.criar(dados)).rejects.toThrow(ValidationError);

    // Assert no banco: nada foi gravado
    const total = await Evento.count();
    expect(total).toBe(0);
  });

  // ============================================================
  // SUA VEZ: complete o teste abaixo, seguindo o modelo do
  // participante.integration.test.js (teste "grava o participante...").
  //
  // 1. Arrange: monte os dados de um evento válido (nome e data)
  // 2. Act:     chame EventoService.criar(dados) com await
  // 3. Assert:  busque o evento no banco com Evento.findByPk(criado.id)
  //             e confira o nome gravado
  //
  // Depois, apague o ".todo" da linha abaixo e troque por um teste completo:
  //   it("grava o evento no banco com o nome correto", async () => { ... });
  // ============================================================
  
  it("grava o evento no banco com o nome correto", async () => {
    // Arrange: um evento válido (data no formato ano-mês-dia)
    const dados = { nome: "Semana de Tecnologia", data: "2026-11-20" };

    // Act: chamem o service que cria o evento (não esqueçam o await!)
    const criado = await EventoService.criar(dados);

    // Assert: busquem o evento NO BANCO pelo id
    const doBanco = await Evento.findByPk(criado.id);

    expect(doBanco).not.toBeNull();
    expect(doBanco.nome).toBe(dados.nome);
  });
});
