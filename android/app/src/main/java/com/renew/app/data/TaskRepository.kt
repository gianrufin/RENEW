package com.renew.app.data

import kotlinx.coroutines.flow.Flow
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.util.UUID

class TaskRepository(private val taskDao: TaskDao) {

    val allTasks: Flow<List<TaskEntity>> = taskDao.getAllActiveTasks()

    suspend fun getTaskById(id: String): TaskEntity? = taskDao.getTaskById(id)

    suspend fun getTaskByQr(qrId: String): TaskEntity? = taskDao.getTaskByQrId(qrId)

    suspend fun insertOrUpdate(task: TaskEntity) {
        taskDao.insertTask(task)
    }

    suspend fun deleteTask(task: TaskEntity) {
        taskDao.deleteTask(task)
    }

    suspend fun completeTask(task: TaskEntity, cost: Double?, notes: String?, performer: String?) {
        val today = LocalDate.now()
        val nextDue = calculateNextDate(today, task.recurrenceValue, task.recurrenceUnit)
        
        val newLog = ServiceLog(
            id = UUID.randomUUID().toString(),
            completedDate = today.toString(),
            cost = cost ?: task.estimatedCost,
            notes = notes,
            performer = performer ?: "User"
        )
        
        val updatedHistory = listOf(newLog) + task.history
        val updatedTask = task.copy(
            lastCompletedDate = today.toString(),
            nextDueDate = nextDue.toString(),
            history = updatedHistory
        )
        taskDao.updateTask(updatedTask)
    }

    suspend fun snoozeTask(task: TaskEntity, days: Int) {
        val currentDue = try {
            LocalDate.parse(task.nextDueDate)
        } catch (e: Exception) {
            LocalDate.now()
        }
        val newDue = currentDue.plusDays(days.toLong())
        taskDao.updateTask(task.copy(nextDueDate = newDue.toString()))
    }

    suspend fun restoreAll(tasks: List<TaskEntity>) {
        taskDao.clearAll()
        taskDao.insertAll(tasks)
    }

    private fun calculateNextDate(from: LocalDate, value: Int, unit: RecurrenceUnit): LocalDate {
        return when (unit) {
            RecurrenceUnit.DAYS -> from.plusDays(value.toLong())
            RecurrenceUnit.WEEKS -> from.plusWeeks(value.toLong())
            RecurrenceUnit.MONTHS -> from.plusMonths(value.toLong())
            RecurrenceUnit.YEARS -> from.plusYears(value.toLong())
        }
    }
}
