
# Greed_OrgSalas
**Número da Lista**: 34<br>
**Conteúdo da Disciplina**: Algoritmos Ambiciosos<br>

## Alunos
|Matrícula | Aluno |
| -- | -- |
| 200059947  | Pedro Henrique Muniz de Oliveira |
| 211030827  |  Leandro de Almeida Oliveira |

## Sobre 
O projeto tem como objetivo criar um sistema de agendamento de aulas que organiza os horários de forma eficiente, evitando conflitos e otimizando a alocação de salas. Os usuários podem cadastrar aulas informando nome, horário de início e términos. Após o cadastro, as aulas são alocadas automaticamente em diferentes salas, conforme necessário, e exibidas em uma grade horária visual com marcadores de tempo e representações gráficas das aulas.

## Screenshots
![print1](/assets/PAimg1.jpeg)

![print2](/assets/PAimg2.jpeg)

![print3](/assets/PAimg3.jpeg)

## Vídeo da Apresentação

<a href="https://youtu.be/mSHKq-c2PlY?si=0cIshLO4qkXoRjY1" target="_blank" rel="noopener noreferrer">Assista ao Vídeo da Apresentação</a>

## Instalação 
**Linguagem**: JavaScript<br>

**Pré-requisitos**:
Um navegador web 
Não é necessário instalar nenhuma dependência adicional, pois o projeto usa JavaScript vanilla

**Como executar**:
Você pode usar qualquer servidor HTTP simples. Por exemplo, com Python:
Code
CopyInsert
python -m http.server 8000
Ou usando o Node.js com um pacote como http-server:
Code
CopyInsert
npx http-server
Depois acesse http://localhost:8000 no seu navegador


## Uso 
1. Adicionar uma Nova Aula:
No formulário "Adicionar Nova Aula", preencha:
Nome da Aula (ex: "Matemática", "Português", etc)
Horário de Início (formato HH:MM)
Horário de Fim (formato HH:MM)
Clique no botão "Adicionar Aula"
2. Visualização das Aulas:
As aulas adicionadas serão automaticamente organizadas em salas
cada sala é representada como uma coluna na grade horária
o sistema usa um algoritmo ambicioso (greedy) para alocar as aulas da forma mais eficiente possível
as aulas são exibidas como blocos coloridos na grade, mostrando:
nome da aula
horário de início e fim
sala alocada
3. Gerenciamento de Conflitos:
O sistema automaticamente aloca as aulas em diferentes salas quando há sobreposição de horários
se houver conflitos que não podem ser resolvidos, uma mensagem de aviso será exibida
4. Visualização da Grade:
A grade horária mostra todas as aulas organizadas por sala
é possível visualizar facilmente a distribuição das aulas ao longo do dia
as salas são criadas dinamicamente conforme necessário
## Outros 
O deploy do projeto também foi feito no gitpages e está disponível pelo link: https://projeto-de-algoritmos-2024.github.io/Greed_OrgSalas/




