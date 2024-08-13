// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "Your API Key",
  authDomain: "nadirah-s.firebaseapp.com",
  databaseURL: "https://nadirah-s-default-rtdb.firebaseio.com",
  projectId: "nadirah-s",
  storageBucket: "nadirah-s.appspot.com",
  messagingSenderId: "554923257359",
  appId: "1:554923257359:web:7954b9fb57063c916c3d7a",
  measurementId: "G-Y2CNHWGY0M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const analytics = getAnalytics(app);
const db = getFirestore(app);

// UI Elements
const recipeForm = document.getElementById('recipe-form');
const recipeList = document.getElementById('recipes');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');

// Authentication
loginBtn.addEventListener('click', () => {
    const email = prompt("Enter your email:");
    const password = prompt("Enter your password:");
    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            loginBtn.style.display = 'none';
            logoutBtn.style.display = 'block';
        })
        .catch(error => {
            console.error(error);
        });
});

logoutBtn.addEventListener('click', () => {
    signOut(auth)
        .then(() => {
            loginBtn.style.display = 'block';
            logoutBtn.style.display = 'none';
        })
        .catch(error => {
            console.error(error);
        });
});

// Submit Recipe
recipeForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const ingredients = document.getElementById('ingredients').value;
    const instructions = document.getElementById('instructions').value;
    const image = document.getElementById('image').value;

    try {
        await addDoc(collection(db, 'recipes'), {
            title,
            ingredients,
            instructions,
            image
        });
        recipeForm.reset();
    } catch (error) {
        console.error("Error adding document: ", error);
    }
});

// Display Recipes
onSnapshot(collection(db, 'recipes'), (snapshot) => {
    recipeList.innerHTML = '';
    snapshot.forEach(doc => {
        const data = doc.data();
        const recipeItem = document.createElement('div');
        recipeItem.className = 'recipe-item';
        recipeItem.innerHTML = `
            <h3>${data.title}</h3>
            <p><strong>Ingredients:</strong> ${data.ingredients}</p>
            <p><strong>Instructions:</strong> ${data.instructions}</p>
            ${data.image ? `<img src="${data.image}" alt="${data.title}" style="width:100%; max-width:300px;">` : ''}
        `;
        recipeList.appendChild(recipeItem);
    });
});
