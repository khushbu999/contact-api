const fs = require('fs');
const path = require('path');
const dns = require('dns');
const express = require('express')
const app = express()
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoute = require('./routes/user')
const contactRoute = require('./routes/contact')

function loadEnvFile() {
    const envPath = path.join(__dirname, '.env');

    if (!fs.existsSync(envPath)) {
        return;
    }

    const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);

    for (const line of lines) {
        const trimmed = line.trim();

        if (!trimmed || trimmed.startsWith('#')) {
            continue;
        }

        const separatorIndex = trimmed.indexOf('=');
        if (separatorIndex === -1) {
            continue;
        }

        const key = trimmed.slice(0, separatorIndex).trim();
        let value = trimmed.slice(separatorIndex + 1).trim();

        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
        }

        if (!(key in process.env)) {
            process.env[key] = value;
        }
    }
}

loadEnvFile();

const dnsServers = dns.getServers();
if (dnsServers.includes('127.0.0.1') || dnsServers.includes('::1')) {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
}

const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
    console.error('Missing MONGO_URI. Set it in contact-api-main/.env before starting the app.');
    process.exit(1);
}

mongoose.connect(mongoUri)
.then(() => { console.log('connected to database') })
.catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    if (err && err.code) {
        console.error('MongoDB error code:', err.code);
    }
})

app.use(bodyParser.json())

app.use('/user',userRoute)
app.use('/contact',contactRoute)


app.use('*',(req,res)=>{
    res.status(404).json({
        msg:'bad request'
    })
})

module.exports = app
