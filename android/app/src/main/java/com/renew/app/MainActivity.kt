package com.renew.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.renew.app.data.TaskEntity
import com.renew.app.ui.components.CompleteTaskDialog
import com.renew.app.ui.components.MorningBriefingDialog
import com.renew.app.ui.components.TaskEditDialog
import com.renew.app.ui.screens.*
import com.renew.app.ui.theme.NeonOrange
import com.renew.app.ui.theme.RenewTheme
import com.renew.app.viewmodel.TaskViewModel
import com.renew.app.viewmodel.TaskViewModelFactory

enum class AppTab(val label: String, val icon: ImageVector) {
    ALERTS("ALERTS", Icons.Default.Notifications),
    THIS_WEEK("THIS WEEK", Icons.Default.CalendarToday),
    BUDGET("COSTS", Icons.Default.AccountBalanceWallet),
    QR_SCANNER("QR ASSETS", Icons.Default.QrCodeScanner),
    SETTINGS("SETTINGS", Icons.Default.Settings)
}

class MainActivity : ComponentActivity() {

    private val viewModel: TaskViewModel by viewModels {
        TaskViewModelFactory((application as RenewApplication).repository)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            RenewTheme {
                RenewApp(viewModel)
            }
        }
    }
}

@Composable
fun RenewApp(viewModel: TaskViewModel) {
    var currentTab by remember { mutableStateOf(AppTab.ALERTS) }
    var showBriefing by remember { mutableStateOf(false) }
    var taskToComplete by remember { mutableStateOf<TaskEntity?>(null) }
    var taskToEdit by remember { mutableStateOf<TaskEntity?>(null) }
    var isCreatingNewTask by remember { mutableStateOf(false) }

    val overdueTasks by viewModel.overdueTasks.collectAsState()
    val dueTodayTasks by viewModel.dueTodayTasks.collectAsState()
    val thisWeekTasks by viewModel.thisWeekTasks.collectAsState()

    // Show morning briefing on launch if there are overdue or due-today items
    LaunchedEffect(overdueTasks, dueTodayTasks) {
        if (overdueTasks.isNotEmpty() || dueTodayTasks.isNotEmpty()) {
            showBriefing = true
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        text = "RENEW.",
                        style = MaterialTheme.typography.headlineMedium,
                        fontWeight = FontWeight.Black,
                        color = MaterialTheme.colorScheme.onBackground
                    )
                },
                actions = {
                    if (overdueTasks.isNotEmpty()) {
                        IconButton(onClick = { showBriefing = true }) {
                            Badge(
                                containerColor = NeonOrange,
                                contentColor = Color.Black
                            ) {
                                Text("${overdueTasks.size}", fontWeight = FontWeight.Black)
                            }
                        }
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.background
                )
            )
        },
        bottomBar = {
            NavigationBar(
                containerColor = MaterialTheme.colorScheme.surface,
                tonalElevation = 0.dp
            ) {
                AppTab.values().forEach { tab ->
                    NavigationBarItem(
                        selected = currentTab == tab,
                        onClick = { currentTab = tab },
                        icon = {
                            Icon(
                                imageVector = tab.icon,
                                contentDescription = tab.label,
                                tint = if (currentTab == tab) NeonOrange else MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        },
                        label = {
                            Text(
                                text = tab.label,
                                fontSize = 9.sp,
                                fontWeight = if (currentTab == tab) FontWeight.Black else FontWeight.Bold,
                                color = if (currentTab == tab) NeonOrange else MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                    )
                }
            }
        }
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .background(MaterialTheme.colorScheme.background)
        ) {
            when (currentTab) {
                AppTab.ALERTS -> AlertsScreen(
                    viewModel = viewModel,
                    onCompleteTask = { taskToComplete = it },
                    onEditTask = { taskToEdit = it },
                    onNewTask = { isCreatingNewTask = true }
                )
                AppTab.THIS_WEEK -> ThisWeekScreen(
                    viewModel = viewModel,
                    onCompleteTask = { taskToComplete = it },
                    onEditTask = { taskToEdit = it }
                )
                AppTab.BUDGET -> BudgetPlannerScreen(viewModel = viewModel)
                AppTab.QR_SCANNER -> QrScannerScreen(
                    viewModel = viewModel,
                    onSelectTask = { taskToComplete = it }
                )
                AppTab.SETTINGS -> SettingsScreen(
                    viewModel = viewModel,
                    onOpenBriefing = { showBriefing = true }
                )
            }

            // Morning Briefing Dialog
            if (showBriefing) {
                MorningBriefingDialog(
                    overdueTasks = overdueTasks,
                    dueTodayTasks = dueTodayTasks,
                    thisWeekTasks = thisWeekTasks,
                    onCompleteTask = { task ->
                        showBriefing = false
                        taskToComplete = task
                    },
                    onSnoozeTask = { task, days ->
                        viewModel.snoozeTask(task, days)
                    },
                    onDismiss = { showBriefing = false }
                )
            }

            // Complete Task Dialog
            taskToComplete?.let { task ->
                CompleteTaskDialog(
                    task = task,
                    onConfirm = { cost, notes, performer ->
                        viewModel.completeTask(task, cost, notes, performer)
                        taskToComplete = null
                    },
                    onDismiss = { taskToComplete = null }
                )
            }

            // New or Edit Task Dialog
            if (isCreatingNewTask || taskToEdit != null) {
                TaskEditDialog(
                    initialTask = taskToEdit,
                    onSave = { task ->
                        viewModel.saveTask(task)
                        isCreatingNewTask = false
                        taskToEdit = null
                    },
                    onDelete = { task ->
                        viewModel.deleteTask(task)
                        taskToEdit = null
                    },
                    onDismiss = {
                        isCreatingNewTask = false
                        taskToEdit = null
                    }
                )
            }
        }
    }
}
