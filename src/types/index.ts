export type BugStatus = 
  | 'UNCONFIRMED'
  | 'CONFIRMED'
  | 'IN_PROGRESS'
  | 'RESOLVED'
  | 'VERIFIED'
  | 'CLOSED';

export type BugResolution = 
  | 'FIXED'
  | 'INVALID'
  | 'WONTFIX'
  | 'DUPLICATE'
  | 'WORKSFORME'
  | 'NOT_A_BUG'
  | 'MOVED'
  | null;

export type BugSeverity = 
  | 'BLOCKER'
  | 'CRITICAL'
  | 'MAJOR'
  | 'NORMAL'
  | 'MINOR'
  | 'TRIVIAL'
  | 'ENHANCEMENT';

export type BugPriority = 'P1' | 'P2' | 'P3' | 'P4' | 'P5';

export type OperatingSystem = 'macOS' | 'Linux' | 'Windows' | 'iOS' | 'Android' | 'All';
export type Architecture = 'ARM64' | 'x86_64' | 'Wasm' | 'Universal' | 'All';

export type FlagType = 'review' | 'needinfo' | 'qa-verify' | 'sec-audit' | 'rel-blocker';
export type FlagStatus = '?' | '+' | '-' | 'X'; // ? = requested, + = granted, - = denied, X = canceled

export interface BugFlag {
  id: string;
  type: FlagType;
  status: FlagStatus;
  requestee?: string; // email/user
  setter: string;
  timestamp: string;
  note?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  userAvatar?: string;
  field: string;
  oldValue: string;
  newValue: string;
}

export interface CommentReaction {
  emoji: string;
  users: string[]; // usernames
}

export interface BugComment {
  id: string;
  author: string;
  authorEmail: string;
  authorAvatar: string;
  timestamp: string;
  content: string;
  isInternal?: boolean;
  patchDiff?: string;
  reactions: CommentReaction[];
}

export interface BugAttachment {
  id: string;
  name: string;
  size: number;
  type: 'patch' | 'log' | 'screenshot' | 'crashdump' | 'other';
  uploadedBy: string;
  uploadedAt: string;
  url?: string;
  rawContent?: string;
}

export interface SecurityInfo {
  isEmbargoed: boolean;
  cveId?: string;
  cvssScore?: number; // 0.0 - 10.0
  cvssVector?: string; // e.g. CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H
  embargoExpiry?: string; // ISO date
  restrictedGroups: string[]; // e.g. ['security-core', 'kernel-maintainers']
  publicDisclosurePlan?: string;
}

export interface TimeTracking {
  estimatedHours: number;
  spentHours: number;
  remainingHours: number;
  deadline?: string;
}

export interface Bug {
  id: string; // e.g. "DT-1042"
  numId: number; // e.g. 1042
  title: string;
  description: string;
  product: string;
  component: string;
  version: string;
  targetMilestone: string;
  
  status: BugStatus;
  resolution: BugResolution;
  duplicateOf?: string; // ID of bug this duplicates
  duplicateBugs: string[]; // IDs of bugs marked as duplicates of this

  severity: BugSeverity;
  priority: BugPriority;
  
  reporter: string;
  reporterEmail: string;
  assignee: string;
  assigneeEmail: string;
  qaContact?: string;
  ccList: string[];

  os: OperatingSystem;
  architecture: Architecture;
  environment?: string; // e.g. "V8 v12.4, Node v20.12.0, glibc 2.38"
  
  tags: string[];
  flags: BugFlag[];
  
  // Dependency relationships
  dependsOn: string[]; // Bugs that must be fixed before this one
  blocks: string[];    // Bugs that are blocked by this one
  
  security: SecurityInfo;
  timeTracking: TimeTracking;
  
  stackTrace?: string;
  gitCommitSha?: string;
  gitBranch?: string;
  pullRequestUrl?: string;

  comments: BugComment[];
  attachments: BugAttachment[];
  auditLog: AuditLogEntry[];

  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export interface ProductComponent {
  id: string;
  name: string;
  description: string;
  defaultAssignee: string;
  defaultQaContact: string;
  subcomponents?: string[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  icon: string;
  components: ProductComponent[];
  versions: string[];
  milestones: string[];
}

export interface UserProfile {
  id: string;
  username: string;
  name: string;
  email: string;
  avatar: string;
  role: 'Admin' | 'Security Officer' | 'Core Maintainer' | 'Triager' | 'Contributor' | 'Guest';
  groups: string[];
}

export interface SearchFilterCondition {
  id: string;
  field: keyof Bug | 'flag' | 'any_text' | 'is_blocked' | 'is_blocker';
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'in' | 'not_in' | 'greater_than' | 'less_than' | 'is_empty' | 'is_not_empty';
  value: string;
}

export interface SearchFilterGroup {
  id: string;
  conjunction: 'AND' | 'OR';
  conditions: SearchFilterCondition[];
  groups?: SearchFilterGroup[];
}

export interface SavedSearch {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  queryString?: string;
  filterGroup?: SearchFilterGroup;
  createdBy: string;
  isPublic: boolean;
}

export interface MetricSummary {
  totalBugs: number;
  openBugs: number;
  resolvedBugs: number;
  criticalBlockers: number;
  slaBreaches: number;
  meanTimeToResolutionDays: number;
  bugsNeedingInfo: number;
  securityEmbargoes: number;
}
