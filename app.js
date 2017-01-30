'use strict';

var express    = require('express');
var logger     = require('morgan');
var path       = require('path');
var lineReader = require('readline-promise');
var bodyParser = require('body-parser');
var app        = express();

app.use(logger('dev'));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;

var DATA_DIR   = path.join(__dirname, 'data');
var fs         = require("fs");
var collisions = fs.readFileSync(DATA_DIR + "/collisions");


/**
 * [POST] /collision
 * Rota que recebe a colisão do front-end e insere 
 * no arquivo de colisões.
 */
app.post('/collision', function(req, res) {
    let nodeX = req.body.nodeX;
    let nodeY = req.body.nodeY;

    fs.appendFile(DATA_DIR + "/collisions", `\n${nodeX} ${nodeY}`,  err => {});    
    res.send("Colisão cadastrada com sucesso!");
});

/**
 * [POST] /search-collision
 * Rota que recebe dois nós e verifica se pertencem
 * à mesma rede de colisões.
 */
app.post('/search-collision', function(req, res) {
    let nodeX = req.body.nodeX;
    let nodeY = req.body.nodeY;

    let networks = [];
     
    lineReader.createInterface({
        input: fs.createReadStream(DATA_DIR + "/collisions")
    })
    .each( line => {
        let nodes = line.split(" ").map(function(node){
            return parseInt(node);
        });
        
        let new_network = false;
        let aux_network = [];

        networks = networks.filter( network => {
            // verifica se algum dos nós existe na rede atual            
            if (findOne(network, nodes)) {
                new_network = true;             
                aux_network = uniq(aux_network.concat(network).concat(nodes));
                return false
            } else {
                return true;
            }
        });

        // se encontrou mais de um array com os nós selecionados,
        // insere o grupo inteiro na rede
        if (aux_network.length > 0)
            networks.push(aux_network);

        // se não encontrou nenhuma rede, cria uma nova
        if (!new_network)
            networks.push(nodes);
    })
    .then( count => {
        var collision_network = networks.filter(network => {
            if (network.indexOf(parseInt(nodeX)) >= 0 && network.indexOf(parseInt(nodeY)) >= 0)
                return true;
        });

        var response = (collision_network.length > 0) ? collision_network : false;
        res.send(JSON.stringify({"network": response})) 
    })
    .caught( err => { throw err } );
});


/**
 * [GET] /collisions
 * Retorna os valores listadas no arquivo
 * de colisões
 */
app.get('/collisions', function(req, res) {
  res.setHeader('Content-type', 'text/plain');
  res.send(collisions);
});


/**
 * [GET] /networks
 * Rota que retorna as redes de colisões existentes
 * 
 */
app.get('/networks', function(req, res) {
    res.setHeader('Content-type', 'application/json');
    
    let networks = [];
     
    lineReader.createInterface({
        input: fs.createReadStream(DATA_DIR + "/collisions")
    })
    .each( line => {
        let nodes = line.split(" ").map(function(node){
            return parseInt(node);
        });
        
        let new_network = false;
        let aux_network = [];

        networks = networks.filter( network => {
            // verifica se algum dos nós existe na rede atual            
            if (findOne(network, nodes)) {
                new_network = true;          
                aux_network = uniq(aux_network.concat(network).concat(nodes));
                return false
            } else {
                return true;
            }
        });

        // se encontrou mais de um array com os nós selecionados,
        // insere o grupo inteiro na rede
        if (aux_network.length > 0)
            networks.push(aux_network);

        // se não encontrou nenhuma rede, cria uma nova
        if (!new_network)
            networks.push(nodes);
    })
    .then( count => res.send(JSON.stringify({"networks": networks.sort()})) )
    .caught( err => { throw err } );

});

app.use((req, res) => {
  res.sendfile(__dirname + '/public/index.html');
});



/**
 * @description método que retorna se um array contém um ou mais itens de outro array
 * @param {array} arr_search Array onde faremos a busca
 * @param {array} arr_provider Array que armazenará os itens para buscarmos no arr_search
 * @return {boolean} true|false Se arr_search contém pelo menos um item do arr_provider
 */
var findOne = (arr_search, arr_provider) => {
    return arr_provider.some( v => arr_search.indexOf(v) >= 0 )
}

/**
 * @description método gera um array sem valores duplicados utilizando Set
 * @param {array} a Array contendo os itens duplicados
 * @return {array}
 */
var uniq = a => [...new Set(a)];