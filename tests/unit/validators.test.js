// tests/unit/validators.test.js
// 1. Importa as funções que vamos testar
const { isEmail, minLength } = require("../../src/helpers/validators");
// 2. describe = agrupa os testes de uma função
describe("validators.isEmail", () => {
  // 3. it = um caso de teste. O texto diz o que DEVERIA acontecer
  it("não retorna erro para um e-mail válido", () => {
    // Arrange — prepara
    const email = "ana@senai.br";
    // Act — executa
    const resultado = isEmail(email);
    // Assert — confere (nos validators, null = "sem erro")
    expect(resultado).toBeNull();
  });
  it("retorna mensagem de erro para e-mail sem @", () => {
    const resultado = isEmail("ana.senai.br");
    expect(resultado).toBe("E-mail inválido");
  });
});
