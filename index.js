const { randomUUID } = require("crypto");
const express = require("express");
const methodOverride = require("method-override");
const app = express();
const path = require("path"); 
const port = 3000;
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));  

// let allPosts = [
//     {   
//         id: randomUUID(),
//         username : "rajeev123",
//         content : "hello i am rajeev"
//     },
//     {   
//         id: randomUUID(),
//         username : "xyz123",
//         content : "hello i am xyz"
//     },
//     {   
//         id: randomUUID(),
//         username : "abc123",
//         content : "hello i am abc"
//     },
//     {   
//         id: randomUUID(),
//         username : "klpd123",
//         content : "hello i am klpd"
//     }
// ];
app.use(methodOverride("_method"));
app.listen(port, ()=>{
    console.log(`listenin on port: ${port}`)
});

app.get("/", (req, res)=>{  // home route
    res.render("home_page.ejs", {allPosts});
})

app.get("/home/about", (req, res)=>{  // home / meditation 
    res.render("about.ejs");
})

app.get("/home/contact", (req, res)=>{  // home / meditation 
    res.render("contactUs.ejs");
})

// app.get("/home/excersises", (req, res)=>{ 
//     res.render("meditation_page.ejs");
// })

// app.get("/home/therapyCenters", (req, res)=>{ 
//     res.render("meditation_page.ejs");
// })

