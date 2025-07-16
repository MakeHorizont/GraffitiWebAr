class Rewards {
    constructor(db) {
        this.db = db;
    }

    async addReward(user, amount) {
        const profile = await this.db.get(user) || {};
        profile.reputation = (profile.reputation || 0) + amount;
        await this.db.put(user, profile);
    }
}

module.exports = Rewards;
