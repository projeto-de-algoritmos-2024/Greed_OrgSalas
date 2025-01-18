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
                mensagem: "O horario de inicio deve ser anterior ao horario de fim"
            };
        }
    
        let salaAlocada = false;
        for (let i = 0; i < this.salas.length; i++) {
            let podeAlocar = true;
    
            for (const aula of this.salas[i]) {
                if (this.temConflito(novaAula, aula)) {
                    podeAlocar = false;
                    break;
                }
            }
    
            if (podeAlocar) {
                this.salas[i].push(novaAula);
                salaAlocada = true;
                break;
            }
        }
    
        if (!salaAlocada) {
            this.salas.push([novaAula]);
        }
    
        this.aulas.push(novaAula);
        return {
            sucesso: true,
            mensagem: Aula adicionnada com sucesso na sala ${this.salas.length}
        };
    } 
}

module.exports = SistemaAgendamento;

const sistema = new SistemaAgendamento();
const resultado = sistema.adicionarAula({ nome: "Matemática", horarioInicio: "10:00", horarioFim: "12:00" });
console.log(resultado); 
console.log(sistema.aulas); 


