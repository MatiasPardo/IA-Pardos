const fs = require('fs');
const path = require('path');

class UserService {
    constructor() {
        this.dataDir = '/app/data';
        this.usersFile = path.join(this.dataDir, 'users.json');
        this.ensureDataDir();
        this.users = this.loadUsers();
    }

    ensureDataDir() {
        if (!fs.existsSync(this.dataDir)) {
            fs.mkdirSync(this.dataDir, { recursive: true });
        }
    }

    loadUsers() {
        try {
            return JSON.parse(fs.readFileSync(this.usersFile, 'utf8'));
        } catch {
            return {};
        }
    }

    saveUsers() {
        fs.writeFileSync(this.usersFile, JSON.stringify(this.users, null, 2));
    }

    userExists(username) {
        return !!this.users[username];
    }

    createUser(username, hashedPassword) {
        this.users[username] = { password: hashedPassword };
        this.saveUsers();
    }

    validateUser(username, hashedPassword) {
        return this.users[username] && this.users[username].password === hashedPassword;
    }
}

module.exports = new UserService();