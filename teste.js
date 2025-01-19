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

module.exports = SistemaAgendamento;

const sistema = new SistemaAgendamento();
const resultado1 = sistema.adicionarAula({ nome: "Matematica", horarioInicio: "10:00", horarioFim: "12:00" });
console.log(resultado1);
const resultado2 = sistema.adicionarAula({ nome: "Fisica", horarioInicio: "11:00", horarioFim: "13:00" });
console.log(resultado2);
const resultado3 = sistema.adicionarAula({ nome: "Quimica", horarioInicio: "12:00", horarioFim: "14:00" });
console.log(resultado3);

console.log("Salas:", sistema.salas);
