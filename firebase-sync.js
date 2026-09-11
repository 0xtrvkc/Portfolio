(function () {
  'use strict';

  const FIREBASE_VERSION = '12.19.0';
  const ADMIN_EMAIL = 'cryptotrvkc@gmail.com';
  const DOCUMENT_PATH = ['portfolio', 'public'];
  const firebaseConfig = {
    apiKey: 'AIzaSyDrROd3g_FiV3npk0ce6R-six9tNhkWdY0',
    authDomain: 'portfolio-backend-fe312.firebaseapp.com',
    projectId: 'portfolio-backend-fe312',
    storageBucket: 'portfolio-backend-fe312.firebasestorage.app',
    messagingSenderId: '1060133519344',
    appId: '1:1060133519344:web:a4d026474c343604682735',
    measurementId: 'G-RLG8X3FGPF'
  };

  if (window.TRVKCFirebase && typeof window.TRVKCFirebase.dispose === 'function') {
    window.TRVKCFirebase.dispose();
  }

  let auth = null;
  let db = null;
  let modules = null;
  let unsubscribeAuth = function () {};
  let unsubscribeDocument = function () {};
  let disposed = false;
  let documentExists = null;
  let cloudStatus = 'connecting';
  let lastError = '';
  let writeQueue = Promise.resolve();
  let queuedWrites = 0;
  let resolveFirstSnapshot;
  const firstSnapshot = new Promise(function (resolve) { resolveFirstSnapshot = resolve; });

  function normalizeEmail(value) {
    return String(value || '').trim().toLowerCase();
  }

  function isAdmin(user) {
    return Boolean(
      user &&
      user.emailVerified &&
      normalizeEmail(user.email) === ADMIN_EMAIL
    );
  }

  function state() {
    const user = auth && auth.currentUser;
    return {
      adminEmail: ADMIN_EMAIL,
      authorized: isAdmin(user),
      cloudStatus: cloudStatus,
      documentExists: documentExists,
      email: user && user.email || '',
      lastError: lastError,
      queuedWrites: queuedWrites,
      ready: Boolean(modules && auth && db)
    };
  }

  function emit(name, detail) {
    if (disposed) return;
    window.dispatchEvent(new CustomEvent('trvkc:' + name, { detail: detail }));
  }

  function friendlyError(error) {
    const code = error && error.code || '';
    if (code === 'auth/popup-closed-by-user') return 'Google sign-in was closed.';
    if (code === 'auth/popup-blocked') return 'Your browser blocked the Google sign-in popup. Allow popups and type iii again.';
    if (code === 'auth/unauthorized-domain') return 'This website domain is not authorized in Firebase Authentication.';
    if (code === 'permission-denied' || code === 'firestore/permission-denied') return 'Firebase rejected this write. Sign in with the approved Google account.';
    return error && error.message ? error.message : 'Firebase could not complete the request.';
  }

  const ready = Promise.all([
    import('https://www.gstatic.com/firebasejs/' + FIREBASE_VERSION + '/firebase-app.js'),
    import('https://www.gstatic.com/firebasejs/' + FIREBASE_VERSION + '/firebase-auth.js'),
    import('https://www.gstatic.com/firebasejs/' + FIREBASE_VERSION + '/firebase-firestore.js')
  ]).then(function (loaded) {
    if (disposed) throw new Error('Firebase bridge was disposed.');
    const appModule = loaded[0];
    const authModule = loaded[1];
    const firestoreModule = loaded[2];
    const app = appModule.getApps().length
      ? appModule.getApp()
      : appModule.initializeApp(firebaseConfig);

    auth = authModule.getAuth(app);
    auth.languageCode = 'en';
    db = firestoreModule.getFirestore(app);
    modules = {
      auth: authModule,
      firestore: firestoreModule,
      documentRef: firestoreModule.doc(db, DOCUMENT_PATH[0], DOCUMENT_PATH[1])
    };

    unsubscribeAuth = authModule.onAuthStateChanged(auth, function () {
      emit('auth-state', state());
    });

    unsubscribeDocument = firestoreModule.onSnapshot(modules.documentRef, function (snapshot) {
      documentExists = snapshot.exists();
      cloudStatus = queuedWrites > 0 ? 'saving' : (documentExists ? 'synced' : 'empty');
      lastError = '';
      resolveFirstSnapshot(state());

      if (!documentExists) {
        emit('cloud-empty', state());
        return;
      }

      const store = window.TRVKCPortfolio;
      const data = store ? store.normalize(snapshot.data()) : snapshot.data();
      if (store && queuedWrites === 0 && !snapshot.metadata.hasPendingWrites) store.save(data);
      emit('cloud-data', {
        data: data,
        hasPendingWrites: snapshot.metadata.hasPendingWrites || queuedWrites > 0,
        state: state()
      });
    }, function (error) {
      cloudStatus = 'error';
      lastError = friendlyError(error);
      resolveFirstSnapshot(state());
      emit('cloud-error', {
        message: lastError,
        state: state()
      });
    });

    emit('firebase-ready', state());
    return state();
  }).catch(function (error) {
    cloudStatus = 'error';
    lastError = friendlyError(error);
    resolveFirstSnapshot(state());
    emit('cloud-error', {
      message: lastError,
      state: state()
    });
    throw error;
  });
  ready.catch(function () {});

  async function signInAdmin() {
    await ready;
    if (isAdmin(auth.currentUser)) return state();

    const provider = new modules.auth.GoogleAuthProvider();
    provider.setCustomParameters({
      login_hint: ADMIN_EMAIL,
      prompt: 'select_account'
    });

    const result = await modules.auth.signInWithPopup(auth, provider);
    if (!isAdmin(result.user)) {
      const attemptedEmail = result.user && result.user.email || 'that account';
      await modules.auth.signOut(auth);
      const error = new Error('Access denied for ' + attemptedEmail + '. Use ' + ADMIN_EMAIL + '.');
      error.code = 'portfolio/wrong-account';
      throw error;
    }
    emit('auth-state', state());
    return state();
  }

  async function signOutAdmin() {
    await ready;
    await modules.auth.signOut(auth);
    emit('auth-state', state());
    return state();
  }

  function save(data) {
    const store = window.TRVKCPortfolio;
    const clean = store ? store.normalize(data) : data;
    queuedWrites += 1;

    writeQueue = writeQueue.catch(function () {}).then(async function () {
      try {
        await ready;
        if (!isAdmin(auth.currentUser)) {
          const error = new Error('Sign in with ' + ADMIN_EMAIL + ' before editing.');
          error.code = 'firestore/permission-denied';
          throw error;
        }

        cloudStatus = 'saving';
        emit('cloud-saving', state());
        await modules.firestore.setDoc(modules.documentRef, {
          schemaVersion: clean.schemaVersion,
          tools: clean.tools,
          creative: clean.creative,
          updatedAt: modules.firestore.serverTimestamp(),
          updatedBy: auth.currentUser.email
        });
        documentExists = true;
        lastError = '';
        return clean;
      } catch (error) {
        lastError = friendlyError(error);
        cloudStatus = 'error';
        emit('cloud-error', { message: lastError, state: state() });
        throw error;
      } finally {
        queuedWrites = Math.max(0, queuedWrites - 1);
        cloudStatus = lastError ? 'error' : (queuedWrites > 0 ? 'saving' : 'synced');
        emit('cloud-saved', state());
      }
    });

    return writeQueue;
  }

  async function ensureDocument(data) {
    await ready;
    await firstSnapshot;
    if (cloudStatus === 'error') throw new Error(lastError || 'Firestore is unavailable.');
    if (documentExists) return false;
    await save(data);
    return true;
  }

  function dispose() {
    if (disposed) return;
    disposed = true;
    unsubscribeAuth();
    unsubscribeDocument();
  }

  window.TRVKCFirebase = Object.freeze({
    adminEmail: ADMIN_EMAIL,
    dispose: dispose,
    ensureDocument: ensureDocument,
    friendlyError: friendlyError,
    getState: state,
    ready: ready,
    save: save,
    signInAdmin: signInAdmin,
    signOutAdmin: signOutAdmin
  });
  emit('firebase-bridge-ready', state());
})();
