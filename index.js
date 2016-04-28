#!/usr/bin/env node
#
'use strict';

var request = require('superagent');
var fs = require('fs');
var path = require('path');
var mail = require('./mail');
var template = fs.readFileSync(path.resolve(__dirname + '/templates/main.html')).toString().replace('\n', '');
require('dotenv').config();

function remapValuesToSimpleArray(oldArray) {
    return oldArray.map(singleItem => singleItem.value).map(singleItem => '<li><img src="http://icexpert.ru' + singleItem.value + '"/></li>');
}

function checkPreviousFile(newObject) {
    if (newObject.error) {
        return false;
    }
    var prevFile = fs.readFileSync('./temp').toString();
    if (newObject.mainDate !== prevFile) {
        mail({
            html: template.replace('%images%', remapValuesToSimpleArray(newObject.latestImages)).replace('%date%', newObject.mainDate),
            to: process.env.TO,
            auth: {
                api_key: process.env.API_KEY,
                domain: process.env.DOMAIN
            }
        });
        fs.writeFileSync('./temp', newObject.mainDate);
    }
}

request
    .post('http://www.jamapi.xyz/')
    .type('form')
    .send({
        url: 'http://icexpert.ru/projects/progress/diary.php?section=31&id=2',
        json_data: '{"title": "title", "mainDate": ".date", "latestImages":  [{ "elem": ".diary-title .photos-list a", "value": "href"}]}' })
    .end((err, response) => {
        checkPreviousFile(response.body);
    });
