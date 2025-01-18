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
}

module.exports = SistemaAgendamento;

const sistema = new SistemaAgendamento();
console.log(sistema.horarioParaMinutos("10:30"));

const aula1 = { horarioInicio: "10:00", horarioFim: "12:00" };
const aula2 = { horarioInicio: "11:00", horarioFim: "13:00" };
console.log(sistema.temConflito(aula1, aula2)); 