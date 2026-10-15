# Guia do Aluno 05 — Testes de Integração

**UC:** Testes de Software (TSOF) — 4º semestre | **Turma:** 1-2026-SESI\_DEV\_OC\_2 **Data:** 15/10/2026 | **Professor:** Wagner de Campos Sabor Junior

> Na Aula 04 vocês testaram funções sozinhas. Hoje vocês testam o código **conversando com o banco de dados de verdade**.

---

## 1\. A ideia da aula em uma frase

> **Teste de integração confere se o dado chegou ao banco do jeito certo.**

Lembram dos dois defeitos da primeira aula? O **ENUM incompatível** e o **INSERT fantasma**. Nos dois, cada peça parecia certa sozinha. O problema estava **entre** o código e o banco. Teste unitário não pega isso. Teste de integração pega.

---

## 2\. Unitário × integração

|  | Unitário (Aula 04\) | Integração (hoje) |
| :---- | :---- | :---- |
| O que roda | Uma função sozinha | Service \+ Model \+ **banco MySQL** |
| Exemplo | `isEmail("ana@senai.br")` | `ParticipanteService.criar(...)` grava na tabela |
| Precisa de banco? | Não | **Sim — um banco só para testes** |
| Comando | `npm run test:unit` | `npm run test:integration` |

Na Aula 04, quem tentou testar um service viu `Access denied for user ''`. Era isso: o service queria o banco, e o banco de teste ainda não existia. Hoje ele passa a existir.

---

## 3\. Por que um banco **separado** só para testes

Os testes de integração **apagam todos os dados** antes de cada teste (vocês vão ver por quê na seção 5). Se eles usassem o banco de desenvolvimento, apagariam os eventos e participantes que vocês usam na API.

Por isso existem **dois bancos** no mesmo MySQL:

MySQL do seu notebook

├── notificacoes\_db     ← banco da API (npm run dev). Os testes NUNCA mexem aqui

└── notificacoes\_test   ← banco dos testes. Pode ser apagado à vontade

Três arquivos fazem os testes usarem o banco certo:

| Arquivo | Para quê | Vai para o GitHub? |
| :---- | :---- | :---- |
| `.env.test` | Diz aos testes qual banco usar e a senha do MySQL | **Não** (tem a sua senha) |
| `src/config/database.json` (bloco `"test"`) | Diz ao `sequelize-cli` onde criar as tabelas de teste | **Não** (tem a sua senha) |
| `tests/setup.js` | Carrega o `.env.test` antes de qualquer teste | Sim (já vem pronto) |

E um comando cria as tabelas **no banco de teste**:

npx sequelize-cli db:migrate \--env test

> O `--env test` é o que manda o comando usar o bloco `"test"` do `database.json`. Sem ele, as tabelas seriam criadas no banco da API.

---

## 4\. Anatomia de um teste de integração

Este teste já vem pronto no projeto, em `tests/integration/participante.integration.test.js`:

const { sequelize, Participante } \= require("../../src/models");

const ParticipanteService \= require("../../src/services/ParticipanteService");

const limparBanco \= require("../helpers/limparBanco");

// Antes de CADA teste: banco vazio

beforeEach(async () \=\> {

  await limparBanco();

});

// Depois de TODOS os testes do arquivo: fecha a conexão com o banco

afterAll(async () \=\> {

  await sequelize.close();

});

describe("ParticipanteService.criar (integração)", () \=\> {

  it("grava o participante no banco com nome e e-mail corretos", async () \=\> {

    // Arrange

    const dados \= { nome: "Ana Souza", email: "ana@senai.br" };

    // Act

    const criado \= await ParticipanteService.criar(dados);

    // Assert: busca de novo NO BANCO, não confia no objeto devolvido

    const doBanco \= await Participante.findByPk(criado.id);

    expect(doBanco).not.toBeNull();

    expect(doBanco.nome).toBe("Ana Souza");

  });

});

O que é **novo** em relação à Aula 04:

| Peça | O que faz |
| :---- | :---- |
| `beforeEach(...)` | Roda **antes de cada** teste. Aqui: esvazia o banco de teste |
| `afterAll(...)` | Roda **uma vez, no fim** do arquivo. Aqui: fecha a conexão com o MySQL |
| `async` / `await` | O banco demora para responder. O `await` faz o teste **esperar** a resposta |
| `Participante.findByPk(id)` | Busca o registro **no banco** pelo id |
| `Participante.count()` | Conta quantos registros existem na tabela |

### Por que buscar de novo no banco?

O service devolve um objeto. Mas o objeto devolvido **não prova** que o dado foi gravado. Foi exatamente o caso do INSERT fantasma: a resposta vinha, o dado não chegava.

> **Em teste de integração, a prova está no banco.** Por isso o Assert faz `findByPk` ou `count`.

---

## 5\. Por que limpar o banco antes de cada teste

Se o banco não for limpo, o que um teste grava fica lá para o próximo. Exemplo: o primeiro teste grava a Ana com `ana@senai.br`. Na próxima vez que vocês rodarem, a Ana **ainda está lá** — e o teste falha com `email must be unique`, mesmo sem nenhum defeito no código.

Cada teste precisa **começar do zero** e não depender do que outro teste deixou. Quem garante isso é o `limparBanco`, chamado no `beforeEach`.

---

## 6\. Testando quando o dado **não** pode ser gravado

Para testar que o service **recusa** um dado inválido, usamos `rejects.toThrow()`:

it("não grava evento com nome de 2 letras", async () \=\> {

  // Arrange

  const dados \= { nome: "TI", data: "2026-10-15" };

  // Act \+ Assert: a gravação precisa ser recusada

  await expect(EventoService.criar(dados)).rejects.toThrow(ValidationError);

  // Assert no banco: nada foi gravado

  const total \= await Evento.count();

  expect(total).toBe(0);

});

| Peça | O que faz |
| :---- | :---- |
| `await expect(...).rejects.toThrow()` | Confere que a função **deu erro**. É o `toThrow` da Aula 04, na versão para código com `await` |
| `Evento.count()` → `0` | Confere que **nada** foi gravado. Recusar e gravar mesmo assim seria um defeito |

> Repare: o teste de recusa tem **dois** Asserts. Um confere o erro, o outro confere o banco.

---

## 7\. Erros comuns

| Mensagem | O que fazer |
| :---- | :---- |
| `Unknown database 'notificacoes_test'` | Falta criar o banco no Workbench: `CREATE DATABASE notificacoes_test;` |
| `Access denied for user ''` | Falta o `.env.test`, ou ele ficou com outro nome (`.env.test.txt`) |
| `Access denied for user 'root'` | Senha errada no `.env.test` |
| `Dialect needs to be explicitly supplied` | Falta o `database.json` ou o bloco `"test"` dentro dele |
| Todos os testes falham na linha do `limparBanco` | Faltam as tabelas: `npx sequelize-cli db:migrate --env test` |
| `Received: null` logo depois de um `findByPk` | Faltou o `await` na chamada do service |
| `Incorrect datetime value: 'Invalid date'` | Data no formato brasileiro. Use `"2026-11-20"` (ano-mês-dia) |
| `email must be unique` sem motivo | Algum teste está sem o `beforeEach` com `limparBanco` |

---

## 8\. Glossário

| Termo | Significado |
| :---- | :---- |
| **Teste de integração** | Testa peças conversando de verdade: service \+ model \+ banco |
| **Banco de teste** | Banco separado, só para os testes, que pode ser apagado à vontade |
| **`.env.test`** | Variáveis de ambiente usadas só pelos testes |
| **`beforeEach` / `afterAll`** | Roda antes de cada teste / uma vez no fim do arquivo |
| **`async` / `await`** | Faz o teste esperar a resposta do banco |
| **`rejects.toThrow()`** | Confere que uma função com `await` deu erro |

---

## 9\. Para fixar

1. Qual a diferença entre um teste unitário e um teste de integração?  
2. Por que os testes usam um banco separado do banco da API?  
3. Por que o Assert busca o registro de novo no banco em vez de conferir o objeto que o service devolveu?  
4. O que acontece se tirarmos o `limparBanco` do `beforeEach`?