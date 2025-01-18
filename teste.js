class Aula {
    constructor(nome, horarioInicio, horarioFim) {
        this.nome = nome;
        this.horarioInicio = horarioInicio;
        this.horarioFim = horarioFim;
        this.sala = null;
    }
}

const testeAula = new Aula("Matemática", "10:00", "12:00");
console.log(testeAula);