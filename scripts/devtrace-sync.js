const fs = require('fs');
const admin = require('firebase-admin');

// 1. Verify secrets are present
if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
  console.error("Error: FIREBASE_SERVICE_ACCOUNT environment variable is missing.");
  process.exit(1);
}

// 2. Initialize Firebase Admin SDK
try {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} catch (e) {
  console.error("Error parsing FIREBASE_SERVICE_ACCOUNT secret JSON:", e);
  process.exit(1);
}

const db = admin.firestore();

// 3. Load the GitHub Action Event Payload
const eventName = process.env.GITHUB_EVENT_NAME;
const eventPath = process.env.GITHUB_EVENT_PATH;

if (!eventPath || !fs.existsSync(eventPath)) {
  console.error("Error: GITHUB_EVENT_PATH file not found.");
  process.exit(1);
}

const payload = JSON.parse(fs.readFileSync(eventPath, 'utf8'));
console.log(`Processing event: "${eventName}"`);

async function run() {
  if (eventName === 'issues') {
    const issue = payload.issue;
    const action = payload.action; // opened, edited, closed, reopened, deleted
    const docId = `git-issue-${issue.number}`;

    if (action === 'deleted') {
      console.log(`Deleting Firestore bug document: ${docId}`);
      await db.collection('bugs').doc(docId).delete();
      console.log("Deleted successfully.");
      return;
    }

    // Determine DevTrace Status from GitHub state
    let status = 'UNCONFIRMED';
    let resolvedAt = null;
    let resolution = null;

    if (issue.state === 'closed') {
      status = 'CLOSED';
      resolvedAt = new Date().toISOString();
      resolution = 'FIXED';
    } else if (issue.assignee) {
      status = 'IN_PROGRESS';
    } else {
      status = 'CONFIRMED';
    }

    // Map GitHub labels to severity/priority
    let severity = 'NORMAL';
    let priority = 'NORMAL';
    const labels = (issue.labels || []).map(l => l.name.toLowerCase());
    
    if (labels.some(l => l.includes('critical') || l.includes('blocker') || l.includes('p0'))) {
      severity = 'BLOCKER';
      priority = 'CRITICAL';
    } else if (labels.some(l => l.includes('high') || l.includes('p1'))) {
      severity = 'CRITICAL';
      priority = 'HIGH';
    } else if (labels.some(l => l.includes('low') || l.includes('p3'))) {
      severity = 'LOW';
      priority = 'LOW';
    }

    const bugDoc = {
      id: docId,
      title: `[GitHub #${issue.number}] ${issue.title}`,
      description: issue.body || 'No description provided.',
      product: 'GitHub Synced',
      status: status,
      severity: severity,
      priority: priority,
      assignee: issue.assignee ? issue.assignee.login : 'Unassigned',
      assigneeEmail: issue.assignee ? `${issue.assignee.login}@users.noreply.github.com` : 'unassigned@devtrace.io',
      reporter: issue.user.login,
      reporterEmail: `${issue.user.login}@users.noreply.github.com`,
      createdAt: issue.created_at,
      updatedAt: issue.updated_at,
      resolvedAt: resolvedAt,
      resolution: resolution,
      tags: ['github', ...labels],
      comments: [],
      auditLog: [
        {
          id: `audit-${Date.now()}`,
          timestamp: new Date().toISOString(),
          user: 'GitHub Webhook',
          field: 'Integration',
          oldValue: 'None',
          newValue: `Synced issue action: ${action}`
        }
      ],
      flags: [],
      blocks: [],
      dependsOn: [],
      timeTracking: { deadline: null, estimatedHours: 0, actualHours: 0 },
      security: { isEmbargoed: false, restrictedGroups: [] },
      attachments: []
    };

    console.log(`Writing GitHub Issue #${issue.number} to Firestore:`, docId);
    await db.collection('bugs').doc(docId).set(bugDoc, { merge: true });
    console.log("Write completed successfully!");

  } else if (eventName === 'push') {
    // Process Commits to log fixes / updates
    const commits = payload.commits || [];
    console.log(`Processing push event with ${commits.length} commits.`);

    for (const commit of commits) {
      const commitId = commit.id.slice(0, 7);
      const docId = `git-commit-${commitId}`;
      const message = commit.message || '';
      
      // Auto-resolve reference parser (e.g. "fix: #44", "resolves #12")
      const fixMatch = message.match(/(?:close|closes|resolve|resolves|fix|fixes)\s+#(\d+)/i);
      if (fixMatch) {
        const issueNumber = fixMatch[1];
        const targetIssueDocId = `git-issue-${issueNumber}`;
        console.log(`Commit ${commitId} fixes Issue #${issueNumber}. Auto-resolving Firestore document.`);
        
        const bugRef = db.collection('bugs').doc(targetIssueDocId);
        const bugDoc = await bugRef.get();
        if (bugDoc.exists) {
          const now = new Date().toISOString();
          await bugRef.update({
            status: 'CLOSED',
            resolvedAt: now,
            resolution: 'FIXED',
            updatedAt: now,
            auditLog: admin.firestore.FieldValue.arrayUnion({
              id: `audit-${Date.now()}`,
              timestamp: now,
              user: commit.author.name,
              field: 'Status',
              oldValue: bugDoc.data().status,
              newValue: 'CLOSED'
            })
          });
          console.log(`Issue #${issueNumber} successfully closed via commit.`);
        }
      }

      // Record commit push details as low priority audit stickers for visibility
      const commitDoc = {
        id: docId,
        title: `[Commit] ${message.split('\n')[0]}`,
        description: `Commit pushed to ${payload.ref} by ${commit.author.name} (${commit.author.email})\n\nFull Commit Message:\n${message}\n\nSHA: ${commit.id}\nURL: ${commit.url}`,
        product: 'GitHub Synced',
        status: 'CLOSED',
        severity: 'LOW',
        priority: 'LOW',
        assignee: commit.author.name,
        assigneeEmail: commit.author.email,
        reporter: commit.author.name,
        reporterEmail: commit.author.email,
        createdAt: commit.timestamp,
        updatedAt: commit.timestamp,
        resolvedAt: commit.timestamp,
        resolution: 'FIXED',
        tags: ['commit', 'github'],
        comments: [],
        auditLog: [],
        flags: [],
        blocks: [],
        dependsOn: [],
        timeTracking: { deadline: null, estimatedHours: 0, actualHours: 0 },
        security: { isEmbargoed: false, restrictedGroups: [] },
        attachments: []
      };

      console.log(`Writing GitHub Commit ${commitId} to Firestore:`, docId);
      await db.collection('bugs').doc(docId).set(commitDoc, { merge: true });
    }
    console.log("Processed all commits successfully!");
  } else {
    console.log(`Unhandleable GitHub event: ${eventName}. Skipping.`);
  }
}

run()
  .then(() => {
    console.log("GitHub sync complete.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Error running GitHub sync script:", err);
    process.exit(1);
  });
