# SafeCard

Carteira digital de cartões de fidelidade. Em vez de carregar os cartõezinhos da
farmácia, do supermercado e da academia, você escaneia o código de barras de cada um
uma vez e o aplicativo guarda todos. Na hora de usar, é só abrir o cartão e mostrar o
código na tela para o caixa ler.

Desenvolvido em React Native (Expo) com Firebase.

## Funcionalidades

- **Conta própria**: cadastro e login por e-mail e senha, com Firebase Authentication
- **Cadastro de cartão**: leitura do código de barras pela câmera, ou digitação do
  número quando o código estiver apagado
- **Lista de cartões**, atualizada em tempo real: ao adicionar ou excluir um cartão em
  outro aparelho, a lista muda sozinha
- **Busca** por nome ou por número do cartão
- **Exibição do código de barras** na tela, gerado no formato CODE128, para o leitor do
  caixa
- **Exclusão** de cartão, com confirmação
- Cada usuário só enxerga os próprios cartões

## Tecnologias

| Recurso | Tecnologia |
|---|---|
| App | React Native 0.71 com Expo 48 |
| Linguagem | JavaScript |
| Autenticação | Firebase Authentication |
| Banco de dados | Cloud Firestore |
| Leitor de código | expo-barcode-scanner |
| Geração do código | react-native-barcode-svg |
| Navegação | React Navigation (stack e bottom tabs) |

## Estrutura do banco de dados

Uma coleção, `cards`, com um documento por cartão:

| Campo | O que guarda |
|---|---|
| `userId` | dono do cartão (uid do Firebase Authentication) |
| `nome` | nome dado ao cartão, ex.: "Farmácia" |
| `codigo` | número lido do código de barras ou digitado |
| `tipoCodigo` | formato lido pela câmera, ou `manual` |
| `criadoEm` | data do cadastro |

## Como executar

```bash
npm install
npx expo start
```

Depois é só ler o QR Code com o aplicativo Expo Go no celular. O leitor de código de
barras precisa de um aparelho físico, no emulador não funciona.

## Configurando o Firebase

O arquivo `config.js` vem com as credenciais em branco. Para rodar:

1. Crie um projeto no [console do Firebase](https://console.firebase.google.com)
2. Em **Authentication**, ative o método **E-mail/senha**
3. Em **Firestore Database**, crie o banco
4. Copie as credenciais do projeto (Configurações → Seus aplicativos → Web) e cole em
   `config.js`
5. Nas regras do Firestore, deixe cada usuário acessar apenas os próprios cartões:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /cards/{cardId} {
      allow read, delete: if request.auth != null
        && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null
        && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## Estrutura do projeto

```
App.js                          navegação principal
config.js                       conexão com o Firebase
components/
  BottomTabNavigator.js         abas Meus cartões e Adicionar
screens/
  Login.js                      entrar na conta
  SignUp.js                     criar conta
  CardList.js                   lista e busca de cartões
  AddCard.js                    cadastro com leitura do código de barras
  CardDetail.js                 exibe o código de barras e exclui o cartão
```

## Autor

Carlos Eduardo Ferreira Viana —
[GitHub](https://github.com/NAITBEAbr) ·
[LinkedIn](https://www.linkedin.com/in/carlos-eduardo-ferreira-viana-61b119328)
