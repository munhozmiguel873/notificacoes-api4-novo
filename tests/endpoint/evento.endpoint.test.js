// tests/endpoint/evento.endpoint.test.js
// Teste de ENDPOINT: entra pela "porta da frente" da API, com uma requisição HTTP de verdade.
// O Supertest faz a requisição direto no app, sem precisar rodar o npm run dev.
const request = require("supertest");
const app = require("../../src/app");
const { sequelize, Evento } = require("../../src/models");
const limparBanco = require("../helpers/limparBanco");
const obterToken = require("../helpers/obterToken");

beforeEach(async () => {
  await limparBanco();
});

afterAll(async () => {
  await sequelize.close();
});

describe("GET /eventos (rota pública)", () => {
  it("responde 200 com a lista de eventos vazia", async () => {
    // Act: faz a requisição
    const resposta = await request(app).get("/eventos");

    // Assert: confere o status e o corpo (o "contrato" da resposta)
    expect(resposta.status).toBe(200);
    expect(resposta.body.dados).toEqual([]);
    expect(resposta.body.total).toBe(0);
  });
});

describe("POST /eventos (rota protegida)", () => {
  it("responde 401 quando não manda o token", async () => {
    // Arrange
    const evento = { nome: "Semana de Tecnologia", data: "2026-11-20" };

    // Act: sem o header Authorization
    const resposta = await request(app).post("/eventos").send(evento);

    // Assert
    expect(resposta.status).toBe(401);
    expect(resposta.body.erro.mensagem).toBe("Token não fornecido");
  });

  it("responde 201 quando manda um token válido", async () => {
    // Arrange
    const token = await obterToken();
    const evento = { nome: "Semana de Tecnologia", data: "2026-11-20" };

    // Act
    const resposta = await request(app)
      .post("/eventos")
      .set("Authorization", `Bearer ${token}`)
      .send(evento);

    // Assert
    expect(resposta.status).toBe(201);
    expect(resposta.body.nome).toBe("Semana de Tecnologia");
  });
});

describe("GET /eventos/:id (rota pública)", () => {
  it("responde 404 quando o evento não existe", async () => {
    // Act: peçam um id que não existe no banco de teste
    const resposta = await request(app).get("/eventos/999999");
    // Assert
    expect(resposta.status).toBe(404);
    expect(resposta.body.erro.mensagem).toBe("Evento não encontrado(a)");
  });

  it("responde 400 quando o id tem letras", async () => {
    // Arrange: gravem um evento direto no banco
    const evento = await Evento.create({ nome: "Semana de Tecnologia", data: "2026-11-20" });
    // Act: façam GET em /eventos/ + o id do evento + "abc"
    const resposta = await request(app).get(`/eventos/${evento.id}abc`);
    // Assert: um id com letras não é válido. Qual status a API DEVERIA responder?
    expect(resposta.status).toBe(400);
  });
});

