
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
                mensagem: "O horario de inicio deve ser anterior ao horario de fim."
            };
        }

        this.aulas.push(novaAula);

        this.aulas.sort((a, b) => this.horarioParaMinutos(a.horarioInicio) - this.horarioParaMinutos(b.horarioInicio));

        this.salas = [];

        for (const aula of this.aulas) {
            let salaAlocada = false;

            for (let i = 0; i < this.salas.length; i++) {
                const ultimaAulaDaSala = this.salas[i][this.salas[i].length - 1];

                if (!this.temConflito(ultimaAulaDaSala, aula)) {
                    this.salas[i].push(aula);
                    salaAlocada = true;
                    break;
                }
            }

            if (!salaAlocada) {
                this.salas.push([aula]);
            }
        }

        return {
            sucesso: true,
            mensagem: `Aula adicionada com sucesso. Total de salas usadas: ${this.salas.length}`
        };
    }
}

const SistemaAgendamento = new SistemaAgendamento();

const formularioAula = document.getElementById('formularioAula');
const alertMessage = document.getElementById('mensagemAviso');
const gradeHorarios = document.getElementById('gradeHorarios');

function atualizarGrade() {
    gradeHorarios.innerHTML = '';
    const aulas = SistemaAgendamento.getAulas();
    
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
