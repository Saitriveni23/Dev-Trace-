import type { Bug, Product, UserProfile, SavedSearch } from '../types';

export const CURRENT_USER: UserProfile = {
  id: 'usr-1',
  username: 'triveni',
  name: 'Triveni',
  email: 'triveni@devtrace.io',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&fit=crop&q=80',
  role: 'Lead Detective',
  groups: ['security-core', 'kernel-maintainers', 'triagers', 'qa-team'],
};

export const USERS: UserProfile[] = [
  CURRENT_USER,
  {
    id: 'usr-2',
    username: 'alex.rivera',
    name: 'Alex Rivera',
    email: 'alex@devtrace.io',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&fit=crop&q=80',
    role: 'Senior Clue Analyst',
    groups: ['security-core', 'triagers'],
  },
  {
    id: 'usr-3',
    username: 'priya.menon',
    name: 'Priya Menon',
    email: 'priya@devtrace.io',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=128&fit=crop&q=80',
    role: 'Evidence Specialist',
    groups: ['kernel-maintainers', 'storage-leads'],
  },
  {
    id: 'usr-4',
    username: 'jordan.kim',
    name: 'Jordan Kim',
    email: 'jordan@devtrace.io',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&fit=crop&q=80',
    role: 'Junior Inspector',
    groups: ['qa-team', 'triagers'],
  },
  {
    id: 'usr-5',
    username: 'morgan.lee',
    name: 'Morgan Lee',
    email: 'morgan@devtrace.io',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=128&fit=crop&q=80',
    role: 'Design Sleuth',
    groups: ['frontend-devs'],
  },
  {
    id: 'usr-6',
    username: 'marcus.thorne',
    name: 'Marcus Thorne',
    email: 'marcus@devtrace.io',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=128&fit=crop&q=80',
    role: 'Core Maintainer',
    groups: ['kernel-maintainers', 'distributed-systems'],
  }
];

export const PRODUCTS: Product[] = [
  {
    id: 'prod-quantum',
    name: 'Saitriveni/Dev-Trace-',
    description: 'High-performance next-generation browser rendering & JIT compiler engine',
    icon: 'Atom',
    versions: ['v118.0', 'v119.0-rc1', 'v120.0-nightly', 'v121.0-alpha'],
    milestones: ['Milestone 118', 'Milestone 119', 'Milestone 120', 'Milestone 121'],
    components: [
      {
        id: 'comp-layout',
        name: 'Layout & Box Tree',
        description: 'CSS Grid, Flexbox, subgrid calculations and layout containment engine',
        defaultAssignee: 'triveni@devtrace.io',
        defaultQaContact: 'jordan@devtrace.io',
        subcomponents: ['Subgrid', 'Intrinsic Sizing', 'Pagination']
      },
      {
        id: 'comp-v8',
        name: 'V8-Bindings & JIT',
        description: 'ECMAScript runtime bridges, Maglev/TurboFan optimization pipelines',
        defaultAssignee: 'priya@devtrace.io',
        defaultQaContact: 'jordan@devtrace.io',
        subcomponents: ['TurboFan', 'GC Tracing', 'Wasm Bridge']
      },
      {
        id: 'comp-gpu',
        name: 'GPU Rasterizer',
        description: 'Vulkan/Metal hardware accelerated tile drawing & compositor',
        defaultAssignee: 'marcus@devtrace.io',
        defaultQaContact: 'jordan@devtrace.io',
        subcomponents: ['Vulkan Backend', 'Metal Pipeline', 'Texture Atlas']
      },
      {
        id: 'comp-net',
        name: 'Network & QUIC',
        description: 'HTTP/3, WebTransport, TLS 1.3 socket management and certificate pin',
        defaultAssignee: 'alex@devtrace.io',
        defaultQaContact: 'jordan@devtrace.io',
        subcomponents: ['QUIC Transport', 'DNS over HTTPS', 'Brotli Stream']
      }
    ]
  },
  {
    id: 'prod-aether',
    name: 'Saitriveni/LibraryManagementSystem',
    description: 'Geo-distributed, multi-raft linearizable ACID transactional key-value store',
    icon: 'Database',
    versions: ['v2.3.4', 'v2.4.0-GA', 'v2.5.0-beta2', 'v3.0.0-dev'],
    milestones: ['Q3 Release (v2.4)', 'Q4 Milestone (v2.5)', 'Aether v3.0 Revolution'],
    components: [
      {
        id: 'comp-raft',
        name: 'Raft Consensus Engine',
        description: 'Leader election, log replication, snapshotting and joint consensus',
        defaultAssignee: 'marcus@devtrace.io',
        defaultQaContact: 'jordan@devtrace.io',
        subcomponents: ['Lease Read', 'PreVote', 'Log Compaction']
      },
      {
        id: 'comp-lsm',
        name: 'LSM Storage Engine',
        description: 'MemTable flush, SSTable compaction, Block cache, and Bloom filters',
        defaultAssignee: 'priya@devtrace.io',
        defaultQaContact: 'jordan@devtrace.io',
        subcomponents: ['Universal Compaction', 'Direct I/O', 'Key Encoding']
      },
      {
        id: 'comp-tx',
        name: 'Distributed Transactions',
        description: '2PC, Percolator-style optimistic concurrency control & MVCC garbage collection',
        defaultAssignee: 'triveni@devtrace.io',
        defaultQaContact: 'jordan@devtrace.io',
        subcomponents: ['Latch Manager', 'Lock Resolver', 'Snapshot Isolation']
      }
    ]
  },
  {
    id: 'prod-cryptovault',
    name: 'Saitriveni/clonefest-',
    description: 'Hardware Security Module (HSM) orchestration, Zero-Knowledge proofs and KMS',
    icon: 'ShieldCheck',
    versions: ['v4.1.2', 'v4.2.0-stable', 'v5.0.0-rc1'],
    milestones: ['v4.2 Security Release', 'v5.0 Post-Quantum Upgrade'],
    components: [
      {
        id: 'comp-zk',
        name: 'ZK-SNARK Prover',
        description: 'PlonK and Halo2 zero-knowledge circuit generation and verification',
        defaultAssignee: 'alex@devtrace.io',
        defaultQaContact: 'jordan@devtrace.io',
        subcomponents: ['Circuit Synthesizer', 'SRS Setup', 'Field Arithmetic']
      },
      {
        id: 'comp-hsm',
        name: 'HSM Driver & PKCS#11',
        description: 'Hardware crypto accelerator, secure enclave isolation and key wrapping',
        defaultAssignee: 'alex@devtrace.io',
        defaultQaContact: 'jordan@devtrace.io',
        subcomponents: ['PKCS#11 Bridge', 'Secure Enclave', 'FIPS 140-3 Validator']
      }
    ]
  },
  {
    id: 'prod-hyperflow',
    name: 'Saitriveni/Project',
    description: 'Real-time observability canvas, AST explorer and interactive debugger',
    icon: 'Layers',
    versions: ['v1.8.2', 'v1.9.0-rc3', 'v2.0.0-beta'],
    milestones: ['Spring 2026 Sprint', 'HyperFlow 2.0 Launch'],
    components: [
      {
        id: 'comp-canvas',
        name: 'DAG Graph Visualizer',
        description: 'High-performance WebGL/SVG dependency rendering and layout solver',
        defaultAssignee: 'morgan@devtrace.io',
        defaultQaContact: 'jordan@devtrace.io',
        subcomponents: ['Force Layout', 'Viewport Culling', 'Path Routing']
      },
      {
        id: 'comp-editor',
        name: 'Monaco Code Workspace',
        description: 'Multi-buffer editor, Language Server Protocol client and inline diffs',
        defaultAssignee: 'morgan@devtrace.io',
        defaultQaContact: 'jordan@devtrace.io',
        subcomponents: ['LSP Bridge', 'Syntax Worker', 'Minimap']
      }
    ]
  }
];

export const INITIAL_BUGS: Bug[] = [
  {
    id: 'DT-1024',
    numId: 1024,
    title: 'Heap use-after-free in V8-to-DOM wrapper during concurrent GC cycle',
    description: `### Summary
During rapid DOM tree node detach operations combined with concurrent V8 incremental mark-and-sweep garbage collection, weak references in the wrapper cache fail to clear before memory reclamation, leading to arbitrary memory corruption.

### Reproduction Steps
1. Navigate to stress benchmark \`/tests/dom/weakref_cycle_bench.html\`
2. Spawn 16 Web Workers creating and deleting 50,000 disconnected DOM subtrees
3. Force V8 incremental GC via \`window.gc({ type: 'major', execution: 'async' })\`
4. Inspect ASan output; observable crash at address \`0x7ffe83912040\`.

### Expected Result
Weak reference handles are cleared safely in epilogue hook before page memory is recycled.

### Actual Result
ASan panic: Heap-use-after-free on address \`0x7ffe83912040\` reading 8 bytes.`,
    product: 'Saitriveni/Dev-Trace-',
    component: 'V8-Bindings & JIT',
    version: 'v119.0-rc1',
    targetMilestone: 'Milestone 119',
    status: 'IN_PROGRESS',
    resolution: null,
    duplicateBugs: [],
    severity: 'BLOCKER',
    priority: 'P1',
    reporter: 'Jordan Kim',
    reporterEmail: 'jordan@devtrace.io',
    assignee: 'Priya Menon',
    assigneeEmail: 'priya@devtrace.io',
    qaContact: 'jordan@devtrace.io',
    ccList: ['triveni@devtrace.io', 'alex@devtrace.io'],
    os: 'Linux',
    architecture: 'x86_64',
    environment: 'glibc 2.39, V8 v12.4.254.12, Clang 18.1 with ASan enabled',
    tags: ['security', 'asan', 'gc-leak', 'v8', 'blocker-119'],
    flags: [
      {
        id: 'flg-1',
        type: 'sec-audit',
        status: '+',
        requestee: 'alex@devtrace.io',
        setter: 'alex@devtrace.io',
        timestamp: '2026-08-25T14:30:00Z',
        note: 'High severity CVE candidate. PoC verified in sandbox.'
      },
      {
        id: 'flg-2',
        type: 'review',
        status: '?',
        requestee: 'triveni@devtrace.io',
        setter: 'priya@devtrace.io',
        timestamp: '2026-08-26T09:15:00Z',
        note: 'Submitted patch for wrapper cache tombstoning. Please review.'
      },
      {
        id: 'flg-3',
        type: 'rel-blocker',
        status: '+',
        requestee: 'marcus@devtrace.io',
        setter: 'marcus@devtrace.io',
        timestamp: '2026-08-25T16:00:00Z',
        note: 'Cannot ship v119.0-rc1 with reproducible heap corruption.'
      }
    ],
    dependsOn: ['DT-1018'],
    blocks: ['DT-1030', 'DT-1045'],
    security: {
      isEmbargoed: true,
      cveId: 'CVE-2026-38291',
      cvssScore: 8.8,
      cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:H/I:H/A:H',
      embargoExpiry: '2026-09-15T00:00:00Z',
      restrictedGroups: ['security-core', 'kernel-maintainers'],
      publicDisclosurePlan: 'Coordinated disclosure with Chromium and WebKit teams after v119.0 GA release.'
    },
    timeTracking: {
      estimatedHours: 24,
      spentHours: 18,
      remainingHours: 6,
      deadline: '2026-08-29'
    },
    stackTrace: `==19842==ERROR: AddressSanitizer: heap-use-after-free on address 0x7ffe83912040 at pc 0x55a298418302 bp 0x7ffc83a18010 sp 0x7ffc83a18008
READ of size 8 at 0x7ffe83912040 thread T0 (QuantumMain)
    #0 0x55a298418301 in quantum::v8::DOMWrapper::Unwrap() src/bindings/dom_wrapper.cc:184:5
    #1 0x55a298419208 in quantum::v8::GCWeakCallback(v8::WeakCallbackInfo<quantum::Node> const&) src/bindings/v8_gc_callbacks.cc:92:14
    #2 0x7fa2b9812440 in v8::internal::GlobalHandles::InvokeSecondPassPhantomCallbacks() deps/v8/src/handles/global-handles.cc:842:9
    #3 0x7fa2b9820114 in v8::internal::Heap::PerformGarbageCollection() deps/v8/src/heap/heap.cc:2104:17
    #4 0x55a298402919 in quantum::RunMessageLoop() src/core/engine_loop.cc:340:11`,
    gitCommitSha: '9f8b4a2e1d0c',
    gitBranch: 'fix/v8-weakref-tombstone',
    pullRequestUrl: 'https://github.com/devtrace-org/quantum-engine/pull/842',
    comments: [
      {
        id: 'c-1',
        author: 'Jordan Kim',
        authorEmail: 'jordan@devtrace.io',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&fit=crop&q=80',
        timestamp: '2026-08-25T11:20:00Z',
        content: 'Discovered during automated fuzzing run on cluster worker #4. Standalone reproducer script attached to crash logs.',
        reactions: [{ emoji: '👀', users: ['triveni', 'alex.rivera'] }]
      },
      {
        id: 'c-2',
        author: 'Priya Menon',
        authorEmail: 'priya@devtrace.io',
        authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=128&fit=crop&q=80',
        timestamp: '2026-08-26T09:18:00Z',
        content: `I've implemented a double-checked generational lock on the \`DOMWrapper::Unwrap()\` pathway. Here is the diff patch for the review flag:`,
        patchDiff: `@@ -181,6 +181,14 @@ Node* DOMWrapper::Unwrap() {
+   if (V8_UNLIKELY(m_isTombstoned.load(std::memory_order_acquire))) {
+       LOG_SECURITY_WARNING("Attempted access on tombstoned DOMWrapper handle");
+       return nullptr;
+   }
    std::lock_guard<std::mutex> lock(m_wrapperMutex);
    return m_nativePointer;`,
        reactions: [{ emoji: '🚀', users: ['marcus.thorne', 'triveni'] }]
      }
    ],
    attachments: [
      {
        id: 'att-1',
        name: 'asan_repro_dump.log',
        size: 148200,
        type: 'crashdump',
        uploadedBy: 'jordan@devtrace.io',
        uploadedAt: '2026-08-25T11:22:00Z'
      },
      {
        id: 'att-2',
        name: 'patch_dom_wrapper_v1.diff',
        size: 4200,
        type: 'patch',
        uploadedBy: 'priya@devtrace.io',
        uploadedAt: '2026-08-26T09:17:00Z'
      }
    ],
    auditLog: [
      {
        id: 'aud-1',
        timestamp: '2026-08-25T11:15:00Z',
        user: 'jordan.kim',
        field: 'Status',
        oldValue: 'UNCONFIRMED',
        newValue: 'CONFIRMED'
      },
      {
        id: 'aud-2',
        timestamp: '2026-08-25T11:30:00Z',
        user: 'alex.rivera',
        field: 'Security Embargo',
        oldValue: 'Public',
        newValue: 'Embargoed (CVE-2026-38291)'
      },
      {
        id: 'aud-3',
        timestamp: '2026-08-25T12:00:00Z',
        user: 'jordan.kim',
        field: 'Assignee',
        oldValue: 'unassigned@devtrace.io',
        newValue: 'priya@devtrace.io'
      },
      {
        id: 'aud-4',
        timestamp: '2026-08-25T12:05:00Z',
        user: 'priya.menon',
        field: 'Status',
        oldValue: 'CONFIRMED',
        newValue: 'IN_PROGRESS'
      }
    ],
    createdAt: '2026-08-25T11:15:00Z',
    updatedAt: '2026-08-26T09:18:00Z'
  },
  {
    id: 'DT-1018',
    numId: 1018,
    title: 'Thread-safety violation in global isolate handle disposal lock table',
    description: `When tearing down secondary worker threads while GC sweep is in progress, the global isolate lock table is modified without holding the read-write lock, creating a data race detected by ThreadSanitizer (TSan).`,
    product: 'Saitriveni/Dev-Trace-',
    component: 'V8-Bindings & JIT',
    version: 'v119.0-rc1',
    targetMilestone: 'Milestone 119',
    status: 'CONFIRMED',
    resolution: null,
    duplicateBugs: [],
    severity: 'CRITICAL',
    priority: 'P1',
    reporter: 'Triveni',
    reporterEmail: 'triveni@devtrace.io',
    assignee: 'Priya Menon',
    assigneeEmail: 'priya@devtrace.io',
    qaContact: 'jordan@devtrace.io',
    ccList: ['priya@devtrace.io'],
    os: 'Linux',
    architecture: 'x86_64',
    environment: 'Clang 18 TSan enabled',
    tags: ['thread-safety', 'tsan', 'v8', 'core'],
    flags: [
      {
        id: 'flg-4',
        type: 'needinfo',
        status: '?',
        requestee: 'marcus@devtrace.io',
        setter: 'priya@devtrace.io',
        timestamp: '2026-08-24T16:20:00Z',
        note: 'Need verification if lock contention impacts multi-tenant worker latency.'
      }
    ],
    dependsOn: [],
    blocks: ['DT-1024'],
    security: {
      isEmbargoed: false,
      restrictedGroups: []
    },
    timeTracking: {
      estimatedHours: 16,
      spentHours: 8,
      remainingHours: 8
    },
    comments: [
      {
        id: 'c-3',
        author: 'Triveni',
        authorEmail: 'triveni@devtrace.io',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&fit=crop&q=80',
        timestamp: '2026-08-24T10:00:00Z',
        content: 'TSan report logged during worker pool stress test. Must resolve before DT-1024 UAF patch can safely merge.',
        reactions: []
      }
    ],
    attachments: [],
    auditLog: [
      {
        id: 'aud-5',
        timestamp: '2026-08-24T10:00:00Z',
        user: 'triveni',
        field: 'Status',
        oldValue: 'UNCONFIRMED',
        newValue: 'CONFIRMED'
      }
    ],
    createdAt: '2026-08-24T10:00:00Z',
    updatedAt: '2026-08-24T16:20:00Z'
  },
  {
    id: 'DT-1030',
    numId: 1030,
    title: 'Subgrid nested track alignment collapses to zero height on flex child',
    description: `When a grid item within a parent subgrid specifies \`grid-template-rows: subgrid\` inside an auto-height flexbox container, the computed block size evaluates to zero during the second layout reflow pass.`,
    product: 'Saitriveni/Dev-Trace-',
    component: 'Layout & Box Tree',
    version: 'v119.0-rc1',
    targetMilestone: 'Milestone 119',
    status: 'CONFIRMED',
    resolution: null,
    duplicateBugs: [],
    severity: 'MAJOR',
    priority: 'P2',
    reporter: 'Morgan Lee',
    reporterEmail: 'morgan@devtrace.io',
    assignee: 'Triveni',
    assigneeEmail: 'triveni@devtrace.io',
    qaContact: 'jordan@devtrace.io',
    ccList: ['morgan@devtrace.io'],
    os: 'macOS',
    architecture: 'ARM64',
    environment: 'macOS Sonoma 14.5 (Apple M3 Max)',
    tags: ['css-subgrid', 'layout', 'flexbox', 'reflow'],
    flags: [
      {
        id: 'flg-5',
        type: 'review',
        status: '+',
        requestee: 'triveni@devtrace.io',
        setter: 'priya@devtrace.io',
        timestamp: '2026-08-26T08:00:00Z',
        note: 'Test case suite verified across WPT (Web Platform Tests).'
      }
    ],
    dependsOn: ['DT-1024'],
    blocks: [],
    security: {
      isEmbargoed: false,
      restrictedGroups: []
    },
    timeTracking: {
      estimatedHours: 12,
      spentHours: 6,
      remainingHours: 6
    },
    comments: [
      {
        id: 'c-4',
        author: 'Morgan Lee',
        authorEmail: 'morgan@devtrace.io',
        authorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=128&fit=crop&q=80',
        timestamp: '2026-08-25T13:45:00Z',
        content: 'Reported by frontend teams building complex dashboard grids with nested subgrids.',
        reactions: [{ emoji: '👍', users: ['triveni'] }]
      }
    ],
    attachments: [],
    auditLog: [],
    createdAt: '2026-08-25T13:45:00Z',
    updatedAt: '2026-08-26T08:00:00Z'
  },
  {
    id: 'DT-1045',
    numId: 1045,
    title: 'Raft split-brain candidate state deadlock on partition recovery in 5-node cluster',
    description: `### Failure Scenario
In a 5-node Raft deployment experiencing asymmetric network partitioning (nodes A & B partitioned from C, D, E), if leader re-election triggers simultaneously on both partitions, node C gets stuck in candidate state due to uncoordinated PreVote tick timer reset.

### Observed Impact
Cluster enters sustained 12-second election timeout storm with 100% CPU on Raft actor threads.

### Logs
\`[RAFT-CRIT] Node 3 candidate term 4821 failed quorum: received 2/5 votes (needed 3). Resetting randomized timeout.\``,
    product: 'Saitriveni/LibraryManagementSystem',
    component: 'Raft Consensus Engine',
    version: 'v2.4.0-GA',
    targetMilestone: 'Q3 Release (v2.4)',
    status: 'IN_PROGRESS',
    resolution: null,
    duplicateBugs: [],
    severity: 'BLOCKER',
    priority: 'P1',
    reporter: 'Marcus Thorne',
    reporterEmail: 'marcus@devtrace.io',
    assignee: 'Marcus Thorne',
    assigneeEmail: 'marcus@devtrace.io',
    qaContact: 'jordan@devtrace.io',
    ccList: ['priya@devtrace.io', 'triveni@devtrace.io'],
    os: 'Linux',
    architecture: 'x86_64',
    environment: 'Debian 12, Linux Kernel 6.8, Jepsen Test Cluster #09',
    tags: ['raft', 'consensus', 'jepsen', 'split-brain', 'blocker'],
    flags: [
      {
        id: 'flg-6',
        type: 'review',
        status: '?',
        requestee: 'priya@devtrace.io',
        setter: 'marcus@devtrace.io',
        timestamp: '2026-08-26T11:00:00Z',
        note: 'Added randomized jitter on PreVote rejectback exponential backoff.'
      },
      {
        id: 'flg-7',
        type: 'qa-verify',
        status: '?',
        requestee: 'jordan@devtrace.io',
        setter: 'marcus@devtrace.io',
        timestamp: '2026-08-26T11:05:00Z',
        note: 'Needs 24-hour Jepsen Nemesis partition stress cycle.'
      }
    ],
    dependsOn: ['DT-1024'],
    blocks: ['DT-1060'],
    security: {
      isEmbargoed: false,
      restrictedGroups: []
    },
    timeTracking: {
      estimatedHours: 32,
      spentHours: 20,
      remainingHours: 12
    },
    stackTrace: `panic: [AETHER-RAFT-FATAL] Candidate term oscillation exceeded safety threshold
goroutine 882 [running]:
github.com/devtrace-org/aether/raft.(*RaftNode).campaign(0xc0019a8200, 0x1)
    /src/raft/raft_election.go:214 +0x49a
github.com/devtrace-org/aether/raft.(*RaftNode).handleMsgVoteResp(0xc0019a8200, {0x1, 0x3, 0x12d5, 0x0})
    /src/raft/raft_handlers.go:108 +0x32c
github.com/devtrace-org/aether/raft.(*RaftNode).Step(0xc0019a8200, {0x1, 0x3, 0x12d5, 0x0})
    /src/raft/raft.go:580 +0x889`,
    comments: [
      {
        id: 'c-5',
        author: 'Marcus Thorne',
        authorEmail: 'marcus@devtrace.io',
        authorAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=128&fit=crop&q=80',
        timestamp: '2026-08-25T17:30:00Z',
        content: 'Reproduced in Jepsen Nemesis test with 400ms network packet delay and 25% drop rate.',
        reactions: [{ emoji: '🔥', users: ['jordan.kim', 'priya.menon'] }]
      }
    ],
    attachments: [],
    auditLog: [
      {
        id: 'aud-6',
        timestamp: '2026-08-25T17:00:00Z',
        user: 'marcus.thorne',
        field: 'Status',
        oldValue: 'UNCONFIRMED',
        newValue: 'IN_PROGRESS'
      }
    ],
    createdAt: '2026-08-25T17:00:00Z',
    updatedAt: '2026-08-26T11:05:00Z'
  },
  {
    id: 'DT-1060',
    numId: 1060,
    title: 'LSM Compaction worker memory leak during high-throughput ingest burst',
    description: `During 150,000 writes/sec ingestion benchmarks, the L0-to-L1 SSTable compaction iterator retains discarded block index cache entries, causing RSS to climb by 800MB/hour until OOM killer intervenes.`,
    product: 'Saitriveni/LibraryManagementSystem',
    component: 'LSM Storage Engine',
    version: 'v2.4.0-GA',
    targetMilestone: 'Q3 Release (v2.4)',
    status: 'CONFIRMED',
    resolution: null,
    duplicateBugs: [],
    severity: 'CRITICAL',
    priority: 'P1',
    reporter: 'Priya Menon',
    reporterEmail: 'priya@devtrace.io',
    assignee: 'Priya Menon',
    assigneeEmail: 'priya@devtrace.io',
    qaContact: 'jordan@devtrace.io',
    ccList: ['marcus@devtrace.io'],
    os: 'Linux',
    architecture: 'x86_64',
    environment: 'Ubuntu 24.04 LTS, NVMe RAID-0, Jemalloc 5.3',
    tags: ['lsm', 'memory-leak', 'oom', 'storage', 'compaction'],
    flags: [],
    dependsOn: ['DT-1045'],
    blocks: [],
    security: {
      isEmbargoed: false,
      restrictedGroups: []
    },
    timeTracking: {
      estimatedHours: 20,
      spentHours: 4,
      remainingHours: 16
    },
    comments: [],
    attachments: [],
    auditLog: [],
    createdAt: '2026-08-26T04:10:00Z',
    updatedAt: '2026-08-26T07:20:00Z'
  },
  {
    id: 'DT-1012',
    numId: 1012,
    title: 'Zero-Knowledge circuit witness generation timing side-channel attack',
    description: `### Vulnerability Disclosure
Scalar multiplication operations in PlonK circuit gate synthesizers use non-constant-time modular inversion, permitting cache-timing side-channel recovery of private spending keys during zk-SNARK proof generation.

### Security Impact
Confidentiality breach on transaction shielding keys. CVSS score 7.5.`,
    product: 'Saitriveni/clonefest-',
    component: 'ZK-SNARK Prover',
    version: 'v4.1.2',
    targetMilestone: 'v4.2 Security Release',
    status: 'RESOLVED',
    resolution: 'FIXED',
    duplicateBugs: [],
    severity: 'CRITICAL',
    priority: 'P1',
    reporter: 'Alex Rivera',
    reporterEmail: 'alex@devtrace.io',
    assignee: 'Alex Rivera',
    assigneeEmail: 'alex@devtrace.io',
    qaContact: 'jordan@devtrace.io',
    ccList: ['triveni@devtrace.io'],
    os: 'All',
    architecture: 'Universal',
    environment: 'Curve25519 & BN254 field arithmetic library v2.1',
    tags: ['security', 'crypto', 'timing-attack', 'cve', 'embargoed'],
    flags: [
      {
        id: 'flg-8',
        type: 'sec-audit',
        status: '+',
        requestee: 'alex@devtrace.io',
        setter: 'alex@devtrace.io',
        timestamp: '2026-08-24T18:00:00Z',
        note: 'Constant-time Montgomery ladder implementation verified with Dudect timing suite.'
      },
      {
        id: 'flg-9',
        type: 'qa-verify',
        status: '+',
        requestee: 'jordan@devtrace.io',
        setter: 'jordan@devtrace.io',
        timestamp: '2026-08-25T15:00:00Z',
        note: 'Automated side-channel test suite passed 10M sample iterations.'
      }
    ],
    dependsOn: [],
    blocks: [],
    security: {
      isEmbargoed: true,
      cveId: 'CVE-2026-19284',
      cvssScore: 7.5,
      cvssVector: 'CVSS:3.1/AV:L/AC:H/PR:N/UI:N/S:C/C:H/I:N/A:N',
      embargoExpiry: '2026-09-01T00:00:00Z',
      restrictedGroups: ['security-core'],
      publicDisclosurePlan: 'Coordinated security bulletin with cryptographic audit partners.'
    },
    timeTracking: {
      estimatedHours: 40,
      spentHours: 38,
      remainingHours: 0
    },
    comments: [
      {
        id: 'c-6',
        author: 'Alex Rivera',
        authorEmail: 'alex@devtrace.io',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&fit=crop&q=80',
        timestamp: '2026-08-24T18:30:00Z',
        content: 'Fixed via commit 4c891f0a. Replaced naive inversion with constant-time Fermat little theorem exponentiation.',
        reactions: [{ emoji: '🎉', users: ['triveni', 'jordan.kim', 'priya.menon'] }]
      }
    ],
    attachments: [],
    auditLog: [
      {
        id: 'aud-7',
        timestamp: '2026-08-24T18:35:00Z',
        user: 'alex.rivera',
        field: 'Status',
        oldValue: 'IN_PROGRESS',
        newValue: 'RESOLVED'
      },
      {
        id: 'aud-8',
        timestamp: '2026-08-24T18:35:00Z',
        user: 'alex.rivera',
        field: 'Resolution',
        oldValue: 'None',
        newValue: 'FIXED'
      }
    ],
    createdAt: '2026-08-20T08:00:00Z',
    updatedAt: '2026-08-25T15:00:00Z',
    resolvedAt: '2026-08-24T18:35:00Z'
  },
  {
    id: 'DT-1008',
    numId: 1008,
    title: 'Duplicate: Subgrid row calculation fails on zero-sized flex containers',
    description: `Filing duplicate report for nested flexbox subgrid height bug. See original in DT-1030.`,
    product: 'Saitriveni/Dev-Trace-',
    component: 'Layout & Box Tree',
    version: 'v119.0-rc1',
    targetMilestone: 'Milestone 119',
    status: 'CLOSED',
    resolution: 'DUPLICATE',
    duplicateOf: 'DT-1030',
    duplicateBugs: [],
    severity: 'NORMAL',
    priority: 'P3',
    reporter: 'Jordan Kim',
    reporterEmail: 'jordan@devtrace.io',
    assignee: 'Triveni',
    assigneeEmail: 'triveni@devtrace.io',
    qaContact: 'jordan@devtrace.io',
    ccList: [],
    os: 'macOS',
    architecture: 'ARM64',
    tags: ['duplicate', 'css-subgrid'],
    flags: [],
    dependsOn: [],
    blocks: [],
    security: { isEmbargoed: false, restrictedGroups: [] },
    timeTracking: { estimatedHours: 0, spentHours: 1, remainingHours: 0 },
    comments: [
      {
        id: 'c-7',
        author: 'Jordan Kim',
        authorEmail: 'jordan@devtrace.io',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&fit=crop&q=80',
        timestamp: '2026-08-25T14:00:00Z',
        content: 'Marking as duplicate of DT-1030.',
        reactions: []
      }
    ],
    attachments: [],
    auditLog: [
      {
        id: 'aud-9',
        timestamp: '2026-08-25T14:00:00Z',
        user: 'jordan.kim',
        field: 'Status',
        oldValue: 'UNCONFIRMED',
        newValue: 'CLOSED'
      },
      {
        id: 'aud-10',
        timestamp: '2026-08-25T14:00:00Z',
        user: 'jordan.kim',
        field: 'Resolution',
        oldValue: 'None',
        newValue: 'DUPLICATE'
      }
    ],
    createdAt: '2026-08-25T13:50:00Z',
    updatedAt: '2026-08-25T14:00:00Z',
    resolvedAt: '2026-08-25T14:00:00Z'
  },
  {
    id: 'DT-1072',
    numId: 1072,
    title: 'WebGL DAG Graph Canvas loses WebGL context on window resize during zoom animation',
    description: `When rapidly resizing the browser window while a pinch-to-zoom gesture or smooth panning tween is active on the 10,000-node graph canvas, \`gl.isContextLost()\` triggers without restoring vertex buffers cleanly.`,
    product: 'Saitriveni/Project',
    component: 'DAG Graph Visualizer',
    version: 'v1.9.0-rc3',
    targetMilestone: 'HyperFlow 2.0 Launch',
    status: 'UNCONFIRMED',
    resolution: null,
    duplicateBugs: [],
    severity: 'MAJOR',
    priority: 'P2',
    reporter: 'Morgan Lee',
    reporterEmail: 'morgan@devtrace.io',
    assignee: 'Morgan Lee',
    assigneeEmail: 'morgan@devtrace.io',
    qaContact: 'jordan@devtrace.io',
    ccList: ['triveni@devtrace.io'],
    os: 'Windows',
    architecture: 'x86_64',
    environment: 'Windows 11 23H2, NVIDIA GeForce RTX 4090 Driver 555.85',
    tags: ['webgl', 'canvas', 'context-lost', 'ui-crash'],
    flags: [
      {
        id: 'flg-10',
        type: 'needinfo',
        status: '?',
        requestee: 'morgan@devtrace.io',
        setter: 'jordan@devtrace.io',
        timestamp: '2026-08-26T12:00:00Z',
        note: 'Can you provide the DXDiag GPU state logs when context is dropped?'
      }
    ],
    dependsOn: [],
    blocks: [],
    security: { isEmbargoed: false, restrictedGroups: [] },
    timeTracking: { estimatedHours: 14, spentHours: 2, remainingHours: 12 },
    comments: [],
    attachments: [],
    auditLog: [],
    createdAt: '2026-08-26T10:15:00Z',
    updatedAt: '2026-08-26T12:00:00Z'
  },
  {
    id: 'DT-1055',
    numId: 1055,
    title: 'HTTP/3 QUIC connection migration drops UDP stream packets during Wi-Fi to 5G handover',
    description: `When mobile devices switch network interfaces during an active WebTransport stream, the connection migration path validation probe fails to acknowledge CID retirement in time, forcing an unexpected TLS handshake reset.`,
    product: 'Saitriveni/Dev-Trace-',
    component: 'Network & QUIC',
    version: 'v120.0-nightly',
    targetMilestone: 'Milestone 120',
    status: 'CONFIRMED',
    resolution: null,
    duplicateBugs: [],
    severity: 'MAJOR',
    priority: 'P2',
    reporter: 'Marcus Thorne',
    reporterEmail: 'marcus@devtrace.io',
    assignee: 'Alex Rivera',
    assigneeEmail: 'alex@devtrace.io',
    qaContact: 'jordan@devtrace.io',
    ccList: ['marcus@devtrace.io'],
    os: 'Android',
    architecture: 'ARM64',
    environment: 'Android 14 (Pixel 8 Pro), 5G NR + Wi-Fi 6E',
    tags: ['http3', 'quic', 'network', 'mobile', 'handover'],
    flags: [],
    dependsOn: [],
    blocks: [],
    security: { isEmbargoed: false, restrictedGroups: [] },
    timeTracking: { estimatedHours: 24, spentHours: 10, remainingHours: 14 },
    comments: [],
    attachments: [],
    auditLog: [],
    createdAt: '2026-08-24T15:00:00Z',
    updatedAt: '2026-08-25T09:00:00Z'
  },
  {
    id: 'DT-1080',
    numId: 1080,
    title: 'PKCS#11 Hardware Security Module session leak on concurrent RSA-4096 signing calls',
    description: `When multiple microservices concurrently invoke \`C_OpenSession\` across worker threads, PKCS#11 session handles are exhausted due to missing cleanup in the exception unwind path.`,
    product: 'Saitriveni/clonefest-',
    component: 'HSM Driver & PKCS#11',
    version: 'v4.2.0-stable',
    targetMilestone: 'v4.2 Security Release',
    status: 'IN_PROGRESS',
    resolution: null,
    duplicateBugs: [],
    severity: 'CRITICAL',
    priority: 'P1',
    reporter: 'Alex Rivera',
    reporterEmail: 'alex@devtrace.io',
    assignee: 'Alex Rivera',
    assigneeEmail: 'alex@devtrace.io',
    qaContact: 'jordan@devtrace.io',
    ccList: ['triveni@devtrace.io'],
    os: 'Linux',
    architecture: 'x86_64',
    environment: 'Thales Luna PCIe HSM 7.0, Ubuntu 22.04 LTS',
    tags: ['pkcs11', 'hsm', 'resource-leak', 'crypto'],
    flags: [
      {
        id: 'flg-11',
        type: 'review',
        status: '?',
        requestee: 'triveni@devtrace.io',
        setter: 'alex@devtrace.io',
        timestamp: '2026-08-26T12:30:00Z',
        note: 'Wrapped all session calls in RAII scoped guards.'
      }
    ],
    dependsOn: [],
    blocks: [],
    security: { isEmbargoed: false, restrictedGroups: [] },
    timeTracking: { estimatedHours: 16, spentHours: 12, remainingHours: 4 },
    comments: [],
    attachments: [],
    auditLog: [],
    createdAt: '2026-08-26T06:00:00Z',
    updatedAt: '2026-08-26T12:30:00Z'
  },
  {
    id: 'DT-1085',
    numId: 1085,
    title: 'Monaco editor minimap flickering when multi-cursor edits span over 50,000 lines',
    description: `Rendering worker thread throttles canvas paint events incorrectly when more than 20 cursor carets are active simultaneously in massive source files.`,
    product: 'Saitriveni/Project',
    component: 'Monaco Code Workspace',
    version: 'v1.8.2',
    targetMilestone: 'Spring 2026 Sprint',
    status: 'RESOLVED',
    resolution: 'FIXED',
    duplicateBugs: [],
    severity: 'MINOR',
    priority: 'P3',
    reporter: 'Morgan Lee',
    reporterEmail: 'morgan@devtrace.io',
    assignee: 'Morgan Lee',
    assigneeEmail: 'morgan@devtrace.io',
    qaContact: 'jordan@devtrace.io',
    ccList: [],
    os: 'macOS',
    architecture: 'ARM64',
    tags: ['editor', 'monaco', 'ui', 'minimap'],
    flags: [],
    dependsOn: [],
    blocks: [],
    security: { isEmbargoed: false, restrictedGroups: [] },
    timeTracking: { estimatedHours: 8, spentHours: 7, remainingHours: 0 },
    comments: [],
    attachments: [],
    auditLog: [],
    createdAt: '2026-08-22T09:00:00Z',
    updatedAt: '2026-08-24T11:00:00Z',
    resolvedAt: '2026-08-24T11:00:00Z'
  }
];

export const INITIAL_SAVED_SEARCHES: SavedSearch[] = [
  {
    id: 'search-1',
    name: '🔥 Release Blockers (P1 / Critical)',
    description: 'Active bugs with Priority P1 or Blocker/Critical severity that block release milestones',
    icon: 'Flame',
    queryString: 'is:open (priority:P1 OR severity:BLOCKER OR severity:CRITICAL)',
    createdBy: 'triveni@devtrace.io',
    isPublic: true
  },
  {
    id: 'search-2',
    name: '🔒 Embargoed Security Advisories',
    description: 'Confidential security vulnerabilities with active CVEs or embargo countdowns',
    icon: 'ShieldAlert',
    queryString: 'is:open embargo:true',
    createdBy: 'alex@devtrace.io',
    isPublic: true
  },
  {
    id: 'search-3',
    name: '🙋 Pending My Review (Flags)',
    description: 'Bugs where review?, needinfo?, or qa-verify? has been requested from me',
    icon: 'UserCheck',
    queryString: 'is:open flag:"review?" assigned:me',
    createdBy: 'triveni@devtrace.io',
    isPublic: false
  },
  {
    id: 'search-4',
    name: '🛑 Dependency Root Blockers',
    description: 'Bugs that block other bugs and have open dependents',
    icon: 'GitPullRequest',
    queryString: 'is:open is_blocker:true',
    createdBy: 'marcus@devtrace.io',
    isPublic: true
  },
  {
    id: 'search-5',
    name: '❓ Needs Info / Triage Queue',
    description: 'Unconfirmed bugs or tickets pending reproduction logs from reporter',
    icon: 'HelpCircle',
    queryString: 'status:UNCONFIRMED OR flag:"needinfo?"',
    createdBy: 'jordan@devtrace.io',
    isPublic: true
  }
];
