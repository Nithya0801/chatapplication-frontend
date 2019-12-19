<template>
    <div>
        
        <h3>Group CHat</h3>
        <h4>{{currentUser.userName}} connected now</h4>
        <div @click="goBack">Go Back</div>
        <b-button @click="listUser">Add Group</b-button>
        <b-button @click="listGroup">List Group</b-button>
        <b-button @click="disconnect">Disconnect</b-button>
        <b-button @click="openGroupSocket">openSocket</b-button>
       <div id="main-content" class="container" >
        <div class="row" v-if="addGp">
            
            <div class="col-md-6">
                <table id="conversation" class="table table-striped">
                        <thead>
                            <tr>
                                <th>All Users</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(user,index) in userList" :key="index" >
                                <td>{{user.userName}}</td>
                                <td>
                                    <b-button @click="addUserToGrp(user,index)" v-if="!user.isAdded">ADD</b-button>
                                    <b-button @click="cancelUserToGrp(user,index)" v-if="user.isAdded">CANCEL</b-button>
                                </td>
                                <!-- <td> <button :disabled="user.isConnectPrivate == true"  >Connect Private </button></td> -->
                            </tr>
                          
                        </tbody>
                    </table>
                <!-- <p>{{user.userName}}
                    <b-button @click="addUserToGrp(user,index)" v-if="!user.isAdded">ADD</b-button>
                    <b-button @click="cancelUserToGrp(user,index)" v-if="user.isAdded">CANCEL</b-button>
                </p> -->
            </div>
            <div class="col-md-6"  >
                <table id="conversation" class="table table-striped">
                        <thead>
                            <tr>
                                <th>Creat Group</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(user,index) in addReq" :key="index" >
                                <td>{{user.userName}}</td>
                                <td>
                                    <!-- <b-button @click="addUserToGrp(user,index)" v-if="!user.isAdded">ADD</b-button>
                                    <b-button @click="cancelUserToGrp(user,index)" v-if="user.isAdded">CANCEL</b-button> -->
                                </td>
                                <!-- <td> <button :disabled="user.isConnectPrivate == true"  >Connect Private </button></td> -->
                            </tr>
                            <tr>
                                <td><input type="text" placeholder="Type Group Name...." v-model="group"/></td>
                                <td><b-button @click="createGroup"> CreateGroup</b-button></td>
                            </tr>
                        </tbody>
                    </table>
            </div>
        </div>
        <div class="row" v-if="listGrp">
            <div class="col-md-6">
                <table id="conversation" class="table table-striped">
                        <thead>
                            <tr>
                                <th> Group List</th>
                            </tr>
                        </thead>
                        <tbody  >
                            <tr v-for="(groups,index) in listGrpUser" :key="index" @click="clickedGroup(groups)" style="border-style: ridge;" >
                                <td>{{groups.groupName}}</td>
                                <td><span style="color:blue">Members :</span></td>
                                 <td v-for="(user,index) in groups.user" :key="index">
                                    {{user.userName}}
                                    <!-- <b-button @click="addUserToGrp(user,index)" v-if="!user.isAdded">ADD</b-button>
                                    <b-button @click="cancelUserToGrp(user,index)" v-if="user.isAdded">CANCEL</b-button> -->
                                </td>
                                <!-- <td> <button :disabled="user.isConnectPrivate == true"  >Connect Private </button></td> -->
                            </tr>
                          
                        </tbody>
                    </table>
            </div>
            <div class="col-md-6" v-if="grpM" >
             
            <!-- <div v-for="(msg,index) in grpMsg" :key="index">
            <p>{{msg.sender}} :{{msg.message}}
            </p>
            </div> -->
             Type : <input type="text" v-model="msg"><b-button @click="sendMessage">Send</b-button>
             <div style="overflow-y:auto;height:400px;border-style: ridge;">
                    <div v-for="(msg,index) in grpMsg" :key="index" >
                        <p v-if="currentUser.userName==msg.sender" style="text-align:right;color:green">{{msg.sender}} :: {{msg.message}}
                        <!-- <span style="margin-left:1rem;font-size:12px;color:grey  ">{{item.dateTime}}</span> -->
                        </p>
                         <p v-else style="text-align:left;color:red">{{msg.sender}} :: {{msg.message}}
                        <!-- <span style="margin-left:1rem;font-size:12px;color:grey  ">{{item.dateTime}}</span> -->
                        </p>
                    </div>
             </div>
        </div>
        </div>
       </div>
        
    </div>
</template>
<script>
import SockJS from "sockjs-client";
import Stomp from "webstomp-client";
import ChatApi from "@/service/ChatService";
import moment from "moment";
export default {
    name : "GroupChat",
   
    data(){
        return{
            userList:[],
            addGp:false,
            addReq:[],
            currentUser:this.$session.get("currentUser"),
            msg:"",
            grpMsg:[],
            grpM:false,
            group:"",
            listGrp:false,

            listGrpUser:[],
            groupData:null,
        }
    },
    async mounted(){
        console.log("......",this.currentUser);
        // this.getStatus();
        this.listUser();
        this.createGroup();

    },
    methods:{
        goBack(){
            this.$router.push("/");
        },
        clickedGroup(group){
            this.grpMsg.splice(0);
            this.groupData=group;
            ChatApi.getChat(this.groupData.groupId)
            .then(response=>{
                for(var i=0;i<response.data.length;i++)
                this.grpMsg.push(response.data[i]);
                this.openGroupSocket();
            })
        },
        listGroup(){
            this.grpM=true;
            this.addGp=false;
            this.listGrp=true;
            this.listGrpUser.splice(0);
            ChatApi.getGroup(this.currentUser.userId)
            .then(response=>{
                console.log("Group chat....",response.data);
                for(var i=0;i<response.data.length;i++){
                    this.listGrpUser.push(response.data[i]);
                }
            });
        
            
            
        },
        sendMessage(){
             console.log("..calllinggggg....");
             this.addGp=false;
             this.grpM=true;
             this.listGrp=true;
               if (this.stompClient && this.stompClient.connected) {
                    // let data={ userName: this.currentUser.userName, msgType : 'group' ,fromUserId : this.currentUser.userId,toUserId : "" , sender : this.currentUser.userName , receiver : "" , groupId: "g2",groupName:"sample1", dateTime :moment(new Date()).format("DD/MM hh:mm"),message:this.msg}
                    // let grpUser=[];
                    // grpUser.push(data);

                    // for(var i=0;i<this.addReq.length;i++)
                    // {
                    //     let data={ userName: this.addReq[i].userName, msgType : 'group' ,fromUserId : this.addReq[i].userId,toUserId : "" , sender : this.addReq[i].userName , receiver : "" , groupId: "g2",groupName:"sample1", dateTime :moment(new Date()).format("DD/MM hh:mm"),message:this.msg}
                    //      grpUser.push(data);
                    // }
                    const msg={groupId : this.groupData.groupId , sender : this.currentUser.userName ,senderId : this.currentUser.userId,message : this.msg };
                //    const msg = { message: this.msg, fromUserId: this.currentUser.userId, msgType: 'group' , toUserId : "" , sender : this.currentUser.userName , receiver : "" , groupId: "g1",groupName:"sample", dateTime :moment(new Date()).format("DD/MM hh:mm") };
                 console.log("..senddddddddddddd....",msg);
                this.stompClient.send("/app/chat.sendGroupMessage", JSON.stringify(msg),{});
                this.msg="";
               }
        },
        listUser(){
            this.addGp=true;
            this.userList.splice(0);
            ChatApi.getAllUsers()
                .then(response=>{
                        for(var i=0;i<response.data.length;i++){
                            if(response.data[i].userName != this.currentUser.userName){
                                let data={
                                    userId:response.data[i].userId,
                                    userName:response.data[i].userName,
                                    status:response.data[i].status,
                                    isAdded:false,
                                    isAdmin : false,
                                }
                                this.userList.push(data);
                            }
                        }
                        console.log(".....",this.userList,this.$session.get("userName"));
                })
            
            
        },
        addUserToGrp(user,index){
            this.userList[index].isAdded=true;
            this.addReq.push(user);
             console.log("...xxxxxx..",this.addReq);
        },
        cancelUserToGrp(user,index){
           
            this.userList[index].isAdded=false;
            for(var i=0;i<this.addReq.length;i++){
                if(this.addReq[i].userName == user.userName)
                 this.addReq.splice(i,1);
            }
            

              console.log("...yyyy..",this.addReq);
        },
        createGroup(){
            console.log(">>>>>>>>>>stompClient>>>>>>>>",this.stompClient);
            this.socket = new SockJS("http://localhost:8082/ws");
            this.stompClient = Stomp.over(this.socket);
            let that=this;
           
            this.stompClient.connect({},
                frame => {
                    this.connected = true;
                    console.log("--frame--",frame,);
                    let data={ userName: this.currentUser.userName, status : 'online' ,userId : this.currentUser.userId }
                    let grpUser=[];
                    grpUser.push(data);
                    if(this.addReq.length != 0){
                    for(var i=0;i<this.addReq.length;i++)
                    {
                        let data={ userName: this.addReq[i].userName, status : this.addReq[i].status ,userId : this.addReq[i].userId }
                         grpUser.push(data);
                    }
                    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",grpUser);
                    const msg1 ={ groupName : this.group,user :grpUser};
                    this.stompClient.send("/app/chat.groupUser",JSON.stringify(msg1),"]]]]]]]]]]]]]]]]");
                    that.listGroup();
                    }
                    else{
                       that.openGroupSocket();
                    }
                    //    if(this.currentUser == null)
                    //     that.getStatus();
                   
                },
                error => {
                    console.log(error);
                    this.connected = false;
                }
            );
           
        },
        openGroupSocket(){
             console.log("@@@@@@@@@@");
             this.grpM=true;
             this.addGp=false;
             if(this.groupData != null){
               this.stompClient.subscribe("/topic/"+this.groupData.groupId,message=>{
                   let data = JSON.parse(message.body);
                    console.log("<<<<<<<<<<<<<<<<<<<<<,",data.message);
                     let count=0;
                     count++;
                     if(count == 1){
                    if(data.message != null || data.message != "" || data.message != undefined){
                    this.grpMsg.push(data);
                     if(this.currentUser.userName != data.sender){
                    console.log("---called notify---");
                    this.$notify({
                    //  type:"positive",
                     group:"auth",
                    //  color:"positive",
                    title: data.sender,
                    text: 'new message received in Group Chat',
                    // position:'top right',

                    });
                    }
                    }
                    else
                    this.listGrpUser.push(data);
                     }
               });
             }
        },
        disconnect() {
            if (this.stompClient) {
                this.stompClient.disconnect();
            }
           this.addGp=false;
            // this.isPrivate=false;
        },
        getStatus(){
            console.log(".....called status..............",this.$session.get("userName"));
            
            ChatApi.getStatus(this.$session.get("userName"))
                .then(response=>{
                    console.log(".....called status..............",response.data);
                    // for(var i=0;i<response.data.length;i++){
                    // if(response.data!=null)
                    // {    
                    this.currentUser=response.data;
                    // if(response.data.status=='online')
                    //    this.connect();
                    // }
                    // this.getOnlineUser();
                   // }
                })
                // .catch(err=>{
                //     this.connect();
                // })
        },
    }
}
</script>