require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const http = require('http');
const app = express();
const server = http.createServer(app);


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Dynamiczne ładowanie tras
const routesPath = path.join(__dirname, 'routes');
const loadRoutes = (dirPath) => {
    fs.readdirSync(dirPath).forEach(file => {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            loadRoutes(fullPath); // Rekurencja dla podfolderów
        } else {
            const { path: routePath, router, routeName } = require(fullPath);
            if (routePath && router) {
                app.use(routePath, router);
                const relativePath = path.relative(routesPath, fullPath);
                console.log(`Loaded route: ${routeName}\nPath: ${routePath}\nFrom file: ${relativePath}\n`);
            } else {
                console.error(`Invalid route export in: ${fullPath}`);
            }
        }
    });
};

loadRoutes(routesPath);

// Start the server
server.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});