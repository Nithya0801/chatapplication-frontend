<template>
    <div>
        <h1>Test</h1>
        
        <!-- <div>=== {{message}} </div> -->
        <div v-if="connected == true">
                  <b-button id="disconnect"  class="btn btn-default" type="submit" :disabled="connected == false" @click.prevent="disconnect">Disconnect
                 </b-button>

                 <b-button @click="group">Group Chat</b-button>
        </div>
        <!-- <div v-if="isGroupChat">
            <group-chat :currentUser="currentUser"></group-chat>
        </div> -->
        <div id="main-content" class="container" >
            <!-- <b-row>
                <b-col>
                </b-col>
                <b-col cols="8"> -->
      
            <div class="row">
                <div class="col-md-6" v-if="connected == false">
                    <form class="form-inline">
                        <!-- <div class="form-group" > -->
                            <label for="connect">WebSocket connection</label><br>
                            <b-row>
                                <b-col>
                                <input type="text" v-model="userName" placeholder="sender" @input="getStatus"><br>
                                </b-col>
                                <b-col>
                                <button id="connect" class="btn btn-default" type="submit" :disabled="connected == true" @click.prevent="connect">Connect</button>
                                <button id="disconnect" class="btn btn-default" type="submit" :disabled="connected == false" @click.prevent="disconnect">Disconnect
                                    </button>
                                </b-col>
                                
                            </b-row>
                                                    
                        <!-- </div> -->
                    </form>
                </div>
            </div>
             
           
                 <!-- <div>
                        <input type="text" placeholder="to whom" v-model="to" >
                        <button @click="openSpecificSocket" :disabled="isPrivate == true">Connect Private </button>
                    </div>   -->
                 <!-- <div class="col-md-6" >
                    <form class="form-inline">
                        <label for="name">start chat</label><br>
                        <div class="form-group">
                            
                            <input type="text" id="name"  v-model="send_message" placeholder="Type here...">
                        </div>
                        <button id="send" class="btn btn-default" type="submit" @click.prevent="send">Send</button>
                    </form>
                 </div> -->
                <!-- </div>  -->
            <div v-if="connected">
                {{userName}} is connected now!!!
            </div>
            <div v-if="!connected">
                Disconnected now!!!
            </div>
              <div class="row" v-if="connected">
                 <div class="col-md-4" >

                 </div>   
                <div class="col-md-8" >
                    <form class="form-inline">
                        <!-- <label for="name">start chat</label><br> -->
                        <!-- <div class="form-group"> -->
                            
                            <input type="text" id="name"  v-model="send_message" placeholder="Type here...">
                        <!-- </div> -->
                        <b-button id="send" class="btn btn-default" type="submit" @click.prevent="send">Send</b-button>
                    </form>
                 </div> 
                </div>
            <div class="row" v-if="connected">
                <div class="col-md-4">
                    <table id="conversation" class="table ">
                        <thead>
                            <tr>
                                <th>Online Users</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(user,index) in activeUsers" :key="index" @click="openSpecificSocket(user,index)">
                                <td>{{user.userName}}</td>
                                <td>
                                    <span v-if="user.isConnectPrivate && clickedPublic==false">=></span>
                                </td>
                                <!-- <td> <button :disabled="user.isConnectPrivate == true"  >Connect Private </button></td> -->
                            </tr>
                            <td @click="getPublicChat" style="cursor:pointer">Public</td>
                            <td> <span v-if="clickedPublic==true">=></span></td>
                        </tbody>
                    </table>
                </div>
                <div class="col-md-8" v-if="!isPrivate" style="overflow-y:auto;height:400px;border-style: ridge;">
                    <span><h3>Greetings</h3></span>
                    <div v-for="(item,index) in received_messages" :key="index">
                        <p v-if="currentUser.userName==item.sender" style="text-align:right;color:green">{{item.sender}} :: {{item.message}}
                        <span style="margin-left:1rem;font-size:12px;color:grey  ">{{item.dateTime}}</span>
                        </p>
                         <p v-else style="text-align:left;color:red">{{item.sender}} :: {{item.message}}
                        <span style="margin-left:1rem;font-size:12px;color:grey  ">{{item.dateTime}}</span>
                        </p>
                    </div>
                    <!-- <table id="conversation" class="table table-striped">
                        <thead>
                            <tr>
                                <th>Greetings</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item,index) in received_messages" :key="index">
                                <td>{{item.sender}} :: {{item.message}}</td>
                                <td><span style="margin-left:8rem;font-size:12px;color:grey  ">{{item.dateTime}}</span></td>
                            </tr>
                        </tbody>
                    </table> -->
                </div>
                 <div class="col-md-8" v-if="isPrivate" style="overflow-y:auto;height:400px;border-style: ridge;">
                    <!-- <table id="conversation" class="table table-striped">
                        <thead>
                            <tr>
                                <th>Send Message To {{toUser.userName}}</th> ==={{privatemsg.length}}
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item,index) in privatemsg" :key="index">
                                <td>{{item.sender}} :: {{item.message}}    </td>
                                 <td><span style="margin-left:8rem;font-size:12px;color:grey  ">{{item.dateTime}}</span></td>
                            </tr>
                        </tbody>
                    </table> -->
                    <div v-for="(item,index) in privatemsg" :key="index">
                      <p v-if="currentUser.userName==item.sender" style="text-align:right;color:green">{{item.sender}} :: {{item.message}}
                        <span style="margin-left:1rem;font-size:12px;color:grey  ">{{item.dateTime}}</span>
                        </p>
                         <p v-else style="text-align:left;color:red">{{item.sender}} :: {{item.message}}
                        <span style="margin-left:1rem;font-size:12px;color:grey  ">{{item.dateTime}}</span>
                        </p>
                    </div>
                </div>
                 </div>
              
             
                <!-- </b-col>
            </b-row> -->
        </div>
    </div>
</template>
<script>
import axios from 'axios';
import SockJS from "sockjs-client";
import Stomp from "webstomp-client";
import ChatApi from "@/service/ChatService";
import GroupChat from "@/components/GroupChat"
import moment from "moment";
export default {
    name: 'HelloWorld',
    data() {
        return {
            // message: ""
            received_messages: [],
            send_message: '',
            connected: false,
            userName:"",
            userConnected : false,
            to:"",
            i : "1",
            isPrivate:false,
            activeUsers:[],
            currentUser:null,
            toUser:null,
            privatemsg:[],
            oldIndex:0,
            clickedPublic:true,
            isGroupChat : false
        }
    },
    components:{
        GroupChat
    },
    mounted() {
        // this.getMessage();
      
        if(this.userName != ""){
              this.$session.start();
            this.$session.set("userName",this.userName);
            console.log("--web session example--",this.$session.get("userName"));
        this.getStatus();
        }
        // this.sample();
        console.log("--web socket example--");
        // this.getOnlineUser();
    },
//     created(){
//     // this.timer = setInterval(() => {this.currentDate = Date.now()}, 50000);
    
    
//     this.timer = setInterval(() => {
//         // this.currentDate =moment(new Date()).format("DD/MM/YYYY HH:mm:ss");
//         // console.log("....created....");
//         this.getOnlineUser();
//         },5000);
//   },
//   beforeDestroy() {
//     clearInterval(this.timer)
//   },
    methods: {
        sample(){
            console.log(moment(new Date()).format("DD/MM hh:mm"));
             this.$notify({
                     
                     group:"auth",
                    //  color:"positive",
                    title: "message.receiver",
                    text: 'new message',
                   
                });
        },
        send() {
            console.log("Send message:" + this.send_message+ this.currentUser);
            this.connected=true;
            // this.$notify({
                     
            //          group:"auth",
            //         //  color:"positive",
            //         title: "message.receiver",
            //         text: 'new message2',
                   
            //     });
           this.getOnlineUser();
            // if(this.currentUser == null){
            //     this.getStatus();
            // }
            // if(this.isPrivate)
            //     this.openSpecificSocket(this.toUser);
            // this.privatemsg.splice(0);
            // this.getPrivateChat();
            if (this.stompClient && this.stompClient.connected) {
            //  if (this.stompClient ) {
                // const msg = { message: this.send_message, fromUserId: this.userName, type: 'CHAT' , toName : this.to , channelId : this.i};
               if(this.send_message != ""){
                if(this.isPrivate == false){
                   
                const msg = { message: this.send_message, fromUserId: this.currentUser.userId, msgType: 'public' , toUserId : this.to , sender : this.currentUser.userName , receiver : this.to , dateTime :moment(new Date()).format("DD/MM hh:mm") };
                this.stompClient.send("/app/chat.sendMessage", JSON.stringify(msg),{});
                }
                else{
                    // this.openSpecificSocket(this.toUser);
                    const msg = { message: this.send_message, fromUserId: this.currentUser.userId, msgType: 'private' , toUserId : this.toUser.userId , sender : this.currentUser.userName , receiver : this.toUser.userName , dateTime :moment(new Date()).format("DD/MM hh:mm")};
                this.stompClient.send("/app/chat.sendMessage", JSON.stringify(msg),{});
                this.isPrivate=true;
                // this.getPrivateChat();
                }
               }
                //  this.stompClient.send("/app/send/message",JSON.stringify(msg),{});
            
                // this.stompClient.send("/app/send/message", this.send_message, {});
              
                //     this.openSpecificSocket(this.toUser);
                this.send_message="";

            }
            //   if(this.isPrivate)
            //         this.getPrivateChat();
        },
        connect() {
            this.socket = new SockJS("http://localhost:8082/ws");
            this.stompClient = Stomp.over(this.socket);
            let that=this;
            if(this.userName != ""){
            this.stompClient.connect({},
                frame => {
                    this.connected = true;
                    console.log("--frame--",frame,);
                  
                    // this.stompClient.subscribe('/topic/public',tick=>{

                    // })
                    // console.log("............Destination : ..............."+this.to);
                    // if(this.to == ""){
                    // // this.stompClient.subscribe("/topic/"+this.to, tick => {
                    //     this.stompClient.subscribe("/topic/public", tick => {
                    //     console.log("$$msg$$--",tick,this.to);
                    //     // console.log("=====",tick.body);
                    //     let data = JSON.parse(tick.body);
                    //     console.log("---333---",data.content);
                    //     // if(data.type == 'JOIN')
                    //     // this.userConnected=true;
                      
                    //    if(data.type != 'JOIN' && data.type != 'LEAVE')                        
                    //     this.received_messages.push(data);
                    // });
                    // }
                    // else{
                    //     this.stompClient.subscribe("/topic/"+this.to, tick => {
                    //     console.log("$$msg$$--",tick,this.to);
                    //     // console.log("=====",tick.body);
                    //     let data = JSON.parse(tick.body);
                    //     console.log("---333---",data.content);
                    //     // if(data.type == 'JOIN')
                    //     // this.userConnected=true;
                    //    if(data.sender == data.toName){
                    //        console.log("invoked///////////////");
                    //         this.received_messages.push(data);
                    //    }
                    //    if(data.type != 'JOIN' && data.type != 'LEAVE')                        
                    //     this.received_messages.push(data);
                    // });
                    // }
                    //  const msg1 = { sender: this.userName, type: 'JOIN' , toName : this.to };
                    // this.stompClient.send("/app/chat.addUser",JSON.stringify(msg1),{});
                     const msg1 = { userName: this.userName, status : 'online' };
                    this.stompClient.send("/app/chat.addUser",JSON.stringify(msg1),"]]]]]]]]]]]]]]]]");
                       that.openGlobalSocket();
                    //    if(this.currentUser == null)
                    //     that.getStatus();
                   
                },
                error => {
                    console.log(error);
                    this.connected = false;
                }
            );
            }
        },
        disconnect() {
            if (this.stompClient) {
                this.stompClient.disconnect();
            }
            this.connected = false;
            this.currentUser=null;
            this.userName="";
            // this.isPrivate=false;
        },
        openGlobalSocket(){
               console.log("---callleds globalll");
            //    let that=this;

              this.getOnlineUser();
              this.getPublicChat();
               
            this.stompClient.subscribe("/topic/public",message=>{
            //    this.stompClient.subscribe("/queue/public",message=>{    
                 let data = JSON.parse(message.body);
                  let count=0;
                 count++;
                //    console.log("---count---",count);
                 if(count == 1){
                 console.log("---global---",data);
                // if(data.chatId != "" ){
                 if((data.userId == undefined) && (data.message != "" || data.message != null || data.message != undefined) )  { 
                     console.log("-->>>>>>>>>>>>>>>>>>>>>>>-received message---",data);                    
                        this.received_messages.push(data);
                    //      this.$notify({
                    //  type:"success",
                    //  group:"auth",
                    // //  color:"positive",
                    // title: data.sender,
                    // text: 'new message received for public',
                    // // position:'top right',

                    // });
                 }
                 }
                if(data.status == "online" ){
                     console.log("---online Users---",this.activeUsers)
                    //  this.getOnlineUser();
                     for(var i=0;i<this.activeUsers.length;i++){
                         if(this.activeUsers[i].userName != data.userName && this.currentUser.userName != data.userName)
                          this.activeUsers.push(data);
                     }
                     if(this.activeUsers.length==0 && this.userName != data.userName)
                        this.activeUsers.push(data);
                }
                if(data.status == "offline"){
                     console.log("---offline Users---",this.activeUsers)
                     for(var i=0;i<this.activeUsers.length;i++){
                         if(this.activeUsers[i].userName == data.userName){
                             this.activeUsers.splice(i,1);
                         }
                     }
                }
                //   console.log("---global---",this.currentUser.userName,data.sender);
                    console.log("---global---",this.userName,data.sender);
                //  if(this.currentUser.userName != data.sender && this.connected==true){
                     if(this.userName != data.sender && this.connected==true){
                    console.log("---called notify---");
                    // this.$notify({
                    // //  type:"positive",
                    //  group:"auth",
                    // //  color:"positive",
                    // title: data.sender,
                    // text: 'new message received for public',
                    // // position:'top right',

                    // });
                 }
               // }
               
                 
                //  }
                // this.toastr.success("new message recieved", null, {
                //     'timeOut': 3000
                // });
                   
            })
           
        },
        openSpecificSocket(user,index){
            console.log("---callleds spcificcccccccccccc");
             this.isPrivate=true;
            this.activeUsers[this.oldIndex].isConnectPrivate=false;
             this.activeUsers[index].isConnectPrivate=true;
             this.clickedPublic=false;
             this.oldIndex=index;
            this.toUser=user;
            //   this.getOnlineUser();
            console.log("............toUser........",this.toUser);
              this.privatemsg.splice(0);
            this.getPrivateChat();
            let count=0;
             let sample=[];
            // this.stompClient.subscribe("/topic/"+this.currentUser.userId,message=>{
              this.stompClient.subscribe("/queue/"+this.currentUser.userId,message=>{
                 let data = JSON.parse(message.body);
                 this.isPrivate=true;

                 
                 count++;
                   console.log("---count---",count);
                //  if(count == 1){
                //  console.log("---specific---",data.message,data);
                
                // if((this.currentUser.userId == data.fromUserId && this.toUser.userId == data.toUserId) ||(this.currentUser.userId == data.toUserId && this.toUser.userId == data.fromUserId)){               
                 console.log("inner loop");
                 this.privatemsg.push(data);

                 console.log("---private mesga---",this.privatemsg);
                 if(this.currentUser.userName != data.sender && (data.chatId != "" || data.chatId != undefined || data.chatId != null)){
                    console.log("---called notify---");
                    this.$notify({
                    //  type:"positive",
                     group:"auth",
                    //  color:"positive",
                    title: data.sender,
                    text: 'new message received',
                    // position:'top right',

                    });
                 }
                 //   }
                 //}
                // this.toastr.success("new message recieved", null, {
                //     'timeOut': 3000
                // });
                //    const msg1 = { sender: this.userName, type: 'JOIN' , toName : this.to };
                //     this.stompClient.send("/app/chat.addUser",JSON.stringify(msg1),{});
            })
            
            
        },
        tickleConnection() {
            this.connected ? this.disconnect() : this.connect();
        },
        // getMessage() {
        //     var location = 'http://localhost:8085';
        //     var authAxios = axios.create({
        //         baseURL: location,
        //     });
        //     return new Promise((resolve, reject) => {
        //         authAxios({
        //             method: 'get',
        //             url: '/'
        //         }).then((response) => {
        //             console.log("register api.....",response.data);
        //             this.message = response.data;
        //             resolve(response);
        //         }).catch((err) => {
        //             reject(err);
        //         });
        //     });
        // }
        getOnlineUser(){
            this.activeUsers.splice(0);
            // if(this.currentUser==null)
            ChatApi.getOnlineUser()
            .then(response=>{
                console.log(".....online User List..............",response.data);
                for(var i=0;i<response.data.length;i++){
                if(response.data[i].userName != this.userName){
                    let data={
                        userName :response.data[i].userName,
                        userId:response.data[i].userId,
                        status:response.data[i].status,
                        isConnectPrivate:false,
                    }
                this.activeUsers.push(response.data[i]);
                }
                else if(response.data[i].userName == this.userName && this.currentUser==null){
                    this.currentUser=response.data[i];
                   console.log(".....Current User List..............",this.currentUser);
                }
                }
                console.log(".....Current User .............",this.currentUser);
                if(this.currentUser==null|| this.currentUser == '')
                    this.getStatus();
               
            })
        },
        getStatus(){
            console.log(".....called status..............");
            
            ChatApi.getStatus(this.userName)
                .then(response=>{
                    console.log(".....called status..............",response.data);
                    // for(var i=0;i<response.data.length;i++){
                    if(response.data!=null)
                    {    
                    this.currentUser=response.data;
                    this.$session.set("currentUser",this.currentUser);
                    if(response.data.status=='online')
                       this.connect();
                    }
                    // this.getOnlineUser();
                   // }
                })
                // .catch(err=>{
                //     this.connect();
                // })
        },
        getPublicChat(){
            this.isPrivate=false;
            this.clickedPublic=true;
            // this.activeUsers[this.oldIndex].isConnectPrivate=false;
            this.received_messages.splice(0);
            ChatApi.getPublicChat()
                .then(response=>{
                     console.log("...called public Chat.....");
                    for(var i=0;i<response.data.length;i++)
                    this.received_messages.push(response.data[i])
                    }
                )
        },
          getPrivateChat(){
              console.log("...called Private Chat.....");
                this.privatemsg.splice(0);
            ChatApi.getPrivateChat(this.currentUser.userId,this.toUser.userId)
                .then(response=>{
                    for(var i=0;i<response.data.length;i++)
                    this.privatemsg.push(response.data[i])


                     console.log("...called Private Chat.....",this.privatemsg);
                    }
                )
        },
        group(){
            this.$router.push("/group");
        }

    }
}
</script>
<style scoped>
.left-side{
    text-align:left;
}
.right-side{
    text-align: right;
    color:green;
}
</style>