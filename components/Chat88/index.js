import React, { Component } from "react";
import { Observable } from "rxjs/Rx";
import { database, firebase, storage, messaging} from "./config";
import "./chatstyle.css";
import Recorder from "./recorder";
import PropTypes from "prop-types";// To render available the state in the component
import { TrackState } from "../../state/tracker";
import apiConfig from "../../apiconfiguration/apiconfig";

class Chat88 extends Component {
static contextTypes = {store: PropTypes.object};

	constructor (props) {
    super(props);
    this.auth = null;
    this.adminId = null;
		this.user = null;
		this.isAdmin = false; 
    this.messagesRef = null;
    this.checkTypeSubscription = {};  
		this.usersRef = null;
		this.token = null;
    this.userDbKey = null;
    this.adminIsTyping = false;
		this.messages = [];
		this.profilePicUrl = "";  
		this.state = { messages :[], loggedIn:false,LoggedInUser:null,connectedUsers:[]};
		this._idleSecondsCounter = 0;
		this.heartbeat={};
	}

updateScroll = () => { this.refs.container.scrollTo(0, this.refs.container.scrollHeight); };

checkHeartbeat =() => {
this.heartbeat = window.setInterval(  ()=> {
  this._idleSecondsCounter++;
  
  if (this._idleSecondsCounter >= 200) {
    this.signOut();
    this._idleSecondsCounter = 0
    window.clearInterval(this.heartbeat);
    document.onmousemove =null;    
  }
}, 1000);}


componentWillMount() { window.scrollTo(0, 0); }

componentDidMount() { 
  
  TrackState(this.context.store,"Chat88"); 
  document.onmousemove = ()=> { this._idleSecondsCounter = 0; };
  this.checkHeartbeat();
  this.auth = firebase.auth();
  this.auth.onAuthStateChanged(this.onAuthStateChanged);
  messaging.onMessage((payload) => {console.log(payload); alert("Message received. ");});  
  let source = Observable.interval(100).timeInterval();    
  this.checkTypeSubscription = source.subscribe((x) => {
    database.ref('adminFeedback').once("value", (snapshot) => {
       if((this.user === null) || (this.adminId === null) || (this.user.uid === this.adminId) ) return;      
       this.adminIsTyping = snapshot.val().isTyping;       
       this.refs.adminFeedback.className = this.adminIsTyping ? "chat-typing chat-admin-feedback-visible":"chat-idle chat-admin-feedback-visible";      
      })
  }, (err)=> {/*he*/},()=> {/*done*/});

  
};

removeData = (ref, id) => {  
  let adaRef = database.ref(`${ref}/${id}`);  
  adaRef.remove()
    .then( () => {
      console.log("Remove succeeded.")
    })
    .catch( (error)=> {
      console.log("Remove failed: " + error.message)
  });
};  

componentWillUnmount() {};
componentDidUpdate (){ this.updateScroll(); }
componentWillUpdate (){}

saveMessagingDeviceToken = () => {
  messaging.getToken().then((currentToken)=> {
    if (currentToken) {
      console.log('Got FCM device token:', currentToken);
      // Saving the Device Token to the datastore.
      firebase.database().ref('/fcmTokens').child(currentToken)
          .set(firebase.auth().currentUser.uid);
    } else {
      // Need to request permissions to show notifications.
      this.requestNotificationsPermissions();
    }
  }).catch((error)=>{ /*handle the error please*/  });
};

requestNotificationsPermissions = () => { 
  messaging.requestPermission().then(()=> {
    // Notification permission granted.
    this.saveMessagingDeviceToken();
  }).catch(function(error) {/*handle the error please*/  });
};


onAuthStateChanged = (user) => {  
  this.refs.adminFeedback.className = "chat-admin-feedback-hidden";
  if (user) {
    this.user = user;
    this.auth = firebase.auth();    
    this.requestNotificationsPermissions();
    this.setState({ loggedIn: true, LoggedInUser: this.auth.currentUser.displayName});
    this.profilePicUrl = user.photoURL;
    this.adminRef = database.ref('adminId');
    this.adminRef.once('value').then ((el) => {
    this.adminId = el.val();
    if(this.user.uid === this.adminId) this.isAdmin = true;
    this.usersRef = database.ref('users');
    // the value event is triggered once when the listener is attached and evry time we have a change
    this.usersRef.orderByChild("authId").equalTo(this.user.uid).on("value", (snapshot)=> {      
      try{
      if(!snapshot.val()) // empty?
      {//yes
        let refUser = this.usersRef.push();
        this.userDbKey = refUser.key; 
        refUser.set({
        id: refUser.key,
        Name: this.auth.currentUser.displayName,
        authId: this.user.uid,
        isTyping: false  
        },()=> {
        });
      }
      
      // the following is to be sure that there are not doubles of the same user      
      if(Object.values(snapshot.val()).length > 1)
      {    
        let ar = Object.values(snapshot.val());
        let len = ar.length;
        for(let counter = 0; counter < (len -1); counter ++)
        { 
          let key = ar[counter].id;
          this.removeData('users',key);
        }
      }
      }
      catch(error){console.log('cuncurrency')}
    });

    if(this.isAdmin) {
        this.usersRef.on('value', (snapshot, prevChildKey) => {       
        if(snapshot.val()) this.setState({ connectedUsers: Object.values(snapshot.val())});
    });}

    this.messagesRef = database.ref('chatmessages');
    this.messagesRef.off(); //clean listeners
    this.messagesRef.on('value', (snapshot) => { 
      if(snapshot.val() === null) return;
      let temp = Object.values(snapshot.val());     
      let filtered = temp.filter( (el)=> {return ((el.sender === this.user.uid) || (el.recipient === this.user.uid) || (el.recipient === 'public') );});      
      this.setState({ messages: filtered });   
    });
    this.messagesRef.limitToLast(24).on('child_added', (snapshot, prevChildKey) => {});
    this.messagesRef.limitToLast(24).on('child_changed', (snapshot) => {});
    this.messagesRef.limitToLast(24).on('child_removed', (snapshot) => {});   
   })
  }
  else { this.user = null; this.setState({  messages:[] ,loggedIn: false});
  this.checkTypeSubscription.unsubscribe();

}
};

signIn =() => {
  let provider = new firebase.auth.GoogleAuthProvider(); 
  this.auth.signInWithRedirect(provider).then((result) =>{
  this.token = result.credential.accessToken; 
  document.onmousemove = ()=> { this._idleSecondsCounter = 0; };
  this.checkHeartbeat();});
};

// User's feedback to administrator when typing ______________________________________________
userStartTyping = (event) => {
  if(this.user.uid === this.adminId)  this.adminFeedback = database.ref('adminFeedback').update({ isTyping: true,toWhom:"somebody" });
  this.usersRef.orderByChild("authId").equalTo(this.user.uid).once("value", (snapshot) => { 
    let uid = Object.keys(snapshot.val())[0]; 
    database.ref(`users/${uid}`).update({ isTyping: true });   
  });
 }

userEndTyping = (event) => {
  if(this.user.uid === this.adminId) this.adminFeedback = database.ref('adminFeedback').update({ isTyping: false,toWhom:"nobody" });
  this.usersRef.orderByChild("authId").equalTo(this.user.uid).once("value", (snapshot) => { 
    let uid = Object.keys(snapshot.val())[0]; 
    database.ref(`users/${uid}`).update({ isTyping: false });   
  });
 }

userCheckReturn = (event) => {
  if (event.which === 13 || event.keyCode === 13) {         
    this.sendMessage();   
    this.refs.textmessage.value = '';
  }    
};


signOut = () => {
  if (this.user) {
    this.usersRef.off();
    let todelete = this.usersRef.orderByChild('authId').equalTo(this.user.uid);
    todelete.once('value').then((snapshot)=> {  
    let updates = {};
    snapshot.forEach((child)=> { updates[child.key] = null;});
    this.usersRef.update(updates);
    this.auth.signOut().then(() => {  
    this.user = null;
    this.setState({ messages:[],loggedIn: false, LoggedInUser: null });},(error) => {});  
    
  });}
  else {console.log('Already Signed Out');}
};

sendMessage = (event) => {  
  if (this.user) {
  let refAdd = this.messagesRef.push();
  refAdd.set({
    id: refAdd.key,
    timeStamp: firebase.database.ServerValue.TIMESTAMP,
    Name: this.auth.currentUser.displayName,
    text: this.refs.textmessage.value,
    profilePhotoUrl: this.user.photoURL || '/images/profile_placeholder.png',
    authId: this.user.uid,
    recipient:event === 'toAll' ? 'public' : this.adminId,
    sender: this.user.uid    
  },()=>{
     this.refs.textmessage.value = '';
    
    });
  }
};

saveImage = (event) => {
  if (this.user) {    
    let file = event.target.files[0];    
    if(typeof file === "undefined") return;
    if (!file.type.match('image.*')) {
      alert('You can only share images');
      return;
    };
    let refAdd = this.messagesRef.push();
    refAdd.set({
      id: refAdd.key,
      timeStamp: firebase.database.ServerValue.TIMESTAMP,
      Name: this.auth.currentUser.displayName,
      text: this.refs.textmessage.value,
      imageUrl: apiConfig.chatLoader,
      profilePhotoUrl: this.user.photoURL || '/images/profile_placeholder.png',
      authId: this.user.uid, 
      recipient: this.user.uid === this.adminId ? 'public' : this.adminId,
      sender: this.user.uid, 
      },()=> {      
        this.refs.textmessage.value = '';
        let filePath = this.user.uid + '/' + refAdd.key + '/' + file.name ;
        let fullPath = "";
        storage.ref(filePath).put(file).then((snapshot) => { 
          fullPath = snapshot.metadata.fullPath;          
          return snapshot.ref.getDownloadURL();
        }).then(downloadURL => {        
            return refAdd.update({
            imageUrl: downloadURL,
            bucketImageUrl:storage.ref(fullPath).toString() 
           });         
       })  
      });
    }
};

resetInput = () => {
  this.refs.imgsave.reset();
}


saveImageBis = (event,user) => {
  if (this.user) {  
    let file = event.target.files[0];
    event.target.value = null;    
    if (!file.type.match('image.*')) {
      alert('You can only share images');
      return;
    };
    let refAdd = this.messagesRef.push();
    refAdd.set({
      id: refAdd.key,
      timeStamp: firebase.database.ServerValue.TIMESTAMP,
      Name: this.auth.currentUser.displayName,
      text: this.refs.textmessage.value,
      imageUrl: apiConfig.chatLoader,
      profilePhotoUrl: this.user.photoURL || '/images/profile_placeholder.png',
      authId: this.user.uid, 
      recipient:user.authId,
      sender: this.user.uid,  
      },()=> {      
        this.refs.textmessage.value = '';
        let filePath = this.user.uid + '/' + refAdd.key + '/' + file.name;
        let fullPath = "";
        storage.ref(filePath).put(file).then((snapshot) => { 
          fullPath = snapshot.metadata.fullPath;          
          return snapshot.ref.getDownloadURL();
        }).then(downloadURL => {        
            return refAdd.update({
            imageUrl: downloadURL,
            bucketImageUrl:storage.ref(fullPath).toString() 
           });         
       })  
      });
    }
};


getRecDataFromRecorder = (blob, user, ispublic) => {
  if (this.user) {  
  let file = blob  
  if (!file.type.match('audio.*')) { alert('You can only share recorded audio here'); return;}
  let refAdd = this.messagesRef.push();
  let recipient = '';
  if (ispublic && this.isAdmin) recipient = 'public';
  else if(user) recipient = user.authId;
  else recipient = this.adminId;

  refAdd.set({
    id: refAdd.key,
    timeStamp: firebase.database.ServerValue.TIMESTAMP,
    Name: this.auth.currentUser.displayName,
    text: this.refs.textmessage.value,
    imageUrl: apiConfig.chatLoader,
    profilePhotoUrl: this.user.photoURL || '/images/profile_placeholder.png',
    authId: this.user.uid,    
    recipient: recipient,
    sender: this.user.uid
    },()=> {      
        this.refs.textmessage.value = '';
        let filePath = this.user.uid + '/' + refAdd.key + '/audiorec.ogg';
        let fullPath = "";
        storage.ref(filePath).put(file).then((snapshot) => {
        fullPath = snapshot.metadata.fullPath;
        return snapshot.ref.getDownloadURL();
        }).then(downloadURL => {        
            return refAdd.update({
            audioRecUrl: downloadURL,
            imageUrl:null,
            bucketImageUrl:storage.ref(fullPath).toString() 
           });       
      })      
    });
  } 
};


sendPrivate = (user) =>{
   if (this.user) {
    let refAdd = this.messagesRef.push();    
    refAdd.set({
    id: refAdd.key,
    timeStamp: firebase.database.ServerValue.TIMESTAMP,
    Name: this.auth.currentUser.displayName,
    text: this.refs.textmessage.value,
    profilePhotoUrl: this.user.photoURL || '/images/profile_placeholder.png',
    authId: this.user.uid,
    recipient:user.authId,
    sender: this.user.uid,    
  },()=>{

     this.refs.textmessage.value = '';
    });
  } 
}

updateData = (event) => {};

	render() {
		// Note: we are using ES6 feature to get distinct values from the connected users
		let connectedUsers =[];
		connectedUsers = [...new Set(this.state.connectedUsers)].filter((el)=> { return (el.authId !== this.adminId) }).map((user)=> {
			return (
        <form key={user.id}>
				<div className = "chat-user" > <span >{user.Name}</span><div className = {user.isTyping ? "chat-typing" : "chat-idle"}></div>
					<button onClick = { () => {this.sendPrivate(user)} }>Send</button> 
					<label> Send an image   
          <input onClick= {(e) => e.target.value = null} onChange = {(e) => {this.saveImageBis(e,user)}} type="file" accept = "image/*,capture=camera"/>      
					{/* <input onClick="this.form.reset()" onChange = {(e) => {this.saveImageBis(e,user)}} type="file" accept = "image/*,capture=camera"/>      */}
					</label>
					<Recorder getRecordedData = { (blob) => {this.getRecDataFromRecorder(blob,user,false)}}/>
				</div>
        </form>

			);
		}) 


		let messages = this.state.messages.map((item)=> {
			return (
				<div className = "chat-message" key={item.id}>
					<div>
						<img alt= "" className = "chat-userpic" src={item.profilePhotoUrl}></img>        
						<p>{item.Name}</p>
					</div>
					<pre className="chat-textwrap">{item.text}</pre>
					<a className = {typeof item.imageUrl === "undefined" ? "chat-hideelement" : "chat-showelement"} href = {item.imageUrl} download = "">
						<img alt="" className = "chat-imagepic" src={item.imageUrl}></img>
					</a>
					<audio className = {typeof item.audioRecUrl === "undefined" ? "chat-hideelement" : "chat-showelement"} controls="controls" src={item.audioRecUrl} ></audio>        
					<hr/>
				</div>
			)
    });
    
  

		return (
			<div  className = "chat-backdiv">
				<div ref="chat" className="chat-maincontainer">
					<div className="chat-loginheader">
						<div className={!this.state.loggedIn ? "chat-showlogin" : "chat-hidelogin"}>
							<button  onClick = {this.signIn} >Login with Google</button>
						</div>
						<div className={this.state.loggedIn ? "chat-showlogout" : "chat-hidelogout"}>
							<button  onClick = {this.signOut} >Logout</button>
						</div>
						<div className={this.state.loggedIn ? "chat-showuser" : "chat-hidelogout"}>
							<span> {this.state.LoggedInUser}</span>    
							<img alt="" src={this.profilePicUrl}></img>
						</div>
					</div>      
					<div ref="container" className ="chat-container">{messages}</div>
					<div className = "chat-sendcontainer">             
						<textarea placeholder="Write a message..." onKeyPress = {this.userCheckReturn} onKeyUp = {this.userEndTyping} onKeyDown = {this.userStartTyping}  rows = "3" ref = "textmessage"></textarea>
						<form ref="imgsave">
            <div className = "chat-senddiv">
							<input onClick= {this.resetInput} id="mediaCapture" onChange = {this.saveImage} type="file" accept = "image/*,capture=camera"/>
              <div  ref = "adminFeedback" className = "chat-admin-feedback-hidden"></div>
							<label htmlFor="mediaCapture" ><i className="fa fa-upload" aria-hidden="true"></i> Send an image</label>    
							<button className = {!this.isAdmin ? "chat-showlogin" : "chat-hidelogin"} onClick = {this.sendMessage}>Send</button>
							<button className = {this.isAdmin ? "chat-showlogin" : "chat-hidelogin"} onClick = { () => {this.sendMessage("toAll")} }>Send to all</button>
						</div>
            </form>

						<Recorder getRecordedData = { (blob) => {this.getRecDataFromRecorder(blob,null,true)}}/>
						
					</div>
					<div className = {this.isAdmin && this.state.loggedIn ? "chat-connectedusers" : "chat-hidelogin"}>
						<h2>Connected users</h2>
						{connectedUsers}
					</div>
				</div>				
			</div>
		);
	}
}

export default Chat88;


