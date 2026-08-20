package com.renew.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.renew.app.data.CategoryType
import com.renew.app.data.TaskEntity
import com.renew.app.ui.components.TaskCard
import com.renew.app.ui.theme.NeonOrange
import com.renew.app.ui.theme.StatusOverdue
import com.renew.app.viewmodel.TaskViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AlertsScreen(
    viewModel: TaskViewModel,
    onCompleteTask: (TaskEntity) -> Unit,
    onEditTask: (TaskEntity) -> Unit,
    onNewTask: () -> Unit
) {
    val filteredTasks by viewModel.filteredTasks.collectAsState()
    val overdueTasks by viewModel.overdueTasks.collectAsState()
    val dueTodayTasks by viewModel.dueTodayTasks.collectAsState()
    val searchQuery by viewModel.searchQuery.collectAsState()
    val selectedCategory by viewModel.selectedCategory.collectAsState()

    Scaffold(
        floatingActionButton = {
            FloatingActionButton(
                onClick = onNewTask,
                containerColor = NeonOrange,
                contentColor = Color.Black,
                shape = RoundedCornerShape(0.dp)
            ) {
                Icon(Icons.Default.Add, contentDescription = "New Task")
            }
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            // Header Stats Banner
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .border(1.dp, StatusOverdue)
                        .background(StatusOverdue.copy(alpha = 0.1f))
                        .padding(10.dp)
                ) {
                    Column {
                        Text("OVERDUE", style = MaterialTheme.typography.labelSmall, color = StatusOverdue)
                        Text("${overdueTasks.size}", style = MaterialTheme.typography.headlineMedium, color = StatusOverdue)
                    }
                }

                Box(
                    modifier = Modifier
                        .weight(1f)
                        .border(1.dp, NeonOrange)
                        .background(NeonOrange.copy(alpha = 0.1f))
                        .padding(10.dp)
                ) {
                    Column {
                        Text("DUE TODAY", style = MaterialTheme.typography.labelSmall, color = NeonOrange)
                        Text("${dueTodayTasks.size}", style = MaterialTheme.typography.headlineMedium, color = NeonOrange)
                    }
                }

                Box(
                    modifier = Modifier
                        .weight(1f)
                        .border(1.dp, MaterialTheme.colorScheme.outline)
                        .background(MaterialTheme.colorScheme.surfaceVariant)
                        .padding(10.dp)
                ) {
                    Column {
                        Text("ALL ACTIVE", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        Text("${filteredTasks.size}", style = MaterialTheme.typography.headlineMedium, color = MaterialTheme.colorScheme.onSurface)
                    }
                }
            }

            // Search Bar
            OutlinedTextField(
                value = searchQuery,
                onValueChange = { viewModel.setSearchQuery(it) },
                placeholder = { Text("Search maintenance tasks, filters, cars...") },
                leadingIcon = { Icon(Icons.Default.Search, contentDescription = null) },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(0.dp),
                singleLine = true
            )

            // Category Filter Chips
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                FilterChip(
                    selected = selectedCategory == null,
                    onClick = { viewModel.setCategory(null) },
                    label = { Text("ALL", fontSize = 10.sp, fontWeight = FontWeight.Bold) },
                    shape = RoundedCornerShape(0.dp)
                )
                CategoryType.values().take(3).forEach { cat ->
                    FilterChip(
                        selected = selectedCategory == cat,
                        onClick = { viewModel.setCategory(if (selectedCategory == cat) null else cat) },
                        label = { Text(cat.name.split("_")[0], fontSize = 10.sp) },
                        shape = RoundedCornerShape(0.dp)
                    )
                }
            }

            // Tasks List
            if (filteredTasks.isEmpty()) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .weight(1f),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "NO MAINTENANCE TASKS FOUND",
                        style = MaterialTheme.typography.titleMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            } else {
                LazyColumn(
                    modifier = Modifier.weight(1f),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    items(filteredTasks, key = { it.id }) { task ->
                        val daysRemaining = viewModel.getDaysUntilDue(task.nextDueDate)
                        TaskCard(
                            task = task,
                            daysRemaining = daysRemaining,
                            onComplete = { onCompleteTask(task) },
                            onSnooze = { days -> viewModel.snoozeTask(task, days) },
                            onEdit = { onEditTask(task) }
                        )
                    }
                    item {
                        Spacer(modifier = Modifier.height(64.dp))
                    }
                }
            }
        }
    }
}
