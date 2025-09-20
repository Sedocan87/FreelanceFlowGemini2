export const onAuthStateChanged = jest.fn((auth, callback) => {
    const user = {
        uid: 'test-user',
        getIdToken: () => Promise.resolve('test-token'),
    };
    callback(user);
    return jest.fn();
});
export const getAuth = jest.fn();
