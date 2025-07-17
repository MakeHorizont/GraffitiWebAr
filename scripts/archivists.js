const OrbitDB = require('orbit-db');

class Archivists {
    constructor(orbitdb) {
        this.orbitdb = orbitdb;
    }

    async processModerationProposals() {
        const moderationProposalsDb = await this.orbitdb.keyvalue('moderation-proposals-db');
        const proposals = await moderationProposalsDb.all();

        for (const id in proposals) {
            const proposal = proposals[id];
            if (proposal.status === 'pending') {
                let totalWeight = 0;
                let approveWeight = 0;

                for (const did in proposal.votes) {
                    const vote = proposal.votes[did];
                    totalWeight += vote.weight;
                    if (vote.vote === 'approve') {
                        approveWeight += vote.weight;
                    }
                }

                if (approveWeight / totalWeight > 0.5) {
                    const db = await this.orbitdb.keyvalue('vestigium-db');
                    const objectData = await db.get(proposal.cid);
                    if (objectData) {
                        await db.put(proposal.cid, { ...objectData, status: 'hidden' });
                        await moderationProposalsDb.put(id, { ...proposal, status: 'approved' });
                    }
                } else {
                    await moderationProposalsDb.put(id, { ...proposal, status: 'rejected' });
                }
            }
        }
    }
}

module.exports = Archivists;
