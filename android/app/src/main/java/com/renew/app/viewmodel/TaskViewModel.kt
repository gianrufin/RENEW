package com.renew.app.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.renew.app.data.*
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import java.time.LocalDate
import java.time.temporal.ChronoUnit

data class CategoryExpense(
    val category: CategoryType,
    val monthly: Double,
    val yearly: Double
)

data class BudgetSummary(
    val totalMonthly: Double,
    val totalYearly: Double,
    val breakdown: List<CategoryExpense>
)

class TaskViewModel(private val repository: TaskRepository) : ViewModel() {

    val tasks: StateFlow<List<TaskEntity>> = repository.allTasks
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    private val _searchQuery = MutableStateFlow("")
    val searchQuery = _searchQuery.asStateFlow()

    private val _selectedCategory = MutableStateFlow<CategoryType?>(null)
    val selectedCategory = _selectedCategory.asStateFlow()

    val filteredTasks: StateFlow<List<TaskEntity>> = combine(
        tasks,
        _searchQuery,
        _selectedCategory
    ) { taskList, query, cat ->
        taskList.filter { task ->
            val matchesQuery = query.isEmpty() || 
                task.title.contains(query, ignoreCase = true) ||
                task.description.contains(query, ignoreCase = true) ||
                (task.locationOrAsset?.contains(query, ignoreCase = true) ?: false)
            val matchesCategory = cat == null || task.category == cat
            matchesQuery && matchesCategory
        }
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val overdueTasks: StateFlow<List<TaskEntity>> = tasks.map { list ->
        val today = LocalDate.now()
        list.filter {
            try {
                LocalDate.parse(it.nextDueDate).isBefore(today)
            } catch (e: Exception) {
                false
            }
        }
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val dueTodayTasks: StateFlow<List<TaskEntity>> = tasks.map { list ->
        val today = LocalDate.now().toString()
        list.filter { it.nextDueDate == today }
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val thisWeekTasks: StateFlow<List<TaskEntity>> = tasks.map { list ->
        val today = LocalDate.now()
        val nextWeek = today.plusDays(7)
        list.filter {
            try {
                val due = LocalDate.parse(it.nextDueDate)
                (due.isEqual(today) || due.isAfter(today)) && due.isBefore(nextWeek.plusDays(1))
            } catch (e: Exception) {
                false
            }
        }
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val weeklyRoutines: StateFlow<List<TaskEntity>> = tasks.map { list ->
        list.filter { it.isWeeklyRoutine }
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val budgetSummary: StateFlow<BudgetSummary> = tasks.map { list ->
        var totalAnnual = 0.0
        val categoryMap = mutableMapOf<CategoryType, Double>()

        list.forEach { task ->
            val cost = task.estimatedCost
            if (cost > 0) {
                val annualCost = when (task.recurrenceUnit) {
                    RecurrenceUnit.DAYS -> (365.0 / task.recurrenceValue) * cost
                    RecurrenceUnit.WEEKS -> (52.0 / task.recurrenceValue) * cost
                    RecurrenceUnit.MONTHS -> (12.0 / task.recurrenceValue) * cost
                    RecurrenceUnit.YEARS -> (1.0 / task.recurrenceValue) * cost
                }
                totalAnnual += annualCost
                categoryMap[task.category] = (categoryMap[task.category] ?: 0.0) + annualCost
            }
        }

        val breakdown = categoryMap.map { (cat, yearly) ->
            CategoryExpense(category = cat, monthly = yearly / 12.0, yearly = yearly)
        }.sortedByDescending { it.yearly }

        BudgetSummary(
            totalMonthly = totalAnnual / 12.0,
            totalYearly = totalAnnual,
            breakdown = breakdown
        )
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), BudgetSummary(0.0, 0.0, emptyList()))

    fun setSearchQuery(query: String) {
        _searchQuery.value = query
    }

    fun setCategory(category: CategoryType?) {
        _selectedCategory.value = category
    }

    fun completeTask(task: TaskEntity, cost: Double?, notes: String?, performer: String?) {
        viewModelScope.launch {
            repository.completeTask(task, cost, notes, performer)
        }
    }

    fun snoozeTask(task: TaskEntity, days: Int) {
        viewModelScope.launch {
            repository.snoozeTask(task, days)
        }
    }

    fun saveTask(task: TaskEntity) {
        viewModelScope.launch {
            repository.insertOrUpdate(task)
        }
    }

    fun deleteTask(task: TaskEntity) {
        viewModelScope.launch {
            repository.deleteTask(task)
        }
    }

    fun restoreTasks(newTasks: List<TaskEntity>) {
        viewModelScope.launch {
            repository.restoreAll(newTasks)
        }
    }

    fun getDaysUntilDue(dueDateStr: String): Long {
        return try {
            val due = LocalDate.parse(dueDateStr)
            val today = LocalDate.now()
            ChronoUnit.DAYS.between(today, due)
        } catch (e: Exception) {
            0L
        }
    }
}

class TaskViewModelFactory(private val repository: TaskRepository) : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(TaskViewModel::class.java)) {
            @Suppress("UNCHECKED_CAST")
            return TaskViewModel(repository) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}
