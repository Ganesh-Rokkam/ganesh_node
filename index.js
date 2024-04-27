const http = require("http");
const fs = require("fs");
const path = require("path");

const { MongoClient } = require("mongodb");

const PORT = 4121;

async function getFitnessData(client ){
    const cursor = client.db("FitnessGuide").collection("ExercisesPerformed").find({});
    const results = await cursor.toArray();
    //console.log(results);'
    const js= (JSON.stringify(results));
    console.log(js);
    return js;
};

http.createServer(async (req, res) => {
    console.log(req.url);
    if (req.url === "/api") {

        const url = "mongodb+srv://rokkam:admin@cluster0.mbrb02m.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
        const client = new MongoClient(url);
        try {
            // Connect to the MongoDB cluster
            await client.connect();
            console.log(" connection happened here");
            const fitnessData = await getFitnessData(client);
            console.log(fitnessData);
            res.setHeader("Access-Control-Allow-Origin",'*');
            res.writeHead(200,{"content-type":"application/json"});
            res.end(fitnessData);

        } catch (e) {
            console.error(e);
        } finally {
            await client.close();
            console.log("We closed the connection ")
        }
    }
    else if (req.url === "/") {
        fs.readFile(path.join(__dirname,"index.html"),(error,content)=>{
            if(error){
                console.log("This file can't be read");
            }
            else{
                const extname = path.extname(path.join(__dirname,"index.html"));
            let contentType = 'text/html';
            if (extname === '.js') {
                contentType = 'text/javascript';
            } else if (extname === '.css') {
                contentType = 'text/css';
            } else if (extname === '.png') {
                contentType = 'image/png';
            } else if (extname === '.jpg' || extname === '.jpeg') {
                contentType = 'image/jpeg';
            }

                res.writeHead(200,{"content-type":"text/html"});
                res.end(content);
            }
            
        })
    }

    // else{

    // }
    else {
        res.writeHead(404,{"content-type":"text/html"});
                res.end("<h1> 404 PAGE NOT FOUND----Try to give /api</H1>"
                );}


}).listen(PORT, () => console.log(`server is running on ${PORT}`));