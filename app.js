// Load data from localStorage or initialize
function loadData() {
  const savedData = localStorage.getItem("eliteRustMasteryData");
  if (savedData) {
    const parsedData = JSON.parse(savedData);
    streakData = { ...streakData, ...parsedData };

    // Handle data structure migration
    if (streakData.xpActivities && !streakData.dailyXP) {
      // Migrate from old xpActivities structure to new dailyXP structure
      streakData.dailyXP = {};
      if (streakData.xpActivities.dailyCounts) {
        const today = new Date().toDateString();
        const todayCounts = streakData.xpActivities.dailyCounts[today] || {};
        streakData.dailyXP = todayCounts;
      }
      delete streakData.xpActivities;
    }

    // Initialize missing properties
    if (!streakData.todoLists) {
      streakData.todoLists = { morning: [], evening: [], custom: [] };
    }
    if (!streakData.dailyXP) {
      streakData.dailyXP = {};
    }

    // Initialize achievementStats if it doesn't exist
    if (!streakData.achievementStats) {
      streakData.achievementStats = {
        // Learning achievements
        articles_read: 0,
        research_implementations: 0,
        courses_completed: 0,
        research_published: 0,
        blog_posts: 0,

        // Coding achievements
        rust_lines: 0,
        bugs_found: 0,
        unit_tests: 0,
        projects_deployed: 0,

        // Security achievements
        security_challenges: 0,
        vulnerabilities_found: 0,
        ctf_wins: 0,
        audits_completed: 0,
        vulnerabilities_disclosed: 0,

        // Technical mastery badges
        rust_basics_completed: 0,
        memory_allocator_implemented: 0,
        async_app_built: 0,
        crypto_algorithm_implemented: 0,
        contract_vulnerability_found: 0,
        zk_proof_implemented: 0,
        fuzzing_suite_created: 0,
        performance_optimized: 0,

        // Community contribution badges
        questions_answered: 0,
        people_mentored: 0,
        tutorials_created: 0,
        open_source_contributions: 0,
        conference_talks: 0,
        influential_research: 0,
        presentations_given: 0,
        professional_connections: 0,
        junior_developers_mentored: 0,
        followers_gained: 0,

        // Character development badges
        comebacks_made: 0,
        early_morning_sessions: 0,
        deep_work_sessions: 0,
        failures_documented: 0,
        events_organized: 0,
      };
    }
  }

  // Initialize framework progress if not exists
  frameworkSystems.forEach((framework) => {
    if (!streakData.frameworkProgress[framework.id]) {
      streakData.frameworkProgress[framework.id] = false;
    }
  });

  // Initialize todo lists if not exists
  if (!streakData.todoLists.morning.length) {
    streakData.todoLists.morning = [...defaultTodos.morning];
  }
  if (!streakData.todoLists.evening.length) {
    streakData.todoLists.evening = [...defaultTodos.evening];
  }
  if (!streakData.todoLists.custom.length) {
    streakData.todoLists.custom = [...defaultTodos.custom];
  }

  // Initialize XP activities if not exists
  if (!streakData.xpActivities) {
    streakData.xpActivities = {
      dailyCounts: {},
      dailyXP: 0,
    };
  }

  // Reset daily XP if it's a new day
  resetDailyXP();
}

// Save data to localStorage
function saveData() {
  localStorage.setItem("eliteRustMasteryData", JSON.stringify(streakData));
}

// Update UI elements
function updateUI() {
  document.getElementById("streak-counter").textContent =
    streakData.currentStreak;
  document.getElementById("total-xp").textContent =
    streakData.totalXP.toLocaleString();
  document.getElementById("projects-completed").textContent =
    streakData.projectsCompleted;
  document.getElementById("skills-mastered").textContent =
    streakData.skillsMastered;
  document.getElementById("current-month").textContent =
    streakData.currentMonth;
  document.getElementById("framework-completion").textContent = Object.values(
    streakData.frameworkProgress
  ).filter(Boolean).length;

  // Update phase indicator
  const phaseIndicator = document.getElementById("phase-indicator");
  if (streakData.currentMonth <= 6) {
    phaseIndicator.textContent =
      "Phase 1: Foundations & Smart Contract Security";
  } else {
    phaseIndicator.textContent =
      "Phase 2: Advanced Security & Zero-Knowledge Mastery";
  }

  // Update progress bars
  updateProgressBars();

  // Update framework grid
  updateFrameworkGrid();

  // Update daily tasks
  updateDailyTasks();

  // Update calendar
  updateCalendar();

  // Update achievements
  updateAchievements();

  // Update rewards
  updateRewards();

  // Update todo lists
  updateTodoLists();

  // Check for new achievements
  checkForNewAchievements();
}

function updateProgressBars() {
  const progressElements = [
    { id: "rust", skill: "rust" },
    { id: "crypto", skill: "cryptography" },
    { id: "security", skill: "security" },
    { id: "zk", skill: "zk" },
    { id: "identity", skill: "identity" },
    { id: "focus", skill: "focus" },
  ];

  progressElements.forEach(({ id, skill }) => {
    const progress = streakData.skillProgress[skill];
    const percentage = Math.min(100, progress);
    document.getElementById(`${id}-progress`).style.width = `${percentage}%`;
    document.getElementById(`${id}-percentage`).textContent =
      percentage.toFixed(1);
  });
}

function updateFrameworkGrid() {
  const grid = document.getElementById("framework-grid");
  grid.innerHTML = "";

  // Add Core Activities section
  const coreSection = document.createElement("div");
  coreSection.style.cssText = "grid-column: 1 / -1; margin-bottom: 20px;";
  coreSection.innerHTML = `
    <div style="font-size: 1.4rem; font-weight: 700; margin-bottom: 15px; color: #4ecdc4; text-align: center;">
      🎯 Core Activities (Daily Cap: 100 XP)
    </div>
  `;
  grid.appendChild(coreSection);

  xpActivities.core.forEach((activity) => {
    const item = document.createElement("div");
    const currentCount = streakData.dailyXP[activity.id] || 0;
    const dailyLimit = Math.floor(activity.dailyCap / activity.xp); // Calculate how many times you can do this activity
    const isAtCap = currentCount >= dailyLimit;

    item.className = `framework-item ${isAtCap ? "completed" : ""}`;
    item.style.cursor = isAtCap ? "not-allowed" : "pointer";
    item.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
        <div style="display: flex; align-items: center;">
          <span class="framework-emoji">${activity.emoji}</span>
          <span class="framework-text">${activity.text}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="color: #feca57; font-weight: 600; font-size: 0.9rem;">${activity.xp} XP</span>
          <span style="color: #4ecdc4; font-weight: 600; font-size: 0.8rem;">${currentCount}/${dailyLimit}</span>
        </div>
      </div>
    `;

    if (!isAtCap) {
      item.onclick = () => toggleXPActivity(activity.id);
    }

    grid.appendChild(item);
  });

  // Add Bonus Activities section
  const bonusSection = document.createElement("div");
  bonusSection.style.cssText = "grid-column: 1 / -1; margin: 20px 0;";
  bonusSection.innerHTML = `
    <div style="font-size: 1.4rem; font-weight: 700; margin-bottom: 15px; color: #feca57; text-align: center;">
      ⭐ Bonus Activities (Unlimited)
    </div>
  `;
  grid.appendChild(bonusSection);

  xpActivities.bonus.forEach((activity) => {
    const item = document.createElement("div");
    const currentCount = streakData.dailyXP[activity.id] || 0;

    item.className = "framework-item";
    item.style.cursor = "pointer";
    item.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
        <div style="display: flex; align-items: center;">
          <span class="framework-emoji">${activity.emoji}</span>
          <span class="framework-text">${activity.text}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="color: #feca57; font-weight: 600; font-size: 0.9rem;">${activity.xp} XP</span>
          <span style="color: #4ecdc4; font-weight: 600; font-size: 0.8rem;">${currentCount}∞</span>
        </div>
      </div>
    `;
    item.onclick = () => toggleXPActivity(activity.id);
    grid.appendChild(item);
  });
}

function autoProgressStreak() {
  const today = new Date().toDateString();

  // Only auto-progress if we haven't already completed today
  if (streakData.lastCompletedDate === today) {
    return;
  }

  // Check specific requirements for streak progression
  const morningTodos = streakData.todoLists.morning;
  const eveningTodos = streakData.todoLists.evening;
  const completedMorningTodos = morningTodos.filter(
    (todo) => todo.completed
  ).length;
  const completedEveningTodos = eveningTodos.filter(
    (todo) => todo.completed
  ).length;
  const totalMorningTodos = morningTodos.length;
  const totalEveningTodos = eveningTodos.length;
  const completedXPActivities = Object.values(streakData.dailyXP).filter(
    (count) => count > 0
  ).length;

  // Require: morning routine (at least 1 todo), evening routine (at least 1 todo), and 3 XP activities
  const hasMorningRoutine = totalMorningTodos > 0 && completedMorningTodos >= 1;
  const hasEveningRoutine = totalEveningTodos > 0 && completedEveningTodos >= 1;
  const hasEnoughXP = completedXPActivities >= 3;

  if (hasMorningRoutine && hasEveningRoutine && hasEnoughXP) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toDateString();

    if (
      streakData.lastCompletedDate === yesterdayString ||
      streakData.currentStreak === 0
    ) {
      streakData.currentStreak++;
      showNotification(
        `🔥 Streak increased to ${streakData.currentStreak} days! All routines completed!`,
        "success"
      );
    } else {
      streakData.currentStreak = 1;
      showNotification(
        "🔥 New streak started! Welcome back to your mastery journey!",
        "success"
      );
    }

    streakData.lastCompletedDate = today;
    saveData();
    updateUI();
  }
}

function toggleXPActivity(activityId) {
  // Find activity in both core and bonus arrays
  const activity = [...xpActivities.core, ...xpActivities.bonus].find(
    (a) => a.id === activityId
  );
  if (!activity) return;

  const currentCount = streakData.dailyXP[activityId] || 0;

  if (activity.category === "core") {
    // Core activities have daily limits
    const dailyLimit = Math.floor(activity.dailyCap / activity.xp);
    if (currentCount >= dailyLimit) {
      showNotification(
        `❌ Daily limit reached for ${activity.text}! Try again tomorrow.`,
        "error"
      );
      return;
    }
  }

  // Increment count
  streakData.dailyXP[activityId] = currentCount + 1;
  streakData.totalXP += activity.xp;

  // Update skill progress based on activity type
  if (
    activity.text.toLowerCase().includes("rust") ||
    activity.text.toLowerCase().includes("code")
  ) {
    streakData.skillProgress.rust += 1;
  } else if (
    activity.text.toLowerCase().includes("security") ||
    activity.text.toLowerCase().includes("audit")
  ) {
    streakData.skillProgress.security += 1;
  } else if (activity.text.toLowerCase().includes("crypto")) {
    streakData.skillProgress.cryptography += 1;
  } else if (
    activity.text.toLowerCase().includes("zk") ||
    activity.text.toLowerCase().includes("zero")
  ) {
    streakData.skillProgress.zk += 1;
  } else if (
    activity.text.toLowerCase().includes("community") ||
    activity.text.toLowerCase().includes("help")
  ) {
    streakData.skillProgress.identity += 1;
  } else {
    streakData.skillProgress.focus += 1;
  }

  const dailyLimit =
    activity.category === "core"
      ? Math.floor(activity.dailyCap / activity.xp)
      : "∞";
  showNotification(
    `✅ ${activity.text} completed! +${activity.xp} XP (${
      currentCount + 1
    }/${dailyLimit})`
  );

  // Auto-progress streak if conditions are met
  autoProgressStreak();

  saveData();
  updateUI();
  updateFrameworkGrid();
}

// Reset daily XP at midnight
function resetDailyXP() {
  const today = new Date().toDateString();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayString = yesterday.toDateString();

  // Reset daily XP counts if it's a new day
  if (Object.keys(streakData.dailyXP).length > 0) {
    // Check if we need to reset (this is a simple implementation)
    // In a real app, you'd want to check the actual date
    streakData.dailyXP = {};
  }
}

function updateDailyTasks() {
  const container = document.getElementById("daily-task-list");
  container.innerHTML = "";

  // Get today's date key
  const today = new Date().toDateString();
  const todayTasks =
    streakData.completedDays.find((day) => day.date === today)?.tasks || [];

  // Select relevant tasks based on current phase and progress
  const selectedTasks = selectDailyTasks();

  selectedTasks.forEach((task) => {
    const completed = todayTasks.includes(task.id);
    const taskElement = document.createElement("div");
    taskElement.className = "task-item";
    taskElement.innerHTML = `
      <div class="task-checkbox ${
        completed ? "completed" : ""
      }" onclick="toggleTask('${task.id}')">
        ${completed ? "✓" : ""}
      </div>
      <div class="task-text ${completed ? "completed" : ""}">${task.text}</div>
      <div class="xp-points">+${task.xp} XP</div>
    `;
    container.appendChild(taskElement);
  });
}

function selectDailyTasks() {
  // Select 6-8 tasks based on current progress and phase
  const currentPhase = phases.find((phase) =>
    phase.months.includes(streakData.currentMonth)
  );
  const availableTasks = [...dailyTasks];

  // Always include framework review
  const selected = [
    availableTasks.find((task) => task.id === "framework-review"),
  ];

  // Add phase-specific tasks
  if (currentPhase.id <= 2) {
    selected.push(
      availableTasks.find((task) => task.id === "rust-fundamentals"),
      availableTasks.find((task) => task.id === "smart-contract"),
      availableTasks.find((task) => task.id === "crypto-study")
    );
  } else {
    selected.push(
      availableTasks.find((task) => task.id === "zk-research"),
      availableTasks.find((task) => task.id === "code-review"),
      availableTasks.find((task) => task.id === "project-progress")
    );
  }

  // Add learning and documentation tasks
  selected.push(
    availableTasks.find((task) => task.id === "learning-session"),
    availableTasks.find((task) => task.id === "documentation"),
    availableTasks.find((task) => task.id === "network-engage")
  );

  return selected.filter(Boolean);
}

function updateCalendar() {
  const grid = document.getElementById("calendar-grid");
  grid.innerHTML = "";

  // Generate last 21 days
  const today = new Date();
  for (let i = 20; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    const day = document.createElement("div");
    day.className = "calendar-day";
    day.textContent = date.getDate();

    const dateString = date.toDateString();
    const isCompleted = streakData.completedDays.some(
      (d) => d.date === dateString
    );
    const isToday = dateString === today.toDateString();
    const hasData = isCompleted || dateString === today.toDateString();

    if (isCompleted) day.classList.add("completed");
    if (isToday) day.classList.add("today");
    if (hasData) {
      day.classList.add("clickable", "has-data");
      day.onclick = () => showDateHistory(date);
    } else {
      day.classList.add("clickable");
      day.onclick = () => showDateHistory(date);
    }

    grid.appendChild(day);
  }
}

function showDateHistory(date) {
  const dateString = date.toDateString();
  const dayData = streakData.completedDays.find((d) => d.date === dateString);
  const isToday = dateString === new Date().toDateString();

  // Create modal
  const modal = document.createElement("div");
  modal.className = "date-history-modal";

  const content = document.createElement("div");
  content.className = "date-history-content";

  // Header
  const header = document.createElement("div");
  header.className = "date-history-header";

  const title = document.createElement("div");
  title.className = "date-history-title";
  title.textContent = `${date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })}`;

  const closeBtn = document.createElement("button");
  closeBtn.className = "date-history-close";
  closeBtn.innerHTML = "×";
  closeBtn.onclick = () => document.body.removeChild(modal);

  header.appendChild(title);
  header.appendChild(closeBtn);
  content.appendChild(header);

  if (dayData || isToday) {
    // Stats section
    const statsSection = document.createElement("div");
    statsSection.className = "date-history-stats";

    const tasksCompleted = dayData ? dayData.tasks.length : 0;
    const xpEarned = dayData ? dayData.xpEarned : 0;
    const status = dayData
      ? "Completed"
      : isToday
      ? "In Progress"
      : "Not Started";

    // Calculate streak info
    const currentDate = new Date(date);
    const streakInfo = calculateStreakForDate(currentDate);

    statsSection.innerHTML = `
      <div class="date-history-stat">
        <div class="date-history-stat-number">${tasksCompleted}</div>
        <div class="date-history-stat-label">Tasks Completed</div>
      </div>
      <div class="date-history-stat">
        <div class="date-history-stat-number">${xpEarned}</div>
        <div class="date-history-stat-label">XP Earned</div>
      </div>
      <div class="date-history-stat">
        <div class="date-history-stat-number">${streakInfo.streak}</div>
        <div class="date-history-stat-label">Day Streak</div>
      </div>
      <div class="date-history-stat">
        <div class="date-history-stat-number">${status}</div>
        <div class="date-history-stat-label">Status</div>
      </div>
    `;

    content.appendChild(statsSection);

    // Streak section
    if (streakInfo.streak > 0) {
      const streakSection = document.createElement("div");
      streakSection.className = "date-history-section";

      const streakTitle = document.createElement("div");
      streakTitle.className = "date-history-section-title";
      streakTitle.innerHTML = `🔥 ${streakInfo.streak} Day Streak`;
      streakSection.appendChild(streakTitle);

      const streakItem = document.createElement("div");
      streakItem.className = "date-history-item completed";
      streakItem.innerHTML = `
        <div class="date-history-item-text">${streakInfo.message}</div>
        <div class="date-history-item-xp">${streakInfo.streak} consecutive days</div>
      `;
      streakSection.appendChild(streakItem);

      content.appendChild(streakSection);
    }

    // Tasks section
    if (dayData && dayData.tasks.length > 0) {
      const tasksSection = document.createElement("div");
      tasksSection.className = "date-history-section";

      const tasksTitle = document.createElement("div");
      tasksTitle.className = "date-history-section-title";
      tasksTitle.innerHTML = "📋 Completed Tasks";
      tasksSection.appendChild(tasksTitle);

      dayData.tasks.forEach((taskId) => {
        const task = dailyTasks.find((t) => t.id === taskId);
        if (task) {
          const taskItem = document.createElement("div");
          taskItem.className = "date-history-item completed";
          taskItem.innerHTML = `
            <div class="date-history-item-text">${task.text}</div>
            <div class="date-history-item-xp">+${task.xp} XP</div>
          `;
          tasksSection.appendChild(taskItem);
        }
      });

      content.appendChild(tasksSection);
    }

    // Todo sections for each type
    const todoTypes = ["morning", "evening", "custom"];
    let hasAnyTodos = false;

    todoTypes.forEach((type) => {
      const todos = streakData.todoLists[type];
      const completedTodos = todos.filter((todo) => todo.completed);
      const incompleteTodos = todos.filter((todo) => !todo.completed);

      if (todos.length > 0) {
        hasAnyTodos = true;
        const todoSection = document.createElement("div");
        todoSection.className = "date-history-section";

        const todoTitle = document.createElement("div");
        todoTitle.className = "date-history-section-title";
        const typeEmoji =
          type === "morning" ? "🌅" : type === "evening" ? "🌙" : "⚡";
        todoTitle.innerHTML = `${typeEmoji} ${
          type.charAt(0).toUpperCase() + type.slice(1)
        } Routine (${completedTodos.length}/${todos.length})`;
        todoSection.appendChild(todoTitle);

        // Show completed todos
        completedTodos.forEach((todo) => {
          const todoItem = document.createElement("div");
          todoItem.className = "date-history-item completed";
          todoItem.innerHTML = `
            <div class="date-history-item-text">${todo.text}</div>
            <div class="date-history-item-xp">${todo.time} - Completed</div>
          `;
          todoSection.appendChild(todoItem);
        });

        // Show incomplete todos
        incompleteTodos.forEach((todo) => {
          const todoItem = document.createElement("div");
          todoItem.className = "date-history-item";
          todoItem.innerHTML = `
            <div class="date-history-item-text">${todo.text}</div>
            <div class="date-history-item-xp">${todo.time} - Not completed</div>
          `;
          todoSection.appendChild(todoItem);
        });

        content.appendChild(todoSection);
      }
    });

    // Habits section
    const habitsSection = document.createElement("div");
    habitsSection.className = "date-history-section";

    const habitsTitle = document.createElement("div");
    habitsTitle.className = "date-history-section-title";
    const completedHabits = Object.values(habitData).filter(
      (habit) => habit.completed
    ).length;
    habitsTitle.innerHTML = `🔥 Daily Habits (${completedHabits}/4)`;
    habitsSection.appendChild(habitsTitle);

    const habitTypes = [
      { key: "code", name: "Code Practice", emoji: "💻" },
      { key: "security", name: "Security Learning", emoji: "🛡️" },
      { key: "community", name: "Community Engagement", emoji: "👥" },
      { key: "reflection", name: "Progress Review", emoji: "📝" },
    ];

    let hasHabits = false;

    habitTypes.forEach((habit) => {
      const isCompleted = habitData[habit.key].completed;
      hasHabits = true;

      const habitItem = document.createElement("div");
      habitItem.className = `date-history-item ${
        isCompleted ? "completed" : ""
      }`;
      habitItem.innerHTML = `
        <div class="date-history-item-text">${habit.emoji} ${habit.name}</div>
        <div class="date-history-item-xp">${
          isCompleted ? "Completed" : "Not completed"
        }</div>
      `;
      habitsSection.appendChild(habitItem);
    });

    if (hasHabits) {
      content.appendChild(habitsSection);
    }
  } else {
    // Empty state
    const emptyState = document.createElement("div");
    emptyState.className = "date-history-empty";
    emptyState.innerHTML = `
      <div class="date-history-empty-icon">📅</div>
      <div>No activity recorded for this date</div>
      <div style="margin-top: 10px; font-size: 0.9rem;">Start your journey to see your progress here!</div>
    `;
    content.appendChild(emptyState);
  }

  modal.appendChild(content);
  document.body.appendChild(modal);

  // Close modal when clicking outside
  modal.onclick = (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  };
}

function calculateStreakForDate(date) {
  const dateString = date.toDateString();
  const dayData = streakData.completedDays.find((d) => d.date === dateString);

  if (!dayData) {
    return { streak: 0, message: "No activity recorded" };
  }

  // Find the streak that this date was part of
  let streak = 0;
  let currentDate = new Date(date);

  // Count backwards to find the start of the streak
  while (true) {
    const currentDateString = currentDate.toDateString();
    const currentDayData = streakData.completedDays.find(
      (d) => d.date === currentDateString
    );

    if (currentDayData) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  let message = "";
  if (streak === 1) {
    message = "First day of your journey!";
  } else if (streak < 7) {
    message = "Building momentum!";
  } else if (streak < 30) {
    message = "Consistent progress!";
  } else if (streak < 100) {
    message = "Impressive dedication!";
  } else {
    message = "Elite level consistency!";
  }

  return { streak, message };
}

function updateAchievements() {
  const container = document.getElementById("achievement-badges");
  if (!container) return;

  container.innerHTML = "";

  // Group achievements by category
  const categories = {
    consistency: achievements.filter((a) => a.category === "consistency"),
    learning: achievements.filter((a) => a.category === "learning"),
    coding: achievements.filter((a) => a.category === "coding"),
    security: achievements.filter((a) => a.category === "security"),
  };

  // Create category sections
  Object.entries(categories).forEach(([categoryName, categoryAchievements]) => {
    const categorySection = document.createElement("div");
    categorySection.className = "achievement-category";

    const categoryTitle = document.createElement("h3");
    categoryTitle.className = "achievement-category-title";
    categoryTitle.textContent = getCategoryTitle(categoryName);
    categorySection.appendChild(categoryTitle);

    categoryAchievements.forEach((achievement) => {
      const isUnlocked = checkAchievement(achievement);
      const badge = document.createElement("div");
      badge.className = `achievement-badge ${
        isUnlocked ? "unlocked" : "locked"
      }`;

      badge.innerHTML = `
        <div class="achievement-icon">${achievement.name.split(" ")[0]}</div>
        <div class="achievement-info">
          <div class="achievement-name">${achievement.name
            .split(" ")
            .slice(1)
            .join(" ")}</div>
          <div class="achievement-description">${achievement.description}</div>
          <div class="achievement-progress">
            <div class="achievement-progress-bar">
              <div class="achievement-progress-fill" style="width: ${getAchievementProgress(
                achievement
              )}%"></div>
            </div>
            <span class="achievement-progress-text">${getAchievementProgressText(
              achievement
            )}</span>
          </div>
        </div>
        <div class="achievement-status">${isUnlocked ? "✓" : "🔒"}</div>
      `;

      categorySection.appendChild(badge);
    });

    container.appendChild(categorySection);
  });
}

function getCategoryTitle(category) {
  const titles = {
    consistency: "🔥 Consistency Achievements",
    learning: "📚 Learning Achievements",
    coding: "⚔️ Coding Achievements",
    security: "🛡️ Security Achievements",
  };
  return titles[category] || category;
}

function checkAchievement(achievement) {
  const { type, value } = achievement.requirement;

  switch (type) {
    case "streak":
      // Use code practice habit streak for consistency achievements
      return habitData.code.streak >= value;
    case "articles_read":
      return streakData.achievementStats.articles_read >= value;
    case "research_implementations":
      return streakData.achievementStats.research_implementations >= value;
    case "courses_completed":
      return streakData.achievementStats.courses_completed >= value;
    case "research_published":
      return streakData.achievementStats.research_published >= value;
    case "blog_posts":
      return streakData.achievementStats.blog_posts >= value;
    case "rust_lines":
      return streakData.achievementStats.rust_lines >= value;
    case "projects_completed":
      return streakData.projectsCompleted >= value;
    case "bugs_found":
      return streakData.achievementStats.bugs_found >= value;
    case "unit_tests":
      return streakData.achievementStats.unit_tests >= value;
    case "projects_deployed":
      return streakData.achievementStats.projects_deployed >= value;
    case "security_challenges":
      return streakData.achievementStats.security_challenges >= value;
    case "vulnerabilities_found":
      return streakData.achievementStats.vulnerabilities_found >= value;
    case "ctf_wins":
      return streakData.achievementStats.ctf_wins >= value;
    case "audits_completed":
      return streakData.achievementStats.audits_completed >= value;
    case "vulnerabilities_disclosed":
      return streakData.achievementStats.vulnerabilities_disclosed >= value;

    // Technical mastery badges
    case "rust_basics_completed":
      return streakData.achievementStats.rust_basics_completed >= value;
    case "memory_allocator_implemented":
      return streakData.achievementStats.memory_allocator_implemented >= value;
    case "async_app_built":
      return streakData.achievementStats.async_app_built >= value;
    case "crypto_algorithm_implemented":
      return streakData.achievementStats.crypto_algorithm_implemented >= value;
    case "contract_vulnerability_found":
      return streakData.achievementStats.contract_vulnerability_found >= value;
    case "zk_proof_implemented":
      return streakData.achievementStats.zk_proof_implemented >= value;
    case "fuzzing_suite_created":
      return streakData.achievementStats.fuzzing_suite_created >= value;
    case "performance_optimized":
      return streakData.achievementStats.performance_optimized >= value;

    // Community contribution badges
    case "questions_answered":
      return streakData.achievementStats.questions_answered >= value;
    case "people_mentored":
      return streakData.achievementStats.people_mentored >= value;
    case "tutorials_created":
      return streakData.achievementStats.tutorials_created >= value;
    case "open_source_contributions":
      return streakData.achievementStats.open_source_contributions >= value;
    case "conference_talks":
      return streakData.achievementStats.conference_talks >= value;
    case "influential_research":
      return streakData.achievementStats.influential_research >= value;
    case "presentations_given":
      return streakData.achievementStats.presentations_given >= value;
    case "professional_connections":
      return streakData.achievementStats.professional_connections >= value;
    case "junior_developers_mentored":
      return streakData.achievementStats.junior_developers_mentored >= value;
    case "followers_gained":
      return streakData.achievementStats.followers_gained >= value;

    // Character development badges
    case "comebacks_made":
      return streakData.achievementStats.comebacks_made >= value;
    case "early_morning_sessions":
      return streakData.achievementStats.early_morning_sessions >= value;
    case "deep_work_sessions":
      return streakData.achievementStats.deep_work_sessions >= value;
    case "failures_documented":
      return streakData.achievementStats.failures_documented >= value;
    case "events_organized":
      return streakData.achievementStats.events_organized >= value;

    default:
      return false;
  }
}

function getAchievementProgress(achievement) {
  const { type, value } = achievement.requirement;
  let current = 0;

  switch (type) {
    case "streak":
      current = habitData.code.streak;
      break;
    case "articles_read":
      current = streakData.achievementStats.articles_read;
      break;
    case "research_implementations":
      current = streakData.achievementStats.research_implementations;
      break;
    case "courses_completed":
      current = streakData.achievementStats.courses_completed;
      break;
    case "research_published":
      current = streakData.achievementStats.research_published;
      break;
    case "blog_posts":
      current = streakData.achievementStats.blog_posts;
      break;
    case "rust_lines":
      current = streakData.achievementStats.rust_lines;
      break;
    case "projects_completed":
      current = streakData.projectsCompleted;
      break;
    case "bugs_found":
      current = streakData.achievementStats.bugs_found;
      break;
    case "unit_tests":
      current = streakData.achievementStats.unit_tests;
      break;
    case "projects_deployed":
      current = streakData.achievementStats.projects_deployed;
      break;
    case "security_challenges":
      current = streakData.achievementStats.security_challenges;
      break;
    case "vulnerabilities_found":
      current = streakData.achievementStats.vulnerabilities_found;
      break;
    case "ctf_wins":
      current = streakData.achievementStats.ctf_wins;
      break;
    case "audits_completed":
      current = streakData.achievementStats.audits_completed;
      break;
    case "vulnerabilities_disclosed":
      current = streakData.achievementStats.vulnerabilities_disclosed;
      break;

    // Technical mastery badges
    case "rust_basics_completed":
      current = streakData.achievementStats.rust_basics_completed;
      break;
    case "memory_allocator_implemented":
      current = streakData.achievementStats.memory_allocator_implemented;
      break;
    case "async_app_built":
      current = streakData.achievementStats.async_app_built;
      break;
    case "crypto_algorithm_implemented":
      current = streakData.achievementStats.crypto_algorithm_implemented;
      break;
    case "contract_vulnerability_found":
      current = streakData.achievementStats.contract_vulnerability_found;
      break;
    case "zk_proof_implemented":
      current = streakData.achievementStats.zk_proof_implemented;
      break;
    case "fuzzing_suite_created":
      current = streakData.achievementStats.fuzzing_suite_created;
      break;
    case "performance_optimized":
      current = streakData.achievementStats.performance_optimized;
      break;

    // Community contribution badges
    case "questions_answered":
      current = streakData.achievementStats.questions_answered;
      break;
    case "people_mentored":
      current = streakData.achievementStats.people_mentored;
      break;
    case "tutorials_created":
      current = streakData.achievementStats.tutorials_created;
      break;
    case "open_source_contributions":
      current = streakData.achievementStats.open_source_contributions;
      break;
    case "conference_talks":
      current = streakData.achievementStats.conference_talks;
      break;
    case "influential_research":
      current = streakData.achievementStats.influential_research;
      break;
    case "presentations_given":
      current = streakData.achievementStats.presentations_given;
      break;
    case "professional_connections":
      current = streakData.achievementStats.professional_connections;
      break;
    case "junior_developers_mentored":
      current = streakData.achievementStats.junior_developers_mentored;
      break;
    case "followers_gained":
      current = streakData.achievementStats.followers_gained;
      break;

    // Character development badges
    case "comebacks_made":
      current = streakData.achievementStats.comebacks_made;
      break;
    case "early_morning_sessions":
      current = streakData.achievementStats.early_morning_sessions;
      break;
    case "deep_work_sessions":
      current = streakData.achievementStats.deep_work_sessions;
      break;
    case "failures_documented":
      current = streakData.achievementStats.failures_documented;
      break;
    case "events_organized":
      current = streakData.achievementStats.events_organized;
      break;
  }

  return Math.min(100, (current / value) * 100);
}

function getAchievementProgressText(achievement) {
  const { type, value } = achievement.requirement;
  let current = 0;

  switch (type) {
    case "streak":
      current = habitData.code.streak;
      break;
    case "articles_read":
      current = streakData.achievementStats.articles_read;
      break;
    case "research_implementations":
      current = streakData.achievementStats.research_implementations;
      break;
    case "courses_completed":
      current = streakData.achievementStats.courses_completed;
      break;
    case "research_published":
      current = streakData.achievementStats.research_published;
      break;
    case "blog_posts":
      current = streakData.achievementStats.blog_posts;
      break;
    case "rust_lines":
      current = streakData.achievementStats.rust_lines;
      break;
    case "projects_completed":
      current = streakData.projectsCompleted;
      break;
    case "bugs_found":
      current = streakData.achievementStats.bugs_found;
      break;
    case "unit_tests":
      current = streakData.achievementStats.unit_tests;
      break;
    case "projects_deployed":
      current = streakData.achievementStats.projects_deployed;
      break;
    case "security_challenges":
      current = streakData.achievementStats.security_challenges;
      break;
    case "vulnerabilities_found":
      current = streakData.achievementStats.vulnerabilities_found;
      break;
    case "ctf_wins":
      current = streakData.achievementStats.ctf_wins;
      break;
    case "audits_completed":
      current = streakData.achievementStats.audits_completed;
      break;
    case "vulnerabilities_disclosed":
      current = streakData.achievementStats.vulnerabilities_disclosed;
      break;

    // Technical mastery badges
    case "rust_basics_completed":
      current = streakData.achievementStats.rust_basics_completed;
      break;
    case "memory_allocator_implemented":
      current = streakData.achievementStats.memory_allocator_implemented;
      break;
    case "async_app_built":
      current = streakData.achievementStats.async_app_built;
      break;
    case "crypto_algorithm_implemented":
      current = streakData.achievementStats.crypto_algorithm_implemented;
      break;
    case "contract_vulnerability_found":
      current = streakData.achievementStats.contract_vulnerability_found;
      break;
    case "zk_proof_implemented":
      current = streakData.achievementStats.zk_proof_implemented;
      break;
    case "fuzzing_suite_created":
      current = streakData.achievementStats.fuzzing_suite_created;
      break;
    case "performance_optimized":
      current = streakData.achievementStats.performance_optimized;
      break;

    // Community contribution badges
    case "questions_answered":
      current = streakData.achievementStats.questions_answered;
      break;
    case "people_mentored":
      current = streakData.achievementStats.people_mentored;
      break;
    case "tutorials_created":
      current = streakData.achievementStats.tutorials_created;
      break;
    case "open_source_contributions":
      current = streakData.achievementStats.open_source_contributions;
      break;
    case "conference_talks":
      current = streakData.achievementStats.conference_talks;
      break;
    case "influential_research":
      current = streakData.achievementStats.influential_research;
      break;
    case "presentations_given":
      current = streakData.achievementStats.presentations_given;
      break;
    case "professional_connections":
      current = streakData.achievementStats.professional_connections;
      break;
    case "junior_developers_mentored":
      current = streakData.achievementStats.junior_developers_mentored;
      break;
    case "followers_gained":
      current = streakData.achievementStats.followers_gained;
      break;

    // Character development badges
    case "comebacks_made":
      current = streakData.achievementStats.comebacks_made;
      break;
    case "early_morning_sessions":
      current = streakData.achievementStats.early_morning_sessions;
      break;
    case "deep_work_sessions":
      current = streakData.achievementStats.deep_work_sessions;
      break;
    case "failures_documented":
      current = streakData.achievementStats.failures_documented;
      break;
    case "events_organized":
      current = streakData.achievementStats.events_organized;
      break;
  }

  return `${current}/${value}`;
}

function toggleFramework(frameworkId) {
  streakData.frameworkProgress[frameworkId] =
    !streakData.frameworkProgress[frameworkId];

  if (streakData.frameworkProgress[frameworkId]) {
    streakData.totalXP += 25;
    showNotification(
      `✅ Framework system "${
        frameworkSystems.find((f) => f.id === frameworkId).text
      }" completed! +25 XP`
    );
  }

  saveData();
  updateUI();
}

function toggleTask(taskId) {
  const today = new Date().toDateString();
  let todayData = streakData.completedDays.find((day) => day.date === today);

  if (!todayData) {
    todayData = { date: today, tasks: [], xpEarned: 0 };
    streakData.completedDays.push(todayData);
  }

  const taskIndex = todayData.tasks.indexOf(taskId);
  const task = dailyTasks.find((t) => t.id === taskId);

  if (taskIndex === -1) {
    todayData.tasks.push(taskId);
    todayData.xpEarned += task.xp;
    streakData.totalXP += task.xp;
    showNotification(`✅ Task completed! +${task.xp} XP`);

    // Update skill progress
    if (task.category in streakData.skillProgress) {
      streakData.skillProgress[task.category] += 2;
    }
  } else {
    todayData.tasks.splice(taskIndex, 1);
    todayData.xpEarned -= task.xp;
    streakData.totalXP -= task.xp;

    // Update skill progress
    if (task.category in streakData.skillProgress) {
      streakData.skillProgress[task.category] = Math.max(
        0,
        streakData.skillProgress[task.category] - 2
      );
    }
  }

  saveData();
  updateUI();
}

function completeDay() {
  const today = new Date().toDateString();
  const todayData = streakData.completedDays.find((day) => day.date === today);

  // Check specific requirements for day completion
  const morningTodos = streakData.todoLists.morning;
  const eveningTodos = streakData.todoLists.evening;
  const completedMorningTodos = morningTodos.filter(
    (todo) => todo.completed
  ).length;
  const completedEveningTodos = eveningTodos.filter(
    (todo) => todo.completed
  ).length;
  const totalMorningTodos = morningTodos.length;
  const totalEveningTodos = eveningTodos.length;
  const completedXPActivities = Object.values(streakData.dailyXP).filter(
    (count) => count > 0
  ).length;

  // Require: morning routine (at least 1 todo), evening routine (at least 1 todo), and 3 XP activities
  const hasMorningRoutine = totalMorningTodos > 0 && completedMorningTodos >= 1;
  const hasEveningRoutine = totalEveningTodos > 0 && completedEveningTodos >= 1;
  const hasEnoughXP = completedXPActivities >= 3;

  if (!hasMorningRoutine || !hasEveningRoutine || !hasEnoughXP) {
    const missingRequirements = [];
    if (!hasMorningRoutine) missingRequirements.push("morning routine");
    if (!hasEveningRoutine) missingRequirements.push("evening routine");
    if (!hasEnoughXP) missingRequirements.push("3 XP activities");

    showNotification(
      `❌ Complete all requirements: ${missingRequirements.join(", ")}`,
      "error"
    );
    return;
  }

  // Update streak
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayString = yesterday.toDateString();

  if (
    streakData.lastCompletedDate === yesterdayString ||
    streakData.currentStreak === 0
  ) {
    streakData.currentStreak++;
  } else {
    streakData.currentStreak = 1;
  }

  streakData.lastCompletedDate = today;

  // Calculate bonus XP based on activities completed
  let bonusXP = 100; // Base bonus for completing all requirements

  // Additional bonuses
  bonusXP += completedMorningTodos * 10;
  bonusXP += completedEveningTodos * 10;
  bonusXP += completedXPActivities * 15;

  // Additional streak bonus
  bonusXP += streakData.currentStreak * 5;

  streakData.totalXP += bonusXP;
  if (todayData) {
    todayData.xpEarned += bonusXP;
  } else {
    // Create today's data if it doesn't exist
    const newTodayData = { date: today, tasks: [], xpEarned: bonusXP };
    streakData.completedDays.push(newTodayData);
  }

  // Check for month progression
  if (streakData.currentStreak % 30 === 0) {
    streakData.currentMonth = Math.min(24, streakData.currentMonth + 1);
    streakData.projectsCompleted++;
    showMilestoneAlert(
      `🎉 Month ${streakData.currentMonth} completed! New phase unlocked!`
    );
  }

  // Check for skill mastery
  Object.keys(streakData.skillProgress).forEach((skill) => {
    if (
      streakData.skillProgress[skill] >= 100 &&
      streakData.skillProgress[skill] < 102
    ) {
      streakData.skillsMastered++;
      showMilestoneAlert(
        `🏆 ${skill.charAt(0).toUpperCase() + skill.slice(1)} skill mastered!`
      );
    }
  });

  showNotification(
    `🎉 Day completed! +${bonusXP} bonus XP. Streak: ${streakData.currentStreak} days!`,
    "success"
  );

  saveData();
  updateUI();
}

function showNotification(message, type = "success") {
  // Create notification element
  const notification = document.createElement("div");
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${
      type === "error"
        ? "linear-gradient(45deg, #ff6b6b, #ff8e53)"
        : "linear-gradient(45deg, #4ecdc4, #45b7d1)"
    };
    color: ${type === "error" ? "#fff" : "#000"};
    padding: 15px 25px;
    border-radius: 10px;
    font-weight: 600;
    z-index: 10000;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    transform: translateX(100%);
    transition: transform 0.3s ease;
  `;
  notification.textContent = message;

  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)";
  }, 100);

  // Remove after 4 seconds
  setTimeout(() => {
    notification.style.transform = "translateX(100%)";
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 4000);
}

function showMilestoneAlert(message) {
  const alert = document.getElementById("milestone-alert");
  alert.textContent = message;
  alert.classList.remove("hidden");

  setTimeout(() => {
    alert.classList.add("hidden");
  }, 5000);
}

function viewProgress() {
  const report = generateProgressReport();
  showProgressModal(report);
}

function generateProgressReport() {
  const completedFrameworks = Object.values(
    streakData.frameworkProgress
  ).filter(Boolean).length;
  const totalFrameworks = frameworkSystems.length;
  const frameworkCompletion = (
    (completedFrameworks / totalFrameworks) *
    100
  ).toFixed(1);

  return `
    📊 ELITE RUST & WEB3 SECURITY MASTERY PROGRESS REPORT

    🔥 Current Streak: ${streakData.currentStreak} days
    ⭐ Total XP: ${streakData.totalXP.toLocaleString()}
    🚀 Projects Completed: ${streakData.projectsCompleted}
    🎯 Skills Mastered: ${streakData.skillsMastered}
    📅 Current Month: ${streakData.currentMonth}/24
    🧠 Framework Completion: ${frameworkCompletion}% (${completedFrameworks}/${totalFrameworks})

    🦀 SKILL PROGRESS:
    • Rust Mastery: ${streakData.skillProgress.rust.toFixed(1)}%
    • Cryptography: ${streakData.skillProgress.cryptography.toFixed(1)}%
    • Smart Contract Security: ${streakData.skillProgress.security.toFixed(1)}%
    • Zero-Knowledge Proofs: ${streakData.skillProgress.zk.toFixed(1)}%
    • Identity & Vision: ${streakData.skillProgress.identity.toFixed(1)}%
    • Focus & Discipline: ${streakData.skillProgress.focus.toFixed(1)}%

    🏆 ACHIEVEMENTS UNLOCKED:
    ${
      achievements
        .filter((a) => checkAchievement(a))
        .map((a) => `• ${a.name}`)
        .join("\n") || "No achievements unlocked yet"
    }

    📈 RECENT ACTIVITY:
    ${streakData.completedDays
      .slice(-7)
      .map((day) => {
        const date = new Date(day.date);
        return `• ${date.toLocaleDateString()}: ${day.tasks.length} tasks, ${
          day.xpEarned
        } XP`;
      })
      .join("\n")}
  `;
}

function showProgressModal(content) {
  const modal = document.createElement("div");
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    padding: 20px;
  `;

  const modalContent = document.createElement("div");
  modalContent.style.cssText = `
    background: linear-gradient(135deg, #1a1a2e, #16213e);
    border: 2px solid #4ecdc4;
    border-radius: 20px;
    padding: 30px;
    max-width: 600px;
    max-height: 80vh;
    overflow-y: auto;
    color: #e0e0e0;
    font-family: monospace;
    white-space: pre-line;
    line-height: 1.6;
  `;
  modalContent.textContent = content;

  const closeButton = document.createElement("button");
  closeButton.textContent = "Close";
  closeButton.style.cssText = `
    margin-top: 20px;
    padding: 10px 20px;
    background: linear-gradient(45deg, #4ecdc4, #45b7d1);
    border: none;
    border-radius: 10px;
    color: #000;
    font-weight: 600;
    cursor: pointer;
    width: 100%;
  `;
  closeButton.onclick = () => document.body.removeChild(modal);

  modalContent.appendChild(closeButton);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  modal.onclick = (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  };
}

function exportProgress() {
  const data = {
    ...streakData,
    exportDate: new Date().toISOString(),
    version: "1.0",
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `elite-rust-mastery-progress-${
    new Date().toISOString().split("T")[0]
  }.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showNotification("📁 Progress data exported successfully!");
}

function resetStreak() {
  if (
    confirm(
      "⚠️ Are you sure you want to reset your entire progress? This action cannot be undone!"
    )
  ) {
    localStorage.removeItem("eliteRustMasteryData");
    location.reload();
  }
}

// Todo List Functions
function updateTodoLists() {
  updateTodoTab("morning");
  updateTodoTab("evening");
  updateTodoTab("custom");
  updateTodoStats();
}

function updateTodoTab(type) {
  const container = document.getElementById(`todo-${type}-list`);
  if (!container) return;

  container.innerHTML = "";

  streakData.todoLists[type].forEach((todo) => {
    const todoItem = document.createElement("div");
    todoItem.className = "todo-item";
    todoItem.innerHTML = `
      <div class="todo-checkbox ${
        todo.completed ? "completed" : ""
      }" onclick="toggleTodo('${type}', '${todo.id}')">
        ${todo.completed ? "✓" : ""}
      </div>
      <div class="todo-text ${todo.completed ? "completed" : ""}">${
      todo.text
    }</div>
      <div class="todo-time">${todo.time}</div>
      <div class="todo-actions">
        <button class="todo-action-btn delete" onclick="deleteTodo('${type}', '${
      todo.id
    }')" title="Delete">🗑️</button>
      </div>
    `;
    container.appendChild(todoItem);
  });
}

function updateTodoStats() {
  const types = ["morning", "evening", "custom"];

  types.forEach((type) => {
    const statsContainer = document.getElementById(`todo-${type}-stats`);
    if (!statsContainer) return;

    const todos = streakData.todoLists[type];
    const completed = todos.filter((todo) => todo.completed).length;
    const total = todos.length;
    const completionRate =
      total > 0 ? Math.round((completed / total) * 100) : 0;

    statsContainer.innerHTML = `
      <div class="todo-progress">
        <span class="todo-progress-text">${completed}/${total} completed</span>
        <div class="todo-progress-bar">
          <div class="todo-progress-fill" style="width: ${completionRate}%"></div>
        </div>
      </div>
      <div class="todo-completion-rate">${completionRate}%</div>
    `;
  });
}

function toggleTodo(type, todoId) {
  const todo = streakData.todoLists[type].find((t) => t.id === todoId);
  if (todo) {
    todo.completed = !todo.completed;
    saveData();
    updateTodoLists();

    if (todo.completed) {
      showNotification(`✅ ${todo.text} completed!`);

      // Auto-progress streak if conditions are met
      autoProgressStreak();
    }
  }
}

function deleteTodo(type, todoId) {
  if (confirm("Are you sure you want to delete this todo item?")) {
    streakData.todoLists[type] = streakData.todoLists[type].filter(
      (t) => t.id !== todoId
    );
    saveData();
    updateTodoLists();
    showNotification("🗑️ Todo item deleted");
  }
}

function addTodo(type) {
  const textInput = document.getElementById(`todo-${type}-text`);
  const timeInput = document.getElementById(`todo-${type}-time`);

  const text = textInput.value.trim();
  const time = timeInput.value.trim();

  if (!text) {
    showNotification("Please enter a todo item", "error");
    return;
  }

  const newTodo = {
    id: `${type}-${Date.now()}`,
    text: text,
    time: time || "5 min",
    completed: false,
  };

  streakData.todoLists[type].push(newTodo);
  saveData();
  updateTodoLists();

  // Clear inputs
  textInput.value = "";
  timeInput.value = "";

  showNotification(`✅ Added new ${type} todo: ${text}`);
}

function switchTodoTab(type) {
  // Update tab buttons
  document.querySelectorAll(".todo-tab").forEach((tab) => {
    tab.classList.remove("active");
  });
  document
    .querySelector(`[onclick="switchTodoTab('${type}')"]`)
    .classList.add("active");

  // Update content
  document.querySelectorAll(".todo-content").forEach((content) => {
    content.classList.remove("active");
  });
  document.getElementById(`todo-${type}-content`).classList.add("active");
}

function updateRewards() {
  const grid = document.getElementById("rewards-grid");
  if (!grid) return;

  const rewards = [
    {
      level: 2,
      name: "High-quality noise-canceling headphones",
      description:
        "Premium audio gear to enhance your focus during deep work sessions",
      icon: "🎧",
      xpRequired: 1000,
    },
    {
      level: 3,
      name: "Professional development books budget ($200)",
      description:
        "Invest in your knowledge with curated books on Rust, security, and blockchain",
      icon: "📚",
      xpRequired: 2500,
    },
    {
      level: 4,
      name: "Conference attendance (virtual or local)",
      description:
        "Attend a major tech conference to network and learn from experts",
      icon: "🎤",
      xpRequired: 5000,
    },
    {
      level: 5,
      name: "Premium development tools and subscriptions",
      description:
        "Access to professional IDEs, security tools, and cloud services",
      icon: "⚡",
      xpRequired: 10000,
    },
    {
      level: 6,
      name: "Major conference attendance with networking",
      description:
        "VIP access to international conferences with exclusive networking events",
      icon: "🌟",
      xpRequired: 20000,
    },
    {
      level: 7,
      name: "Professional photo shoot and personal branding",
      description:
        "Build your professional image with high-quality photos and branding materials",
      icon: "📸",
      xpRequired: 35000,
    },
    {
      level: 8,
      name: "Retreat/intensive learning experience",
      description:
        "Immersive learning retreat focused on advanced Rust and security concepts",
      icon: "🏔️",
      xpRequired: 50000,
    },
    {
      level: 9,
      name: "Speaking coach or presentation training",
      description:
        "Develop your public speaking skills for conferences and presentations",
      icon: "🎭",
      xpRequired: 75000,
    },
    {
      level: 10,
      name: "Custom celebration and legacy project funding",
      description:
        "Celebrate your achievement and fund a legacy project in the community",
      icon: "🏆",
      xpRequired: 100000,
    },
  ];

  grid.innerHTML = "";

  rewards.forEach((reward) => {
    const isUnlocked = streakData.totalXP >= reward.xpRequired;
    const progress = Math.min(
      100,
      (streakData.totalXP / reward.xpRequired) * 100
    );

    const card = document.createElement("div");
    card.className = `reward-card ${isUnlocked ? "unlocked" : "locked"}`;

    card.innerHTML = `
      <div class="reward-level">Level ${reward.level}</div>
      <div class="reward-icon">${reward.icon}</div>
      <div class="reward-name">${reward.name}</div>
      <div class="reward-description">${reward.description}</div>
      <div class="reward-progress">
        <div class="reward-progress-fill" style="width: ${
          isUnlocked ? 100 : progress
        }%"></div>
      </div>
      <div class="reward-status ${isUnlocked ? "unlocked" : "locked"}">
        ${
          isUnlocked
            ? "🎉 UNLOCKED!"
            : `${reward.xpRequired.toLocaleString()} XP Required`
        }
      </div>
    `;

    grid.appendChild(card);
  });
}

// Function to update achievement statistics
function updateAchievementStat(statType, amount = 1) {
  if (streakData.achievementStats[statType] !== undefined) {
    streakData.achievementStats[statType] += amount;

    // Check for new achievements
    checkForNewAchievements();

    // Update UI
    updateAchievements();

    // Save data
    saveData();

    // Show notification
    showNotification(`📈 Updated ${statType}: +${amount}`);
  }
}

// Function to check for newly unlocked achievements
function checkForNewAchievements() {
  let newAchievements = [];

  achievements.forEach((achievement) => {
    const wasUnlocked = streakData.achievements.includes(achievement.id);
    const isUnlocked = checkAchievement(achievement);

    if (isUnlocked && !wasUnlocked) {
      streakData.achievements.push(achievement.id);
      streakData.totalXP += achievement.xpReward;
      newAchievements.push(achievement);
    }
  });

  // Show notifications for new achievements
  newAchievements.forEach((achievement) => {
    showNotification(
      `🏆 Achievement Unlocked: ${achievement.name}! +${achievement.xpReward} XP`
    );
  });

  // Update UI if any new achievements were unlocked
  if (newAchievements.length > 0) {
    updateUI();
  }
}

// Function to show achievement tracking modal
function showAchievementTracker() {
  const modal = document.createElement("div");
  modal.className = "achievement-modal";
  modal.innerHTML = `
    <div class="achievement-modal-content">
      <div class="achievement-modal-header">
        <h2>🏆 Achievement Tracker</h2>
        <button class="achievement-close-btn" onclick="closeAchievementTracker()">×</button>
      </div>
      
      <div class="achievement-categories">
        <button class="achievement-category-btn active" onclick="switchAchievementCategory('consistency')">🔥 Consistency</button>
        <button class="achievement-category-btn" onclick="switchAchievementCategory('learning')">📚 Learning</button>
        <button class="achievement-category-btn" onclick="switchAchievementCategory('coding')">💻 Coding</button>
        <button class="achievement-category-btn" onclick="switchAchievementCategory('security')">🛡️ Security</button>
        <button class="achievement-category-btn" onclick="switchAchievementCategory('technical_mastery')">⚡ Technical Mastery</button>
        <button class="achievement-category-btn" onclick="switchAchievementCategory('community_contribution')">🤝 Community</button>
        <button class="achievement-category-btn" onclick="switchAchievementCategory('character_development')">🌱 Character</button>
      </div>
      
      <div class="achievement-stats">
        <div class="achievement-stat">
          <span class="achievement-stat-number">${
            streakData.achievements.length
          }</span>
          <span class="achievement-stat-label">Achievements Unlocked</span>
        </div>
        <div class="achievement-stat">
          <span class="achievement-stat-number">${achievements.length}</span>
          <span class="achievement-stat-label">Total Achievements</span>
        </div>
        <div class="achievement-stat">
          <span class="achievement-stat-number">${Math.round(
            (streakData.achievements.length / achievements.length) * 100
          )}%</span>
          <span class="achievement-stat-label">Completion Rate</span>
        </div>
      </div>
      
      <div class="achievement-list" id="achievement-list">
        ${generateAchievementList("consistency")}
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Add event listener for close button
  setTimeout(() => {
    const closeBtn = modal.querySelector(".achievement-close-btn");
    if (closeBtn) {
      closeBtn.addEventListener("click", closeAchievementTracker);
    }
  }, 100);
}

function generateAchievementList(category) {
  const categoryAchievements = achievements.filter(
    (a) => a.category === category
  );
  const categoryNames = {
    consistency: "🔥 Consistency Achievements",
    learning: "📚 Learning Achievements",
    coding: "💻 Coding Achievements",
    security: "🛡️ Security Achievements",
    technical_mastery: "⚡ Technical Mastery Badges",
    community_contribution: "🤝 Community Contribution Badges",
    character_development: "🌱 Character Development Badges",
  };

  return `
    <div class="achievement-category-title">${categoryNames[category]}</div>
    <div class="achievement-grid">
      ${categoryAchievements
        .map((achievement) => {
          const isUnlocked = streakData.achievements.includes(achievement.id);
          const progress = getAchievementProgress(achievement);
          const progressText = getAchievementProgressText(achievement);

          return `
          <div class="achievement-item ${isUnlocked ? "unlocked" : "locked"}">
            <div class="achievement-icon">${
              achievement.name.split(" ")[0]
            }</div>
            <div class="achievement-content">
              <div class="achievement-name">${achievement.name}</div>
              <div class="achievement-description">${
                achievement.description
              }</div>
              <div class="achievement-progress">
                <div class="achievement-progress-bar">
                  <div class="achievement-progress-fill" style="width: ${progress}%"></div>
                </div>
                <div class="achievement-progress-text">${progressText}</div>
              </div>
              <div class="achievement-xp">+${achievement.xpReward} XP</div>
            </div>
            <div class="achievement-status">
              ${isUnlocked ? "✅" : "🔒"}
            </div>
          </div>
        `;
        })
        .join("")}
    </div>
  `;
}

function switchAchievementCategory(category) {
  // Update active button
  document.querySelectorAll(".achievement-category-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  event.target.classList.add("active");

  // Update achievement list
  document.getElementById("achievement-list").innerHTML =
    generateAchievementList(category);
}

// Function to show achievement progress updater
function showAchievementProgressUpdater() {
  const modal = document.createElement("div");
  modal.className = "achievement-modal";
  modal.innerHTML = `
    <div class="achievement-modal-content">
      <div class="achievement-modal-header">
        <h2>📈 Update Achievement Progress</h2>
        <button class="achievement-close-btn" onclick="closeAchievementTracker()">×</button>
      </div>
      
      <div class="achievement-updater-sections">
        <div class="achievement-updater-section">
          <h3>📚 Learning Achievements</h3>
          <div class="achievement-updater-buttons">
            <button onclick="updateAchievementStat('articles_read')" class="achievement-update-btn">
              📖 Read Technical Article (+1)
            </button>
            <button onclick="updateAchievementStat('research_implementations')" class="achievement-update-btn">
              🧠 Complete Research Implementation (+1)
            </button>
            <button onclick="updateAchievementStat('courses_completed')" class="achievement-update-btn">
              🎓 Complete Online Course (+1)
            </button>
            <button onclick="updateAchievementStat('blog_posts')" class="achievement-update-btn">
              ✍️ Write Blog Post (+1)
            </button>
            <button onclick="updateAchievementStat('research_published')" class="achievement-update-btn">
              🔬 Publish Research (+1)
            </button>
          </div>
        </div>
        
        <div class="achievement-updater-section">
          <h3>💻 Coding Achievements</h3>
          <div class="achievement-updater-buttons">
            <button onclick="updateAchievementStat('rust_lines', 100)" class="achievement-update-btn">
              💻 Write 100 Lines of Rust (+100)
            </button>
            <button onclick="updateAchievementStat('bugs_found')" class="achievement-update-btn">
              🐛 Find Bug in Code (+1)
            </button>
            <button onclick="updateAchievementStat('unit_tests', 50)" class="achievement-update-btn">
              🧪 Write 50 Unit Tests (+50)
            </button>
            <button onclick="updateAchievementStat('projects_deployed')" class="achievement-update-btn">
              🚀 Deploy Project (+1)
            </button>
            <button onclick="updateAchievementStat('rust_basics_completed')" class="achievement-update-btn">
              🦀 Complete Rust Basics (+1)
            </button>
            <button onclick="updateAchievementStat('memory_allocator_implemented')" class="achievement-update-btn">
              🧠 Implement Memory Allocator (+1)
            </button>
            <button onclick="updateAchievementStat('async_app_built')" class="achievement-update-btn">
              ⚡ Build Async Application (+1)
            </button>
            <button onclick="updateAchievementStat('crypto_algorithm_implemented')" class="achievement-update-btn">
              🔐 Implement Crypto Algorithm (+1)
            </button>
            <button onclick="updateAchievementStat('fuzzing_suite_created')" class="achievement-update-btn">
              🧪 Create Fuzzing Suite (+1)
            </button>
            <button onclick="updateAchievementStat('performance_optimized')" class="achievement-update-btn">
              ⚡ Optimize Performance (+1)
            </button>
          </div>
        </div>
        
        <div class="achievement-updater-section">
          <h3>🛡️ Security Achievements</h3>
          <div class="achievement-updater-buttons">
            <button onclick="updateAchievementStat('security_challenges')" class="achievement-update-btn">
              🛡️ Complete Security Challenge (+1)
            </button>
            <button onclick="updateAchievementStat('vulnerabilities_found')" class="achievement-update-btn">
              🔍 Find Security Vulnerability (+1)
            </button>
            <button onclick="updateAchievementStat('contract_vulnerability_found')" class="achievement-update-btn">
              📋 Find Smart Contract Vulnerability (+1)
            </button>
            <button onclick="updateAchievementStat('zk_proof_implemented')" class="achievement-update-btn">
              🔒 Implement ZK-Proof System (+1)
            </button>
            <button onclick="updateAchievementStat('audits_completed')" class="achievement-update-btn">
              🔒 Complete Security Audit (+1)
            </button>
            <button onclick="updateAchievementStat('ctf_wins')" class="achievement-update-btn">
              🏆 Win CTF Competition (+1)
            </button>
            <button onclick="updateAchievementStat('vulnerabilities_disclosed')" class="achievement-update-btn">
              🚨 Disclose Critical Vulnerability (+1)
            </button>
          </div>
        </div>
        
        <div class="achievement-updater-section">
          <h3>🤝 Community & Character</h3>
          <div class="achievement-updater-buttons">
            <button onclick="updateAchievementStat('questions_answered')" class="achievement-update-btn">
              🤝 Answer Community Question (+1)
            </button>
            <button onclick="updateAchievementStat('people_mentored')" class="achievement-update-btn">
              👨‍🏫 Mentor Someone (+1)
            </button>
            <button onclick="updateAchievementStat('tutorials_created')" class="achievement-update-btn">
              📚 Create Tutorial (+1)
            </button>
            <button onclick="updateAchievementStat('open_source_contributions')" class="achievement-update-btn">
              🌟 Contribute to Open Source (+1)
            </button>
            <button onclick="updateAchievementStat('conference_talks')" class="achievement-update-btn">
              🎤 Give Conference Talk (+1)
            </button>
            <button onclick="updateAchievementStat('presentations_given')" class="achievement-update-btn">
              🎤 Give Presentation (+1)
            </button>
            <button onclick="updateAchievementStat('professional_connections', 10)" class="achievement-update-btn">
              🔗 Make 10 Professional Connections (+10)
            </button>
            <button onclick="updateAchievementStat('junior_developers_mentored')" class="achievement-update-btn">
              👨‍🏫 Mentor Junior Developer (+1)
            </button>
            <button onclick="updateAchievementStat('followers_gained', 100)" class="achievement-update-btn">
              📢 Gain 100 Followers (+100)
            </button>
            <button onclick="updateAchievementStat('comebacks_made')" class="achievement-update-btn">
              👑 Make Comeback (+1)
            </button>
            <button onclick="updateAchievementStat('early_morning_sessions')" class="achievement-update-btn">
              😈 Complete Early Morning Session (+1)
            </button>
            <button onclick="updateAchievementStat('deep_work_sessions')" class="achievement-update-btn">
              🏰 Complete Deep Work Session (+1)
            </button>
            <button onclick="updateAchievementStat('failures_documented')" class="achievement-update-btn">
              🌱 Document Failure (+1)
            </button>
            <button onclick="updateAchievementStat('events_organized')" class="achievement-update-btn">
              🏗️ Organize Event (+1)
            </button>
          </div>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 20px;">
        <button onclick="closeAchievementTracker()" class="btn btn-primary">
          Close
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Add event listener for close button
  setTimeout(() => {
    const closeBtn = modal.querySelector(".achievement-close-btn");
    if (closeBtn) {
      closeBtn.addEventListener("click", closeAchievementTracker);
    }
  }, 100);
}

function closeAchievementTracker() {
  const modal = document.querySelector(".achievement-modal");
  if (modal) {
    document.body.removeChild(modal);
  }
}
