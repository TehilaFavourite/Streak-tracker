// Initialize habit checkboxes
function initializeHabits() {
  const habitTypes = ["code", "security", "community", "reflection"];

  habitTypes.forEach((type) => {
    const checkbox = document.getElementById(`${type}-checkbox`);
    const card = document.getElementById(`habit-${type}`);

    if (checkbox && card) {
      checkbox.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleHabit(type);
      });

      card.addEventListener("click", () => {
        toggleHabit(type);
      });
    }
  });

  updateHabitsDisplay();
}

// Toggle habit completion
function toggleHabit(type) {
  habitData[type].completed = !habitData[type].completed;

  if (habitData[type].completed) {
    habitData[type].streak += 1;

    // Auto-progress main streak if conditions are met
    if (typeof autoProgressStreak === "function") {
      autoProgressStreak();
    }

    // Check for consistency achievements when code practice is completed
    if (type === "code" && typeof checkForNewAchievements === "function") {
      checkForNewAchievements();
      // Immediately update achievement display to show progress
      if (typeof updateAchievements === "function") {
        updateAchievements();
      }
    }
  } else {
    // Optionally reset streak when unchecked
    habitData[type].streak = Math.max(0, habitData[type].streak - 1);

    // Update achievement display when unchecking code practice too
    if (type === "code" && typeof updateAchievements === "function") {
      updateAchievements();
    }
  }

  updateHabitsDisplay();
  updateOverallProgress();
}

// Update habits display
function updateHabitsDisplay() {
  const habitTypes = ["code", "security", "community", "reflection"];

  habitTypes.forEach((type) => {
    const checkbox = document.getElementById(`${type}-checkbox`);
    const card = document.getElementById(`habit-${type}`);
    const streakElement = card.querySelector(".habit-streak-count");

    if (habitData[type].completed) {
      checkbox.classList.add("completed");
      card.classList.add("completed");
    } else {
      checkbox.classList.remove("completed");
      card.classList.remove("completed");
    }

    streakElement.textContent = `🔥 ${habitData[type].streak} day streak`;
  });
}

function updateOverallProgress() {
  const completedCount = Object.values(habitData).filter(
    (habit) => habit.completed
  ).length;
  const completionRate = Math.round((completedCount / 4) * 100);

  const completionElement = document.getElementById("habits-completion");
  if (completionElement) {
    completionElement.textContent = `${completionRate}%`;
  }
}
