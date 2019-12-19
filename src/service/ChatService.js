import axios from 'axios';

var serverLocation = 'http://localhost:8082';

export default {

    getOnlineUser(){
        var serverAxios = axios.create({
            baseURL: serverLocation,
        });
        return new Promise((resolve, reject) => {
            
            serverAxios.get("/list/onlineUser")
            .then((response) => {
                resolve(response);
              })
              .catch((err) => {
                reject(err);
              });
        })
    },
    getStatus(data){
        var serverAxios = axios.create({
            baseURL: serverLocation,
        });
        return new Promise((resolve, reject) => {
            
            serverAxios.get("/getStatus/"+data)
            .then((response) => {
                resolve(response);
              })
              .catch((err) => {
                reject(err);
              });
        })
    },
    getPublicChat(data){
        var serverAxios = axios.create({
            baseURL: serverLocation,
        });
        return new Promise((resolve, reject) => {
            
            serverAxios.get("/getChat")
            .then((response) => {
                resolve(response);
              })
              .catch((err) => {
                reject(err);
              });
        })
    },
    getPrivateChat(fromId,toId){
        var serverAxios = axios.create({
            baseURL: serverLocation,
        });
        return new Promise((resolve, reject) => {
            
            serverAxios.get("/getPrivateChat/"+fromId+"/"+toId)
            .then((response) => {
                resolve(response);
              })
              .catch((err) => {
                reject(err);
              });
        })
    },
    getAllUsers(){
        var serverAxios = axios.create({
            baseURL: serverLocation,
        });
        return new Promise((resolve, reject) => {
            
            serverAxios.get("/getAll")
            .then((response) => {
                resolve(response);
              })
              .catch((err) => {
                reject(err);
              });
        })
    },
    getGroup(data){
        var serverAxios = axios.create({
            baseURL: serverLocation,
        });
        return new Promise((resolve, reject) => {
            
            serverAxios.get("/listGroup/"+data)
            .then((response) => {
                resolve(response);
              })
              .catch((err) => {
                reject(err);
              });
        })
    },
    getChat(data){
        var serverAxios = axios.create({
            baseURL: serverLocation,
        });
        return new Promise((resolve, reject) => {
            
            serverAxios.get("/listChat/"+data)
            .then((response) => {
                resolve(response);
              })
              .catch((err) => {
                reject(err);
              });
        })  
    }

}