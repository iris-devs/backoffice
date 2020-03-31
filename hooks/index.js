import React from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "isomorphic-unfetch";

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: process.env.CLIENT_FIREBASE_API_KEY,
    authDomain: process.env.CLIENT_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.CLIENT_FIREBASE_DATABASE_URL,
    projectId: process.env.CLIENT_FIREBASE_PROJECT_ID,
    storageBucket: process.env.CLIENT_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.CLIENT_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.CLIENT_FIREBASE_APP_ID
  });
}
const db = firebase.firestore();
const messagesRef = db.collection("messages");
const commentsRef = db.collection("comments");
const questionsRef = db.collection("questions");

export const useCollections = () => {
  return {
    messagesRef,
    commentsRef
  };
};

export const useQuestionSubscription = () => {
  const [questions, setQuestions] = React.useState([]);

  const reply = (questionId, body, authorName, userId) => {
    const q = questionsRef
      .doc(`${questionId}`)
      .get()
      .then(snapshot => {
        const msg = snapshot.data();
        console.log(msg);
        if (!msg.comment) {
          console.log("creating new reply");
          questionsRef
            .doc(`${questionId}`)
            .update({
              comment: {
                body,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                authorName,
                uid: userId
              }
            });
          return;
        }
        questionsRef.doc(`${questionId}`).update({'comment.body': body})
      });
  };

  React.useEffect(() => {
    let unsubscribe = questionsRef.onSnapshot(
      querySnapshot => {
        const messages = {};
        querySnapshot.forEach(function(doc) {
          messages[doc.id] = doc.data();
        });
        if (messages) setQuestions(messages);
      },
      error => {
        typeof unsubscribe === "function" && unsubscribe();
        console.error(error);
      }
    );
  }, []);
  return { questions, reply };
};

export const useCommentsSubscription = id => {
  const [comments, setComments] = React.useState([]);
  if (!id) {
    setComments([]);
  }

  React.useEffect(() => {
    // listen for auth state changes
    let unsubscribe = commentsRef
      .where("parentId", "==", id)
      .orderBy("up", "desc")
      .onSnapshot(
        snapshot => {
          if (snapshot.empty) {
            console.log("No matching documents.");
            return;
          }
          const messages = {};
          snapshot.forEach(function(doc) {
            messages[doc.id] = doc.data();
          });
          if (messages) setComments(messages);
        },
        err => {
          console.log("Error getting documents", err);
          typeof unsubscribe === "function" && unsubscribe();
        }
      );
    // unsubscribe to the listener when unmounting
    return () => typeof unsubscribe === "function" && unsubscribe();
  }, []);

  return {
    comments
  };
};

export const useTopicSubscription = id => {
  const [topic, setTopic] = React.useState("");
  if (!id) {
    setTopic("");
  }

  React.useEffect(() => {
    // listen for auth state changes
    let unsubscribe = messagesRef
      .doc(id)
      .get()
      .then(snapshot => {
        if (snapshot.empty) {
          console.log("No matching documents.");
          return;
        }

        setTopic(snapshot.data());
      })
      .catch(err => {
        console.log("Error getting documents", err);
        typeof unsubscribe === "function" && unsubscribe();
      });
    // unsubscribe to the listener when unmounting
    return () => typeof unsubscribe === "function" && unsubscribe();
  }, []);

  return {
    topic
  };
};

export const useManageTopics = user => {
  const [messages, setMessages] = React.useState([]);
  const createTopic = (text, title, authorName, isPublished = true, summary, type) => {
    messagesRef.add({
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      text,
      title,
      summary,
      type,
      author: user.uid,
      up: 0,
      down: 0,
      authorName,
      isPublished,
      isDeleted: false
    });
  };

  const deleteTopic = id => {
    messagesRef.doc(`${id}`).update({ isDeleted: true, isPublished: false });
  };

  const updateTopic = (id, title, text, isPublished = true, summary, type) => {
    messagesRef.doc(`${id}`).update({ title, text, isPublished, summary, type });
  };

  React.useEffect(() => {
    // listen for auth state changes
    let unsubscribe = messagesRef.onSnapshot(
      querySnapshot => {
        const messages = {};
        querySnapshot.forEach(function(doc) {
          messages[doc.id] = doc.data();
        });
        if (messages) setMessages(messages);
      },
      error => {
        unsubscribe();
        console.error(error);
      }
    );
    // unsubscribe to the listener when unmounting
    return () => unsubscribe();
  }, []);

  return {
    createTopic,
    messages,
    deleteTopic,
    updateTopic
  };
};

export const signIn = () => {
  firebase
    .auth()
    .signInWithPopup(new firebase.auth.GoogleAuthProvider())
    .then(() => {
      window.location.href = '/'
    })
    .catch((e) => {
      console.error(e)
    })
}

export const signOut = () => {
  firebase
    .auth()
    .signOut()
    .catch((e) => {
      console.error(e)
    })
}

export const useAuth = () => {
  const [state, setState] = React.useState(() => {
    const user = firebase.auth().currentUser || null
    const initialState = {}
    if (user) {
      initialState.user = {uid: user.uid}
    }
    return initialState;
  });

  function onChange(user) {
    if (user) {
      setState({
        user: {
          uid: user.uid
        }
      });
    } else {
      window.location.href = '/login'
    }
  }

  React.useEffect(() => {
    // listen for auth state changes
    const unsubscribe = firebase.auth().onAuthStateChanged(onChange);
    // unsubscribe to the listener when unmounting
    return () => unsubscribe();
  }, []);

  return state;
};
