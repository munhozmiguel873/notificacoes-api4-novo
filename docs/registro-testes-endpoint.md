# Registro de Testes de Endpoint

Aluno: Miguel Munhoz
Grupo: (não informado)

## Testes escritos

| # | Verbo e rota | Com token? | Status esperado | Verde ou vermelho? |
| --- | ------------ | ---------- | --------------- | ------------------ |
| 1 | POST /eventos | Sim | 201 | Verde |
| 2 | GET /eventos/:id | Não | 404 | Verde |
| 3 | GET /eventos/:id | Não | 400 | Vermelho |

## Resultado

Linha "Tests:" da saída do npm run test:endpoint:
Tests: 1 failed, 4 passed, 5 total

## Defeito encontrado

Teste: GET /eventos/:id (rota pública) › responde 400 quando o id tem letras
Esperado: 400
Obtido: 200

Em qual aula esse mesmo defeito já tinha aparecido, e como:
Aula 04, no helper `src/helpers/parseId.js`: `parseInt("12abc")` devolvia `12` em vez de lançar erro, porque `parseInt` ignora o sufixo não numérico. O mesmo defeito chega à API porque `EventoController.show` usa `parseInt(req.params.id)` diretamente em vez de validar o id (e nem chama o `parseId`), então `GET /eventos/1abc` é tratado como `GET /eventos/1` e responde 200.
