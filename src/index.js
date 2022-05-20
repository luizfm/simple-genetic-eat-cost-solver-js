const restaurante = [
  { nome: "Batata A", slug: "Batata", tempoPreparo: 20, custo: 4.5 },
  { nome: "Salada A", slug: "Salada", tempoPreparo: 7, custo: 2.15 },
  { nome: "Salada B", slug: "Salada", tempoPreparo: 6, custo: 2.65 },
  { nome: "Batata B", slug: "Batata", tempoPreparo: 15, custo: 4.1 },
  { nome: "Salada C", slug: "Salada", tempoPreparo: 9, custo: 2.1 },
  { nome: "Salada D", slug: "Salada", tempoPreparo: 3, custo: 4.65 },
  { nome: "Brocolis A", slug: "Brocolis", tempoPreparo: 8, custo: 4.2 },
  { nome: "Brocolis B", slug: "Brocolis", tempoPreparo: 7, custo: 5.2 },
  { nome: "Brocolis C", slug: "Brocolis", tempoPreparo: 4, custo: 8.2 },
  { nome: "Brocolis D", slug: "Brocolis", tempoPreparo: 3, custo: 9.1 },
  { nome: "Cenoura A", slug: "Cenoura", tempoPreparo: 2, custo: 9.15 },
  { nome: "Cenoura B", slug: "Cenoura", tempoPreparo: 5, custo: 7.1 },
];

const batatas = restaurante.filter((alimento) => alimento.slug === "Batata");
const tamanhoListaBatatas = batatas.length;

const brocolises = restaurante.filter(
  (alimento) => alimento.slug === "Brocolis"
);
const tamanhoListaBrocolisis = brocolises.length;

const saladas = restaurante.filter((alimento) => alimento.slug === "Salada");
const tamanhoListSaladas = saladas.length;

const cenouras = restaurante.filter((alimento) => alimento.slug === "Cenoura");
const tamanhoListaCenouras = cenouras.length;

const createRandomNumber = (max) => {
  return Math.floor(Math.random() * max);
};

const funcaoCusto = (tempoTotalPreparo, custoTotalPreparo) => {
  return tempoTotalPreparo * custoTotalPreparo;
};

const mutation = (solucao) => {
  const umaBatata = createRandomNumber(tamanhoListaBatatas);
  const umBrocolis = createRandomNumber(tamanhoListaBrocolisis);
  const umaSalada = createRandomNumber(tamanhoListSaladas);
  const umaCenoura = createRandomNumber(tamanhoListaCenouras);

  const possiveisAlteracoes = [
    { ...batatas[umaBatata] },
    { ...brocolises[umBrocolis] },
    { ...saladas[umaSalada] },
    { ...cenouras[umaCenoura] },
  ];
  const pegarUmAlimentoQualquer = createRandomNumber(
    possiveisAlteracoes.length
  );
  const itemASeralterado = possiveisAlteracoes[pegarUmAlimentoQualquer];

  const mutante = {
    ...solucao,
    alimentos: {
      ...solucao.alimentos,
      [itemASeralterado.slug]: itemASeralterado,
    },
    fitness:
      solucao.fitness -
      solucao.alimentos[itemASeralterado.slug].custo +
      itemASeralterado.custo,
  };

  return mutante;
};

const createRandomSolution = () => {
  const umaBatata = createRandomNumber(tamanhoListaBatatas);
  const umBrocolis = createRandomNumber(tamanhoListaBrocolisis);
  const umaSalada = createRandomNumber(tamanhoListSaladas);
  const umaCenoura = createRandomNumber(tamanhoListaCenouras);

  const tempoTotalPreparo =
    batatas[umaBatata].tempoPreparo *
    brocolises[umBrocolis].tempoPreparo *
    saladas[umaSalada].tempoPreparo *
    cenouras[umaCenoura].tempoPreparo;

  const custoTotalPreparo =
    batatas[umaBatata].custo *
    brocolises[umBrocolis].custo *
    saladas[umaSalada].custo *
    cenouras[umaCenoura].custo;

  return {
    alimentos: {
      Batata: { ...batatas[umaBatata] },
      Brocolis: { ...brocolises[umBrocolis] },
      Salada: { ...saladas[umaSalada] },
      Cenoura: { ...cenouras[umaCenoura] },
    },
    fitness: funcaoCusto(tempoTotalPreparo, custoTotalPreparo),
  };
};

class EatTimeCostSolver {
  constructor() {
    this.populationSize = 50;
    this.mutationProbability = 0.2;
    this.elitism = 0.1;
    this.generationNumbers = 120;
  }

  execute() {
    let population = [];
    let currentGeneration = 0;

    for (let i = 0; i < this.populationSize; i++) {
      population.push(createRandomSolution());
    }

    const elitismNumber = this.elitism * this.populationSize;

    for (let i = 0; i < this.generationNumbers; i++) {
      currentGeneration++;
      population.sort((a, b) => {
        return a.fitness - b.fitness;
      });

      population = population.slice(0, elitismNumber);
      while (population.length < this.populationSize) {
        const m = Math.floor(Math.random() * elitismNumber);
        population.push(mutation(population[m]));
      }
    }

    population.sort((a, b) => {
      return a.fitness - b.fitness;
    });

    return {
      solucao: population[0].alimentos,
      cost: population[0].fitness,
      currentGeneration,
    };
  }
}

const AGEatCost = new EatTimeCostSolver();
console.log(AGEatCost.execute());
