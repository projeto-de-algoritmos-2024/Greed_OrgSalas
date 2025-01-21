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
        this.horaInicio = 8;
        this.horaFim = 20;
    }

    getAulas() {
        return this.aulas;
    }

    validarHorario(horario) {
        const [horas, minutos] = horario.split(':').map(Number);
        return horas >= 0 && horas <= 23 && minutos >= 0 && minutos < 60;
    }

    formatarHorario(horas, minutos) {
        return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
    }

    horarioParaMinutos(horario) {
        const [horas, minutos] = horario.split(':').map(Number);
        return horas * 60 + minutos;
    }

    minutosParaHorario(minutos) {
        const horas = Math.floor(minutos / 60);
        const mins = minutos % 60;
        return `${horas.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    }

    temConflito(aula1, aula2) {
        const inicio1 = this.horarioParaMinutos(aula1.horarioInicio);
        const fim1 = this.horarioParaMinutos(aula1.horarioFim);
        const inicio2 = this.horarioParaMinutos(aula2.horarioInicio);
        const fim2 = this.horarioParaMinutos(aula2.horarioFim);

        return !(fim1 <= inicio2 || fim2 <= inicio1);
    }

    adicionarAula(novaAula) {
        if (!this.validarHorario(novaAula.horarioInicio) || !this.validarHorario(novaAula.horarioFim)) {
            return {
                sucesso: false,
                mensagem: "Horário inválido. As horas devem estar entre 00 e 23, e os minutos entre 00 e 59."
            };
        }

        const inicioAula = this.horarioParaMinutos(novaAula.horarioInicio);
        const fimAula = this.horarioParaMinutos(novaAula.horarioFim);
        const inicioPermitido = this.horaInicio * 60;
        const fimPermitido = this.horaFim * 60;

        if (inicioAula >= fimAula) {
            return {
                sucesso: false,
                mensagem: "O horário de início deve ser anterior ao horário de fim."
            };
        }

        if (inicioAula < inicioPermitido || fimAula > fimPermitido) {
            return {
                sucesso: false,
                mensagem: `As aulas devem estar entre ${this.horaInicio}:00 e ${this.horaFim}:00.`
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

    calcularPeriodoSala(aulasNaSala) {
        let minInicio = Math.min(...aulasNaSala.map(aula => this.horarioParaMinutos(aula.horarioInicio)));
        let maxFim = Math.max(...aulasNaSala.map(aula => this.horarioParaMinutos(aula.horarioFim)));
        
        minInicio = Math.max(this.horaInicio * 60, minInicio - 60);
        maxFim = Math.min(this.horaFim * 60, maxFim + 60);
        
        return {
            inicio: this.minutosParaHorario(minInicio),
            fim: this.minutosParaHorario(maxFim)
        };
    }
}

const sistemaAgendamento = new SistemaAgendamento();

const formularioAula = document.getElementById('formularioAula');
const mensagemAviso = document.getElementById('mensagemAviso');
const gradeHorarios = document.getElementById('gradeHorarios');

const startTimeHour = document.getElementById('startTimeHour');
const startTimeMinute = document.getElementById('startTimeMinute');
const endTimeHour = document.getElementById('endTimeHour');
const endTimeMinute = document.getElementById('endTimeMinute');

function validarInputNumerico(input, min, max) {
    let valor = parseInt(input.value);
    
    if (isNaN(valor)) {
        input.value = '';
        return false;
    }

    if (valor < min) {
        input.value = min;
        valor = min;
    } else if (valor > max) {
        input.value = max;
        valor = max;
    }

    input.value = valor.toString().padStart(2, '0');
    return true;
}

startTimeHour.addEventListener('input', () => validarInputNumerico(startTimeHour, 0, 23));
startTimeMinute.addEventListener('input', () => validarInputNumerico(startTimeMinute, 0, 59));
endTimeHour.addEventListener('input', () => validarInputNumerico(endTimeHour, 0, 23));
endTimeMinute.addEventListener('input', () => validarInputNumerico(endTimeMinute, 0, 59));

function criarMarcadoresHora(timeline, horaInicio, horaFim) {
    const inicioMinutos = sistemaAgendamento.horarioParaMinutos(horaInicio);
    const fimMinutos = sistemaAgendamento.horarioParaMinutos(horaFim);
    
    for (let minutos = inicioMinutos; minutos <= fimMinutos; minutos += 60) {
        const marcador = document.createElement('div');
        marcador.className = 'timeline-hora';
        marcador.textContent = sistemaAgendamento.minutosParaHorario(minutos);
        const porcentagem = ((minutos - inicioMinutos) / (fimMinutos - inicioMinutos)) * 100;
        marcador.style.left = `${porcentagem}%`;
        timeline.appendChild(marcador);
    }
}

function posicionarAulaNaTimeline(aula, timeline, periodoInicio, periodoFim) {
    const inicioPeriodoMinutos = sistemaAgendamento.horarioParaMinutos(periodoInicio);
    const fimPeriodoMinutos = sistemaAgendamento.horarioParaMinutos(periodoFim);
    const duracaoPeriodo = fimPeriodoMinutos - inicioPeriodoMinutos;

    const inicioAulaMinutos = sistemaAgendamento.horarioParaMinutos(aula.horarioInicio);
    const fimAulaMinutos = sistemaAgendamento.horarioParaMinutos(aula.horarioFim);
    
    const posicaoInicio = ((inicioAulaMinutos - inicioPeriodoMinutos) / duracaoPeriodo) * 100;
    const largura = ((fimAulaMinutos - inicioAulaMinutos) / duracaoPeriodo) * 100;
    
    const aulaElement = document.createElement('div');
    aulaElement.className = 'timeline-item';
    aulaElement.textContent = aula.nome;
    aulaElement.style.left = `${posicaoInicio}%`;
    aulaElement.style.width = `${largura}%`;
    aulaElement.title = `${aula.nome}\n${aula.horarioInicio} - ${aula.horarioFim}`;
    
    timeline.appendChild(aulaElement);
}

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

        const timeline = document.createElement('div');
        timeline.className = 'timeline';
        
        const aulasNaSala = aulasPorSala[numeroSala];
        const periodo = sistemaAgendamento.calcularPeriodoSala(aulasNaSala);
        
        criarMarcadoresHora(timeline, periodo.inicio, periodo.fim);
        
        aulasNaSala.forEach(aula => {
            posicionarAulaNaTimeline(aula, timeline, periodo.inicio, periodo.fim);
        });

        cardSala.appendChild(timeline);
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

    const horaInicio = parseInt(startTimeHour.value);
    const minutoInicio = parseInt(startTimeMinute.value);
    const horaFim = parseInt(endTimeHour.value);
    const minutoFim = parseInt(endTimeMinute.value);

    if (isNaN(horaInicio) || isNaN(minutoInicio) || isNaN(horaFim) || isNaN(minutoFim)) {
        exibirMensagem("Por favor, preencha todos os campos de horário corretamente.", false);
        return;
    }

    const horarioInicio = sistemaAgendamento.formatarHorario(horaInicio, minutoInicio);
    const horarioFim = sistemaAgendamento.formatarHorario(horaFim, minutoFim);

    const novaAula = new Aula(nomeAula, horarioInicio, horarioFim);
    const resultado = sistemaAgendamento.adicionarAula(novaAula);

    exibirMensagem(resultado.mensagem, resultado.sucesso);
    if (resultado.sucesso) {
        atualizarGrade();
        formularioAula.reset();
    }
});
