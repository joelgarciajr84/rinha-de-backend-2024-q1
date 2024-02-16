db = db.getSiblingDB('rinha');
db.createCollection('clientes');
db.createCollection('transacoes');

db.clientes.insertMany([
  {
    id: 1,
    limite: 100000,
    saldo: 0,
  },
  {
    id: 2,
    limite: 80000,
    saldo: 0,
  },
  {
    id: 3,
    limite: 1000000,
    saldo: 0,
  },
  {
    id: 4,
    limite: 10000000,
    saldo: 0,
  },
  {
    id: 5,
    limite: 500000,
    saldo: 0,
  },
]);

db.clientes.createIndex({ id: 1 });
db.transacoes.createIndex({ clienteid: 1, realizada_em: -1 });
