# Dashboard do servidor

Painel responsivo em HTML, CSS e JavaScript, pronto para publicação no GitHub Pages.

## Publicar no GitHub Pages

1. Crie um repositório público no GitHub.
2. Envie `index.html`, `styles.css` e `script.js` para a raiz do repositório.
3. O workflow em `.github/workflows/pages.yml` fará o deploy automaticamente.
4. No GitHub, acesse **Settings > Pages** e selecione **GitHub Actions** como fonte.
5. Depois da execução do workflow, o site ficará disponível em:

```text
https://SEU_USUARIO.github.io/NOME_DO_REPOSITORIO/
```

O arquivo `servidor-dashboard.ps1` serve apenas para testes na rede local e não é necessário no GitHub Pages.
