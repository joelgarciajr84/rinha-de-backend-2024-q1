db = db.getSiblingDB('rinha');

db.createCollection('clientes');
db.createCollection('transacoes');

db.clientes.insertMany([
    {
        "id": 1,
        "nome": "Luke Skywalker",
        "limite": 100000,
        "saldo": 0
  
    },
    {
        "id": 2,
        "nome": "Princess Leia",
        "limite": 80000,
        "saldo": 0
    },
    {
        "id": 3,
        "nome": "Darth Vader",
        "limite": 1000000,
        "saldo": 0
    },
    {
        "id": 4,
        "nome": "Han Solo",
        "limite": 10000000,
        "saldo": 0
    },
    {
        "id": 5,
        "nome": "Chewbacca",
        "limite": 500000,
        "saldo": 0
    }
  ]);