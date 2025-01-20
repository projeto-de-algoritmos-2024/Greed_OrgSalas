class Aula {
    constructor(nome, horarioInicio, horarioFim) {
        this.nome = nome;
        this.horarioInicio = horarioInicio;
        this.horarioFim = horarioFim;
        this.sala = null;
    }
}

class SistemaAgendamento {
    constructor() {
        this.aulas = [];
        this.salas = [];
    }

    getAulas() {
        return this.aulas;
    }

    horarioParaMinutos(horario) {
        const [horas, minutos] = horario.split(':').map(Number);
        return horas * 60 + minutos;
    }

    temConflito(aula1, aula2) {
        const inicio1 = this.horarioParaMinutos(aula1.horarioInicio);
        const fim1 = this.horarioParaMinutos(aula1.horarioFim);
        const inicio2 = this.horarioParaMinutos(aula2.horarioInicio);
        const fim2 = this.horarioParaMinutos(aula2.horarioFim);

        return !(fim1 <= inicio2 || fim2 <= inicio1);
    }

    adicionarAula(novaAula) {
        if (this.horarioParaMinutos(novaAula.horarioInicio) >= this.horarioParaMinutos(novaAula.horarioFim)) {
            return {
                sucesso: false,
                mensagem: "O horário de início deve ser anterior ao horário de fim."
            };
        }

        this.aulas.push(novaAula);

        this.aulas.sort((a, b) => this.horarioParaMinutos(a.horarioInicio) - this.horarioParaMinutos(b.horarioInicio));

        this.salas = [];
        this.aulas.forEach(aula => aula.sala = null);

        for (const aula of this.aulas) {
            let salaAlocada = false;

            for (let i = 0; i < this.salas.length; i++) {
                const ultimaAulaDaSala = this.salas[i][this.salas[i].length - 1];
                
                if (!this.temConflito(ultimaAulaDaSala, aula)) {
                    this.salas[i].push(aula);
                    aula.sala = i;
                    salaAlocada = true;
                    break;
                }
            }

            if (!salaAlocada) {
                aula.sala = this.salas.length;
                this.salas.push([aula]);
            }
        }

        return {
            sucesso: true,
            mensagem: `Aula adicionada com sucesso. Total de salas usadas: ${this.salas.length}`
        };
    }
}

const sistemaAgendamento = new SistemaAgendamento();

const formularioAula = document.getElementById('formularioAula');
const mensagemAviso = document.getElementById('mensagemAviso');
const gradeHorarios = document.getElementById('gradeHorarios');

function atualizarGrade() {
    gradeHorarios.innerHTML = '';
    const aulas = sistemaAgendamento.getAulas();
    
    const aulasPorSala = {};
    aulas.forEach(aula => {
        if (!aulasPorSala[aula.sala]) {
            aulasPorSala[aula.sala] = [];
        }
        aulasPorSala[aula.sala].push(aula);
    });

    Object.keys(aulasPorSala).forEach(numeroSala => {
        const cardSala = document.createElement('div');
        cardSala.className = 'card-sala';

        const cabecalhoSala = document.createElement('div');
        cabecalhoSala.className = 'cabecalho-sala';
        cabecalhoSala.innerHTML = `
            <div class="titulo-sala">Sala ${parseInt(numeroSala) + 1}</div>
        `;
        
        cardSala.appendChild(cabecalhoSala);

        const aulasNaSala = aulasPorSala[numeroSala];
        aulasNaSala.forEach(aula => {
            const divAula = document.createElement('div');
            divAula.className = 'item-aula';
            divAula.innerHTML = `
                <div class="nome-aula">${aula.nome}</div>
                <div class="horario-aula">${aula.horarioInicio} - ${aula.horarioFim}</div>
            `;
            cardSala.appendChild(divAula);
        });

        gradeHorarios.appendChild(cardSala);
    });

    if (Object.keys(aulasPorSala).length === 0) {
        const mensagemVazia = document.createElement('div');
        mensagemVazia.className = 'sala-vazia';
        mensagemVazia.textContent = 'Nenhuma aula agendada';
        gradeHorarios.appendChild(mensagemVazia);
    }
}

function exibirMensagem(mensagem, sucesso) {
    mensagemAviso.textContent = mensagem;
    mensagemAviso.className = 'aviso ' + (sucesso ? 'sucesso' : 'erro');
    setTimeout(() => {
        mensagemAviso.className = 'aviso';
    }, 3000);
}

formularioAula.addEventListener('submit', (e) => {
    e.preventDefault();

    const nomeAula = document.getElementById('className').value;
    const horarioInicio = document.getElementById('startTime').value;
    const horarioFim = document.getElementById('endTime').value;

    const novaAula = new Aula(nomeAula, horarioInicio, horarioFim);
    const resultado = sistemaAgendamento.adicionarAula(novaAula);

    exibirMensagem(resultado.mensagem, resultado.sucesso);
    if (resultado.sucesso) {
        atualizarGrade();
        formularioAula.reset();
    }
});
