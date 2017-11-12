(function() {
    'use strict';

    angular
        .module('app')
        .factory('EmailService', EmailService);

    EmailService.$inject = ['$q', '$http'];

    function EmailService($q, $http) {
        var service = {};
        service.sendEmail = sendEmail;
        return service;

        function sendEmail() {

            var apiKey = 'a6f811e10bb5b1da72fd4036a048c95f';
            var secretKey = 'fd18612f1bc02b2ff9dc7cdd0fde497f';
            var authentificate = btoa(apiKey + ':' + secretKey);

            // Build the HTTP POST body text
            var body = JSON.stringify({
                From: { "Email": "fernando.naghar@gmail.com", "Name": "Teste - tem q trocar depois" },
                To: [{ "Email": "fernando.naghar@gmail.com", "Name": "passenger" }],
                Subject: 'assunto',
                TextPart: 'texto do corpo do email'
            });

            var options = {
                url: 'https://api.mailjet.com/v3.1/send/',
                method: 'POST',
                headers: {
                    'Authorization': 'Basic ' + authentificate,
                    'Content-Type': 'application/json'
                },
                data: body
            };

            // API request
            var req = $http(options).then(function(res) {
                console.log('STATUS: ' + res.statusCode);
                console.log('HEADERS: ' + JSON.stringify(res.headers));
                res.setEncoding('utf8');
                res.on('data', function(chunk) {
                    console.log('BODY: ' + chunk);
                });
            });

            // Checking errors
            req.on('error', function(e) {
                console.log('problem with request: ' + e.message);
            });

            // Send the body
            console.log(body);
            req.end(body);
        }

    }


})();