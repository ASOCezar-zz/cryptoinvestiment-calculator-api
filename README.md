# Backend Cryptocalc

Esse é o backend do serviço Cryptocalc desenvolvido durante o bootcamp fullstack da DIO em conjunto com a Eduzz.

# Stacks

A API foi desenvolvida utilizando NestJs com Typescript, TypeORM em conjunto com um banco de dados MySQL hospedado utilizando Docker (em ambiente de desenvolvimento) e Amazon RDS (em ambiente de produção) além do sistema de filas utilizando Redis para envio de emails com a plataforma SendGrid.

A parte de produção está em processo de upload para nuvem utilizando ECS e ECR da Amazon AWS.

# Conceito

O conceito da plataforma no geral é auxiliar o gerenciamento de investimento em criptomoedas.

# Endpoints

## Usuário
- GET(/users) **Essa é uma rota privada** busca o usuário que estiver logado na plataforma, retornando os dados desse usuário

- POST(/users/register) Cria um usuário no banco de dados ao receber no corpo da requisição os seguintes dados:
	- name
	- email
	- password
  - confirmPassword

- POST(/users/login) Permite fazer o login de um usuário já cadastrado na plataforma. Para fazer o login é necessário fornecer:
  - email
  - password

- POST(/users/change-password) **Essa é uma rota privada** permite que se faça a alteração da senha do usuário de maneira isolada sem a necessidade de enviar a senha antiga no corpo da requisição (para recuperação de senha através do email enviado). Para a alteração da senha é necessário enviar: 
  - password (nova senha a ser cadastrada)
  - confirmPassword (confirmação da nova senha a ser cadastrada)

- PATCH(/users/update) **Essa é uma rota privada** permite fazer o update de dados do usuário que está logado na plataforma. Para atualizar os dados é possível enviar no corpo da requisição:
  - name
  - email
  - **Alterar a senha** para alteração de senha é necessário que forneça:
		- oldPassword (senha atual cadastrada)
		- password (nova senha a ser cadastrada)
		- confirmPassword (confirmação da nova senha a ser cadastrada)

- DELETE(/users) **Essa é uma rota privada** permite a deleção da conta do usuário que está logado na plataforma 

## Investimento

- GET(/investiments) **Essa é uma rota privada** busca e retorna todos os investimentos ativos do usuário que está logado na plataforma

- GET(/investiments/:id) **Essa é uma rota privada** busca e retorna um investimento específico de um usuário. O endpoint apenas irá retornar o investimento se esse realmente pertence ao usuário logado, não sendo possível acessar os investimentos de outros usuários

- POST(/investiments/create) **Essa é uma rota privada** cria um investimento para o usuário que estiver logado. É possível criar um investimento enviando:
	- coin_id (1 - Bitcoin, 2 - Ethereum, 3 - Litecoin, 4 - Ripple, 5 - Binance Coin)
	- value (valor do investimento)

- PATCH(/investiments/update/:id) **Essa é uma rota privada** permite fazer alterações em um investimento cadastrado no banco de dados. Para fazer alterações é possível enviar:
  - value (valor do investimento)

- DELETE(/investiments/delete/:id) **Essa é uma rota privada** permite a deleção de um investimento do usuário. Somente é possível deletar os investimentos do próprio usuário. Obs.: o investimento não é excluído do banco de dados, mas sim inativado, o que significa que se mantém no banco mas não é mostrado no momento de busca de investimentos do usuário

## Coin

- GET(/coin) retorna todas as moedas cadastradas no banco de dados com seus valores

- POST(/coin) faz a atualização dos valores da moeda, se baseando em informações de outra API específica para valores de criptomoedas. Para melhor uso, indica-se que utilize uma atualização periódica dos valores para mostrar um valor mais atual

## Token

- POST(/token) faz a busca de um usuário de acordo com um token JWT enviado no corpo da requisição. Para fazer a busca deve-se enviar um campo:
  - hash

- PUT(/token/refresh) faz a atualização do token, permitindo serviços de refresh-token. Para fazer a atualização do token é necessário que se envie o último token fornecido, para evitar revalidação de tokens muito antigos. Deve-se enviar os campos:
  - oldToken

## Enviar email para recuperação de senha

- POST(/forgot-password) faz o envio do email de recuperação de senha para o email que for enviado no corpo da requisição. Caso o usuário não exista, o endpoint retornará um erro.

# Considerações de um dev

A ideia da API era facilitar a utilização do usuário para que este não tivesse que enviar o valor de momento da moeda em que ele investiu. Para isso utilizei do serviço provido por outra API que faz a atualização dos valores das moedas cadastradas no banco de dados. Sendo assim, por motivo de prototipagem, é necessário que se tenha cautela na quantidade de requisições para atualização, afim de não esgotar as requisições.

A aplicação disponibiliza 5 tipos de criptomoedas para cadastrar um investimento (Bitcoin, Ethereum, Litecoin, Ripple e Binance Coin). Essas são as principais criptomoedas atuais de acordo com o Estadão (https://einvestidor.estadao.com.br/criptomoedas/criptomoedas-conheca-principais-mercado-financeiro-2).


# Agradecimentos

Obrigado à galera da DIO e da própria Eduzz, por fornecer tanto material educativo de qualidade que permitiu que esse projeto fosse realizado.
