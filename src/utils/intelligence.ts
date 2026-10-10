import {
  Problem,
  StudyDayLog,
  TopicMasteryStats,
  ReadinessBreakdown,
  FocusSession,
  RescheduleEvent,
} from '../types/dsa';
import { getTodayDateString } from '../data/initialData';

const CORE_TOPICS = [
  'Arrays & Hashing',
  'Two Pointers',
  'Sliding Window',
  'Stack',
  'Binary Search',
  'Linked List',
  'Trees & BST',
  'Heap / Priority Queue',
  'Backtracking',
  'Graphs',
  'Dynamic Programming',
  'Greedy',
];

// ==============================================================================
// Feature 2: Weakness Intelligence Map Engine
// ==============================================================================

export const computeTopicMasteryMap = (problems: Problem[]): TopicMasteryStats[] => {
  const topicGroups: Record<string, Problem[]> = {};

  // Group problems by topic
  problems.forEach((p) => {
    const t = p.topic || 'General DSA';
    if (!topicGroups[t]) topicGroups[t] = [];
    topicGroups[t].push(p);
  });

  // Ensure all core topics are represented even if 0 problems attempted
  CORE_TOPICS.forEach((core) => {
    if (!topicGroups[core]) topicGroups[core] = [];
  });

  const results: TopicMasteryStats[] = Object.keys(topicGroups).map((topic) => {
    const list = topicGroups[topic];
    const totalProblems = list.length;
    const solved = list.filter(
      (p) => p.status === 'Solved Independently' || p.status === 'Solved with Hints'
    );
    const solvedCount = solved.length;
    const independentCount = solved.filter((p) => p.solvedIndependently).length;
    const hintsCount = solved.filter((p) => !p.solvedIndependently || (p.hintsUsed && p.hintsUsed > 0)).length;
    
    const attemptsTotal = list.reduce((sum, p) => sum + (p.attempts || 1), 0);
    const avgAttempts = totalProblems > 0 ? Number((attemptsTotal / totalProblems).toFixed(1)) : 1;
    const totalMinutes = list.reduce((sum, p) => sum + (p.timeSpentMinutes || 0), 0);

    const revisionFails = list.reduce((count, p) => {
      const failed = p.revisionHistory?.filter((r) => !r.success).length || 0;
      return count + failed + (p.lastRevisionOutcome === 'failed' ? 1 : 0);
    }, 0);

    // Honest data-driven mastery formula (0 to 100)
    let masteryScore = 0;
    if (totalProblems === 0) {
      masteryScore = 0;
    } else {
      const independentRatio = independentCount / totalProblems;
      const hintFreeRatio = Math.max(0, 1 - (hintsCount / Math.max(1, solvedCount)));
      const attemptEfficiency = Math.max(0, Math.min(1, 2.0 / Math.max(1, avgAttempts)));
      const revisionPenalty = Math.max(0, 1 - (revisionFails * 0.15));

      masteryScore = Math.round(
        (independentRatio * 45) +
        (hintFreeRatio * 25) +
        (attemptEfficiency * 15) +
        (revisionPenalty * 15)
      );
    }

    // Determine honest status
    let status: TopicMasteryStats['status'];
    if (totalProblems === 0) {
      status = 'Needs Practice';
    } else if (masteryScore < 35 || (solvedCount > 0 && hintsCount / solvedCount > 0.6)) {
      status = 'Critical Weakness';
    } else if (masteryScore < 60) {
      status = 'Needs Practice';
    } else if (masteryScore < 78) {
      status = 'Developing';
    } else if (masteryScore < 90) {
      status = 'Proficient';
    } else {
      status = 'Mastered';
    }

    // Explanatory breakdown text
    let explanation = '';
    if (totalProblems === 0) {
      explanation = 'No problems attempted yet in this category.';
    } else {
      const parts: string[] = [];
      if (solvedCount === 0) {
        parts.push(`${totalProblems} attempted, 0 solved yet`);
      } else {
        const hintPct = Math.round((hintsCount / solvedCount) * 100);
        parts.push(`${independentCount}/${solvedCount} solved independently`);
        if (hintPct > 0) parts.push(`${hintPct}% hint dependency`);
      }
      parts.push(`${avgAttempts} avg attempts`);
      if (revisionFails > 0) parts.push(`${revisionFails} failed revision(s)`);
      explanation = parts.join(' • ');
    }

    // Subtopics analysis
    const subtopicMap: Record<string, { total: number; solved: number; needsHelp: boolean }> = {};
    list.forEach((p) => {
      const sub = p.subtopic || 'Core Concept';
      if (!subtopicMap[sub]) subtopicMap[sub] = { total: 0, solved: 0, needsHelp: false };
      subtopicMap[sub].total += 1;
      const isSolved = p.status === 'Solved Independently' || p.status === 'Solved with Hints';
      if (isSolved) subtopicMap[sub].solved += 1;
      if (!p.solvedIndependently || p.needsRevision || (p.hintsUsed && p.hintsUsed > 0)) {
        subtopicMap[sub].needsHelp = true;
      }
    });

    const subtopics = Object.keys(subtopicMap).map((name) => ({
      name,
      solved: subtopicMap[name].solved,
      total: subtopicMap[name].total,
      needsHelp: subtopicMap[name].needsHelp,
    }));

    return {
      topic,
      totalProblems,
      solvedCount,
      independentCount,
      hintsCount,
      attemptsTotal,
      avgAttempts,
      totalMinutes,
      revisionFails,
      masteryScore,
      status,
      explanation,
      subtopics,
    };
  });

  return results.sort((a, b) => {
    // Sort critical weaknesses first, then by mastery score ascending
    if (a.status === 'Critical Weakness' && b.status !== 'Critical Weakness') return -1;
    if (b.status === 'Critical Weakness' && a.status !== 'Critical Weakness') return 1;
    return a.masteryScore - b.masteryScore;
  });
};

// ==============================================================================
// Feature 3: Smart Spaced Repetition Engine
// ==============================================================================

export const calculateNextSpacedRepetitionDate = (
  currentStage: number,
  outcome: 'success' | 'hints' | 'failed',
  intervals: number[] = [1, 3, 7, 14]
): { nextStage: number; nextScheduledDate: string; intervalDays: number } => {
  let nextStage = currentStage;
  let intervalDays = 1;

  if (outcome === 'success') {
    // Advance interval stage: 1d -> 3d -> 7d -> 14d -> 30d
    nextStage = Math.min(intervals.length, currentStage + 1);
    if (nextStage < intervals.length) {
      intervalDays = intervals[nextStage];
    } else {
      intervalDays = 30; // Max mastery interval
    }
  } else if (outcome === 'hints') {
    // Retain shorter interval (re-test in 1 or 2 days)
    nextStage = Math.max(0, currentStage - 1);
    intervalDays = intervals[nextStage] || 1;
  } else {
    // Failed: reset stage to 0, review again tomorrow!
    nextStage = 0;
    intervalDays = 1;
  }

  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + intervalDays);
  const year = nextDate.getFullYear();
  const month = String(nextDate.getMonth() + 1).padStart(2, '0');
  const day = String(nextDate.getDate()).padStart(2, '0');

  return {
    nextStage,
    nextScheduledDate: `${year}-${month}-${day}`,
    intervalDays,
  };
};

// ==============================================================================
// Feature 8: Interview Readiness Meter
// ==============================================================================

export const computeInterviewReadiness = (
  problems: Problem[],
  studyLogs: StudyDayLog[],
  customWeights?: {
    coverage: number;
    independent: number;
    revision: number;
    difficulty: number;
    consistency: number;
  }
): ReadinessBreakdown => {
  const weights = customWeights || {
    coverage: 25,
    independent: 25,
    revision: 20,
    difficulty: 15,
    consistency: 15,
  };

  const solvedProblems = problems.filter(
    (p) => p.status === 'Solved Independently' || p.status === 'Solved with Hints'
  );

  // 1. Topic Coverage (Score 0-100)
  // Evaluates coverage across the 12 core topics
  const topicsWithSolved = new Set(solvedProblems.map((p) => p.topic));
  let coveredCount = 0;
  CORE_TOPICS.forEach((ct) => {
    const countInTopic = solvedProblems.filter((p) => p.topic === ct).length;
    if (countInTopic >= 2) coveredCount += 1;
    else if (countInTopic === 1) coveredCount += 0.5;
  });
  const topicCoverageScore = Math.min(100, Math.round((coveredCount / CORE_TOPICS.length) * 100));

  // 2. Independent Solving Rate (Score 0-100)
  const independentSolved = solvedProblems.filter((p) => p.solvedIndependently).length;
  const independentSolveScore =
    solvedProblems.length > 0
      ? Math.round((independentSolved / solvedProblems.length) * 100)
      : 0;

  // 3. Revision Success Rate (Score 0-100)
  const totalRevisions = problems.reduce(
    (sum, p) => sum + (p.revisionHistory?.length || 0),
    0
  );
  const successfulRevisions = problems.reduce((sum, p) => {
    return sum + (p.revisionHistory?.filter((r) => r.success).length || 0);
  }, 0);
  const revisionSuccessScore =
    totalRevisions > 0
      ? Math.round((successfulRevisions / totalRevisions) * 100)
      : 50; // Neutral baseline if no revisions recorded yet

  // 4. Difficulty Distribution (Score 0-100)
  // Ideal interview mix has healthy ratio of Mediums (2 pts) & Hards (3 pts)
  const easyCount = solvedProblems.filter((p) => p.difficulty === 'Easy').length;
  const mediumCount = solvedProblems.filter((p) => p.difficulty === 'Medium').length;
  const hardCount = solvedProblems.filter((p) => p.difficulty === 'Hard').length;
  const weightedDiff = easyCount * 1 + mediumCount * 2.2 + hardCount * 3.5;
  const expectedDiff = Math.max(1, solvedProblems.length * 2.0); // Medium average target
  const difficultyDistributionScore = Math.min(
    100,
    Math.round((weightedDiff / expectedDiff) * 75)
  );

  // 5. Consistency & Streak (Score 0-100)
  // Measured across active days and STL completion
  const recentLogs = studyLogs.slice(0, 14);
  const daysTargetMet = recentLogs.filter((l) => l.targetMet || l.solvedCount >= 3).length;
  const stlDays = recentLogs.filter((l) => l.stlCompleted).length;
  const consistencyScore =
    recentLogs.length > 0
      ? Math.min(100, Math.round(((daysTargetMet + stlDays) / (recentLogs.length * 2)) * 100))
      : 40;

  // Weighted overall calculation
  const overallScore = Math.min(
    100,
    Math.max(
      0,
      Math.round(
        (topicCoverageScore * weights.coverage +
          independentSolveScore * weights.independent +
          revisionSuccessScore * weights.revision +
          difficultyDistributionScore * weights.difficulty +
          consistencyScore * weights.consistency) /
          100
      )
    )
  );

  // Transparent explanation and actionable gap suggestions
  const actionableGaps: string[] = [];
  if (topicCoverageScore < 70) {
    const unvisited = CORE_TOPICS.filter((ct) => !topicsWithSolved.has(ct));
    if (unvisited.length > 0) {
      actionableGaps.push(`Expand coverage into missing topics: ${unvisited.slice(0, 3).join(', ')}.`);
    }
  }
  if (independentSolveScore < 70) {
    actionableGaps.push('Increase independent solve rate. Spend at least 20 minutes before checking hints.');
  }
  if (mediumCount + hardCount < easyCount) {
    actionableGaps.push('Shift question difficulty toward Medium problems to mirror real technical interview rounds.');
  }
  if (revisionSuccessScore < 70 && totalRevisions > 0) {
    actionableGaps.push('Reinforce past mistakes in Revision Queue. Repeat failed problems within 24 hours.');
  }
  if (stlDays < recentLogs.length * 0.7) {
    actionableGaps.push('Complete daily 30-min STL sessions consistently so C++ container methods become second nature.');
  }

  const explanation = `Readiness Score is a transparent weighted formula (${weights.coverage}% Topic Coverage, ${weights.independent}% Independent Solves, ${weights.revision}% Revision Mastery, ${weights.difficulty}% Difficulty Mix, ${weights.consistency}% Study Consistency). It is a personal prep index, not an interview guarantee.`;

  return {
    topicCoverageScore,
    independentSolveScore,
    revisionSuccessScore,
    difficultyDistributionScore,
    consistencyScore,
    overallScore,
    weights,
    explanation,
    actionableGaps: actionableGaps.length > 0 ? actionableGaps : ['All core factors well balanced! Keep current momentum.'],
  };
};

// ==============================================================================
// Feature 6: Weekly Performance Autopsy Engine
// ==============================================================================

export const computeWeeklyAutopsy = (
  problems: Problem[],
  studyLogs: StudyDayLog[],
  focusSessions: FocusSession[],
  rescheduleEvents: RescheduleEvent[],
  offsetWeeks = 0
) => {
  const now = new Date();
  const endD = new Date(now);
  endD.setDate(endD.getDate() - (offsetWeeks * 7));
  const startD = new Date(endD);
  startD.setDate(startD.getDate() - 6);

  const startStr = startD.toISOString().slice(0, 10);
  const endStr = endD.toISOString().slice(0, 10);

  // Filter logs for this 7-day period
  const weekLogs = studyLogs.filter((l) => l.date >= startStr && l.date <= endStr);
  const weekProblems = problems.filter((p) => {
    const pDate = p.completedAt ? p.completedAt.slice(0, 10) : p.createdAt.slice(0, 10);
    return pDate >= startStr && pDate <= endStr;
  });

  const weekFocusSessions = focusSessions.filter((f) => {
    const fDate = f.startedAt.slice(0, 10);
    return fDate >= startStr && fDate <= endStr;
  });

  const weekReschedules = rescheduleEvents.filter((r) => {
    return r.date >= startStr && r.date <= endStr;
  });

  const plannedCount = weekLogs.reduce((sum, l) => sum + (l.solvedCount || 4), 0);
  const completedCount = weekProblems.filter(
    (p) => p.status === 'Solved Independently' || p.status === 'Solved with Hints'
  ).length;

  const completionRate = plannedCount > 0 ? Math.min(100, Math.round((completedCount / plannedCount) * 100)) : 0;
  const independentCount = weekProblems.filter((p) => p.solvedIndependently).length;
  const independentRate = completedCount > 0 ? Math.round((independentCount / completedCount) * 100) : 0;

  const easyCount = weekProblems.filter((p) => p.difficulty === 'Easy').length;
  const mediumCount = weekProblems.filter((p) => p.difficulty === 'Medium').length;
  const hardCount = weekProblems.filter((p) => p.difficulty === 'Hard').length;

  const totalDsaMinutes = weekLogs.reduce((sum, l) => sum + (l.dsaMinutes || 0), 0);
  const totalFocusMinutes = Math.round(
    weekFocusSessions.reduce((sum, f) => sum + (f.activeSeconds || 0), 0) / 60
  );
  const totalStlMinutes = weekLogs.reduce((sum, l) => sum + (l.stlMinutes || 0), 0);
  const stlDaysCompleted = weekLogs.filter((l) => l.stlCompleted).length;

  // Topic metrics in this week
  const topicCounts: Record<string, { total: number; independent: number }> = {};
  weekProblems.forEach((p) => {
    if (!topicCounts[p.topic]) topicCounts[p.topic] = { total: 0, independent: 0 };
    topicCounts[p.topic].total += 1;
    if (p.solvedIndependently) topicCounts[p.topic].independent += 1;
  });

  let strongestTopic = 'General DSA';
  let weakestTopic = 'None';
  let bestScore = -1;
  let worstScore = 999;

  Object.keys(topicCounts).forEach((t) => {
    const { total, independent } = topicCounts[t];
    const score = independent / total;
    if (score > bestScore) {
      bestScore = score;
      strongestTopic = t;
    }
    if (score < worstScore) {
      worstScore = score;
      weakestTopic = t;
    }
  });

  // Revision outcomes
  const revisionAttempts = weekProblems.reduce(
    (sum, p) => sum + (p.revisionHistory?.length || 0),
    0
  );
  const revisionSuccesses = weekProblems.reduce((sum, p) => {
    return sum + (p.revisionHistory?.filter((r) => r.success).length || 0);
  }, 0);
  const revisionSuccessRate =
    revisionAttempts > 0 ? Math.round((revisionSuccesses / revisionAttempts) * 100) : 100;

  const recoveredCount = weekReschedules.filter((r) => r.action === 'carry_over').length;
  const hasEnoughData = weekLogs.length >= 3 || weekProblems.length >= 3;

  // Actionable suggestions based on measured facts
  const recommendations: string[] = [];
  if (stlDaysCompleted < 5) {
    recommendations.push(
      `STL Consistency was ${stlDaysCompleted}/7 days. Protect your daily 30-min STL practice session as a mandatory non-negotiable block.`
    );
  }
  if (independentRate < 60 && completedCount > 0) {
    recommendations.push(
      `Independent solve rate was ${independentRate}%. Before consulting editorial hints, enforce a strict 20-minute silent attempt timer in Focus Mode.`
    );
  }
  if (mediumCount < easyCount && completedCount > 2) {
    recommendations.push(
      `Easy problems dominated this week (${easyCount} Easy vs ${mediumCount} Medium). Upgrade next week's plan to 60%+ Medium problems to match technical interview rigor.`
    );
  }
  if (recoveredCount > 0) {
    recommendations.push(
      `You successfully carried over and recovered ${recoveredCount} unfinished problem(s). Great resilience!`
    );
  }
  if (recommendations.length === 0) {
    recommendations.push('Solid execution across all dimensions this week. Maintain consistency in the coming week.');
  }

  return {
    startDate: startStr,
    endDate: endStr,
    plannedCount,
    completedCount,
    completionRate,
    independentCount,
    independentRate,
    easyCount,
    mediumCount,
    hardCount,
    totalDsaMinutes,
    totalFocusMinutes,
    totalStlMinutes,
    stlDaysCompleted,
    revisionAttempts,
    revisionSuccessRate,
    strongestTopic,
    weakestTopic,
    recoveredCount,
    hasEnoughData,
    recommendations,
  };
};
