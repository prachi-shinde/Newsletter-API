const express =  require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https"); 
const { ADDRCONFIG } = require("dns");

const app = express();

app.use(express.static("public"));  //Because ur using this, put src attributes in the html files relative to this "public" folder (as if they are inside it)
app.use(bodyParser.urlencoded({extended : true}));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});


app.post("/", function(req,res){
    
    const fname = req.body.fname;
    const lname = req.body.lname;
    const email = req.body.email;

    var data = {
        members : [
            {
                email_address : email,
                status : "subscribed",
                merge_fields : {
                    FNAME : fname,
                    LNAME : lname
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data);

    const url = "https://us14.api.mailchimp.com/3.0/lists/4a3e9f5285";

    const options  = {
        method : "POST",
        auth : "Prachi:3e1759c9f3920f4d10763d2b73c31c4b-us14"
    }

    const request = https.request(url, options, function(response){
        if(response.statusCode===200)
        res.sendFile(__dirname+"/success.html");
        else
        res.sendFile(__dirname+"/failure.html");
    
        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    });

    request.write(jsonData);
    request.end();

});

app.listen(process.env.PORT || 3000, function(){
    console.log("Server running on port 3000.");
});



//3e1759c9f3920f4d10763d2b73c31c4b-us14      API Key
//4a3e9f5285                                unique ID/ List ID
