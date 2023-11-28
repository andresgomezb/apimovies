//Llamamos express
const express = require('express');

const fs = require('fs');
//iniciamos express
const app = express();

//middleware

app.use(express.json());
app.use(express.urlencoded({ extended: false}));

app.listen(3000, () =>  {
    console.log('Estoy escuchando por el puerto 3000');
});

//metodo GET
app.get('/',function(request, response){
    response.send('holi');
});

app.get('/movies', (req, res) => {
    fs.readFile('movies.json', (error, file) => {
        if(error) {
            console.log('No se puede leer el archivo', error);
            return;
        }

    const movies = JSON.parse(file);
    return res.json(movies);
    });    
});

    //metodo POST

    app.post('/movies',(req, res) => {

        fs.readFile('movies.json',(err,data) => {

            if(err) {
                console.log("Error, no se puede encontrar el archivo", err);
            }
            const movies = JSON.parse(data);

            const newMovieID = movies.length +1;
            
            req.body.id = newMovieID;

            movies.push(req.body);

            //El array de movies tiene una nueva pelicula
            const newMovie = JSON.stringify(movies,null,2);

            fs.writeFile('movies.json',newMovie, (err) => {
                if (err) {
                console.log("Ha ocurrido un error a escrinir en el archivo", err);
            }
            
            return res.status(200).send("new movie added");            
        })
    })

});

//metodo PATCH

app.patch('/movie/:id', (req, res) => {

    const mid = req.params.id; //rescatamos el ID del endpoint
    const { name,year } = req.body; //rescatamos todos

    fs.readFile('movies.json', (err,data) => {

        if (err) {
            console.log("Ha ocurrido un error al leer el fichero",err);
        }

        const movies = JSON.parse(data); //rescato las pelis

        movies.forEach(movie => {
           
            if(movie.id === Number(mid)){

                if(name != undefined) { //si name tiene valor undefined
                    movie.name = name;
                }

                if (year != undefined) {
                    movie.year = year;
                }
                //Tengo mi peli actualizada en el array movies 
                const movieUpdated = JSON.stringify(movies,null,2);

                fs.writeFile('movies.json',movieUpdated,(err) => {
                    if(err) {
                        console.log("Ha ocurrido un error al escribir el fichero",err);
                    
                    }
                    return res.status(200).json({message: "Movie updated"})
                })
            }
        });
    })

})

//metodo DELETE

app.delete('/movie/:id', (req, res) => {

    const mid = req.params.id;

    fs.readFile('movies.json', (err,data) => {
        if (err) {
            console.log("Ha ocurrido un error al escribir el fichero",err);
        }

        const movies = JSON.parse(data);
        movies.forEach(movie => {
            if (movie.id === Number(mid)) {

                movies.splice(movies.indexOf(movie),1);

                const movieDeleted = JSON.stringify(movies,null,2)

                fs.writeFile('movies.json', movieDeleted, (err) => {
                    if(err){
                        console.log("Ha ocurrido un error al escribir el fichero",err);                    
                    }
                    return res.status(200).json({message: "Movie deleted"})
                })
            }
        })
    })
})