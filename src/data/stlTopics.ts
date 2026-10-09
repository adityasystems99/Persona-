import { STLTopicItem } from '../types/dsa';

export const INITIAL_STL_TOPICS: STLTopicItem[] = [
  {
    id: 'vectors',
    title: 'std::vector & Dynamic Memory',
    category: 'Sequence Containers',
    methods: ['push_back()', 'emplace_back()', 'pop_back()', 'reserve()', 'resize()', 'clear()', 'size()', 'shrink_to_fit()'],
    description: 'Dynamic contiguous array with amortized O(1) insertion at the back. Crucial to pre-reserve memory to eliminate reallocation overhead.',
    keyUseCases: 'General dynamic lists, adjacency lists for graph representations, dynamic matrices vector<vector<int>>.',
    codeExample: `// Vector efficient initialization & 2D grid
vector<int> v;
v.reserve(1000); // Prevents multiple reallocations
v.emplace_back(42); // Constructs in-place

// 2D grid (rows x cols initialized to 0)
int rows = 5, cols = 10;
vector<vector<int>> grid(rows, vector<int>(cols, 0));`,
    completedDates: []
  },
  {
    id: 'strings',
    title: 'std::string & String Manipulation',
    category: 'Sequence Containers',
    methods: ['substr()', 'find()', 'npos', 'append()', 'to_string()', 'stoi()', 'getline()', 'push_back()'],
    description: 'Dynamic character sequences with rich search, substring, and conversion primitives. Avoid excessive substring copies in recursion.',
    keyUseCases: 'String parsing, sliding window substring problems, anagram tracking, palindrome validations.',
    codeExample: `// String search and substring
string s = "algorithmic_mastery";
size_t pos = s.find("mastery");
if (pos != string::npos) {
    string sub = s.substr(pos, 7); // "mastery"
}
// Fast number conversions
int num = 1234;
string strVal = to_string(num);
int parsed = stoi("5678");`,
    completedDates: []
  },
  {
    id: 'pairs-tuples',
    title: 'std::pair & std::tuple',
    category: 'Utility',
    methods: ['make_pair', 'make_tuple', 'get<N>()', 'std::tie()', 'structured bindings [a, b]'],
    description: 'Heterogeneous value pairs and tuples. Standard pairs come with built-in lexicographical comparison operators.',
    keyUseCases: 'Coordinates {r, c}, weighted graph edges {weight, next_node}, Dijkstra priority queue nodes.',
    codeExample: `// Structured bindings (C++17)
pair<int, string> p = {1, "optimal"};
auto [id, label] = p;

// In sorting or priority queues
vector<pair<int, int>> intervals = {{1, 4}, {2, 3}, {3, 6}};
sort(intervals.begin(), intervals.end()); // sorts by .first, then .second`,
    completedDates: []
  },
  {
    id: 'iterators',
    title: 'Iterators & Traversal Primitives',
    category: 'Iterators',
    methods: ['begin()', 'end()', 'rbegin()', 'rend()', 'std::advance()', 'std::distance()', 'std::prev()', 'std::next()'],
    description: 'Pointers-like abstractions for container element traversal. Random access, bidirectional, and reverse iterators.',
    keyUseCases: 'Traversing ranges, reversing arrays, pointer arithmetic in STL algorithms, erase-remove idiom.',
    codeExample: `vector<int> nums = {10, 20, 30, 40, 50};
// Reverse traversal
for (auto it = nums.rbegin(); it != nums.rend(); ++it) {
    cout << *it << " ";
}

// Distance and jump
auto it = nums.begin();
advance(it, 3); // points to 40
cout << distance(nums.begin(), it); // outputs 3`,
    completedDates: []
  },
  {
    id: 'sorting-comparators',
    title: 'std::sort & Custom Comparators',
    category: 'Algorithms',
    methods: ['std::sort()', 'std::stable_sort()', 'std::greater<T>()', 'Lambda Comparators', 'Strict Weak Ordering'],
    description: 'O(N log N) IntroSort algorithm. Requires a strict weak ordering comparator (never use <= or >= in custom comparator!).',
    keyUseCases: 'Interval scheduling, sorting pairs by custom criteria, sorting strings by length then alphabetically.',
    codeExample: `// Custom sorting with lambda
struct Event { int start, end, val; };
vector<Event> events;

// Sort by end time ascending; tie-break by val descending
sort(events.begin(), events.end(), [](const Event& a, const Event& b) {
    if (a.end != b.end) return a.end < b.end;
    return a.val > b.val; // Strict weak ordering!
});`,
    completedDates: []
  },
  {
    id: 'binary-search',
    title: 'std::lower_bound & std::upper_bound',
    category: 'Algorithms',
    methods: ['std::binary_search()', 'std::lower_bound()', 'std::upper_bound()', 'std::equal_range()'],
    description: 'O(log N) search on pre-sorted ranges. lower_bound returns iterator to first element >= val; upper_bound returns first element > val.',
    keyUseCases: 'Binary search on answer, count of elements in range [L, R], insertion index in sorted array.',
    codeExample: `vector<int> arr = {10, 20, 20, 20, 30, 40};
// Find first element >= 20
auto it1 = lower_bound(arr.begin(), arr.end(), 20); // index 1
// Find first element > 20
auto it2 = upper_bound(arr.begin(), arr.end(), 20); // index 4

// Count occurrences of 20
int count20 = it2 - it1; // 3 occurrences`,
    completedDates: []
  },
  {
    id: 'sets-multisets',
    title: 'std::set & std::unordered_set',
    category: 'Associative Containers',
    methods: ['insert()', 'find()', 'erase()', 'count()', 'lower_bound()', 'std::multiset'],
    description: 'std::set is a Red-Black Tree with O(log N) operations and sorted order. std::unordered_set is a hash table with average O(1) operations.',
    keyUseCases: 'Duplicate detection, maintaining running median (dual sets), tracking visited states in BFS, sliding window maximums.',
    codeExample: `// Red-Black tree ordered set
set<int> ordered;
ordered.insert(50);
ordered.insert(10);
ordered.insert(30);

// Set member lower_bound is O(log N)
auto it = ordered.lower_bound(25); // points to 30

// Erasing by value in multiset removes ALL instances:
multiset<int> ms = {2, 2, 2, 5};
ms.erase(ms.find(2)); // Removes ONLY ONE instance!`,
    completedDates: []
  },
  {
    id: 'maps-hash-tables',
    title: 'std::map & std::unordered_map',
    category: 'Associative Containers',
    methods: ['operator[]', 'insert()', 'find()', 'count()', 'erase()', 'contains() (C++20)'],
    description: 'Key-value associations. Beware: operator[] inserts a default-constructed value if the key does not exist! Use find() or count() to check existence.',
    keyUseCases: 'Frequency counting, prefix sum hash map (Subarray Sum Equals K), memoization caches for dynamic programming.',
    codeExample: `unordered_map<int, int> prefixCount;
prefixCount[0] = 1; // Base case for prefix sum

// Frequency counter
string s = "leetcode";
unordered_map<char, int> freq;
for (char c : s) freq[c]++;

// Safe existence check without unintended insertion
if (freq.find('z') != freq.end()) {
    // found
}`,
    completedDates: []
  },
  {
    id: 'stacks-queues',
    title: 'std::stack & std::queue & std::deque',
    category: 'Container Adaptors',
    methods: ['push()', 'pop()', 'top()', 'front()', 'back()', 'empty()', 'size()'],
    description: 'LIFO (stack) and FIFO (queue) adaptors built atop deque or vector. Direct random-access is disabled to guarantee invariant constraints.',
    keyUseCases: 'Monotonic stack for Next Greater Element / Daily Temperatures, BFS tree and graph traversal, Valid Parentheses.',
    codeExample: `// Monotonic Stack for Next Greater Element
vector<int> nums = {2, 1, 2, 4, 3};
int n = nums.size();
vector<int> nge(n, -1);
stack<int> st; // stores indices

for (int i = 0; i < n; ++i) {
    while (!st.empty() && nums[i] > nums[st.top()]) {
        nge[st.top()] = nums[i];
        st.pop();
    }
    st.push(i);
}`,
    completedDates: []
  },
  {
    id: 'priority-queues',
    title: 'std::priority_queue (Min & Max Heaps)',
    category: 'Container Adaptors',
    methods: ['push()', 'pop()', 'top()', 'empty()', 'greater<T> comparator'],
    description: 'Binary heap with O(log N) insertion/deletion and O(1) top query. Default is Max-Heap. Use greater<T> for Min-Heap.',
    keyUseCases: 'Dijkstra shortest path algorithm, Top K Frequent Elements, Merge K Sorted Lists, Median of Data Stream.',
    codeExample: `// Default Max-Heap
priority_queue<int> maxHeap;

// Min-Heap
priority_queue<int, vector<int>, greater<int>> minHeap;

// Min-Heap with pairs (e.g., {distance, node})
using pii = pair<int, int>;
priority_queue<pii, vector<pii>, greater<pii>> pq;
pq.push({0, startNode});`,
    completedDates: []
  },
  {
    id: 'standard-algorithms',
    title: 'Essential STL Algorithms & Bitwise',
    category: 'Algorithms',
    methods: ['std::accumulate', 'std::next_permutation', 'std::reverse', 'std::max_element', '__builtin_popcount', 'std::iota'],
    description: 'High-performance standard library algorithms that replace manual loops and edge-case prone arithmetic.',
    keyUseCases: 'Array reductions, generating all permutations, calculating range sums, bit manipulation mask operations.',
    codeExample: `#include <numeric>
// Range sum with custom starting accumulator
vector<int> vals = {1, 2, 3, 4, 5};
long long sum = accumulate(vals.begin(), vals.end(), 0LL);

// Fill with sequential values 0, 1, 2, ...
vector<int> indices(5);
iota(indices.begin(), indices.end(), 0);

// Bit population count (number of set bits)
int setBits = __builtin_popcount(29); // 29 is 11101_2 -> 4 bits`,
    completedDates: []
  }
];
