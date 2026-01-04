const express = require('express');
const axios = require('axios');
const req = require('express/lib/request');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = '';

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

// * Code for Route 1 goes here
app.get('/plants', async (req, res) => {
    const plants = 'https://api.hubspot.com/crm/v3/objects/2-209529826/?properties=plant_name&properties=plant_type&properties=plant_location';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(plants, { headers });
        console.log('HubSpot Response:', resp.data);
        const data = resp.data.results;
        res.render('contacts', { title: 'Plants | HubSpot APIs', data });      
    } catch (error) {
        console.error(error);
    }
})

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.
app.get('/update-cobj', async (req, res) => {
    const plants = 'https://api.hubspot.com/crm/v3/objects/2-209529826/?properties=plant_name&properties=plant_type&properties=plant_location';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(plants, { headers });
        const data = resp.data.results;
        res.render('update-cobj', { title: 'Plants Update| HubSpot APIs', data });      
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
})

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.
app.post('/update-cobj', async (req, res) => {
    const formData = req.body;
    console.log(formData);
    try {
        const newContact = {
            properties: {
                "plant_name": formData.plant_name,
                "plant_type": formData.plant_type,
                "plant_location": formData.plant_location
            }
        };
        const createContactURL = 'https://api.hubspot.com/crm/v3/objects/2-209529826';    
        const headers = {
            Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
            'Content-Type': 'application/json'
        };
        const response = await axios.post(createContactURL, newContact, { headers });
        // The ID of the new contact can be obtained from the response
        const newContactId = response.data.id;
        res.redirect('/plants');  
    } catch (error) {
        console.error(error);
        res.status(500).send(error.response ? error.response.data : 'Error creating new record in CRM');
    }
});

// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));