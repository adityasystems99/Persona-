import { Playlist } from '../types/dsa';

export const INITIAL_PLAYLISTS: Playlist[] = [
  // 1. DSA Topicwise Prep
  {
    id: 'pl-dsa-arrays',
    category: 'dsa',
    title: 'Arrays & Two Pointers Mastery',
    description: 'Sliding window, prefix sums, two pointers, and Kadane algorithm fundamentals.',
    topic: 'Arrays & Hashing',
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    items: [
      {
        id: 'vi-dsa-1',
        playlistId: 'pl-dsa-arrays',
        title: 'Two Pointers & Sliding Window Intuition',
        videoUrl: 'https://www.youtube.com/watch?v=0k7b2j6kK1M',
        topic: 'Arrays & Hashing',
        order: 1,
        durationSeconds: 1680, // 28 mins
        watchedSeconds: 745, // 12m 25s
        isCompleted: false,
        notes: 'Pay attention to loop boundary conditions when shrinking left pointer.',
        bookmarks: [
          {
            id: 'bm-1',
            timestampSeconds: 245,
            label: 'Fixed vs Variable Window pattern',
            note: 'When window size k is constant vs when condition determines window expansion.',
            createdAt: new Date().toISOString(),
          },
          {
            id: 'bm-2',
            timestampSeconds: 890,
            label: 'Edge cases: negative numbers',
            note: 'Two pointers fails when numbers can be negative; need prefix sum + hashmap instead.',
            createdAt: new Date().toISOString(),
          },
        ],
        lastWatchedAt: new Date().toISOString(),
      },
      {
        id: 'vi-dsa-2',
        playlistId: 'pl-dsa-arrays',
        title: 'Prefix Sums & Kadane Algorithm Deep Dive',
        videoUrl: 'https://www.youtube.com/watch?v=86CQq33ZAuI',
        topic: 'Arrays & Hashing',
        order: 2,
        durationSeconds: 1920, // 32 mins
        watchedSeconds: 1920,
        isCompleted: true,
        notes: 'Max subarray sum with O(1) space.',
        bookmarks: [
          {
            id: 'bm-3',
            timestampSeconds: 615,
            label: 'Kadane DP State Formulation',
            note: 'dp[i] = max(nums[i], dp[i-1] + nums[i])',
            createdAt: new Date().toISOString(),
          },
        ],
      },
      {
        id: 'vi-dsa-3',
        playlistId: 'pl-dsa-arrays',
        title: 'Trapping Rainwater (Two Pointers vs Monotonic Stack)',
        videoUrl: 'https://www.youtube.com/watch?v=ZI2z589b46I',
        topic: 'Arrays & Hashing',
        order: 3,
        durationSeconds: 2100, // 35 mins
        watchedSeconds: 0,
        isCompleted: false,
        bookmarks: [],
      },
    ],
  },
  {
    id: 'pl-dsa-trees',
    category: 'dsa',
    title: 'Binary Trees & BST Deep Dive',
    description: 'DFS, BFS, diameter, lowest common ancestor, and balanced BSTs.',
    topic: 'Trees',
    order: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    items: [
      {
        id: 'vi-dsa-trees-1',
        playlistId: 'pl-dsa-trees',
        title: 'Tree Traversals (Pre, In, Post, Level Order)',
        videoUrl: 'https://www.youtube.com/watch?v=jmy0LaGET1I',
        topic: 'Trees',
        order: 1,
        durationSeconds: 1800,
        watchedSeconds: 1200,
        isCompleted: false,
        notes: 'Morris traversal gives O(1) space by modifying threaded pointers temporarily.',
        bookmarks: [
          {
            id: 'bm-trees-1',
            timestampSeconds: 520,
            label: 'Recursive vs Iterative Inorder',
            note: 'Use explicit stack pushing left nodes until null.',
            createdAt: new Date().toISOString(),
          },
        ],
      },
      {
        id: 'vi-dsa-trees-2',
        playlistId: 'pl-dsa-trees',
        title: 'Lowest Common Ancestor (LCA) in Binary Tree',
        videoUrl: 'https://www.youtube.com/watch?v=_-QHfMDde90',
        topic: 'Trees',
        order: 2,
        durationSeconds: 1440,
        watchedSeconds: 0,
        isCompleted: false,
        bookmarks: [],
      },
    ],
  },
  {
    id: 'pl-dsa-dp',
    category: 'dsa',
    title: 'Dynamic Programming Patterns',
    description: '1D memoization, 2D grids, knapsack variants, and LCS/LIS patterns.',
    topic: 'Dynamic Programming',
    order: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    items: [
      {
        id: 'vi-dsa-dp-1',
        playlistId: 'pl-dsa-dp',
        title: '0/1 Knapsack & Unbounded Knapsack Patterns',
        videoUrl: 'https://www.youtube.com/watch?v=GqOmJHQvEbA',
        topic: 'Dynamic Programming',
        order: 1,
        durationSeconds: 2400,
        watchedSeconds: 960,
        isCompleted: false,
        notes: 'Iterate backwards in 1D array to avoid reusing current item in 0/1 knapsack.',
        bookmarks: [
          {
            id: 'bm-dp-1',
            timestampSeconds: 430,
            label: 'Choice Diagram',
            note: 'Include vs Exclude item when weight <= W',
            createdAt: new Date().toISOString(),
          },
        ],
      },
    ],
  },

  // 2. System Design
  {
    id: 'pl-sys-hld',
    category: 'system-design',
    title: 'High-Level Design (HLD) Foundations',
    description: 'Scaling from zero to millions of users, load balancers, caching, and CDN.',
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    items: [
      {
        id: 'vi-sys-1',
        playlistId: 'pl-sys-hld',
        title: 'Scale from Zero to Millions of Users',
        videoUrl: 'https://www.youtube.com/watch?v=kKzmT3y96W8',
        order: 1,
        durationSeconds: 2280, // 38 mins
        watchedSeconds: 1540,
        isCompleted: false,
        notes: 'Stateless web tier with sticky sessions vs token-based JWT authentication.',
        bookmarks: [
          {
            id: 'bm-sys-1',
            timestampSeconds: 320,
            label: 'Vertical vs Horizontal Scaling tradeoffs',
            note: 'Vertical hits hardware limit; Horizontal requires load balancing + distributed state.',
            createdAt: new Date().toISOString(),
          },
          {
            id: 'bm-sys-2',
            timestampSeconds: 980,
            label: 'Database Sharding & Consistent Hashing',
            note: 'Virtual nodes prevent hot spots in hash ring distribution.',
            createdAt: new Date().toISOString(),
          },
        ],
      },
      {
        id: 'vi-sys-2',
        playlistId: 'pl-sys-hld',
        title: 'Caching Strategies (Redis & Memcached)',
        videoUrl: 'https://www.youtube.com/watch?v=U3RkDLtS7uY',
        order: 2,
        durationSeconds: 1800,
        watchedSeconds: 0,
        isCompleted: false,
        bookmarks: [],
      },
    ],
  },

  // 3. Database Management (DBMS)
  {
    id: 'pl-dbms-core',
    category: 'dbms',
    title: 'DBMS Core & SQL Performance',
    description: 'Indexing internals, B+ Trees, ACID transactions, and isolation levels.',
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    items: [
      {
        id: 'vi-dbms-1',
        playlistId: 'pl-dbms-core',
        title: 'How Database Indexing Works (B-Trees vs B+ Trees)',
        videoUrl: 'https://www.youtube.com/watch?v=aZjYr87r1b8',
        order: 1,
        durationSeconds: 1500, // 25 mins
        watchedSeconds: 1100,
        isCompleted: false,
        notes: 'B+ tree leaf nodes are linked via pointers for sequential range queries.',
        bookmarks: [
          {
            id: 'bm-dbms-1',
            timestampSeconds: 420,
            label: 'Clustered vs Non-Clustered Index',
            note: 'Clustered index physically sorts data pages on disk. Only 1 per table.',
            createdAt: new Date().toISOString(),
          },
        ],
      },
      {
        id: 'vi-dbms-2',
        playlistId: 'pl-dbms-core',
        title: 'ACID Properties & Transaction Isolation Levels',
        videoUrl: 'https://www.youtube.com/watch?v=pomxJODecQA',
        order: 2,
        durationSeconds: 1650,
        watchedSeconds: 0,
        isCompleted: false,
        bookmarks: [],
      },
    ],
  },

  // 4. CN & OS Prep
  {
    id: 'pl-cn-os-core',
    category: 'cn-os',
    title: 'Operating Systems & Computer Networks Core',
    description: 'Processes, CPU scheduling, Virtual Memory, TCP 3-way handshake, and HTTP/HTTPS.',
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    items: [
      {
        id: 'vi-os-1',
        playlistId: 'pl-cn-os-core',
        title: 'Process vs Thread & Virtual Memory Paging',
        videoUrl: 'https://www.youtube.com/watch?v=4rXQv_f9b0c',
        order: 1,
        durationSeconds: 1980,
        watchedSeconds: 1350,
        isCompleted: false,
        notes: 'Page tables, TLB (Translation Lookaside Buffer), and page fault interrupt handling.',
        bookmarks: [
          {
            id: 'bm-os-1',
            timestampSeconds: 310,
            label: 'Context Switching Overhead',
            note: 'Saving PCB registers, flushing CPU cache and TLB invalidation.',
            createdAt: new Date().toISOString(),
          },
        ],
      },
      {
        id: 'vi-cn-1',
        playlistId: 'pl-cn-os-core',
        title: 'TCP 3-Way Handshake & Connection Teardown',
        videoUrl: 'https://www.youtube.com/watch?v=bW_W1t3Zz9w',
        order: 2,
        durationSeconds: 1420,
        watchedSeconds: 0,
        isCompleted: false,
        bookmarks: [],
      },
    ],
  },
];

// Utility Helpers for video and timestamps
export function formatSecondsToTime(totalSeconds: number): string {
  if (isNaN(totalSeconds) || totalSeconds < 0) return '00:00';
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = Math.floor(totalSeconds % 60);

  const pad = (n: number) => n.toString().padStart(2, '0');

  if (hrs > 0) {
    return `${hrs}:${pad(mins)}:${pad(secs)}`;
  }
  return `${pad(mins)}:${pad(secs)}`;
}

export function parseTimeToSeconds(timeStr: string): number {
  if (!timeStr || !timeStr.trim()) return 0;
  const cleaned = timeStr.trim();
  const parts = cleaned.split(':').map((p) => parseInt(p, 10) || 0);

  if (parts.length === 3) {
    // HH:MM:SS
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else if (parts.length === 2) {
    // MM:SS
    return parts[0] * 60 + parts[1];
  } else if (parts.length === 1) {
    // raw seconds or minutes
    return parts[0];
  }
  return 0;
}

export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

export function getYouTubeTimestampUrl(url: string, seconds: number): string {
  if (!url) return '';
  const ytId = extractYouTubeId(url);
  if (ytId) {
    return `https://www.youtube.com/watch?v=${ytId}&t=${Math.max(0, Math.floor(seconds))}s`;
  }
  // If not YouTube, try appending t query param
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}t=${Math.max(0, Math.floor(seconds))}`;
}

export function getYouTubeEmbedUrl(url: string, startSeconds: number = 0): string | null {
  const ytId = extractYouTubeId(url);
  if (!ytId) return null;
  return `https://www.youtube.com/embed/${ytId}?start=${Math.max(0, Math.floor(startSeconds))}&autoplay=0`;
}
