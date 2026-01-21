import { useState, useCallback, useEffect } from 'react';
import { ActionGuidanceState, ActionTask } from '../types';

interface TaskCompletionTrackerProps {
    initialState: ActionGuidanceState;
    onStateChange?: (state: ActionGuidanceState) => void;
}

/**
 * Task Completion Tracker Hook
 * 
 * Manages:
 * - Task completion state
 * - Action history tracking
 * - Daily/Weekly streak calculation
 * - Auto-completion for condition-based tasks
 * - Persistence to localStorage
 */
export const useTaskCompletionTracker = ({
    initialState,
    onStateChange
}: TaskCompletionTrackerProps) => {
    const [guidanceState, setGuidanceState] = useState<ActionGuidanceState>(initialState);
    const [lastResetDate, setLastResetDate] = useState<string>(
        localStorage.getItem('storex_task_last_reset') || new Date().toISOString()
    );

    // ============================================================================
    // PERSISTENCE
    // ============================================================================
    useEffect(() => {
        // Load from localStorage on mount
        const stored = localStorage.getItem('storex_action_guidance');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setGuidanceState(parsed);
            } catch (e) {
                console.error('Failed to parse stored guidance state:', e);
            }
        }
    }, []);

    useEffect(() => {
        // Save to localStorage on change
        localStorage.setItem('storex_action_guidance', JSON.stringify(guidanceState));
        onStateChange?.(guidanceState);
    }, [guidanceState, onStateChange]);

    // ============================================================================
    // TASK COMPLETION
    // ============================================================================
    const completeTask = useCallback((taskId: string, actionKey?: string) => {
        setGuidanceState(prev => {
            const now = new Date().toISOString();

            // Update task state
            const updateTasks = (tasks: ActionTask[]) =>
                tasks.map(task =>
                    task.id === taskId
                        ? { ...task, state: 'completed' as const, completedAt: now }
                        : task
                );

            // Add to task history if actionKey provided
            const newHistory = actionKey && !prev.taskHistory.includes(actionKey)
                ? [...prev.taskHistory, actionKey]
                : prev.taskHistory;

            return {
                ...prev,
                daily: updateTasks(prev.daily),
                weekly: updateTasks(prev.weekly),
                monthly: updateTasks(prev.monthly),
                taskHistory: newHistory
            };
        });
    }, []);

    // ============================================================================
    // STREAK CALCULATION
    // ============================================================================
    const updateStreaks = useCallback(() => {
        setGuidanceState(prev => {
            const today = new Date().toISOString().split('T')[0];
            const lastReset = new Date(lastResetDate).toISOString().split('T')[0];

            // Check if all daily tasks are completed
            const allDailyCompleted = prev.daily.every(task => task.state === 'completed');

            // Check if all weekly tasks are completed
            const allWeeklyCompleted = prev.weekly.every(task => task.state === 'completed');

            let newDailyStreak = prev.streaks.daily;
            let newWeeklyStreak = prev.streaks.weekly;

            // Update daily streak
            if (allDailyCompleted) {
                if (lastReset === today) {
                    // Same day, no change
                } else {
                    // New day, increment streak
                    newDailyStreak += 1;
                }
            } else {
                // Reset streak if not all completed
                newDailyStreak = 0;
            }

            // Update weekly streak (every 7 days)
            if (newDailyStreak > 0 && newDailyStreak % 7 === 0) {
                newWeeklyStreak += 1;
            }

            return {
                ...prev,
                streaks: {
                    daily: newDailyStreak,
                    weekly: newWeeklyStreak
                }
            };
        });
    }, [lastResetDate]);

    // ============================================================================
    // AUTO-COMPLETION FOR CONDITION-BASED TASKS
    // ============================================================================
    const checkAutoCompletion = useCallback(() => {
        setGuidanceState(prev => {
            const now = new Date().toISOString();

            const updateTasks = (tasks: ActionTask[]) =>
                tasks.map(task => {
                    if (task.state === 'condition_based' && task.progress) {
                        const { current, total } = task.progress;
                        if (current >= total) {
                            return { ...task, state: 'completed' as const, completedAt: now };
                        }
                    }
                    return task;
                });

            return {
                ...prev,
                daily: updateTasks(prev.daily),
                weekly: updateTasks(prev.weekly),
                monthly: updateTasks(prev.monthly)
            };
        });
    }, []);

    // ============================================================================
    // RESET LOGIC (Daily/Weekly/Monthly)
    // ============================================================================
    const checkAndResetTasks = useCallback(() => {
        const now = new Date();
        const lastReset = new Date(lastResetDate);

        const hoursSinceReset = (now.getTime() - lastReset.getTime()) / (1000 * 60 * 60);
        const daysSinceReset = hoursSinceReset / 24;

        // Reset daily tasks (every 24 hours)
        if (hoursSinceReset >= 24) {
            setGuidanceState(prev => ({
                ...prev,
                daily: prev.daily.map(task => ({
                    ...task,
                    state: 'pending' as const,
                    completedAt: undefined
                }))
            }));
            setLastResetDate(now.toISOString());
            localStorage.setItem('storex_task_last_reset', now.toISOString());
        }

        // Reset weekly tasks (every 7 days)
        if (daysSinceReset >= 7) {
            setGuidanceState(prev => ({
                ...prev,
                weekly: prev.weekly.map(task => ({
                    ...task,
                    state: task.state === 'condition_based' ? 'condition_based' : 'pending',
                    completedAt: undefined
                }))
            }));
        }

        // Reset monthly tasks (every 30 days)
        if (daysSinceReset >= 30) {
            setGuidanceState(prev => ({
                ...prev,
                monthly: prev.monthly.map(task => ({
                    ...task,
                    state: task.state === 'condition_based' ? 'condition_based' : 'pending',
                    completedAt: undefined
                }))
            }));
        }
    }, [lastResetDate]);

    // ============================================================================
    // AUTO-RUN CHECKS
    // ============================================================================
    useEffect(() => {
        // Check for resets on mount and every hour
        checkAndResetTasks();
        const interval = setInterval(checkAndResetTasks, 60 * 60 * 1000); // Every hour
        return () => clearInterval(interval);
    }, [checkAndResetTasks]);

    useEffect(() => {
        // Check auto-completion whenever guidance state changes
        checkAutoCompletion();
    }, [guidanceState.daily, guidanceState.weekly, guidanceState.monthly, checkAutoCompletion]);

    useEffect(() => {
        // Update streaks whenever tasks complete
        updateStreaks();
    }, [guidanceState.daily, guidanceState.weekly, updateStreaks]);

    // ============================================================================
    // PUBLIC API
    // ============================================================================
    return {
        guidanceState,
        completeTask,
        updateStreaks,
        checkAutoCompletion,
        resetTasks: checkAndResetTasks
    };
};

export default useTaskCompletionTracker;
