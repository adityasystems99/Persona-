import { Problem, AccountabilitySettings, STLPracticeState, StudyDayLog } from '../types/dsa';

export const getTodayDateString = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const DEFAULT_SETTINGS: AccountabilitySettings = {
  studyStartTime: '09:00',
  studyEndTime: '23:30',
  hourlyRemindersEnabled: true,
  stlReminderEnabled: true,
  incompleteTargetReminderEnabled: true,
  browserNotificationsEnabled: false,
  soundEnabled: true,
  reminderIntervalMinutes: 60,
  dailyTargetEasy: 2,
  dailyTargetMedium: 2,
  dailyTargetHard: 1,
};

// 100% Live Default: Clean slate so everything reflects what the user actually adds!
export const INITIAL_PROBLEMS: Problem[] = [];

export const INITIAL_STL_STATE: STLPracticeState = {
  date: getTodayDateString(),
  totalSeconds: 1800, // 30 minutes
  remainingSeconds: 1800,
  isRunning: false,
  isCompleted: false,
  currentTopicId: 'vectors',
  notes: '',
  codeSnippet: `// Space Cadet C++ STL Arena
#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

int main() {
    // Write your STL logic here
    vector<int> v;
    v.reserve(100);
    return 0;
}`,
};

// 100% Live Default: Empty past study logs
export const INITIAL_PAST_LOGS: StudyDayLog[] = [];

// Optional sample pack if the user manually clicks "Reset to Sample Data" in Settings
export const SAMPLE_PROBLEMS_PACK: Problem[] = [
  {
    id: 'sample-1',
    title: 'Two Sum',
    topic: 'Arrays & Hashing',
    subtopic: 'Hash Map Lookup',
    difficulty: 'Easy',
    platform: 'LeetCode',
    url: 'https://leetcode.com/problems/two-sum/',
    status: 'Solved Independently',
    timeSpentMinutes: 14,
    notes: 'Store complement target - nums[i] in unordered_map. One-pass hash table gives O(N) time.',
    approach: 'Hash Map Complement lookup',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(N)',
    attempts: 1,
    solvedIndependently: true,
    inTodayPlan: true,
    orderInPlan: 1,
    needsRevision: false,
    revisionHistory: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'sample-2',
    title: 'Valid Palindrome',
    topic: 'Two Pointers',
    subtopic: 'String Verification',
    difficulty: 'Easy',
    platform: 'LeetCode',
    url: 'https://leetcode.com/problems/valid-palindrome/',
    status: 'Solved Independently',
    timeSpentMinutes: 18,
    notes: 'Two pointers from left and right skipping non-alphanumeric using std::isalnum and std::tolower.',
    approach: 'Two Pointers moving towards center',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    attempts: 1,
    solvedIndependently: true,
    inTodayPlan: true,
    orderInPlan: 2,
    needsRevision: false,
    revisionHistory: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'sample-3',
    title: 'Container With Most Water',
    topic: 'Two Pointers',
    subtopic: 'Greedy Area Maximization',
    difficulty: 'Medium',
    platform: 'LeetCode',
    url: 'https://leetcode.com/problems/container-with-most-water/',
    status: 'In Progress',
    timeSpentMinutes: 25,
    notes: 'Move pointer pointing to the shorter vertical bar inward because width decreases, so only taller bar can yield greater area.',
    approach: 'Two Pointers with Greedy elimination',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    attempts: 2,
    solvedIndependently: false,
    inTodayPlan: true,
    orderInPlan: 3,
    needsRevision: false,
    revisionHistory: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const SAMPLE_PAST_LOGS: StudyDayLog[] = [
  {
    date: '2026-10-08',
    solvedCount: 3,
    easySolved: 2,
    mediumSolved: 1,
    hardSolved: 0,
    independentCount: 2,
    hintsCount: 1,
    dsaMinutes: 75,
    stlMinutes: 30,
    stlCompleted: true,
    targetMet: true,
  },
];
