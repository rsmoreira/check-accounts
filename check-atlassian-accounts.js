var http = require('http');
var fs = require('fs');
var q = require('q');

var matriculas_mongodb_file_name = './files/matriculas_mongodb.txt';
var matriculas_final_file_name = './files/matriculas_final.txt';

var matriculas_novas_file_name = './files/matriculas_outubro_2017.txt';


console.log(matriculas_mongodb_file_name);
console.log(matriculas_novas_file_name);

var matriculasMongo = [];
var matriculasNovas = [];

// estao na base mas nao estao no novo arquivo
var matriculasRemovidas = []; 
// estao no novo arquivo mas nao estao no arquivo da base
var matriculasAdicionadas = [];

var matriculasFinal = [];

function loadData(file) {
    var deferred = q.defer();

    fs.readFile(file, 'utf8', function (err,data) {
        if (err || !data || data === undefined) {
          return deferred.reject(`ERRO ao ler o arquivo ${file} de matriculas. Não esqueça de colocar o arquivo dentro da pasta files. `);
        }
        
        var array = data.toString().split("\n");
        
        return deferred.resolve(array);
    });

    return deferred.promise;

}


function compararMatriculas() {
    var deferred = q.defer();

    loadData(matriculas_mongodb_file_name)
        .then(function (results) {
            matriculasMongo = results;
            return loadData(matriculas_novas_file_name); 
        }).then(function(results) {
            matriculasNovas = results;
            
            matriculasMongo.forEach(function(element) {
                if (!element || element === undefined || element === '') return;

                if (matriculasNovas.indexOf(element) === -1) {
                    matriculasRemovidas.push(parseInt(element));
                }
                // por hora, mesmo uma matricula removida será mantida no arquivo final
                if (matriculasFinal.indexOf(parseInt(element))  === -1) {
                    matriculasFinal.push(parseInt(element));
                }
            });
            
            matriculasNovas.forEach(function(element) {
                if (!element || element === undefined || element === '') return;

                if (matriculasMongo.indexOf(element)  === -1) {
                    matriculasAdicionadas.push(parseInt(element));
                }
                if (matriculasFinal.indexOf(parseInt(element)) === -1) {
                    matriculasFinal.push(parseInt(element));
                }
            });

            // console.log("----------------");
            // console.log("matriculasMongo");
            // console.log(matriculasMongo);
            // console.log("----------------");
            // console.log("matriculasNovas");
            // console.log(matriculasNovas);
            console.log("----------------");
            console.log("Matriculas Final");
            console.log(matriculasFinal);

            console.log("----------------");
            console.log("Matriculas Adicionadas");
            console.log(matriculasAdicionadas);

            // console.log("----------------");
            // console.log("matriculasRemovidas");
            // console.log(matriculasRemovidas);

            fs.writeFile(matriculas_final_file_name, matriculasFinal, function(err) {
                if (err) {
                    return console.log(err);
                }

                console.log('Arquivo salvo com sucesso.');
            });


        });
}


compararMatriculas();



