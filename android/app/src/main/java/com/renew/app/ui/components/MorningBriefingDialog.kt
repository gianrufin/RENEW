package com.renew.app.ui.components

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import com.renew.app.data.TaskEntity
import com.renew.app.ui.theme.NeonOrange
import com.renew.app.ui.theme.StatusOverdue

@Composable
fun MorningBriefingDialog(
    overdueTasks: List<TaskEntity>,
    dueTodayTasks: List<TaskEntity>,
    thisWeekTasks: List<TaskEntity>,
    onCompleteTask: (TaskEntity) -> Unit,
    onSnoozeTask: (TaskEntity, Int) -> Unit,
    onDismiss: () -> Unit
) {
    Dialog(
        onDismissRequest = onDismiss,
        properties = DialogProperties(usePlatformDefaultWidth = false)
    ) {
        Surface(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp),
            shape = RoundedCornerShape(0.dp),
            color = MaterialTheme.colorScheme.background,
            border = BorderStroke(2.dp, NeonOrange)
        ) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(20.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // Header
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            text = "MORNING BRIEFING.",
                            style = MaterialTheme.typography.headlineMedium,
                            color = MaterialTheme.colorScheme.onBackground
                        )
                        Text(
                            text = "HOUSEHOLD STATUS & PRIORITY ALERTS",
                            style = MaterialTheme.typography.labelSmall,
                            color = NeonOrange
                        )
                    }
                    IconButton(onClick = onDismiss) {
                        Icon(Icons.Default.Close, contentDescription = "Close", tint = MaterialTheme.colorScheme.onBackground)
                    }
                }

                // Summary Numbers
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .border(1.dp, StatusOverdue)
                            .background(StatusOverdue.copy(alpha = 0.1f))
                            .padding(12.dp)
                    ) {
                        Column {
                            Text("OVERDUE", style = MaterialTheme.typography.labelSmall, color = StatusOverdue)
                            Text("${overdueTasks.size}", style = MaterialTheme.typography.headlineLarge, color = StatusOverdue)
                        }
                    }

                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .border(1.dp, NeonOrange)
                            .background(NeonOrange.copy(alpha = 0.1f))
                            .padding(12.dp)
                    ) {
                        Column {
                            Text("DUE TODAY", style = MaterialTheme.typography.labelSmall, color = NeonOrange)
                            Text("${dueTodayTasks.size}", style = MaterialTheme.typography.headlineLarge, color = NeonOrange)
                        }
                    }

                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .border(1.dp, MaterialTheme.colorScheme.outline)
                            .background(MaterialTheme.colorScheme.surfaceVariant)
                            .padding(12.dp)
                    ) {
                        Column {
                            Text("THIS WEEK", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                            Text("${thisWeekTasks.size}", style = MaterialTheme.typography.headlineLarge, color = MaterialTheme.colorScheme.onSurface)
                        }
                    }
                }

                // Task List
                LazyColumn(
                    modifier = Modifier.weight(1f),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    if (overdueTasks.isNotEmpty()) {
                        item {
                            Text("⚠️ URGENT ACTION REQUIRED", style = MaterialTheme.typography.labelSmall, color = StatusOverdue)
                        }
                        items(overdueTasks) { task ->
                            BriefingTaskItem(task, isOverdue = true, onComplete = { onCompleteTask(task) }, onSnooze = { onSnoozeTask(task, 3) })
                        }
                    }

                    if (dueTodayTasks.isNotEmpty()) {
                        item {
                            Text("🎯 SCHEDULED FOR TODAY", style = MaterialTheme.typography.labelSmall, color = NeonOrange)
                        }
                        items(dueTodayTasks) { task ->
                            BriefingTaskItem(task, isOverdue = false, onComplete = { onCompleteTask(task) }, onSnooze = { onSnoozeTask(task, 3) })
                        }
                    }
                }

                Button(
                    onClick = onDismiss,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(48.dp),
                    shape = RoundedCornerShape(0.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = NeonOrange, contentColor = Color.Black)
                ) {
                    Text("START MY DAY", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Black)
                }
            }
        }
    }
}

@Composable
fun BriefingTaskItem(
    task: TaskEntity,
    isOverdue: Boolean,
    onComplete: () -> Unit,
    onSnooze: () -> Unit
) {
    Card(
        shape = RoundedCornerShape(0.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
        border = BorderStroke(1.dp, if (isOverdue) StatusOverdue else MaterialTheme.colorScheme.outline)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text(task.title, style = MaterialTheme.typography.titleMedium, color = MaterialTheme.colorScheme.onSurface)
                Text(task.locationOrAsset ?: task.category.name, style = MaterialTheme.typography.bodyMedium, fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
            Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                OutlinedButton(
                    onClick = onSnooze,
                    shape = RoundedCornerShape(0.dp),
                    contentPadding = PaddingValues(horizontal = 8.dp, vertical = 4.dp)
                ) {
                    Text("+3D", style = MaterialTheme.typography.labelSmall)
                }
                Button(
                    onClick = onComplete,
                    shape = RoundedCornerShape(0.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = NeonOrange, contentColor = Color.Black),
                    contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp)
                ) {
                    Text("DONE", style = MaterialTheme.typography.labelSmall)
                }
            }
        }
    }
}
