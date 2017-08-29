function importAll(r) {
    r.keys().forEach(r);
}

importAll(require.context('./src', true, /spec\.js$/));
