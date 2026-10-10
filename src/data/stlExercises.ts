import { STLExercise } from '../types/dsa';

export const INITIAL_STL_EXERCISES: STLExercise[] = [
  // 1. Vectors & Strings
  {
    id: 'ex-vec-1',
    topicId: 'vectors',
    category: 'Vectors & Strings',
    title: 'Dynamic Array Allocation & std::vector::reserve()',
    difficulty: 'Easy',
    description: 'Given n integers, construct a std::vector and reserve memory upfront to prevent reallocations. Then filter all even integers.',
    starterCode: `#include <vector>
#include <iostream>

std::vector<int> filterEvens(const std::vector<int>& input) {
    std::vector<int> evens;
    // TODO: Reserve capacity and push even numbers
    return evens;
}`,
    solutionCode: `#include <vector>
#include <iostream>

std::vector<int> filterEvens(const std::vector<int>& input) {
    std::vector<int> evens;
    evens.reserve(input.size()); // Pre-allocate to avoid geometric reallocation
    for (int num : input) {
        if (num % 2 == 0) {
            evens.push_back(num);
        }
    }
    return evens;
}`,
    conceptReinforced: 'Eliminates amortized copy overhead by reserving known or bounded capacity.',
    testCasesDescription: 'Input: [1, 2, 3, 4, 5, 6] -> Output: [2, 4, 6] without memory re-allocations.',
    isCompleted: false,
  },
  {
    id: 'ex-str-1',
    topicId: 'strings',
    category: 'Vectors & Strings',
    title: 'Fast String Tokenization & Substrings',
    difficulty: 'Medium',
    description: 'Split a comma-separated string into substrings using std::string::find() and std::string::substr() without using stringstream.',
    starterCode: `#include <string>
#include <vector>

std::vector<std::string> splitString(const std::string& s, char delimiter) {
    std::vector<std::string> tokens;
    // TODO: Use s.find() and s.substr()
    return tokens;
}`,
    solutionCode: `#include <string>
#include <vector>

std::vector<std::string> splitString(const std::string& s, char delimiter) {
    std::vector<std::string> tokens;
    size_t start = 0;
    size_t end = s.find(delimiter);
    while (end != std::string::npos) {
        tokens.push_back(s.substr(start, end - start));
        start = end + 1;
        end = s.find(delimiter, start);
    }
    tokens.push_back(s.substr(start));
    return tokens;
}`,
    conceptReinforced: 'O(N) zero-heap-thrash tokenization avoiding heavy std::stringstream object construction.',
    testCasesDescription: 'Input: "apple,banana,cherry", \',\' -> Output: ["apple", "banana", "cherry"]',
    isCompleted: false,
  },

  // 2. Pairs & Iterators
  {
    id: 'ex-pair-1',
    topicId: 'pairs-tuples',
    category: 'Pairs & Iterators',
    title: 'Lexicographical Coordinate Sorting with std::pair',
    difficulty: 'Easy',
    description: 'Create a list of 2D points (x, y) using std::pair<int, int>, and sort them. Demonstrate structured bindings in C++17.',
    starterCode: `#include <vector>
#include <utility>
#include <algorithm>

void sortAndProcessPoints(std::vector<std::pair<int, int>>& points) {
    // TODO: Sort points and iterate using structured bindings [x, y]
}`,
    solutionCode: `#include <vector>
#include <utility>
#include <algorithm>

void sortAndProcessPoints(std::vector<std::pair<int, int>>& points) {
    // std::pair has default operator< comparing .first then .second
    std::sort(points.begin(), points.end());
    for (const auto& [x, y] : points) {
        // Structured binding access
    }
}`,
    conceptReinforced: 'std::pair built-in lexicographical ordering and modern C++17 structured bindings.',
    testCasesDescription: 'Input: [(3, 2), (1, 5), (1, 2)] -> Output: [(1, 2), (1, 5), (3, 2)]',
    isCompleted: false,
  },
  {
    id: 'ex-iter-1',
    topicId: 'iterators',
    category: 'Pairs & Iterators',
    title: 'Iterator Arithmetic: std::advance, std::distance & Reverse Iterators',
    difficulty: 'Medium',
    description: 'Find the middle element of a std::vector using random-access iterator distance without indexing [].',
    starterCode: `#include <vector>
#include <iterator>

int findMedianIterator(const std::vector<int>& sortedVec) {
    // TODO: Use begin(), std::distance, and std::advance or std::next
    return 0;
}`,
    solutionCode: `#include <vector>
#include <iterator>

int findMedianIterator(const std::vector<int>& sortedVec) {
    auto start = sortedVec.begin();
    auto end = sortedVec.end();
    auto dist = std::distance(start, end);
    auto mid = std::next(start, dist / 2);
    return *mid;
}`,
    conceptReinforced: 'Container-agnostic traversal patterns applicable to lists and forward ranges.',
    testCasesDescription: 'Input: [10, 20, 30, 40, 50] -> Output: 30',
    isCompleted: false,
  },

  // 3. Sorting & Custom Comparators
  {
    id: 'ex-sort-1',
    topicId: 'sorting-comparators',
    category: 'Sorting & Custom Comparators',
    title: 'Custom Lambda Comparator: Strict Weak Ordering',
    difficulty: 'Medium',
    description: 'Sort an array of intervals [start, end] where intervals are sorted primarily by end time ascending, and on ties by start time descending.',
    starterCode: `#include <vector>
#include <algorithm>

struct Interval {
    int start;
    int end;
};

void sortIntervals(std::vector<Interval>& intervals) {
    // TODO: std::sort with strict weak ordering (use <, never <=)
}`,
    solutionCode: `#include <vector>
#include <algorithm>

struct Interval {
    int start;
    int end;
};

void sortIntervals(std::vector<Interval>& intervals) {
    std::sort(intervals.begin(), intervals.end(), [](const Interval& a, const Interval& b) {
        if (a.end != b.end) {
            return a.end < b.end;
        }
        return a.start > b.start; // Tie-breaker: start descending
    });
}`,
    conceptReinforced: 'Preventing undefined behavior and segfaults in std::sort by guaranteeing irreflexivity (comp(x, x) == false).',
    testCasesDescription: 'Input: [{1, 4}, {2, 4}, {3, 5}] -> Output: [{2, 4}, {1, 4}, {3, 5}]',
    isCompleted: false,
  },

  // 4. Binary Search Algorithms
  {
    id: 'ex-bs-1',
    topicId: 'binary-search',
    category: 'Binary Search Algorithms',
    title: 'std::lower_bound vs std::upper_bound Range Counting',
    difficulty: 'Medium',
    description: 'In a sorted vector of integers with duplicates, count occurrences of target in O(log N) time using lower_bound and upper_bound.',
    starterCode: `#include <vector>
#include <algorithm>

int countOccurrences(const std::vector<int>& sortedArr, int target) {
    // TODO: Return count using std::upper_bound - std::lower_bound
    return 0;
}`,
    solutionCode: `#include <vector>
#include <algorithm>

int countOccurrences(const std::vector<int>& sortedArr, int target) {
    auto low = std::lower_bound(sortedArr.begin(), sortedArr.end(), target);
    auto high = std::upper_bound(sortedArr.begin(), sortedArr.end(), target);
    return high - low;
}`,
    conceptReinforced: 'O(log N) half-open interval arithmetic [first >= target, first > target).',
    testCasesDescription: 'Input: arr=[1, 2, 2, 2, 3, 5], target=2 -> Output: 3',
    isCompleted: false,
  },

  // 5. Sets & Maps
  {
    id: 'ex-map-1',
    topicId: 'maps-hash-tables',
    category: 'Sets & Maps',
    title: 'std::unordered_map Safe Querying vs operator[]',
    difficulty: 'Easy',
    description: 'Implement a read-only frequency check. Avoid accidental key insertions that occur when invoking map[key].',
    starterCode: `#include <unordered_map>

bool containsWithCount(const std::unordered_map<int, int>& counts, int key, int minThreshold) {
    // TODO: Query without mutating map
    return false;
}`,
    solutionCode: `#include <unordered_map>

bool containsWithCount(const std::unordered_map<int, int>& counts, int key, int minThreshold) {
    auto it = counts.find(key);
    if (it != counts.end() && it->second >= minThreshold) {
        return true;
    }
    return false;
}`,
    conceptReinforced: 'Avoid unintended default-construction allocations caused by operator[].',
    testCasesDescription: 'Input: map={1: 3, 2: 1}, key=1, threshold=2 -> Output: true; key=3 -> Output: false without inserting 3:0',
    isCompleted: false,
  },
  {
    id: 'ex-set-1',
    topicId: 'sets-multisets',
    category: 'Sets & Maps',
    title: 'std::multiset Single-Element Eradication',
    difficulty: 'Hard',
    description: 'Demonstrate erasing exactly ONE instance of a duplicate key from std::multiset rather than all instances.',
    starterCode: `#include <set>

void eraseSingleInstance(std::multiset<int>& ms, int value) {
    // TODO: Erase exactly one element with 'value'
}`,
    solutionCode: `#include <set>

void eraseSingleInstance(std::multiset<int>& ms, int value) {
    auto it = ms.find(value); // Finds iterator to one instance
    if (it != ms.end()) {
        ms.erase(it); // Erasing by iterator deletes ONE element. ms.erase(value) deletes ALL!
    }
}`,
    conceptReinforced: 'Critical gotcha: ms.erase(val) removes all duplicates O(k + log N); ms.erase(it) removes 1 item O(1) amortized.',
    testCasesDescription: 'Input: multiset={5, 5, 5, 8}, erase(5) -> Output: {5, 5, 8}',
    isCompleted: false,
  },

  // 6. Stacks & Queues
  {
    id: 'ex-stk-1',
    topicId: 'stacks-queues',
    category: 'Stacks & Queues',
    title: 'Monotonic Stack for Next Greater Element',
    difficulty: 'Medium',
    description: 'Given an array of temperatures, compute days until next warmer day using a monotonic decreasing std::stack of indices.',
    starterCode: `#include <vector>
#include <stack>

std::vector<int> dailyTemperatures(const std::vector<int>& temps) {
    std::vector<int> res(temps.size(), 0);
    std::stack<int> st; // store indices
    // TODO: Monotonic stack logic
    return res;
}`,
    solutionCode: `#include <vector>
#include <stack>

std::vector<int> dailyTemperatures(const std::vector<int>& temps) {
    int n = temps.size();
    std::vector<int> res(n, 0);
    std::stack<int> st; // monotonic decreasing stack
    for (int i = 0; i < n; ++i) {
        while (!st.empty() && temps[i] > temps[st.top()]) {
            int prevIdx = st.top();
            st.pop();
            res[prevIdx] = i - prevIdx;
        }
        st.push(i);
    }
    return res;
}`,
    conceptReinforced: 'O(N) amortized processing with each element pushed and popped at most once.',
    testCasesDescription: 'Input: [73, 74, 75, 71, 69, 72, 76, 73] -> Output: [1, 1, 4, 2, 1, 1, 0, 0]',
    isCompleted: false,
  },

  // 7. Priority Queues
  {
    id: 'ex-pq-1',
    topicId: 'priority-queues',
    category: 'Priority Queues',
    title: 'Min-Heap Construction with std::greater<T>',
    difficulty: 'Medium',
    description: 'Maintain a running Top-K largest elements stream using a Min-Heap of size K.',
    starterCode: `#include <vector>
#include <queue>

std::vector<int> topKLargest(const std::vector<int>& stream, int k) {
    // TODO: Create min-heap priority_queue<int, vector<int>, greater<int>>
    std::vector<int> result;
    return result;
}`,
    solutionCode: `#include <vector>
#include <queue>

std::vector<int> topKLargest(const std::vector<int>& stream, int k) {
    // Min-heap keeps the smallest of the top k at the top
    std::priority_queue<int, std::vector<int>, std::greater<int>> minHeap;
    for (int num : stream) {
        minHeap.push(num);
        if (minHeap.size() > static_cast<size_t>(k)) {
            minHeap.pop();
        }
    }
    std::vector<int> result;
    while (!minHeap.empty()) {
        result.push_back(minHeap.top());
        minHeap.pop();
    }
    return result;
}`,
    conceptReinforced: 'O(N log K) space-bounded priority queue stream processing.',
    testCasesDescription: 'Input: [3, 2, 1, 5, 6, 4], k=2 -> Output: [5, 6]',
    isCompleted: false,
  },

  // 8. Useful STL Algorithms
  {
    id: 'ex-algo-1',
    topicId: 'standard-algorithms',
    category: 'Useful STL Algorithms',
    title: 'std::accumulate, std::nth_element & std::next_permutation',
    difficulty: 'Medium',
    description: 'Use std::nth_element to find the k-th smallest element in O(N) average time without full O(N log N) sorting.',
    starterCode: `#include <vector>
#include <algorithm>

int quickSelectKth(std::vector<int>& nums, int k) {
    // TODO: std::nth_element(nums.begin(), nums.begin() + k, nums.end())
    return 0;
}`,
    solutionCode: `#include <vector>
#include <algorithm>

int quickSelectKth(std::vector<int>& nums, int k) {
    // k is 0-indexed
    std::nth_element(nums.begin(), nums.begin() + k, nums.end());
    return nums[k];
}`,
    conceptReinforced: 'IntroSelect O(N) average partition algorithm built into C++ STL.',
    testCasesDescription: 'Input: [3, 2, 1, 5, 6, 4], k=2 (3rd smallest) -> Output: 3',
    isCompleted: false,
  }
];
