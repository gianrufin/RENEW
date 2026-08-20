package com.renew.app.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.renew.app.data.TaskEntity
import com.renew.app.ui.components.TaskCard
import com.renew.app.ui.theme.NeonOrange
import com.renew.app.ui.theme.StatusOverdue
import com.renew.app.viewmodel.TaskViewModel

@Composable
fun ThisWeekScreen(
    viewModel: TaskViewModel,
    onCompleteTask: (TaskEntity) -> Unit,
    onEditTask: (TaskEntity) -> Unit
) {
    val overdueTasks by viewModel.overdueTasks.collectAsState()
    val thisWeekTasks by viewModel.thisWeekTasks.collectAsState()
    val weeklyRoutines by viewModel.weeklyRoutines.collectAsState()

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        item {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .border(1.dp, MaterialTheme.colorScheme.outline)
                    .background(MaterialTheme.colorScheme.surfaceVariant)
                    .padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                Text(
                    text = "THIS WEEK'S AGENDA.",
                    style = MaterialTheme.typography.titleLarge,
                    color = MaterialTheme.colorScheme.onSurface
                )
                Text(
                    text = "A flexible 7-day view of critical maintenance and weekly household routines.",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }

        // Section 1: Overdue
        if (overdueTasks.isNotEmpty()) {
            item {
                Text("⚠️ OVERDUE ITEMS", style = MaterialTheme.typography.labelSmall, color = StatusOverdue)
            }
            items(overdueTasks, key = { it.id }) { task ->
                TaskCard(
                    task = task,
                    daysRemaining = viewModel.getDaysUntilDue(task.nextDueDate),
                    onComplete = { onCompleteTask(task) },
                    onSnooze = { days -> viewModel.snoozeTask(task, days) },
                    onEdit = { onEditTask(task) }
                )
            }
        }

        // Section 2: Due in the Next 7 Days
        item {
            Text("📅 SCHEDULED THIS WEEK", style = MaterialTheme.typography.labelSmall, color = NeonOrange)
        }
        if (thisWeekTasks.isEmpty()) {
            item {
                Text("No specific items due this week.", style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
        } else {
            items(thisWeekTasks, key = { it.id }) { task ->
                TaskCard(
                    task = task,
                    daysRemaining = viewModel.getDaysUntilDue(task.nextDueDate),
                    onComplete = { onCompleteTask(task) },
                    onSnooze = { days -> viewModel.snoozeTask(task, days) },
                    onEdit = { onEditTask(task) }
                )
            }
        }

        // Section 3: Flexible Weekly Habits
        if (weeklyRoutines.isNotEmpty()) {
            item {
                Text("🔄 FLEXIBLE WEEKLY ROUTINES", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.primary)
            }
            items(weeklyRoutines, key = { it.id }) { task ->
                TaskCard(
                    task = task,
                    daysRemaining = viewModel.getDaysUntilDue(task.nextDueDate),
                    onComplete = { onCompleteTask(task) },
                    onSnooze = { days -> viewModel.snoozeTask(task, days) },
                    onEdit = { onEditTask(task) }
                )
            }
        }

        item {
            Spacer(modifier = Modifier.height(72.dp))
        }
    }
}
