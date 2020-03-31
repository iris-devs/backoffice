import React from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "isomorphic-unfetch";

function getCollectionRef(name) {
  return firebase.firestore().collection(name);
}

export const useQuestionSubscription = () => {
  const [questions, setQuestions] = React.useState([]);

  const reply = (questionId, body, authorName, userId) => {
    const q = getCollectionRef('questions')
      .doc(`${questionId}`)
      .get()
      .then(snapshot => {
        const msg = snapshot.data();
        console.log(msg);
        if (!msg.comment) {
          console.log("creating new reply");
          getCollectionRef('questions')
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
        getCollectionRef('questions').doc(`${questionId}`).update({'comment.body': body})
      });
  };

  React.useEffect(() => {
    let unsubscribe = getCollectionRef('questions').onSnapshot(
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
    let unsubscribe = getCollectionRef('comments')
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
    let unsubscribe = getCollectionRef('messages')
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
    getCollectionRef('messages').add({
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
    getCollectionRef('messages').doc(`${id}`).update({ isDeleted: true, isPublished: false });
  };

  const updateTopic = (id, title, text, isPublished = true, summary, type) => {
    getCollectionRef('messages').doc(`${id}`).update({ title, text, isPublished, summary, type });
  };

  React.useEffect(() => {
    // listen for auth state changes
    let unsubscribe = getCollectionRef('messages').onSnapshot(
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
