import "./App.css";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useState } from "react";

firebase.initializeApp({
  apiKey: "AIzaSyD-eWkgLlGVKnhhsLI4yrFiW-vgzrsdyuA",
  authDomain: "chatapp-demo-223bd.firebaseapp.com",
  projectId: "chatapp-demo-223bd",
  storageBucket: "chatapp-demo-223bd.appspot.com",
  messagingSenderId: "112611349648",
  appId: "1:112611349648:web:12d9b25681b269295bb415"
});

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  const [user] = useAuthState(auth)
  return (
    <div className="App">
      <header className="App-header">

        <section>
          {user ? <ChatRoom /> : <SignIn/>}
        </section>
      </header>
    </div>
  );
}

function SignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  return (
    <button onClick={signInWithGoogle}>Sign in with Google</button>
  )
}

function SignOut() {
  return auth.currentUser && (
    <button onClick={()=>auth.signOut()}>Sign Out</button>
  )
}

function  ChatRoom() {
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, {idField: 'id'})

  const [formValue, setFormValue] = useState('')

  const sendMessage = async(e) => {
    e.preventDefault();
    console.log(auth.currentUser.photoUrl)
    const {uid} = auth.currentUser;
    const photoURL = auth.currentUser.photoURL

    await messagesRef.add({
      text: formValue, 
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('')
  }

  return (
    <>
      <div>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg}/>)}
      </div>

      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)}/>

        <button type="submit">Send</button>
      </form>
    </>
  )

}

function ChatMessage(props) {
  const {text, uid, photoUrl} = props.message;

  const messageClass = uid == auth.currentUser.uid ? 'sent' : 'recieved';


  return (
    <div className={`messsages ${messageClass}`}>
      <img src={photoUrl}/>
      <p>{text}</p>
    </div>
  )
}
export default App;
