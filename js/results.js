// Get current user from localStorage
let currentUser = JSON.parse(localStorage.getItem('currentUser'));
let users = JSON.parse(localStorage.getItem("users")) || [];

// Redirect if no user is logged in
if (!currentUser || !currentUser.hasCompletedInfo) {
  window.location.href = 'index.html';
}

// Food options data
const foodOptions = {
  breakfast: [
    { name: "Grilled Eggs", calories: 155, protein: 13 },
    { name: "Oatmeal with Milk", calories: 150, protein: 5 },
    { name: "Banana", calories: 90, protein: 1.2 },
    { name: "Cheese Toast", calories: 200, protein: 8 },
    { name: "Low-Fat Milk", calories: 120, protein: 8 },
    { name: "Greek Yogurt", calories: 100, protein: 10 },
    { name: "White Cheese", calories: 50, protein: 3 },
    { name: "Honey on Bread", calories: 180, protein: 2 },
    { name: "Avocado on Toast", calories: 250, protein: 4 },
    { name: "Almond Butter", calories: 200, protein: 7 },
    { name: "Fava Beans", calories: 130, protein: 5 },
    { name: "Dates with Cheese", calories: 220, protein: 6 },
    { name: "Boiled Eggs", calories: 140, protein: 12 },
    { name: "Oatmeal with Banana", calories: 180, protein: 6 },
    { name: "Brown Bread", calories: 120, protein: 4 },
    { name: "Coconut Milk", calories: 140, protein: 1 },
    { name: "Yogurt with Fruits", calories: 150, protein: 7 },
    { name: "Cream Cheese", calories: 90, protein: 2 },
    { name: "Natural Jam", calories: 100, protein: 0.5 },
    { name: "Chia Seeds", calories: 130, protein: 5 }
  ],
  lunch: [
    { name: "Grilled Chicken Breast", calories: 165, protein: 31 },
    { name: "White Rice", calories: 130, protein: 2.7 },
    { name: "Green Salad", calories: 30, protein: 1 },
    { name: "Grilled Fish", calories: 200, protein: 25 },
    { name: "Pasta with Sauce", calories: 180, protein: 6 },
    { name: "Beef Steak", calories: 300, protein: 28 },
    { name: "Cooked Broccoli", calories: 50, protein: 3 },
    { name: "Quinoa", calories: 120, protein: 4 },
    { name: "Cooked Lentils", calories: 115, protein: 9 },
    { name: "Baked Potatoes", calories: 130, protein: 2 },
    { name: "Chicken Curry", calories: 250, protein: 25 },
    { name: "Rice with Veggies", calories: 150, protein: 3 },
    { name: "Tuna Salad", calories: 180, protein: 20 },
    { name: "Salmon", calories: 250, protein: 23 },
    { name: "Pasta with Cheese", calories: 220, protein: 8 },
    { name: "Lamb Meat", calories: 300, protein: 25 },
    { name: "Stuffed Zucchini", calories: 140, protein: 4 },
    { name: "Quinoa with Veggies", calories: 160, protein: 5 },
    { name: "Fava Beans", calories: 130, protein: 5 },
    { name: "Potatoes with Butter", calories: 180, protein: 2 }
  ],
  dinner: [
    { name: "Beef Steak", calories: 300, protein: 28 },
    { name: "Mashed Potatoes", calories: 150, protein: 2 },
    { name: "Sautéed Broccoli", calories: 60, protein: 3 },
    { name: "Vegetable Soup", calories: 80, protein: 2 },
    { name: "Syrian Bread", calories: 200, protein: 6 },
    { name: "Grilled Chicken", calories: 240, protein: 27 },
    { name: "Grilled Salmon", calories: 250, protein: 25 },
    { name: "Sweet Potatoes", calories: 100, protein: 2 },
    { name: "Fried Tofu", calories: 180, protein: 15 },
    { name: "Cooked Spinach", calories: 40, protein: 3 },
    { name: "Chicken Steak", calories: 180, protein: 30 },
    { name: "Potatoes with Butter", calories: 180, protein: 2 },
    { name: "Broccoli with Lemon", calories: 70, protein: 3 },
    { name: "Lentil Soup", calories: 120, protein: 5 },
    { name: "Brown Bread", calories: 130, protein: 4 },
    { name: "Oven Chicken", calories: 220, protein: 26 },
    { name: "Salmon with Honey", calories: 270, protein: 24 },
    { name: "Spiced Potatoes", calories: 160, protein: 2 },
    { name: "Tofu with Soy", calories: 150, protein: 12 },
    { name: "Spinach with Garlic", calories: 50, protein: 3 }
  ],
  snacks: [
    { name: "Greek Yogurt", calories: 100, protein: 10 },
    { name: "Mixed Nuts", calories: 200, protein: 5 },
    { name: "Apple", calories: 52, protein: 0.3 },
    { name: "Cream Cheese", calories: 90, protein: 2 },
    { name: "Dark Chocolate", calories: 150, protein: 2 },
    { name: "Protein Bar", calories: 200, protein: 20 },
    { name: "Plain Popcorn", calories: 120, protein: 3 },
    { name: "Granola", calories: 180, protein: 4 },
    { name: "Small Banana", calories: 70, protein: 1 },
    { name: "Hummus", calories: 150, protein: 7 },
    { name: "Roasted Almonds", calories: 160, protein: 6 },
    { name: "Dates", calories: 120, protein: 1 },
    { name: "Yogurt with Honey", calories: 140, protein: 6 },
    { name: "Walnuts", calories: 180, protein: 4 },
    { name: "Chocolate with Nuts", calories: 200, protein: 5 }
  ]
};

// User data tracking
let userData = {
  totalCalories: 0,
  totalProtein: 0,
  totalCarbs: 0
};

// Calculate and display requirements
function calculateAndDisplayRequirements() {
  // Calculate BMR
  let bmr;
  if (currentUser.gender === "male") {
    bmr = 10 * currentUser.weight + 6.25 * currentUser.height - 5 * currentUser.age + 5;
  } else {
    bmr = 10 * currentUser.weight + 6.25 * currentUser.height - 5 * currentUser.age - 161;
  }

  // Activity multipliers
  const activityMultiplier = [1.2, 1.375, 1.55, 1.725, 1.9];
  let dailyCalories = bmr * (activityMultiplier[currentUser.activityLevel - 1] || 1.2);

  // Adjust for goals
  if (currentUser.goal === 1) dailyCalories += 500; // Weight gain
  else if (currentUser.goal === 2) dailyCalories -= 500; // Weight loss

  const dailyProtein = currentUser.weight * (currentUser.goal === 1 ? 2.0 : 1.5);
  const dailyFat = (currentUser.fatPercentage * currentUser.weight) / 100.0;
  
  const caloriesFromProtein = dailyProtein * 4;
  const caloriesFromFat = dailyFat * 9;
  const remainingCalories = dailyCalories - (caloriesFromProtein + caloriesFromFat);
  const dailyCarbs = remainingCalories / 4;
  const dailyWater = currentUser.weight * 35;

  // Display results
  document.getElementById("caloriesResult").textContent = dailyCalories.toFixed(0);
  document.getElementById("proteinResult").textContent = dailyProtein.toFixed(1);
  document.getElementById("fatResult").textContent = dailyFat.toFixed(1);
  document.getElementById("carbsResult").textContent = dailyCarbs.toFixed(1);
  document.getElementById("waterResult").textContent = dailyWater.toFixed(0);

  // Store for later use
  currentUser.dailyCalories = dailyCalories;
  currentUser.dailyProtein = dailyProtein;
  currentUser.dailyFat = dailyFat;
  currentUser.dailyCarbs = dailyCarbs;
  currentUser.dailyWater = dailyWater;

  // Calculate vitamins and minerals
  calculateVitaminsAndMinerals();
  
  // Show appropriate sections based on plan type
  showRelevantSections();
}

function calculateVitaminsAndMinerals() {
  let vitaminC, vitaminD, calcium, iron;
  
  if (currentUser.gender === "male") {
    vitaminC = currentUser.age > 18 ? 90 : 75;
    vitaminD = 15;
    calcium = 1000;
    iron = currentUser.age > 18 ? 8 : 11;
  } else {
    vitaminC = currentUser.age > 18 ? 75 : 65;
    vitaminD = 15;
    calcium = currentUser.age > 50 ? 1200 : 1000;
    iron = currentUser.age > 18 ? 18 : 15;
  }

  document.getElementById("vitaminC").textContent = vitaminC;
  document.getElementById("vitaminD").textContent = vitaminD;
  document.getElementById("calcium").textContent = calcium;
  document.getElementById("iron").textContent = iron;
}

function showRelevantSections() {
  const mealPlanSection = document.getElementById("mealPlanSection");
  const vitaminsSection = document.getElementById("vitaminsSection");
  const fitnessPlanSection = document.getElementById("fitnessPlanSection");
  const muscleGroupsSection = document.getElementById("muscleGroupsSection");
  const supplementsSection = document.getElementById("supplementsSection");

  // Show meal plan for diet plans
  if (currentUser.planType === 1 || currentUser.planType === 3) {
    mealPlanSection.classList.remove("hidden");
    vitaminsSection.classList.remove("hidden");
  }

  // Show fitness plan for workout plans
  if (currentUser.planType === 2 || currentUser.planType === 3) {
    fitnessPlanSection.classList.remove("hidden");
    muscleGroupsSection.classList.remove("hidden");
    
    // Show supplements if requested
    if (currentUser.supplements === "yes") {
      supplementsSection.classList.remove("hidden");
      showSupplements();
    }
  }
}

function showSupplements() {
  const supplementsList = document.getElementById("supplementsList");
  supplementsList.innerHTML = "";
  
  const supplements = [
    "Whey Protein: 1-2 scoops (25-50g) post-workout",
    "Creatine Monohydrate: 5g daily",
    "Pre-Workout: 1 scoop 20-30 minutes before workout",
    "BCAAs: 5-10g during workout",
    "Multivitamins: 1 tablet daily with a meal",
    "Omega-3 Fish Oil: 1-2 capsules daily with meals"
  ];
  
  supplements.forEach(supplement => {
    const li = document.createElement("li");
    li.textContent = supplement;
    supplementsList.appendChild(li);
  });
}

function showMealSelection(mealType) {
  const mealContainer = document.getElementById(mealType).querySelector(".meal-options");
  mealContainer.innerHTML = "";
  
  const mealOptions = foodOptions[mealType].slice(0, mealType === "snacks" ? 15 : 20);
  
  mealOptions.forEach((item, index) => {
    const mealItem = document.createElement("div");
    mealItem.className = "meal-item";
    mealItem.innerHTML = `
      <label for="meal-${mealType}-${index}">${item.name} (per 100g: ${item.calories} kcal, ${item.protein}g protein)</label>
      <input type="number" id="meal-${mealType}-${index}-weight" min="0" placeholder="Amount (g)" style="width: 80px; margin-left: 10px;">
    `;
    mealContainer.appendChild(mealItem);
  });
  
  const confirmBtn = document.createElement("button");
  confirmBtn.className = "btn";
  confirmBtn.textContent = language === "en" ? "Confirm Selection" : "تأكيد الاختيار";
  confirmBtn.addEventListener("click", () => confirmMealSelection(mealType));
  mealContainer.appendChild(confirmBtn);
}

function confirmMealSelection(mealType) {
  const mealOptions = foodOptions[mealType].slice(0, mealType === "snacks" ? 15 : 20);
  let totalMealCalories = 0;
  let totalMealProtein = 0;
  
  mealOptions.forEach((item, index) => {
    const weightInput = document.getElementById(`meal-${mealType}-${index}-weight`);
    if (weightInput && weightInput.value) {
      const weight = parseFloat(weightInput.value);
      if (weight > 0) {
        totalMealCalories += (item.calories * weight) / 100;
        totalMealProtein += (item.protein * weight) / 100;
      }
    }
  });
  
  if (totalMealCalories > 0) {
    const mealContainer = document.getElementById(mealType).querySelector(".meal-options");
    mealContainer.innerHTML = `<p>Selected: ${totalMealCalories.toFixed(1)} kcal, ${totalMealProtein.toFixed(1)}g protein</p>`;
    
    // Update totals
    userData.totalCalories += totalMealCalories;
    userData.totalProtein += totalMealProtein;
    userData.totalCarbs += (totalMealCalories - totalMealProtein * 4) / 4;
    
    // Update total consumed section
    const totalConsumed = document.getElementById("totalConsumed");
    totalConsumed.classList.remove("hidden");
    document.getElementById("totalCalories").textContent = userData.totalCalories.toFixed(1);
    document.getElementById("totalProtein").textContent = userData.totalProtein.toFixed(1);
    document.getElementById("totalCarbs").textContent = userData.totalCarbs.toFixed(1);
    
    // Update remaining calories
    const remainingCalories = currentUser.dailyCalories - userData.totalCalories;
    const remainingElement = document.getElementById(`remainingCalories${mealType.charAt(0).toUpperCase() + mealType.slice(1)}`);
    if (remainingElement) {
      remainingElement.textContent = remainingCalories.toFixed(0);
    }
    
    // Show snacks after dinner
    if (mealType === "dinner") {
      document.getElementById("snacksSection").classList.remove("hidden");
    }
  }
}

function showTrainingPlan() {
  const gymDays = parseInt(document.getElementById("gymDays").value);
  const trainingSystem = document.getElementById("trainingSystem");
  const systemDescription = document.getElementById("systemDescription");
  
  trainingSystem.classList.remove("hidden");
  
  let description = "";
  if (gymDays <= 3) {
    description = "Full Body Training System: Focus on compound exercises covering all muscles per session.";
  } else if (gymDays === 4) {
    description = "Muscle Split System: Day for chest and arms, day for back and shoulders, day for legs, and a rest or light workout day.";
  } else {
    description = "Advanced Split System: Day for chest, day for back, day for shoulders, day for arms, day for legs.";
  }
  
  systemDescription.textContent = description;
}

function showExercises() {
  const selectedMuscles = Array.from(
    document.querySelectorAll('input[name="muscleGroup"]:checked')
  ).map(input => input.value);
  
  const exercisesSection = document.getElementById("exercisesSection");
  exercisesSection.classList.remove("hidden");
  exercisesSection.innerHTML = "";
  
  if (selectedMuscles.length === 0) {
    exercisesSection.innerHTML = "<p>Please select at least one muscle group.</p>";
    return;
  }
  
  const exercises = {
    chest: [
      "Bench Press or Dumbbell Press (middle chest)",
      "Incline Press (upper chest)",
      "Decline Press (lower chest)",
      "Flyes (with dumbbells or cable)",
      "Cable Crossover (all chest parts)"
    ],
    back: [
      "Deadlift (lower and middle back)",
      "Bar Pull (middle back)",
      "Pull-Up (upper and lateral back)",
      "Cable Pull (middle back)",
      "Face Pull (upper and lateral back)"
    ],
    shoulder: [
      "Overhead Press (all shoulder parts)",
      "Lateral Raise (side delts)",
      "Rear Delt Raise (rear delts)",
      "Arnold Press (front delts with rotation)"
    ],
    arm: [
      "Barbell Bicep Curl",
      "Hammer Curl",
      "Tricep Cable Pushdown",
      "Overhead Tricep Extension",
      "Wrist Curls (forearms)"
    ],
    leg: [
      "Squat (thighs and glutes)",
      "Deadlift (hamstrings and glutes)",
      "Lunge (thighs and glutes)",
      "Leg Raise (calves)",
      "Leg Press"
    ]
  };
  
  const muscleNames = {
    chest: "Chest",
    back: "Back",
    shoulder: "Shoulders",
    arm: "Arms",
    leg: "Legs"
  };
  
  selectedMuscles.forEach(muscle => {
    const muscleSection = document.createElement("div");
    muscleSection.innerHTML = `<h4>${muscleNames[muscle]}</h4>`;
    const ul = document.createElement("ul");
    exercises[muscle].forEach(exercise => {
      const li = document.createElement("li");
      li.textContent = exercise;
      ul.appendChild(li);
    });
    muscleSection.appendChild(ul);
    exercisesSection.appendChild(muscleSection);
  });
}

function goBack() {
  window.location.href = 'basic-info.html';
}

function logout() {
  localStorage.removeItem('currentUser');
  window.location.href = 'index.html';
}

// Display current date and time
function displayDateTime() {
  const now = new Date();
  document.getElementById('dateTime').textContent = now.toLocaleString();
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
  // Initialize the page
  calculateAndDisplayRequirements();
  displayDateTime();
  setInterval(displayDateTime, 1000);
  
  // Meal selection buttons
  document.querySelectorAll('.meal-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      showMealSelection(this.getAttribute('data-meal'));
    });
  });
  
  // Snacks button
  document.getElementById('snacksBtn').addEventListener('click', function() {
    showMealSelection('snacks');
  });
  
  // Training plan button
  document.getElementById('showPlanBtn').addEventListener('click', showTrainingPlan);
  
  // Show exercises button
  document.getElementById('showExercisesBtn').addEventListener('click', showExercises);
});
