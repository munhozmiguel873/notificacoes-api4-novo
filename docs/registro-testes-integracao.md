# Registro de Testes de Integração

Aluno: [Seu Nome Aqui]
Grupo: [Nome do seu Grupo Aqui]
Data: 15/10/2026

## Banco de teste
Nome do banco de teste: notificacoes_test
Por que ele é separado do banco da API (uma frase): Ele serve para que as operações de escrita, limpeza e destruição de dados executadas pelos testes não apaguem ou corrompam os dados reais do banco de desenvolvimento ou produção.

## Testes escritos

| # | Arquivo | O que o teste verifica | Verde ou vermelho? |
|---| ------- | ---------------------- | ------------------ |
| 1 | evento.integration.test.js | Se grava o evento no banco com o nome correto | Verde |
| 2 | participante.integration.test.js | Se não grava participante com e-mail inválido | Verde |
| 3 | participante.integration.test.js | Se o método atualizar grava o nome novo no banco | Vermelho |

## Resultado
Linha "Tests:" da saída do npm run test:integration:
Tests:       1 failed, 5 passed, 6 total

## Defeito encontrado
Teste: ParticipanteService.atualizar (integração) › grava o nome novo no banco
Esperado: "Ana Maria"
Obtido: "Ana"
O que o usuário da API veria (a rota responde 200, mas...): O usuário veria uma resposta de sucesso (HTTP Status 200 OK), dando a falsa impressão de que os dados foram salvos. Porém, ao consultar o participante novamente, veria que o nome antigo não foi modificado no banco de dados.
