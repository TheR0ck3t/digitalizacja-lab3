const path = require('path');
const express = require('express');
const fs = require('fs');
const router = express.Router();

// Dynamic route creation for files and folders in views/public
const viewsPath = path.resolve(__dirname, '../views/public');

// Rekurencyjne ładowanie tras
const loadRoutesRecursively = (dirPath, baseRoute = '') => {
    fs.readdirSync(dirPath).forEach(file => {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            // Rekurencja dla podfolderów
            loadRoutesRecursively(fullPath, `${baseRoute}/${file}`);
        } else if (file.endsWith('.ejs')) {
            const routeName = file.split('.')[0];
            const routePath = routeName === 'index' ? baseRoute || '/' : `${baseRoute}/${routeName}`;
            router.get(routePath, (req, res) => {
                res.render(fullPath, {
                    user: req.user || null,
                    currentPage: routeName,
                });
            });
            console.log(`Loaded route: ${routeName}\nPath: ${routePath}\nFrom file: ${path.relative(viewsPath, fullPath)}\n`);
        }
    });
};

// Ładowanie tras dla głównego folderu public oraz podfolderów
loadRoutesRecursively(viewsPath);

module.exports = {
    router,
    routeName: 'public',
    path: '/',
}