//app.js
(
    function () {
    'use strict';
    angular
    .module('app', ['ngRoute', 'ngCookies'])
    .config(config)
    .run(run);
    config.$inject = ['$routeProvider', '$locationProvider'];
    function config($routeProvider, $locationProvider) {
    $routeProvider
    .when('/', {
    controller: 'LoginController',
    templateUrl: 'js/login/login.html',
    controllerAs: 'vm'
    })
    .when('/home', {
    controller: 'HomeController',
    templateUrl: 'js/home/home.html',
    controllerAs: 'vm',
    })            
    .when('/register', {
    controller: 'RegisterController',
    templateUrl: 'js/register/register.html',
    controllerAs: 'vm'
    })
    .when('/vid-home', {
        controller: 'vidhomeController',
        templateUrl: 'js/vid-home/vid-home.html',
        controllerAs: 'vm'
    })
    .otherwise({ redirectTo: '/login' });
    }    
    run.$inject = ['$rootScope'];
    function run(){
    console.clear();
    }
    })();