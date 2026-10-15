# Atividade 05 — Meus Primeiros Testes de Integração

**UC:** Testes de Software (TSOF) | **Aula 05** | **Data:** 15/10/2026 **Modalidade:** em grupo, com **entrega individual** (cada aluno no próprio fork) **Avaliação:** formativa (CT 2, 3, 4 | CS 1, 2\)

---

## O que entregar

| \# | Onde | O que |
| :---- | :---- | :---- |
| 1 | **No seu fork** | Banco de teste funcionando (`npm run test:integration` roda) |
| 2 | **No seu fork** | **3 testes novos** em `tests/integration/` — o do desafio pode ficar vermelho |
| 3 | **No seu fork** | `docs/registro-testes-integracao.md` preenchido |

Tudo com **commit e push** até o fim da aula.

---

## Parte 1 — Preparando o banco de teste (junto com o professor)

> Façam acompanhando o professor no projetor. Os mesmos passos estão no **README** do projeto (seção "🧪 Testes — comece aqui", Passos 3 a 5).

**1.1 — Trazer as novidades do professor (Sync fork).**

1. No GitHub, abram **o seu fork** e cliquem em **Sync fork** → **Update branch**.  
2. No terminal do VS Code, na pasta `tsof-notificacoes`:

git pull

> Se aparecer `Need to specify how to reconcile divergent branches`, usem: `git pull --no-rebase --no-edit`

✅ Na pasta `tests/integration/` existem dois arquivos: `evento.integration.test.js` e `participante.integration.test.js`.

**1.2 — Criar o banco de teste.** No **MySQL Workbench**, rodem:

CREATE DATABASE notificacoes\_test;

**1.3 — Criar o `database.json`.** No terminal:

cp src/config/database.json.example src/config/database.json

Abram `src/config/database.json` e, no bloco **`"test"`**, troquem `sua_senha_aqui` pela senha do seu MySQL.

**1.4 — Criar as tabelas no banco de teste:**

npx sequelize-cli db:migrate \--env test

✅ Aparecem várias linhas terminando em `migrated`.

**1.5 — Criar o `.env.test`:**

cp .env.test.example .env.test

Abram o `.env.test` e troquem `sua_senha_aqui` pela senha do seu MySQL.

> ⚠️ Confiram que o arquivo se chama `.env.test`, e não `.env.test.txt`.

**1.6 — Rodar os testes de integração:**

npm run test:integration

✅ A saída termina com **`Tests: 1 todo, 3 passed, 4 total`**.

> O `todo` é um teste que ainda não foi escrito. Vocês vão escrevê-lo na Parte 3\.

---

## Parte 2 — Lendo o exemplo (junto com o professor)

Abram `tests/integration/participante.integration.test.js` e encontrem:

- [ ] o `beforeEach` — o que ele faz antes de cada teste?  
- [ ] o `afterAll` — o que ele faz no fim?  
- [ ] no primeiro teste, as linhas do **Arrange**, do **Act** e do **Assert**  
- [ ] a linha que busca o participante **no banco**

Consultem o **Guia 05, seção 4** se travarem.

---

## Parte 3 — Teste 1: gravar um evento (vocês completam)

Abram `tests/integration/evento.integration.test.js`. No fim do arquivo tem esta linha:

it.todo("grava o evento no banco com o nome correto");

**Apaguem essa linha** e coloquem este teste no lugar. Completem as lacunas `______`:

  it("grava o evento no banco com o nome correto", async () \=\> {

    // Arrange: um evento válido (data no formato ano-mês-dia)

    const dados \= { nome: "Semana de Tecnologia", data: "2026-11-20" };

    // Act: chamem o service que cria o evento (não esqueçam o await\!)

    const criado \= \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_;

    // Assert: busquem o evento NO BANCO pelo id

    const doBanco \= \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_;

    expect(doBanco).not.toBeNull();

    expect(\_\_\_\_\_\_\_\_\_\_\_\_\_\_).toBe(\_\_\_\_\_\_\_\_\_\_\_\_\_\_);

  });

> 💡 **Dica:** olhem o primeiro teste do `participante.integration.test.js`. A estrutura é a mesma — só muda a entidade (`EventoService` e `Evento`).

Rodem `npm run test:integration`. ✅ **`Tests: 4 passed, 4 total`** (o `todo` sumiu).

---

## Parte 4 — Teste 2: e-mail inválido não é gravado (vocês completam)

Abram `tests/integration/participante.integration.test.js`. **Antes da última linha do arquivo** (o `});` que fecha o `describe`), colem este teste e completem as lacunas:

  it("não grava participante com e-mail inválido", async () \=\> {

    // Arrange: um participante com e-mail SEM @

    const dados \= { nome: "Bruno", email: "\_\_\_\_\_\_\_\_\_\_\_\_\_\_" };

    // Act \+ Assert: a gravação precisa ser recusada

    await expect(ParticipanteService.criar(dados)).rejects.toThrow();

    // Assert no banco: quantos participantes devem existir agora?

    const total \= await Participante.count();

    expect(total).toBe(\_\_\_);

  });

> 💡 **Dica:** é igual ao teste "não grava evento com nome de 2 letras", no arquivo do evento. Leiam o **Guia 05, seção 6**.

Rodem. ✅ **`Tests: 5 passed, 5 total`**.

---

## Parte 5 — Teste 3: o desafio

A rota `PUT /participantes/:id` existe na API e responde **200**. Parece que funciona.

> **Quando atualizamos o nome de um participante, o nome novo chega de verdade ao banco?**

No **fim** do `participante.integration.test.js` (depois de tudo), criem um `describe` novo e escrevam o teste. Desta vez vocês escrevem o código — os comentários dizem o que fazer:

describe("ParticipanteService.atualizar (integração)", () \=\> {

  it("grava o nome novo no banco", async () \=\> {

    // Arrange: criem um participante "Ana", e-mail "ana@senai.br"

    //          (usem ParticipanteService.criar, como nos outros testes)

    // Act: atualizem o nome para "Ana Maria"

    //      ParticipanteService.atualizar(id, { nome: "Ana Maria" })  ← não esqueçam o await

    // Assert: busquem o participante no banco e confiram se o nome é "Ana Maria"

  });

});

Rodem `npm run test:integration`.

Se o teste ficar **vermelho**, **não mexam no código da API**: vocês encontraram um defeito. Leiam o `Expected` e o `Received` e anotem no registro (Parte 6). **Esse vermelho vale ponto.**

---

## Parte 6 — Registro e entrega

**6.1** Criem `docs/registro-testes-integracao.md` **no fork**:

\# Registro de Testes de Integração

Aluno:

Grupo:

Data: 15/10/2026

\#\# Banco de teste

Nome do banco de teste:

Por que ele é separado do banco da API (uma frase):

\#\# Testes escritos

| \#   | Arquivo | O que o teste verifica | Verde ou vermelho? |

| \--- | \------- | \---------------------- | \------------------ |

| 1   |         |                        |                    |

| 2   |         |                        |                    |

| 3   |         |                        |                    |

\#\# Resultado

Linha "Tests:" da saída do npm run test:integration:

\#\# Defeito encontrado

Teste:

Esperado:

Obtido:

O que o usuário da API veria (a rota responde 200, mas...):

**6.2** Confiram que **não** vão subir a senha para o GitHub:

git status

O `.env.test` e o `database.json` **não podem** aparecer na lista. Se aparecerem, chamem o professor.

**6.3** Commit e push:

git add .

git commit \-m "test: primeiros testes de integracao"

git push

---

## Checklist

- [ ] Sync fork feito, os dois arquivos de `tests/integration/` no notebook  
- [ ] Banco `notificacoes_test` criado, com as tabelas  
- [ ] `npm run test:integration` rodando  
- [ ] Teste 1 (evento) verde — o `todo` sumiu  
- [ ] Teste 2 (e-mail inválido) verde  
- [ ] Teste 3 (desafio) escrito  
- [ ] `docs/registro-testes-integracao.md` preenchido  
- [ ] `git status` sem `.env.test` e sem `database.json`  
- [ ] Commit e push no fork

---

## Ticket de saída — individual

> Responda sozinho. **A avaliação somativa é individual.**  
> 

1. Por que os testes de integração usam um banco **separado** do banco da API?  
2. No Assert, por que buscamos o registro **de novo no banco**, em vez de conferir o objeto que o service devolveu?  
3. A rota `PUT /participantes/:id` responde 200\. O que o seu teste do desafio mostrou sobre ela?