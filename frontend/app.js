// app.js
const errorMessage = document.getElementById('error-message');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
// firebase-config.js
const firebaseConfig = {
  apiKey: "AIzaSyDx46VdUS4cXafQZFt4KmKDLh0YxUzmSes",
  authDomain: "capstone-test-442213.firebaseapp.com",
  projectId: "capstone-test-442213",
  storageBucket: "capstone-test-442213.firebasestorage.app",
  messagingSenderId: "917166323879",
  appId: "1:917166323879:web:b934200c1ce48c226e0382",
  measurementId: "G-6E1YZBH6XR"
};

const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.getAuth(app);

function login() {
  const email = emailInput.value;
  const password = passwordInput.value;

  if (email && password) {
    firebase
      .signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Login berhasil
        window.location.href = 'dashboard.html';  // Redirect ke halaman lain setelah login sukses
      })
      .catch((error) => {
        // Menampilkan pesan kesalahan jika login gagal
        errorMessage.textContent = 'Invalid email or password';
        errorMessage.classList.remove('hidden');
      });
  } else {
    errorMessage.textContent = 'Email and password are required';
    errorMessage.classList.remove('hidden');
  }
}
